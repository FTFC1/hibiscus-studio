import { VoiceProcessor, ProcessedVoice } from '../voice/processor.js';
import { ActionExtractor, TrelloAction, ActionExtractionResult } from '../patterns/action-extractor.js';
import { NLPAnalysis } from '../intelligence/nlp-pipeline.js';

export interface VoiceOSResult {
    sessionId: string;
    timestamp: Date;
    originalInput: {
        text: string;
        audioLength?: number;
        confidence: number;
    };
    processing: {
        transcription: {
            text: string;
            confidence: number;
            language?: string;
            duration?: number;
        };
        nlpAnalysis: NLPAnalysis;
        processedVoice: ProcessedVoice;
    };
    actions: {
        extracted: ActionExtractionResult;
        executable: TrelloAction[];
        summary: string;
        ambiguities: string[];
    };
    metadata: {
        processingTime: number;
        overallConfidence: number;
        status: 'success' | 'partial' | 'failed';
        warnings: string[];
        nextSteps?: string[];
    };
}

export interface VoiceOSConfig {
    openaiApiKey?: string;
    openrouterApiKey?: string;
    preferAI?: boolean;
    enableContextTracking?: boolean;
    confidenceThreshold?: number;
}

export class VoiceOS {
    private voiceProcessor: VoiceProcessor;
    private actionExtractor: ActionExtractor;
    private config: VoiceOSConfig;
    private activeSession: string | null = null;

    constructor(config: VoiceOSConfig = {}) {
        this.config = {
            preferAI: true,
            enableContextTracking: true,
            confidenceThreshold: 0.6,
            ...config
        };

        this.voiceProcessor = new VoiceProcessor({
            openaiApiKey: config.openaiApiKey,
            openrouterApiKey: config.openrouterApiKey,
            preferAI: config.preferAI
        });

        this.actionExtractor = new ActionExtractor();
    }

    async processVoiceInput(
        audioInput: Buffer | string,
        sessionId?: string
    ): Promise<VoiceOSResult> {
        const startTime = Date.now();
        const currentSessionId = sessionId || this.activeSession || this.generateSessionId();
        this.activeSession = currentSessionId;

        const result: VoiceOSResult = {
            sessionId: currentSessionId,
            timestamp: new Date(),
            originalInput: {
                text: typeof audioInput === 'string' ? audioInput : '',
                confidence: 0
            },
            processing: {
                transcription: { text: '', confidence: 0 },
                nlpAnalysis: {} as NLPAnalysis,
                processedVoice: {} as ProcessedVoice
            },
            actions: {
                extracted: { actions: [], confidence: 0, summary: '', ambiguities: [] },
                executable: [],
                summary: '',
                ambiguities: []
            },
            metadata: {
                processingTime: 0,
                overallConfidence: 0,
                status: 'failed',
                warnings: []
            }
        };

        try {
            // Step 1: Process voice input
            const processedVoice = await this.voiceProcessor.processVoiceInput({
                audio: audioInput,
                timestamp: new Date(),
                sessionId: currentSessionId
            });

            // Step 2: Update result with processed voice data
            result.originalInput.text = processedVoice.text;
            result.originalInput.confidence = processedVoice.confidence;
            result.processing.processedVoice = processedVoice;
            
            if (processedVoice.transcription) {
                result.processing.transcription = {
                    text: processedVoice.transcription.text,
                    confidence: processedVoice.transcription.confidence,
                    language: processedVoice.transcription.language,
                    duration: processedVoice.transcription.duration
                };
            }

            if (processedVoice.nlpAnalysis) {
                result.processing.nlpAnalysis = processedVoice.nlpAnalysis;
            }

            // Step 3: Extract actionable items
            if (processedVoice.nlpAnalysis) {
                const actionResult = await this.actionExtractor.extractActions(
                    processedVoice.text,
                    processedVoice.nlpAnalysis
                );

                result.actions.extracted = actionResult;
                result.actions.executable = actionResult.actions;
                result.actions.summary = actionResult.summary;
                result.actions.ambiguities = actionResult.ambiguities;
            }

            // Step 4: Calculate metadata
            const processingTime = Date.now() - startTime;
            result.metadata.processingTime = processingTime;
            result.metadata.overallConfidence = this.calculateOverallConfidence(result);
            result.metadata.status = this.determineStatus(result);
            result.metadata.warnings = this.generateWarnings(result);
            result.metadata.nextSteps = this.generateNextSteps(result);

            return result;

        } catch (error) {
            console.error('VoiceOS processing error:', error);
            
            result.metadata.processingTime = Date.now() - startTime;
            result.metadata.status = 'failed';
            result.metadata.warnings.push(`Processing failed: ${error}`);
            
            return result;
        }
    }

    async processTextInput(text: string, sessionId?: string): Promise<VoiceOSResult> {
        return await this.processVoiceInput(text, sessionId);
    }

    // Session management
    startNewSession(): string {
        this.activeSession = this.generateSessionId();
        return this.activeSession;
    }

    getActiveSession(): string | null {
        return this.activeSession;
    }

