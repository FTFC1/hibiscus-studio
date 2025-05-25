import { promises as fs } from 'fs';
import path from 'path';
import { PatternIntelligence, PatternRecommendation, PatternCluster } from '../intelligence/pattern-intelligence.js';

export interface UserPattern {
    id: string;
    userId: string;
    patternType: 'voice_to_action' | 'list_preference' | 'priority_mapping' | 'workflow';
    trigger: {
        text: string;
        intent: string;
        entities: Record<string, any>;
    };
    action: {
        type: string;
        parameters: Record<string, any>;
        confidence: number;
    };
    metadata: {
        frequency: number;
        lastUsed: Date;
        success_rate: number;
        created: Date;
        updated: Date;
    };
    learning: {
        user_confirmations: number;
        user_corrections: number;
        auto_improvements: string[];
    };
}

export interface PatternMatch {
    pattern: UserPattern;
    confidence: number;
    similarity: number;
    reason: string;
}

export class PatternLearner {
    private patterns: Map<string, UserPattern> = new Map();
    private patternsPath: string;
    private initialized: boolean = false;
    private patternIntelligence: PatternIntelligence;

    constructor(config?: { 
        patternsPath?: string;
        openaiApiKey?: string;
        enableIntelligence?: boolean;
    }) {
        this.patternsPath = config?.patternsPath || path.join(process.cwd(), 'data', 'patterns.json');
        
        // Initialize pattern intelligence if enabled (default: true)
        if (config?.enableIntelligence !== false) {
            this.patternIntelligence = new PatternIntelligence({
                openaiApiKey: config?.openaiApiKey
            });
        } else {
            // Create a dummy intelligence for fallback
            this.patternIntelligence = {} as PatternIntelligence;
        }
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;
        
        try {
            const dataDir = path.dirname(this.patternsPath);
            await fs.mkdir(dataDir, { recursive: true });
            await this.loadPatterns();
            this.initialized = true;
            console.log(`✅ PatternLearner initialized with ${this.patterns.size} patterns`);
        } catch (error) {
            console.error('❌ Failed to initialize PatternLearner:', error);
            throw error;
        }
    }

    async learnFromInteraction(
        input: {
            text: string;
            intent: string;
            entities: Record<string, any>;
        },
        action: {
            type: string;
            parameters: Record<string, any>;
        },
        userId: string = 'default',
        success: boolean = true
    ): Promise<UserPattern> {
        await this.initialize();
        
        const patternId = this.generatePatternId(input, action);
        const existingPattern = this.patterns.get(patternId);
        
        if (existingPattern) {
            return await this.updateExistingPattern(existingPattern, success);
        } else {
            return await this.createNewPattern(patternId, input, action, userId);
        }
    }

    async findMatchingPatterns(
        input: {
            text: string;
            intent: string;
            entities: Record<string, any>;
        },
        userId: string = 'default',
        threshold: number = 0.7
    ): Promise<PatternMatch[]> {
        await this.initialize();
        
        const userPatterns = Array.from(this.patterns.values())
            .filter(p => p.userId === userId || p.userId === 'global');
        
        const matches: PatternMatch[] = [];
        
        // Use enhanced similarity if PatternIntelligence is available
        if (this.patternIntelligence.isAvailable?.()) {
            for (const pattern of userPatterns) {
                const similarity = await this.patternIntelligence.enhancedPatternSimilarity(
                    { trigger: input } as UserPattern,
                    pattern
                );
                
                if (similarity >= threshold) {
                    const confidence = this.calculateConfidence(pattern, similarity);
                    
                    matches.push({
                        pattern,
                        confidence,
                        similarity,
                        reason: `${(similarity * 100).toFixed(1)}% semantic similarity with ${pattern.metadata.frequency} uses`
                    });
                }
            }
        } else {
            // Fallback to basic similarity
            for (const pattern of userPatterns) {
                const similarity = this.calculateSimilarity(input, pattern.trigger);
                
                if (similarity >= threshold) {
                    const confidence = this.calculateConfidence(pattern, similarity);
                    
                    matches.push({
                        pattern,
                        confidence,
                        similarity,
                        reason: `${(similarity * 100).toFixed(1)}% basic similarity with ${pattern.metadata.frequency} uses`
                    });
                }
            }
        }
        
        return matches.sort((a, b) => b.confidence - a.confidence);
    }

    private async loadPatterns(): Promise<void> {
        try {
            const data = await fs.readFile(this.patternsPath, 'utf-8');
            const patternsArray: UserPattern[] = JSON.parse(data);
            
            patternsArray.forEach(pattern => {
                pattern.metadata.lastUsed = new Date(pattern.metadata.lastUsed);
                pattern.metadata.created = new Date(pattern.metadata.created);
                pattern.metadata.updated = new Date(pattern.metadata.updated);
                this.patterns.set(pattern.id, pattern);
            });
        } catch (error) {
            if ((error as any).code !== 'ENOENT') {
                console.warn('⚠️  Failed to load patterns:', error);
            }
        }
    }

