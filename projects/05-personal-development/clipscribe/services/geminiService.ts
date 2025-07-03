
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { ReportData, UploadedFile } from '../types';
import { GEMINI_MODEL } from '../constants';

const getSystemInstruction = () => {
  return `You are an expert video analysis AI. You will be given a video file. Your task is to analyze BOTH the video and audio content.
You MUST provide a response in a single, valid JSON object. Do not wrap it in markdown backticks.
The JSON object must have six top-level keys: "suggestedTitle", "tldr", "audioTranscript", "keyPoints", "feedbackAndRequirements", and "sceneBreakdown".
It is critically important that any double quotes within any string value are properly escaped with a backslash (e.g., "a user said \\"hello\\""). This is vital for the JSON to be valid.

1.  **suggestedTitle**: A short, descriptive title for the video based on its content (e.g., "Walkthrough of New Dashboard Feature" or "Feedback on Login Page UI"). Do not use the original filename.
2.  **tldr**: A single, concise sentence (max 25 words) that summarizes the video's main purpose or conclusion.
3.  **audioTranscript**: A verbatim transcript of all spoken words from the video's audio track. If there is no spoken audio, return an empty string.
4.  **keyPoints**: An array of strings. After generating the transcript, carefully review the audio and visual content to extract the most important facts, summaries, or actions. Each point should be a concise summary. Aim for 3-7 key points.
5.  **feedbackAndRequirements**: An array of strings. Listen specifically for statements in the audio that sound like feedback, feature requests, instructions, or bug reports. Synthesize these into a list of actionable items. If no such statements are found, return an empty array.
6.  **sceneBreakdown**: An array of objects. Each object represents a distinct scene or event and must have two keys:
    *   **timestamp**: A number representing the start time of the scene in seconds (e.g., 15.2). This should correspond to the timestamp of the event.
    *   **description**: A string briefly describing the visual elements and actions in that scene.`;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ProgressCallback = (status: string, stageIndex: number) => void;

export const startBackgroundUpload = (apiKey: string, file: File): Promise<UploadedFile> => {
    const ai = new GoogleGenAI({ apiKey });
    // This returns a promise that resolves when the upload is complete.
    // We don't await it here, allowing the upload to happen in the background.
    return ai.files.upload({ file });
};

export const finishAnalysis = async (
    apiKey: string,
    uploadPromise: Promise<UploadedFile>,
    onProgress: ProgressCallback
): Promise<Omit<ReportData, 'id' | 'videoFileName' | 'analysisDurationSeconds'>> => {
  const ai = new GoogleGenAI({ apiKey });
  let uploadedFile: UploadedFile | null = null;

  try {
    // 1. Await the background upload
    onProgress('Uploading file...', 0);
    uploadedFile = await uploadPromise;
    
    // The resource name is required for polling.
    if (!uploadedFile.name) {
        throw new Error(`File upload failed to return a resource name. State: ${uploadedFile.state}`);
    }

    // 2. Poll for processing
    onProgress('Server is processing video...', 1);
    while (uploadedFile.state === 'PROCESSING') {
        await sleep(5000); // Poll every 5 seconds
        uploadedFile = await ai.files.get({ name: uploadedFile.name || '' });
    }

    if (uploadedFile.state !== 'ACTIVE') {
        throw new Error(`File processing failed with state: ${uploadedFile.state}`);
    }

    if (!uploadedFile.uri) {
      throw new Error(`File is active, but URI is missing.`);
    }

    if (!uploadedFile.mimeType) {
      throw new Error(`File is active, but mimeType is missing.`);
    }
    
    // 3. Generate content with the file
    onProgress('Analyzing with Gemini AI...', 2);
    const filePart = { fileData: { mimeType: uploadedFile.mimeType, fileUri: uploadedFile.uri } };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ parts: [filePart] }],
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
      },
    });

    onProgress('Finalizing report...', 3);

    let jsonStr = response.text?.trim() || '';
    // More robustly find the JSON object
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
    }
    
    let parsedData;
    try {
        parsedData = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", jsonStr);
        throw new Error("The AI returned a response that was not valid JSON.");
    }
    
    // Basic validation
    if (!parsedData.suggestedTitle || !parsedData.tldr || !Array.isArray(parsedData.keyPoints) || !Array.isArray(parsedData.sceneBreakdown) || parsedData.audioTranscript === undefined || !Array.isArray(parsedData.feedbackAndRequirements)) {
        console.error("Parsed JSON is missing required keys:", parsedData);
        throw new Error('Invalid JSON structure received from API.');
    }

    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your key in Settings.");
    }
    if (error instanceof Error && (error.message.includes("Invalid JSON structure") || error.message.includes("not valid JSON"))) {
        throw error;
    }
    throw new Error("Failed to get analysis from Gemini AI.");
  } finally {
      // 4. Clean up the file
      if (uploadedFile && uploadedFile.name) {
          await ai.files.delete({ name: uploadedFile.name });
      }
  }
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey.trim()) {
        throw new Error("API Key is empty.");
    }
    const ai = new GoogleGenAI({ apiKey });
    try {
        // Use a lightweight, inexpensive call to test the key
        await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{text: "test"}]
        });
        return true;
    } catch (error) {
        console.error("API Key test failed:", error);
        if (error instanceof Error && error.message.includes("API key not valid")) {
            throw new Error("API key not valid. Please check and try again.");
        }
        throw new Error("A network or other error occurred while testing the key.");
    }
};

