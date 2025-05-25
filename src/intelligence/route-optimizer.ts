import { PatternLearner, UserPattern, PatternMatch } from '../patterns/pattern-learner.js';
import { PatternRecommendation } from './pattern-intelligence.js';
import { ProcessedVoice } from '../voice/processor.js';
import { TrelloAction } from '../patterns/action-extractor.js';

export interface RoutingDecision {
    action: TrelloAction;
    confidence: number;
    source: 'pattern_match' | 'ai_fallback' | 'manual_override';
    pattern?: UserPattern;
    alternatives: TrelloAction[];
    reasoning: string;
    timestamp: Date;
}

export interface RoutingFeedback {
    routingId: string;
    successful: boolean;
    userCorrection?: TrelloAction;
    userRating?: number; // 1-5 scale
    notes?: string;
    timestamp: Date;
}

export interface RoutingStats {
    totalRoutes: number;
    patternMatchRoutes: number;
    fallbackRoutes: number;
    manualOverrides: number;
    averageConfidence: number;
    successRate: number;
    learnedPatterns: number;
}

export class RouteOptimizer {
    private patternLearner: PatternLearner;
    private routingHistory: Map<string, RoutingDecision> = new Map();
    private feedbackHistory: Map<string, RoutingFeedback> = new Map();
    private stats: RoutingStats;
    private confidenceThreshold: number;
    private userId: string;

    constructor(config?: {
        userId?: string;
        confidenceThreshold?: number;
        patternLearnerConfig?: any;
    }) {
        this.userId = config?.userId || 'default';
        this.confidenceThreshold = config?.confidenceThreshold || 0.6;
        this.patternLearner = new PatternLearner(config?.patternLearnerConfig);
        
        this.stats = {
            totalRoutes: 0,
            patternMatchRoutes: 0,
            fallbackRoutes: 0,
            manualOverrides: 0,
            averageConfidence: 0,
            successRate: 0,
            learnedPatterns: 0
        };

        console.log(`✅ RouteOptimizer initialized for user: ${this.userId}`);
    }

    async initialize(): Promise<void> {
        await this.patternLearner.initialize();
        console.log('🎯 RouteOptimizer ready for intelligent routing');
    }

    async routeVoiceInput(
        processedVoice: ProcessedVoice,
        fallbackAction?: TrelloAction
    ): Promise<RoutingDecision> {
        const routingId = this.generateRoutingId();
        
        try {
            // Step 1: Try pattern matching
            const patternMatch = await this.findBestPatternMatch(processedVoice);
            
            if (patternMatch && patternMatch.confidence >= this.confidenceThreshold) {
                return this.createPatternBasedRouting(routingId, patternMatch, processedVoice);
            }

            // Step 2: Try intelligent recommendations
            const recommendations = await this.getIntelligentRecommendations(processedVoice);
            
            if (recommendations.length > 0 && recommendations[0].confidence >= this.confidenceThreshold) {
                return this.createRecommendationBasedRouting(routingId, recommendations[0], processedVoice);
            }

            // Step 3: Fallback to AI-generated action
            if (fallbackAction) {
                return this.createFallbackRouting(routingId, fallbackAction, processedVoice);
            }

            // Step 4: Create default action based on intent
            const defaultAction = this.createDefaultAction(processedVoice);
            return this.createFallbackRouting(routingId, defaultAction, processedVoice);

        } catch (error) {
            console.error('❌ Routing error:', error);
            const errorAction = this.createErrorAction(processedVoice);
            return this.createFallbackRouting(routingId, errorAction, processedVoice);
        }
    }

    private async findBestPatternMatch(processedVoice: ProcessedVoice): Promise<PatternMatch | null> {
        if (!processedVoice.intent || !processedVoice.text) {
            return null;
        }

        const input = {
            text: processedVoice.text,
            intent: processedVoice.intent,
            entities: processedVoice.entities || {}
        };

        const matches = await this.patternLearner.findMatchingPatterns(input, this.userId, 0.3);
        return matches.length > 0 ? matches[0] : null;
    }