    private async savePatterns(): Promise<void> {
        try {
            const patternsArray = Array.from(this.patterns.values());
            await fs.writeFile(this.patternsPath, JSON.stringify(patternsArray, null, 2));
        } catch (error) {
            console.error('❌ Failed to save patterns:', error);
        }
    }

    private generatePatternId(
        input: { text: string; intent: string; entities: Record<string, any> },
        action: { type: string; parameters: Record<string, any> }
    ): string {
        const signature = `${input.intent}-${action.type}-${JSON.stringify(input.entities)}`;
        return signature.replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase();
    }

    private async createNewPattern(
        patternId: string,
        input: { text: string; intent: string; entities: Record<string, any> },
        action: { type: string; parameters: Record<string, any> },
        userId: string
    ): Promise<UserPattern> {
        const now = new Date();
        
        const pattern: UserPattern = {
            id: patternId,
            userId,
            patternType: this.classifyPatternType(input, action),
            trigger: input,
            action: {
                ...action,
                confidence: 0.8
            },
            metadata: {
                frequency: 1,
                lastUsed: now,
                success_rate: 1.0,
                created: now,
                updated: now
            },
            learning: {
                user_confirmations: 0,
                user_corrections: 0,
                auto_improvements: []
            }
        };
        
        this.patterns.set(patternId, pattern);
        await this.savePatterns();
        
        console.log(`✅ Created new pattern: ${patternId}`);
        return pattern;
    }

    private async updateExistingPattern(pattern: UserPattern, success: boolean): Promise<UserPattern> {
        pattern.metadata.frequency++;
        pattern.metadata.lastUsed = new Date();
        pattern.metadata.updated = new Date();
        
        if (success) {
            pattern.learning.user_confirmations++;
        } else {
            pattern.learning.user_corrections++;
        }
        
        pattern.metadata.success_rate = this.calculateSuccessRate(pattern);
        
        await this.savePatterns();
        return pattern;
    }

    private calculateSimilarity(
        input: { text: string; intent: string; entities: Record<string, any> },
        trigger: { text: string; intent: string; entities: Record<string, any> }
    ): number {
        let score = 0;
        
        // Intent match (40%)
        if (input.intent === trigger.intent) {
            score += 0.4;
        }
        
        // Text similarity (30%)
        const textSimilarity = this.calculateTextSimilarity(input.text, trigger.text);
        score += textSimilarity * 0.3;
        
        // Entity overlap (30%)
        const entitySimilarity = this.calculateEntitySimilarity(input.entities, trigger.entities);
        score += entitySimilarity * 0.3;
        
        return Math.min(score, 1.0);
    }

    private calculateTextSimilarity(text1: string, text2: string): number {
        const words1 = text1.toLowerCase().split(/\s+/);
        const words2 = text2.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        
        return union.length > 0 ? intersection.length / union.length : 0;
    }

    private calculateEntitySimilarity(entities1: Record<string, any>, entities2: Record<string, any>): number {
        const keys1 = Object.keys(entities1);
        const keys2 = Object.keys(entities2);
        
        if (keys1.length === 0 && keys2.length === 0) return 1;
        if (keys1.length === 0 || keys2.length === 0) return 0;
        
        const sharedKeys = keys1.filter(key => keys2.includes(key));
        const totalKeys = [...new Set([...keys1, ...keys2])];
        
        return sharedKeys.length / totalKeys.length;
    }

    private calculateConfidence(pattern: UserPattern, similarity: number): number {
        const frequencyScore = Math.min(pattern.metadata.frequency / 10, 1);
        const successScore = pattern.metadata.success_rate;
        
        return (similarity * 0.5) + (frequencyScore * 0.25) + (successScore * 0.25);
    }

    private calculateSuccessRate(pattern: UserPattern): number {
        const total = pattern.learning.user_confirmations + pattern.learning.user_corrections;
        return total > 0 ? pattern.learning.user_confirmations / total : 1.0;
    }

    private classifyPatternType(
        input: { text: string; intent: string; entities: Record<string, any> },
        action: { type: string; parameters: Record<string, any> }
    ): UserPattern['patternType'] {
        if (input.intent.includes('create') || action.type.includes('create')) {
            return 'voice_to_action';
        }
        if (input.entities.listName || action.parameters.listName) {
            return 'list_preference';
        }
        if (input.entities.priority || action.parameters.priority) {
            return 'priority_mapping';
        }
        return 'workflow';
    }