export const createChatSession = (apiKey: string, report: ReportData): Chat => {
    const ai = new GoogleGenAI({ apiKey });
    const { tldr, audioTranscript, keyPoints, sceneBreakdown, suggestedTitle, feedbackAndRequirements } = report;

    const keyPointsText = keyPoints.map(p => `- ${p}`).join('\n');
    const scenesText = sceneBreakdown.map(s => `- ${s.timestamp.toFixed(1)}s: ${s.description}`).join('\n');
    const feedbackText = feedbackAndRequirements.map(p => `- ${p}`).join('\n');

    const history = [
        {
            role: 'user',
            parts: [{
                text: `I have an analysis report for a video titled "${suggestedTitle}". Here is the data:
                
                TL;DR: ${tldr}

                AUDIO TRANSCRIPT:
                ${audioTranscript}
                
                KEY POINTS:
                ${keyPointsText}
                
                FEEDBACK & REQUIREMENTS:
                ${feedbackText}
                
                SCENE BREAKDOWN:
                ${scenesText}

                Now, please act as a helpful assistant and answer my questions about this specific video. Do not mention that you are an AI. Just answer the questions directly based on the context provided. If my question requires information not in the report, you may use your general knowledge or web search capabilities.`
            }]
        },
        {
            role: 'model',
            parts: [{ text: `Of course. I have reviewed the report for "${suggestedTitle}". What would you like to know?`}]
        }
    ];

    const chat = ai.chats.create({
        model: GEMINI_MODEL,
        history: history,
        config: {
            tools: [{googleSearch: {}}]
        }
    });
    return chat;
};


export const getExampleReport = (): ReportData => {
  return {
    id: 'example',
    videoFileName: "example_feature_demo.mp4",
    suggestedTitle: "Demo of New Analytics Widget Feature",
    analysisDurationSeconds: 42.7,
    tldr: "This video demonstrates a new 'Analytics' widget that expands to show user engagement metrics.",
    audioTranscript: "Okay, so in this next sprint, we're introducing a new feature. On the dashboard, you'll see this 'Analytics' widget. When you click it, it expands to show more detailed user metrics like bounce rate and session duration. We think this will give our users much better insight into their engagement.",
    keyPoints: [
      "A new 'Analytics' widget has been added to the dashboard.",
      "The widget is interactive and expands on click.",
      "It displays detailed user metrics like bounce rate and session duration.",
      "The goal is to provide users with better engagement insights."
    ],
    feedbackAndRequirements: [
        "The feature is planned for the next sprint.",
        "Ensure the widget is placed on the main dashboard."
    ],
    sceneBreakdown: [
      { timestamp: 2.1, description: "Shows the login screen with fields for email and password." },
      { timestamp: 5.5, description: "A cursor clicks the 'Login' button." },
      { timestamp: 8.2, description: "The main application dashboard appears, with various charts and data points." },
      { timestamp: 11.0, description: "The cursor moves to highlight an 'Analytics' widget in the top-right corner." },
      { timestamp: 14.8, description: "The analytics widget is clicked and expands into a larger, more detailed view." }
    ]
  };
};