    private async getIntelligentRecommendations(processedVoice: ProcessedVoice): Promise<PatternRecommendation[]> {
        if (!processedVoice.intent || !processedVoice.text) {
            return [];
        }

        const input = {
            text: processedVoice.text,
            intent: processedVoice.intent,
            entities: processedVoice.entities || {}
        };

        return await this.patternLearner.getPatternRecommendations(input, this.userId, 3);
    }

    private createPatternBasedRouting(
        routingId: string,
        match: PatternMatch,
        processedVoice: ProcessedVoice
    ): RoutingDecision {
        const action: TrelloAction = {
            type: match.pattern.action.type as TrelloAction['type'],
            parameters: { ...match.pattern.action.parameters },
            confidence: match.confidence,
            sourceText: processedVoice.text || '',
            priority: this.extractPriority(processedVoice.text || '')
        };

        // Enhance action with current context
        this.enhanceActionWithContext(action, processedVoice);

        const decision: RoutingDecision = {
            action,
            confidence: match.confidence,
            source: 'pattern_match',
            pattern: match.pattern,
            alternatives: [],
            reasoning: `Matched pattern: "${match.pattern.trigger.text}" with ${(match.similarity * 100).toFixed(1)}% similarity`,
            timestamp: new Date()
        };

        this.recordRouting(routingId, decision);
        this.updateStats('pattern_match', match.confidence);

        console.log(`🎯 Pattern-based routing: ${action.type} (${(match.confidence * 100).toFixed(1)}% confidence)`);
        return decision;
    }

    private createRecommendationBasedRouting(
        routingId: string,
        recommendation: PatternRecommendation,
        processedVoice: ProcessedVoice
    ): RoutingDecision {
        const action: TrelloAction = {
            type: recommendation.pattern.action.type as TrelloAction['type'],
            parameters: { ...recommendation.pattern.action.parameters },
            confidence: recommendation.confidence,
            sourceText: processedVoice.text || '',
            priority: this.extractPriority(processedVoice.text || '')
        };

        this.enhanceActionWithContext(action, processedVoice);

        const decision: RoutingDecision = {
            action,
            confidence: recommendation.confidence,
            source: 'pattern_match',
            pattern: recommendation.pattern,
            alternatives: [],
            reasoning: `AI recommendation: ${recommendation.reason}`,
            timestamp: new Date()
        };

        this.recordRouting(routingId, decision);
        this.updateStats('pattern_match', recommendation.confidence);

        console.log(`🤖 Recommendation-based routing: ${action.type} (${(recommendation.confidence * 100).toFixed(1)}% confidence)`);
        return decision;
    }

    private createFallbackRouting(
        routingId: string,
        action: TrelloAction,
        processedVoice: ProcessedVoice
    ): RoutingDecision {
        const decision: RoutingDecision = {
            action,
            confidence: action.confidence || 0.5,
            source: 'ai_fallback',
            alternatives: [],
            reasoning: 'No suitable patterns found, using AI-generated action',
            timestamp: new Date()
        };

        this.recordRouting(routingId, decision);
        this.updateStats('fallback', decision.confidence);

        console.log(`🔄 Fallback routing: ${action.type} (${(decision.confidence * 100).toFixed(1)}% confidence)`);
        return decision;
    }

    private enhanceActionWithContext(action: TrelloAction, processedVoice: ProcessedVoice): void {
        // Extract entities and enhance action parameters
        if (processedVoice.entities) {
            Object.entries(processedVoice.entities).forEach(([key, value]) => {
                if (value && !action.parameters[key]) {
                    action.parameters[key] = value;
                }
            });
        }

        // Add context from voice processing
        if (processedVoice.context) {
            action.parameters.context = processedVoice.context;
        }
    }