    endSession(): void {
        this.activeSession = null;
    }

    // Analysis helpers
    async analyzeText(text: string): Promise<ProcessedVoice> {
        return await this.voiceProcessor.processText(text, 'analysis-session');
    }

    async extractActionsOnly(text: string): Promise<ActionExtractionResult> {
        const processedVoice = await this.analyzeText(text);
        if (processedVoice.nlpAnalysis) {
            return await this.actionExtractor.extractActions(text, processedVoice.nlpAnalysis);
        } else {
            // Create a minimal NLP analysis for fallback
            const fallbackAnalysis: NLPAnalysis = {
                intent: processedVoice.intent || 'unknown',
                confidence: processedVoice.confidence,
                entities: [],
                sentiment: 'neutral',
                keywords: text.split(' ').slice(0, 5),
                actionItems: [],
                urgency: 'medium'
            };
            return await this.actionExtractor.extractActions(text, fallbackAnalysis);
        }
    }

    // Private helper methods
    private generateSessionId(): string {
        return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private calculateOverallConfidence(result: VoiceOSResult): number {
        const confidences: number[] = [];
        
        if (result.originalInput.confidence > 0) {
            confidences.push(result.originalInput.confidence);
        }
        
        if (result.processing.transcription.confidence > 0) {
            confidences.push(result.processing.transcription.confidence);
        }
        
        if (result.processing.nlpAnalysis.confidence > 0) {
            confidences.push(result.processing.nlpAnalysis.confidence);
        }
        
        if (result.actions.extracted.confidence > 0) {
            confidences.push(result.actions.extracted.confidence);
        }

        return confidences.length > 0 
            ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length 
            : 0;
    }

    private determineStatus(result: VoiceOSResult): 'success' | 'partial' | 'failed' {
        const confidence = result.metadata.overallConfidence;
        const hasActions = result.actions.executable.length > 0;
        const hasText = result.originalInput.text.length > 0;

        if (!hasText) return 'failed';
        
        if (hasActions && confidence >= (this.config.confidenceThreshold || 0.6)) {
            return 'success';
        }
        
        if (hasActions || confidence >= 0.4) {
            return 'partial';
        }
        
        return 'failed';
    }

    private generateWarnings(result: VoiceOSResult): string[] {
        const warnings: string[] = [];
        
        // Low confidence warnings
        if (result.metadata.overallConfidence < 0.5) {
            warnings.push('Low overall confidence in processing results');
        }
        
        // No actions detected
        if (result.actions.executable.length === 0) {
            warnings.push('No actionable items detected');
        }
        
        // Transcription quality
        if (result.processing.transcription.confidence < 0.7) {
            warnings.push('Transcription quality may be poor');
        }
        
        // Ambiguities
        if (result.actions.ambiguities.length > 0) {
            warnings.push(`${result.actions.ambiguities.length} ambiguities detected`);
        }
        
        // Processing time
        if (result.metadata.processingTime > 10000) {
            warnings.push('Processing took longer than expected');
        }
        
        return warnings;
    }

    private generateNextSteps(result: VoiceOSResult): string[] {
        const steps: string[] = [];
        
        if (result.metadata.status === 'failed') {
            steps.push('Try rephrasing your request more clearly');
            steps.push('Ensure audio quality is good for better transcription');
            return steps;
        }
        
        if (result.actions.ambiguities.length > 0) {
            steps.push('Clarify ambiguous references');
            result.actions.ambiguities.forEach(ambiguity => {
                steps.push(`Resolve: ${ambiguity}`);
            });
        }
        
        if (result.actions.executable.length > 0) {
            steps.push('Review and execute the suggested actions');
            result.actions.executable.forEach(action => {
                if (action.confidence < 0.7) {
                    steps.push(`Verify action: ${action.type} (low confidence)`);
                }
            });
        }
        
        if (result.metadata.overallConfidence >= 0.8) {
            steps.push('Actions can be executed with high confidence');
        }
        
        return steps;
    }

    // Utility methods for output formatting
    generateHumanReadableSummary(result: VoiceOSResult): string {
        let summary = `Voice OS Processing Summary\n`;
        summary += `Session: ${result.sessionId}\n`;
        summary += `Status: ${result.metadata.status.toUpperCase()}\n`;
        summary += `Confidence: ${(result.metadata.overallConfidence * 100).toFixed(1)}%\n`;
        summary += `Processing Time: ${result.metadata.processingTime}ms\n\n`;
        
        summary += `Input: "${result.originalInput.text}"\n\n`;
        
        if (result.actions.executable.length > 0) {
            summary += `Actions to take:\n`;
            result.actions.executable.forEach((action, i) => {
                summary += `${i + 1}. ${action.type}: ${JSON.stringify(action.parameters)} (${(action.confidence * 100).toFixed(1)}%)\n`;
            });
        } else {
            summary += `No actionable items detected.\n`;
        }
        
        if (result.metadata.warnings.length > 0) {
            summary += `\nWarnings:\n`;
            result.metadata.warnings.forEach(warning => {
                summary += `- ${warning}\n`;
            });
        }
        
        return summary;
    }
} 