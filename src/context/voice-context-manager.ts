import { PatternLearner } from '../patterns/pattern-learner.js';
import { ProcessedVoice } from '../voice/processor.js';
import { TrelloAction } from '../patterns/action-extractor.js';

export interface VoiceContextEntry {
    id: string;
    timestamp: Date;
    rawTranscript: string;
    processedVoice: ProcessedVoice;
    actions: TrelloAction[];
    summary: string;
    semanticTags: string[];
    contextType: 'planning' | 'execution' | 'review' | 'waffle' | 'decision';
    linkedContexts: string[];
    confidence: number;
}

export interface ContextAttachment {
    filename: string;
    content: string;
    type: 'voice_context' | 'voice_archive' | 'action_summary';
    metadata: {
        sessionId: string;
        timestamp: Date;
        contextType: string;
        actionCount: number;
        tags: string[];
    };
}

export interface ContextStorageConfig {
    maxContextsPerCard: number;
    compressionThreshold: number; // Characters before compression
    archiveAfterDays: number;
    enableSemanticLinking: boolean;
    useSmartSummaries: boolean;
}

export class VoiceContextManager {
    private patternLearner: PatternLearner;
    private contexts: Map<string, VoiceContextEntry[]> = new Map();
    private config: ContextStorageConfig;
    private sessionId: string;

    constructor(config?: Partial<ContextStorageConfig>) {
        this.config = {
            maxContextsPerCard: 10,
            compressionThreshold: 2000,
            archiveAfterDays: 7,
            enableSemanticLinking: true,
            useSmartSummaries: true,
            ...config
        };
        
        this.patternLearner = new PatternLearner();
        this.sessionId = this.generateSessionId();
        
        console.log('🎙️ VoiceContextManager initialized with enhanced attachment pattern');
    }

    async storeVoiceContext(
        cardId: string,
        processedVoice: ProcessedVoice,
        actions: TrelloAction[],
        rawTranscript: string
    ): Promise<VoiceContextEntry> {
        const contextEntry: VoiceContextEntry = {
            id: this.generateContextId(),
            timestamp: new Date(),
            rawTranscript,
            processedVoice,
            actions,
            summary: await this.generateSummary(rawTranscript, actions),
            semanticTags: await this.extractSemanticTags(rawTranscript, processedVoice),
            contextType: this.classifyContextType(processedVoice, actions),
            linkedContexts: await this.findLinkedContexts(cardId, rawTranscript),
            confidence: this.calculateContextConfidence(processedVoice, actions)
        };

        // Store in memory
        if (!this.contexts.has(cardId)) {
            this.contexts.set(cardId, []);
        }
        this.contexts.get(cardId)!.push(contextEntry);

        // Create attachment following your waffle pattern
        await this.createContextAttachment(cardId, contextEntry);

        // Manage context lifecycle
        await this.manageContextLifecycle(cardId);

        console.log(`📎 Voice context stored for card ${cardId}: ${contextEntry.contextType}`);
        return contextEntry;
    }

    private async createContextAttachment(
        cardId: string,
        context: VoiceContextEntry
    ): Promise<ContextAttachment> {
        const timestamp = context.timestamp.toISOString().split('T')[0];
        const filename = `voice_context_${timestamp}_${context.id.slice(-8)}.txt`;
        
        // Following your waffle pattern but enhanced
        const content = this.formatContextContent(context);
        
        const attachment: ContextAttachment = {
            filename,
            content,
            type: 'voice_context',
            metadata: {
                sessionId: this.sessionId,
                timestamp: context.timestamp,
                contextType: context.contextType,
                actionCount: context.actions.length,
                tags: context.semanticTags
            }
        };

        // TODO: Use MCP Trello integration to attach file
        // await this.attachToCard(cardId, attachment);
        
        return attachment;
    }

    private formatContextContent(context: VoiceContextEntry): string {
        return `
# Voice Context Entry
**ID:** ${context.id}
**Timestamp:** ${context.timestamp.toISOString()}
**Type:** ${context.contextType}
**Confidence:** ${(context.confidence * 100).toFixed(1)}%

## Summary
${context.summary}

## Raw Transcript
${context.rawTranscript}

## Processed Intent
- **Intent:** ${context.processedVoice.intent}
- **Entities:** ${JSON.stringify(context.processedVoice.entities, null, 2)}

## Extracted Actions (${context.actions.length})
${context.actions.map((action, idx) => `
### Action ${idx + 1}: ${action.type}
- **Confidence:** ${(action.confidence * 100).toFixed(1)}%
- **Priority:** ${action.priority}
- **Parameters:** ${JSON.stringify(action.parameters, null, 2)}
`).join('\n')}

## Semantic Tags
${context.semanticTags.map(tag => `- ${tag}`).join('\n')}

## Linked Contexts
${context.linkedContexts.map(id => `- ${id}`).join('\n')}

---
*Generated by Voice OS - Enhanced Context Management*
        `.trim();
    }

