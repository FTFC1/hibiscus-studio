import { VoiceTranscriber, TranscriptionResult } from './transcription.js';
import { AIProcessor, NLPAnalysis } from '../intelligence/nlp-pipeline.js';

export interface VoiceInput {
    audio: Buffer | string;
    timestamp: Date;
    sessionId: string;
}

export interface ProcessedVoice {
    text: string;
    confidence: number;
    intent?: string;
    entities?: Record<string, any>;
    context?: Record<string, any>;
    transcription?: TranscriptionResult;
    nlpAnalysis?: NLPAnalysis;
}

export class VoiceProcessor {
    private sessionContext: Map<string, any> = new Map();
    private transcriber: VoiceTranscriber;
    private aiProcessor: AIProcessor | null = null;
    private preferAI: boolean = false;

    constructor(config?: {
        openaiApiKey?: string;
        openrouterApiKey?: string;
        preferAI?: boolean;
    }) {
        this.transcriber = new VoiceTranscriber(config?.openaiApiKey);
        this.preferAI = config?.preferAI || false;
        
        // Only initialize AI processor if we want AI mode
        if (this.preferAI) {
            try {
                this.aiProcessor = new AIProcessor({
                    openaiKey: config?.openaiApiKey,
                    openrouterKey: config?.openrouterApiKey
                });
            } catch (error) {
                console.warn('⚠️  AI processor initialization failed, using fallback mode:', error instanceof Error ? error.message : String(error));
                this.aiProcessor = null;
            }
        }
    }

    async processVoiceInput(input: VoiceInput): Promise<ProcessedVoice> {
        try {
            // Step 1: Transcribe audio to text
            const transcription = await this.transcriber.transcribeAudio(input);
            const text = transcription.text;
            
            // Step 2: Try AI processing if available and preferred
            if (this.preferAI && this.aiProcessor) {
                try {
                    const nlpAnalysis = await this.aiProcessor.analyzeText(text, {
                        sessionId: input.sessionId,
                        previousContext: this.getSessionContext(input.sessionId)
                    });
                    
                    // Update session context with AI insights
                    this.updateSessionContext(input.sessionId, {
                        lastInput: text,
                        lastAnalysis: nlpAnalysis,
                        timestamp: input.timestamp
                    });
                    
                    return {
                        text,
                        confidence: transcription.confidence,
                        intent: nlpAnalysis.intent,
                        entities: this.convertEntitiesToRecord(nlpAnalysis.entities),
                        context: this.getSessionContext(input.sessionId),
                        transcription,
                        nlpAnalysis
                    };
                } catch (aiError) {
                    console.warn('⚠️  AI processing failed, falling back to rule-based processing:', aiError instanceof Error ? aiError.message : String(aiError));
                    // Fall through to fallback processing
                }
            }
            
            // Step 3: Fallback to rule-based processing
            return await this.fallbackProcessing(input, transcription);
            
        } catch (error) {
            console.error('Voice processing error:', error);
            throw new Error(`Failed to process voice input: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async fallbackProcessing(input: VoiceInput, transcription: TranscriptionResult): Promise<ProcessedVoice> {
        const text = transcription.text;
        
        const intent = this.extractIntent(text);
        const entities = this.extractEntities(text);
        const context = this.getSessionContext(input.sessionId);
        
        this.updateSessionContext(input.sessionId, {
            lastInput: text,
            lastIntent: intent,
            lastEntities: entities,
            timestamp: input.timestamp
        });

        return {
            text,
            confidence: transcription.confidence,
            intent,
            entities,
            context,
            transcription
        };
    }

    private convertEntitiesToRecord(entities: any[]): Record<string, any> {
        const result: Record<string, any> = {};
        entities.forEach((entity, index) => {
            result[`entity_${index}`] = entity;
        });
        return result;
    }

    private extractIntent(text: string): string {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
            return 'create_card';
        }
        if (lowerText.includes('update') || lowerText.includes('edit') || lowerText.includes('change')) {
            return 'update_card';
        }
        if (lowerText.includes('move') || lowerText.includes('transfer')) {
            return 'move_card';
        }
        if (lowerText.includes('delete') || lowerText.includes('remove') || lowerText.includes('archive')) {
            return 'archive_card';
        }
        if (lowerText.includes('list') || lowerText.includes('show') || lowerText.includes('display')) {
            return 'list_cards';
        }
        
        return 'unknown';
    }

    private extractEntities(text: string): Record<string, any> {
        const entities: Record<string, any> = {};
        
        // Extract card names (text in quotes)
        const cardNameMatch = text.match(/['"]([^'"]+)['"]/);
        if (cardNameMatch) {
            entities.cardName = cardNameMatch[1];
        }
        
        // Extract list names
        const listPatterns = ['backlog', 'todo', 'doing', 'done', 'in progress', 'review'];
        for (const pattern of listPatterns) {
            if (text.toLowerCase().includes(pattern)) {
                entities.listName = pattern;
                break;
            }
        }
        
        // Extract priorities
        if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('high priority')) {
            entities.priority = 'high';
        } else if (text.toLowerCase().includes('low priority')) {
            entities.priority = 'low';
        }
        
        return entities;
    }

    private getSessionContext(sessionId: string): Record<string, any> {
        return this.sessionContext.get(sessionId) || {};
    }

    private updateSessionContext(sessionId: string, update: Record<string, any>): void {
        const existing = this.getSessionContext(sessionId);
        this.sessionContext.set(sessionId, { ...existing, ...update });
    }

    // Helper method to process text directly (for testing)
    async processText(text: string, sessionId: string = 'test'): Promise<ProcessedVoice> {
        const input: VoiceInput = {
            audio: text,
            timestamp: new Date(),
            sessionId
        };
        
        return await this.processVoiceInput(input);
    }

    // Get processor status for debugging
    getStatus() {
        return {
            transcriber: this.transcriber.isAvailable(),
            aiProcessor: this.aiProcessor !== null,
            preferAI: this.preferAI,
            activeSessions: this.sessionContext.size
        };
    }
} 