    private createDefaultAction(processedVoice: ProcessedVoice): TrelloAction {
        const intent = processedVoice.intent || 'unknown';
        const sourceText = processedVoice.text || '';
        const priority = this.extractPriority(sourceText);
        
        switch (intent) {
            case 'create_card':
            case 'create_task':
                return {
                    type: 'create_card',
                    parameters: {
                        name: this.extractCardName(sourceText) || 'Voice-created task',
                        description: `Created from voice input: "${sourceText}"`
                    },
                    confidence: 0.6,
                    sourceText,
                    priority
                };

            case 'list_cards':
                // Convert to create_card as 'get_cards' isn't in the valid types
                return {
                    type: 'create_card',
                    parameters: {
                        name: 'Card List Request',
                        description: `List cards request: "${sourceText}"`
                    },
                    confidence: 0.7,
                    sourceText,
                    priority
                };

            case 'update_card':
                return {
                    type: 'update_card',
                    parameters: {
                        description: `Voice update: "${sourceText}"`
                    },
                    confidence: 0.5,
                    sourceText,
                    priority
                };

            case 'move_card':
                return {
                    type: 'move_card',
                    parameters: {
                        context: sourceText
                    },
                    confidence: 0.5,
                    sourceText,
                    priority
                };

            case 'archive_card':
                return {
                    type: 'archive_card',
                    parameters: {
                        context: sourceText
                    },
                    confidence: 0.6,
                    sourceText,
                    priority
                };

            default:
                return {
                    type: 'create_card',
                    parameters: {
                        name: 'Voice input',
                        description: `Unrecognized command: "${sourceText}"`
                    },
                    confidence: 0.3,
                    sourceText,
                    priority
                };
        }
    }

    private createErrorAction(processedVoice: ProcessedVoice): TrelloAction {
        const sourceText = processedVoice.text || '';
        return {
            type: 'create_card',
            parameters: {
                name: 'Voice Input Error',
                description: `Failed to process: "${sourceText}"`
            },
            confidence: 0.1,
            sourceText,
            priority: 'low'
        };
    }

    private extractPriority(text: string): 'high' | 'medium' | 'low' {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('critical')) {
            return 'high';
        }
        
        if (lowerText.includes('important') || lowerText.includes('priority') || lowerText.includes('soon')) {
            return 'medium';
        }
        