    // CRUD Methods for direct pattern management
    async addPattern(pattern: Omit<UserPattern, 'id' | 'metadata' | 'learning'>): Promise<UserPattern> {
        await this.initialize();
        
        const now = new Date();
        const patternId = this.generatePatternId(pattern.trigger, pattern.action);
        
        const fullPattern: UserPattern = {
            ...pattern,
            id: patternId,
            metadata: {
                frequency: 1,
                lastUsed: now,
                success_rate: 1.0,
                created: now,
                updated: now
            },
            learning: {
                user_confirmations: 0,
                user_corrections: 0,
                auto_improvements: []
            }
        };
        
        this.patterns.set(patternId, fullPattern);
        await this.savePatterns();
        
        console.log(`✅ Added pattern: ${patternId}`);
        return fullPattern;
    }

    async getPattern(patternId: string): Promise<UserPattern | null> {
        await this.initialize();
        return this.patterns.get(patternId) || null;
    }

    async updatePattern(patternId: string, updates: Partial<UserPattern>): Promise<UserPattern | null> {
        await this.initialize();
        
        const existingPattern = this.patterns.get(patternId);
        if (!existingPattern) {
            console.warn(`⚠️  Pattern not found: ${patternId}`);
            return null;
        }
        
        const updatedPattern: UserPattern = {
            ...existingPattern,
            ...updates,
            id: patternId, // Ensure ID doesn't change
            metadata: {
                ...existingPattern.metadata,
                ...updates.metadata,
                updated: new Date()
            }
        };
        
        this.patterns.set(patternId, updatedPattern);
        await this.savePatterns();
        
        console.log(`✅ Updated pattern: ${patternId}`);
        return updatedPattern;
    }

    async deletePattern(patternId: string): Promise<boolean> {
        await this.initialize();
        
        const existed = this.patterns.has(patternId);
        if (existed) {
            this.patterns.delete(patternId);
            await this.savePatterns();
            console.log(`✅ Deleted pattern: ${patternId}`);
        } else {
            console.warn(`⚠️  Pattern not found: ${patternId}`);
        }
        
        return existed;
    }

    // Utility methods for pattern management
    async getAllPatterns(userId?: string): Promise<UserPattern[]> {
        await this.initialize();
        
        const allPatterns = Array.from(this.patterns.values());
        
        if (userId) {
            return allPatterns.filter(p => p.userId === userId || p.userId === 'global');
        }
        
        return allPatterns;
    }

    async getPatternStats(): Promise<{
        total: number;
        byType: Record<string, number>;
        byUser: Record<string, number>;
        avgSuccessRate: number;
    }> {
        await this.initialize();
        
        const patterns = Array.from(this.patterns.values());
        const stats = {
            total: patterns.length,
            byType: {} as Record<string, number>,
            byUser: {} as Record<string, number>,
            avgSuccessRate: 0
        };
        
        let totalSuccessRate = 0;
        
        patterns.forEach(pattern => {
            // Count by type
            stats.byType[pattern.patternType] = (stats.byType[pattern.patternType] || 0) + 1;
            
            // Count by user
            stats.byUser[pattern.userId] = (stats.byUser[pattern.userId] || 0) + 1;
            
            // Sum success rates
            totalSuccessRate += pattern.metadata.success_rate;
        });
        
        stats.avgSuccessRate = patterns.length > 0 ? totalSuccessRate / patterns.length : 0;
        
        return stats;
    }

    // Enhanced AI-powered methods
    async getPatternRecommendations(
        input: { text: string; intent: string; entities: Record<string, any> },
        userId: string = 'default',
        limit: number = 5
    ): Promise<PatternRecommendation[]> {
        await this.initialize();
        
        if (!this.patternIntelligence.isAvailable?.()) {
            console.warn('⚠️  Pattern intelligence not available, returning empty recommendations');
            return [];
        }
        
        const userPatterns = Array.from(this.patterns.values())
            .filter(p => p.userId === userId || p.userId === 'global');
        
        return await this.patternIntelligence.recommendPatterns(input, userPatterns, limit);
    }

    async clusterPatterns(userId?: string): Promise<PatternCluster[]> {
        await this.initialize();
        
        if (!this.patternIntelligence.clusterPatterns) {
            console.warn('⚠️  Pattern clustering not available');
            return [];
        }
        
        const patterns = userId 
            ? Array.from(this.patterns.values()).filter(p => p.userId === userId || p.userId === 'global')
            : Array.from(this.patterns.values());
        
        return await this.patternIntelligence.clusterPatterns(patterns);
    }

