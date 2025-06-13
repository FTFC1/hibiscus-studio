import OpenAI from 'openai';
import { VoiceInput } from './processor.js';

export interface TranscriptionResult {
    text: string;
    confidence: number;
    language?: string;
    duration?: number;
}

export class VoiceTranscriber {
    private openai: OpenAI | null = null;
    private hasApiKey: boolean = false;

    constructor(apiKey?: string) {
        const key = apiKey || process.env.OPENAI_API_KEY;
        
        if (key) {
            this.openai = new OpenAI({
                apiKey: key,
            });
            this.hasApiKey = true;
        } else {
            console.warn('⚠️  OpenAI API key not found. Voice transcription will use fallback mode.');
            this.hasApiKey = false;
        }
    }

    async transcribeAudio(input: VoiceInput): Promise<TranscriptionResult> {
        try {
            // Handle different input types
            let audioData: Buffer;
            
            if (typeof input.audio === 'string') {
                // If it's already text, return it directly (for testing)
                return {
                    text: input.audio,
                    confidence: 1.0,
                    language: 'en',
                    duration: 0
                };
            }
            
            // Check if we have OpenAI available
            if (!this.hasApiKey || !this.openai) {
                return this.fallbackTranscription(input);
            }
            
            audioData = input.audio as Buffer;
            
            // Create a temporary file for OpenAI Whisper
            const fs = await import('fs');
            const path = await import('path');
            const tempFile = path.join('/tmp', `voice-${Date.now()}.wav`);
            
            fs.writeFileSync(tempFile, audioData);
            
            try {
                const transcription = await this.openai.audio.transcriptions.create({
                    file: fs.createReadStream(tempFile),
                    model: 'whisper-1',
                    language: 'en',
                    response_format: 'verbose_json'
                });
                
                // Clean up temp file
                fs.unlinkSync(tempFile);
                
                return {
                    text: transcription.text,
                    confidence: 0.95, // Whisper typically has high confidence
                    language: transcription.language || 'en',
                    duration: transcription.duration
                };
                
            } catch (apiError) {
                // Clean up temp file on error
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
                throw apiError;
            }
            
        } catch (error) {
            console.error('Transcription error:', error);
            // Fallback to basic processing
            return this.fallbackTranscription(input);
        }
    }

    private fallbackTranscription(input: VoiceInput): TranscriptionResult {
        // Simple fallback - assume audio is already text or return placeholder
        if (typeof input.audio === 'string') {
            return {
                text: input.audio,
                confidence: 1.0,
                language: 'en',
                duration: 0
            };
        }
        
        // For actual audio buffers without API, return placeholder
        return {
            text: 'Audio transcription not available (no OpenAI API key)',
            confidence: 0.1,
            language: 'en',
            duration: 0
        };
    }

    isAvailable(): boolean {
        return this.hasApiKey;
    }

    async transcribeFromFile(filePath: string): Promise<TranscriptionResult> {
        try {
            const fs = await import('fs');
            const audioBuffer = fs.readFileSync(filePath);
            
            const voiceInput: VoiceInput = {
                audio: audioBuffer,
                timestamp: new Date(),
                sessionId: 'file-upload'
            };
            
            return await this.transcribeAudio(voiceInput);
        } catch (error) {
            console.error('File transcription error:', error);
            throw new Error(`Failed to transcribe file: ${error}`);
        }
    }
} 