    async getContextForCard(cardId: string, includeArchived: boolean = false): Promise<VoiceContextEntry[]> {
        const contexts = this.contexts.get(cardId) || [];
        
        if (!includeArchived) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.config.archiveAfterDays);
            return contexts.filter(ctx => ctx.timestamp > cutoffDate);
        }
        
        return contexts;
    }

    async getContextSummary(cardId: string): Promise<string> {
        const contexts = await this.getContextForCard(cardId);
        
        if (contexts.length === 0) {
            return "No voice context available for this card.";
        }

        const summaries = contexts.map(ctx => `[${ctx.contextType}] ${ctx.summary}`);
        
        if (this.config.useSmartSummaries && summaries.join(' ').length > this.config.compressionThreshold) {
            return await this.compressContextSummaries(summaries);
        }

        return `Voice Context Summary (${contexts.length} entries):\n\n${summaries.join('\n\n')}`;
    }

    async findRelatedContext(
        cardId: string, 
        query: string, 
        maxResults: number = 3
    ): Promise<VoiceContextEntry[]> {
        const allContexts = Array.from(this.contexts.values()).flat();
        
        if (!this.config.enableSemanticLinking) {
            return [];
        }

        // Use pattern learner for semantic matching
        const matches = await this.patternLearner.findMatchingPatterns(
            {
                text: query,
                intent: 'search',
                entities: {}
            },
            'system',
            0.3
        );

        // Convert matches to context entries (simplified)
        return allContexts
            .filter(ctx => ctx.semanticTags.some(tag => 
                query.toLowerCase().includes(tag.toLowerCase())
            ))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, maxResults);
    }

    private async generateSummary(transcript: string, actions: TrelloAction[]): Promise<string> {
        if (!this.config.useSmartSummaries) {
            return transcript.substring(0, 150) + (transcript.length > 150 ? '...' : '');
        }

        // AI-powered summary generation
        try {
            const actionSummary = actions.length > 0 ? 
                ` Generated ${actions.length} actions: ${actions.map(a => a.type).join(', ')}.` : '';
            
            // Simplified summary - in production, use OpenAI API
            const summary = transcript.length > 200 ? 
                transcript.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...' : 
                transcript;
                
            return summary + actionSummary;
        } catch (error) {
            console.warn('Failed to generate AI summary, using fallback');
            return transcript.substring(0, 150) + '...';
        }
    }

    private async extractSemanticTags(
        transcript: string, 
        processedVoice: ProcessedVoice
    ): Promise<string[]> {
        const tags: string[] = [];
        
        // Add intent as primary tag
        if (processedVoice.intent) {
            tags.push(processedVoice.intent);
        }

        // Extract entity-based tags
        if (processedVoice.entities) {
            Object.entries(processedVoice.entities).forEach(([key, value]) => {
                if (value && typeof value === 'string') {
                    tags.push(`${key}:${value}`);
                }
            });
        }

        // Add context-based tags
        const lowerTranscript = transcript.toLowerCase();
        const contextualTags = [
            { keywords: ['urgent', 'asap', 'critical'], tag: 'urgent' },
            { keywords: ['meeting', 'call', 'discuss'], tag: 'meeting' },
            { keywords: ['bug', 'error', 'issue'], tag: 'bug' },
            { keywords: ['feature', 'enhancement', 'improvement'], tag: 'feature' },
            { keywords: ['deadline', 'due', 'schedule'], tag: 'deadline' }
        ];

        contextualTags.forEach(({ keywords, tag }) => {
            if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
                tags.push(tag);
            }
        });

        return [...new Set(tags)]; // Remove duplicates
    }

    private classifyContextType(
        processedVoice: ProcessedVoice, 
        actions: TrelloAction[]
    ): VoiceContextEntry['contextType'] {
        const intent = processedVoice.intent?.toLowerCase() || '';
        const transcript = processedVoice.text?.toLowerCase() || '';

        if (transcript.includes('waffle') || transcript.includes('brain dump')) {
            return 'waffle';
        }

        if (intent.includes('plan') || transcript.includes('plan')) {
            return 'planning';
        }

        if (actions.length > 0) {
            return 'execution';
        }

        if (intent.includes('review') || transcript.includes('review')) {
            return 'review';
        }

        if (transcript.includes('decide') || transcript.includes('decision')) {
            return 'decision';
        }

        return 'waffle'; // Default to waffle for unclassified
    }

    private async findLinkedContexts(cardId: string, transcript: string): Promise<string[]> {
        if (!this.config.enableSemanticLinking) {
            return [];
        }

        // Find contexts with similar content or references
        const linked: string[] = [];
        const currentContexts = this.contexts.get(cardId) || [];
        
        // Simple keyword-based linking (could be enhanced with embeddings)
        const keywords = transcript.toLowerCase().split(' ')
            .filter(word => word.length > 4)
            .slice(0, 10); // Top 10 keywords

        currentContexts.forEach(ctx => {
            const similarity = this.calculateTextSimilarity(transcript, ctx.rawTranscript);
            if (similarity > 0.3 && ctx.id !== cardId) {
                linked.push(ctx.id);
            }
        });

        return linked;
    }

    private calculateContextConfidence(
        processedVoice: ProcessedVoice, 
        actions: TrelloAction[]
    ): number {
        let confidence = 0.5; // Base confidence

        // Boost confidence for clear intent
        if (processedVoice.intent && processedVoice.intent !== 'unknown') {
            confidence += 0.2;
        }

        // Boost confidence for extracted entities
        if (processedVoice.entities && Object.keys(processedVoice.entities).length > 0) {
            confidence += 0.1;
        }

        // Boost confidence for generated actions
        if (actions.length > 0) {
            confidence += 0.2;
            // Add action confidence average
            const avgActionConfidence = actions.reduce((sum, action) => 
                sum + (action.confidence || 0.5), 0) / actions.length;
            confidence = (confidence + avgActionConfidence) / 2;
        }

        return Math.min(confidence, 1.0);
    }

    private async manageContextLifecycle(cardId: string): Promise<void> {
        const contexts = this.contexts.get(cardId);
        if (!contexts) return;

        // Archive old contexts
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.archiveAfterDays);
        
        const currentContexts = contexts.filter(ctx => ctx.timestamp > cutoffDate);
        const archivedContexts = contexts.filter(ctx => ctx.timestamp <= cutoffDate);

        if (archivedContexts.length > 0) {
            await this.archiveContexts(cardId, archivedContexts);
        }

        // Limit active contexts
        if (currentContexts.length > this.config.maxContextsPerCard) {
            const excess = currentContexts.splice(0, currentContexts.length - this.config.maxContextsPerCard);
            await this.archiveContexts(cardId, excess);
        }

        this.contexts.set(cardId, currentContexts);
    }

    private async archiveContexts(cardId: string, contexts: VoiceContextEntry[]): Promise<void> {
        if (contexts.length === 0) return;

        // Create archive attachment following waffle pattern
        const archiveContent = this.formatArchiveContent(contexts);
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `voice_archive_${timestamp}_${cardId.slice(-8)}.txt`;

        const archiveAttachment: ContextAttachment = {
            filename,
            content: archiveContent,
            type: 'voice_archive',
            metadata: {
                sessionId: this.sessionId,
                timestamp: new Date(),
                contextType: 'archive',
                actionCount: contexts.reduce((sum, ctx) => sum + ctx.actions.length, 0),
                tags: [...new Set(contexts.flatMap(ctx => ctx.semanticTags))]
            }
        };

        // TODO: Use MCP Trello integration to attach archive
        console.log(`📦 Archived ${contexts.length} voice contexts for card ${cardId}`);
    }

    private formatArchiveContent(contexts: VoiceContextEntry[]): string {
        return `
# Voice Context Archive
**Archive Date:** ${new Date().toISOString()}
**Contexts Archived:** ${contexts.length}
**Total Actions:** ${contexts.reduce((sum, ctx) => sum + ctx.actions.length, 0)}

## Archive Summary
${contexts.map(ctx => `- [${ctx.timestamp.toISOString()}] ${ctx.contextType}: ${ctx.summary}`).join('\n')}

## Detailed Archive
${contexts.map((ctx, idx) => `
### Context ${idx + 1} - ${ctx.contextType}
**ID:** ${ctx.id}
**Timestamp:** ${ctx.timestamp.toISOString()}
**Confidence:** ${(ctx.confidence * 100).toFixed(1)}%

${ctx.rawTranscript}

**Actions Generated:** ${ctx.actions.map(a => a.type).join(', ')}
**Tags:** ${ctx.semanticTags.join(', ')}

---
`).join('\n')}

*Archived by Voice OS Context Manager*
        `.trim();
    }

    private async compressContextSummaries(summaries: string[]): Promise<string> {
        // AI-powered compression would go here
        // For now, simple truncation with key points
        const compressed = summaries
            .slice(-5) // Last 5 contexts
            .map(summary => summary.substring(0, 100) + '...')
            .join('\n');
            
        return `Recent voice contexts (compressed):\n${compressed}`;
    }

    private calculateTextSimilarity(text1: string, text2: string): number {
        // Simple Jaccard similarity - could be enhanced with embeddings
        const words1 = new Set(text1.toLowerCase().split(' '));
        const words2 = new Set(text2.toLowerCase().split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    private generateSessionId(): string {
        return `voice_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateContextId(): string {
        return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Utility methods for MCP integration
    async exportContextForPrompt(cardId: string): Promise<string> {
        const summary = await this.getContextSummary(cardId);
        return `Voice Context for Card ${cardId}:\n\n${summary}\n\nTo get more details, read the voice context attachments on this card.`;
    }

    getAnalytics(): {
        totalContexts: number;
        contextsByType: Record<string, number>;
        averageConfidence: number;
        activeCards: number;
    } {
        const allContexts = Array.from(this.contexts.values()).flat();
        
        const contextsByType = allContexts.reduce((acc, ctx) => {
            acc[ctx.contextType] = (acc[ctx.contextType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const averageConfidence = allContexts.length > 0 ?
            allContexts.reduce((sum, ctx) => sum + ctx.confidence, 0) / allContexts.length : 0;

        return {
            totalContexts: allContexts.length,
            contextsByType,
            averageConfidence,
            activeCards: this.contexts.size
        };
    }
} 