    async optimizePatterns(): Promise<{
        removed: number;
        merged: number;
        optimized: number;
    }> {
        await this.initialize();
        
        console.log('🔧 Optimizing pattern database...');
        
        let removed = 0;
        let merged = 0;
        let optimized = 0;
        
        const patterns = Array.from(this.patterns.values());
        const toRemove: string[] = [];
        
        // Remove low-quality patterns
        for (const pattern of patterns) {
            const isLowQuality = (
                pattern.metadata.success_rate < 0.3 ||
                (pattern.metadata.frequency === 1 && this.isOldPattern(pattern))
            );
            
            if (isLowQuality) {
                toRemove.push(pattern.id);
                removed++;
            }
        }
        
        // Remove identified patterns
        for (const id of toRemove) {
            this.patterns.delete(id);
        }
        
        // Try to merge similar patterns if intelligence is available
        if (this.patternIntelligence.enhancedPatternSimilarity) {
            const remainingPatterns = Array.from(this.patterns.values());
            const mergeGroups: UserPattern[][] = [];
            
            for (let i = 0; i < remainingPatterns.length; i++) {
                for (let j = i + 1; j < remainingPatterns.length; j++) {
                    const pattern1 = remainingPatterns[i];
                    const pattern2 = remainingPatterns[j];
                    
                    if (pattern1.userId === pattern2.userId) {
                        const similarity = await this.patternIntelligence.enhancedPatternSimilarity(pattern1, pattern2);
                        
                        if (similarity > 0.95) {
                            // Very similar patterns - candidates for merging
                            const existingGroup = mergeGroups.find(group => 
                                group.includes(pattern1) || group.includes(pattern2)
                            );
                            
                            if (existingGroup) {
                                if (!existingGroup.includes(pattern1)) existingGroup.push(pattern1);
                                if (!existingGroup.includes(pattern2)) existingGroup.push(pattern2);
                            } else {
                                mergeGroups.push([pattern1, pattern2]);
                            }
                        }
                    }
                }
            }
            
            // Merge similar patterns
            for (const group of mergeGroups) {
                if (group.length > 1) {
                    const mergedPattern = this.mergePatterns(group);
                    
                    // Remove individual patterns
                    for (const pattern of group) {
                        this.patterns.delete(pattern.id);
                    }
                    
                    // Add merged pattern
                    this.patterns.set(mergedPattern.id, mergedPattern);
                    merged += group.length - 1;
                }
            }
        }
        
        // Update timestamps and optimize metadata
        for (const pattern of this.patterns.values()) {
            pattern.metadata.updated = new Date();
            optimized++;
        }
        
        await this.savePatterns();
        
        console.log(`✅ Pattern optimization complete: removed ${removed}, merged ${merged}, optimized ${optimized}`);
        
        return { removed, merged, optimized };
    }

    private isOldPattern(pattern: UserPattern): boolean {
        const daysSinceCreated = (Date.now() - pattern.metadata.created.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreated > 30; // Older than 30 days
    }

    private mergePatterns(patterns: UserPattern[]): UserPattern {
        if (patterns.length === 0) {
            throw new Error('Cannot merge empty pattern array');
        }
        
        if (patterns.length === 1) {
            return patterns[0];
        }
        
        // Use the pattern with highest frequency as base
        const basePattern = patterns.reduce((prev, current) => 
            prev.metadata.frequency > current.metadata.frequency ? prev : current
        );
        
        // Merge metadata
        const totalFrequency = patterns.reduce((sum, p) => sum + p.metadata.frequency, 0);
        const totalConfirmations = patterns.reduce((sum, p) => sum + p.learning.user_confirmations, 0);
        const totalCorrections = patterns.reduce((sum, p) => sum + p.learning.user_corrections, 0);
        const avgSuccessRate = patterns.reduce((sum, p) => sum + p.metadata.success_rate, 0) / patterns.length;
        
        return {
            ...basePattern,
            metadata: {
                ...basePattern.metadata,
                frequency: totalFrequency,
                success_rate: avgSuccessRate,
                updated: new Date()
            },
            learning: {
                user_confirmations: totalConfirmations,
                user_corrections: totalCorrections,
                auto_improvements: [
                    ...basePattern.learning.auto_improvements,
                    `Merged ${patterns.length} similar patterns`
                ]
            }
        };
    }

    // Intelligence utility methods
    async getIntelligenceStatus(): Promise<{
        available: boolean;
        embeddingsCacheSize: number;
        clustersCount: number;
    }> {
        return {
            available: this.patternIntelligence.isAvailable?.() || false,
            embeddingsCacheSize: this.patternIntelligence.getEmbeddingsCacheSize?.() || 0,
            clustersCount: this.patternIntelligence.getClusters?.().length || 0
        };
    }

    async clearIntelligenceCache(): Promise<void> {
        if (this.patternIntelligence.clearCache) {
            this.patternIntelligence.clearCache();
            console.log('🧹 Cleared pattern intelligence cache');
        }
    }
} 