        return 'low';
    }

    private extractCardName(text: string): string | null {
        // Extract text in quotes
        const quotedMatch = text.match(/['"]([^'"]+)['"]/);
        if (quotedMatch) {
            return quotedMatch[1];
        }

        // Extract text after common keywords
        const keywordMatch = text.match(/(?:create|add|make|new)\s+(?:a\s+)?(?:card|task|item)?\s+(?:called|named|for)?\s*["']?([^"']+?)["']?(?:\s+(?:in|to|for)|$)/i);
        if (keywordMatch) {
            return keywordMatch[1].trim();
        }

        return null;
    }

    async recordFeedback(routingId: string, feedback: Omit<RoutingFeedback, 'routingId' | 'timestamp'>): Promise<void> {
        const fullFeedback: RoutingFeedback = {
            ...feedback,
            routingId,
            timestamp: new Date()
        };

        this.feedbackHistory.set(routingId, fullFeedback);

        // Learn from feedback
        const routing = this.routingHistory.get(routingId);
        if (routing && routing.pattern) {
            await this.learnFromFeedback(routing, fullFeedback);
        }

        // Update success rate
        this.updateSuccessRate();

        console.log(`📝 Recorded feedback for routing ${routingId}: ${feedback.successful ? 'success' : 'failure'}`);
    }

    private async learnFromFeedback(routing: RoutingDecision, feedback: RoutingFeedback): Promise<void> {
        if (!routing.pattern) return;

        if (feedback.successful) {
            // Positive feedback - reinforce the pattern
            await this.patternLearner.learnFromInteraction(
                routing.pattern.trigger,
                routing.pattern.action,
                this.userId,
                true
            );
        } else if (feedback.userCorrection) {
            // User provided a correction - learn the new pattern
            await this.patternLearner.learnFromInteraction(
                routing.pattern.trigger,
                feedback.userCorrection,
                this.userId,
                true
            );

            // Mark the old pattern as less successful
            await this.patternLearner.learnFromInteraction(
                routing.pattern.trigger,
                routing.pattern.action,
                this.userId,
                false
            );

            this.stats.learnedPatterns++;
            console.log(`🧠 Learned new pattern from user correction`);
        }
    }

    async manualOverride(
        processedVoice: ProcessedVoice,
        overrideAction: TrelloAction,
        reasoning?: string
    ): Promise<RoutingDecision> {
        const routingId = this.generateRoutingId();
        
        const decision: RoutingDecision = {
            action: overrideAction,
            confidence: 1.0,
            source: 'manual_override',
            alternatives: [],
            reasoning: reasoning || 'Manual override by user',
            timestamp: new Date()
        };

        this.recordRouting(routingId, decision);
        this.updateStats('manual_override', 1.0);

        // Learn from manual override
        if (processedVoice.intent && processedVoice.text) {
            await this.patternLearner.learnFromInteraction(
                {
                    text: processedVoice.text,
                    intent: processedVoice.intent,
                    entities: processedVoice.entities || {}
                },
                overrideAction,
                this.userId,
                true
            );
            this.stats.learnedPatterns++;
        }

        console.log(`🎛️  Manual override: ${overrideAction.type}`);
        return decision;
    }

    // Analytics and monitoring
    getRoutingStats(): RoutingStats {
        return { ...this.stats };
    }

    async getPatternAnalytics(): Promise<{
        totalPatterns: number;
        clustersCount: number;
        intelligenceAvailable: boolean;
        recentRoutings: RoutingDecision[];
    }> {
        const patternStats = await this.patternLearner.getPatternStats();
        const intelligenceStatus = await this.patternLearner.getIntelligenceStatus();
        
        const recentRoutings = Array.from(this.routingHistory.values())
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);

        return {
            totalPatterns: patternStats.total,
            clustersCount: intelligenceStatus.clustersCount,
            intelligenceAvailable: intelligenceStatus.available,
            recentRoutings
        };
    }

    async optimizePatterns(): Promise<void> {
        console.log('🔧 Optimizing routing patterns...');
        const result = await this.patternLearner.optimizePatterns();
        console.log(`✅ Pattern optimization complete: removed ${result.removed}, merged ${result.merged}`);
    }

    // Utility methods
    private generateRoutingId(): string {
        return `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private recordRouting(routingId: string, decision: RoutingDecision): void {
        this.routingHistory.set(routingId, decision);
        
        // Keep only recent history (last 1000 entries)
        if (this.routingHistory.size > 1000) {
            const oldest = Array.from(this.routingHistory.keys())[0];
            this.routingHistory.delete(oldest);
        }
    }

    private updateStats(source: 'pattern_match' | 'fallback' | 'manual_override', confidence: number): void {
        this.stats.totalRoutes++;
        
        switch (source) {
            case 'pattern_match':
                this.stats.patternMatchRoutes++;
                break;
            case 'fallback':
                this.stats.fallbackRoutes++;
                break;
            case 'manual_override':
                this.stats.manualOverrides++;
                break;
        }

        // Update average confidence
        this.stats.averageConfidence = (
            (this.stats.averageConfidence * (this.stats.totalRoutes - 1)) + confidence
        ) / this.stats.totalRoutes;
    }

    private updateSuccessRate(): void {
        const totalFeedback = this.feedbackHistory.size;
        if (totalFeedback === 0) {
            this.stats.successRate = 0;
            return;
        }

        const successful = Array.from(this.feedbackHistory.values())
            .filter(feedback => feedback.successful).length;

        this.stats.successRate = successful / totalFeedback;
    }

    // Clean up methods
    clearHistory(): void {
        this.routingHistory.clear();
        this.feedbackHistory.clear();
        console.log('🧹 Cleared routing history');
    }

    async clearPatternCache(): Promise<void> {
        await this.patternLearner.clearIntelligenceCache();
    }
} 