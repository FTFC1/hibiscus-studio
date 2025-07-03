
export interface Scene {
  timestamp: number;
  description: string;
}

export interface ReportData {
  id: string;
  videoFileName: string;
  suggestedTitle: string;
  tldr: string;
  audioTranscript: string;
  keyPoints: string[];
  sceneBreakdown: Scene[];
  feedbackAndRequirements: string[];
  analysisDurationSeconds: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}

export interface UploadedFile {
  name?: string;
  uri?: string;
  mimeType?: string;
  state?: 'PROCESSING' | 'ACTIVE' | 'FAILED' | 'STATE_UNSPECIFIED';
}
