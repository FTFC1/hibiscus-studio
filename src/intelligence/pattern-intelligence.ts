import OpenAI from 'openai';
import { UserPattern, PatternMatch } from '../patterns/pattern-learner.js';

export interface SemanticEmbedding {
    vector: number[];
    text: string;
    dimensions: number;
}

export interface PatternCluster {
    id: string;
    centroid: number[];
    patterns: UserPattern[];
    category: string;
    confidence: number;
    lastUpdated: Date;
}

export interface PatternRecommendation {
    pattern: UserPattern;
    reason: string;
    confidence: number;
    cluster?: PatternCluster;
}

export class PatternIntelligence {
    private openai: OpenAI | null = null;
    private clusters: Map<string, PatternCluster> = new Map();
    private embeddings: Map<string, SemanticEmbedding> = new Map();
    private hasApiKey: boolean = false;

    constructor(config?: { openaiApiKey?: string }) {
        const apiKey = config?.openaiApiKey || process.env.OPENAI_API_KEY;
        
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
            this.hasApiKey = true;
            console.log('✅ PatternIntelligence initialized with OpenAI embeddings');
        } else {
            console.warn('⚠️  OpenAI API key not found. Pattern intelligence will use fallback similarity');
        }
    }

    async getSemanticEmbedding(text: string): Promise<SemanticEmbedding | null> {
        if (!this.hasApiKey || !this.openai) {
            return null;
        }

        // Check cache first
        const cached = this.embeddings.get(text);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
                encoding_format: 'float'
            });

            const embedding: SemanticEmbedding = {
                vector: response.data[0].embedding,
                text,
                dimensions: response.data[0].embedding.length
            };

            // Cache the embedding
            this.embeddings.set(text, embedding);
            return embedding;

        } catch (error) {
            console.warn('⚠️  Failed to get semantic embedding:', error);
            return null;
        }
    }

    calculateSemanticSimilarity(embedding1: SemanticEmbedding, embedding2: SemanticEmbedding): number {
        if (embedding1.dimensions !== embedding2.dimensions) {
            return 0;
        }

        // Calculate cosine similarity
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        for (let i = 0; i < embedding1.dimensions; i++) {
            dotProduct += embedding1.vector[i] * embedding2.vector[i];
            magnitude1 += embedding1.vector[i] * embedding1.vector[i];
            magnitude2 += embedding2.vector[i] * embedding2.vector[i];
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }

        return dotProduct / (magnitude1 * magnitude2);
    }

    async enhancedPatternSimilarity(
        pattern1: UserPattern, 
        pattern2: UserPattern
    ): Promise<number> {
        try {
            // Get semantic embeddings for trigger texts
            const embedding1 = await this.getSemanticEmbedding(pattern1.trigger.text);
            const embedding2 = await this.getSemanticEmbedding(pattern2.trigger.text);

            if (embedding1 && embedding2) {
                // Use semantic similarity (70%) + intent match (20%) + entity overlap (10%)
                const semanticSim = this.calculateSemanticSimilarity(embedding1, embedding2);
                const intentMatch = pattern1.trigger.intent === pattern2.trigger.intent ? 1 : 0;
                const entitySim = this.calculateEntityOverlap(pattern1.trigger.entities, pattern2.trigger.entities);

                return (semanticSim * 0.7) + (intentMatch * 0.2) + (entitySim * 0.1);
            } else {
                // Fallback to basic similarity
                return this.basicSimilarity(pattern1, pattern2);
            }
        } catch (error) {
            console.warn('⚠️  Enhanced similarity calculation failed, using fallback:', error);
            return this.basicSimilarity(pattern1, pattern2);
        }
    }

    private basicSimilarity(pattern1: UserPattern, pattern2: UserPattern): number {
        // Basic text similarity using word overlap
        const words1 = pattern1.trigger.text.toLowerCase().split(/\s+/);
        const words2 = pattern2.trigger.text.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        
        const textSim = union.length > 0 ? intersection.length / union.length : 0;
        const intentMatch = pattern1.trigger.intent === pattern2.trigger.intent ? 1 : 0;
        const entitySim = this.calculateEntityOverlap(pattern1.trigger.entities, pattern2.trigger.entities);

        return (textSim * 0.5) + (intentMatch * 0.3) + (entitySim * 0.2);
    }

    private calculateEntityOverlap(entities1: Record<string, any>, entities2: Record<string, any>): number {
        const keys1 = Object.keys(entities1);
        const keys2 = Object.keys(entities2);
        
        if (keys1.length === 0 && keys2.length === 0) return 1;
        if (keys1.length === 0 || keys2.length === 0) return 0;
        
        const sharedKeys = keys1.filter(key => keys2.includes(key));
        const totalKeys = [...new Set([...keys1, ...keys2])];
        
        return sharedKeys.length / totalKeys.length;
    }

    async clusterPatterns(patterns: UserPattern[]): Promise<PatternCluster[]> {
        if (patterns.length === 0) return [];

        console.log(`🧠 Clustering ${patterns.length} patterns...`);

        try {
            // Get embeddings for all patterns
            const patternEmbeddings = await Promise.all(
                patterns.map(async (pattern) => {
                    const embedding = await this.getSemanticEmbedding(pattern.trigger.text);
                    return { pattern, embedding };
                })
            );

            // Filter out patterns without embeddings
            const validEmbeddings = patternEmbeddings.filter(pe => pe.embedding !== null);

            if (validEmbeddings.length < 2) {
                // Create a single cluster for all patterns
                return [{
                    id: 'default_cluster',
                    centroid: [],
                    patterns,
                    category: 'general',
                    confidence: 0.5,
                    lastUpdated: new Date()
                }];
            }

            // Simple k-means clustering (k = min(5, patterns.length/2))
            const k = Math.min(5, Math.max(2, Math.floor(patterns.length / 2)));
            const clusters = await this.performKMeansClustering(validEmbeddings, k);

            // Update internal cluster store
            clusters.forEach(cluster => {
                this.clusters.set(cluster.id, cluster);
            });

            console.log(`✅ Created ${clusters.length} pattern clusters`);
            return clusters;

        } catch (error) {
            console.warn('⚠️  Pattern clustering failed, creating default cluster:', error);
            return [{
                id: 'fallback_cluster',
                centroid: [],
                patterns,
                category: 'general',
                confidence: 0.3,
                lastUpdated: new Date()
            }];
        }
    }

    private async performKMeansClustering(
        patternEmbeddings: Array<{ pattern: UserPattern; embedding: SemanticEmbedding | null }>,
        k: number
    ): Promise<PatternCluster[]> {
        const validItems = patternEmbeddings.filter(pe => pe.embedding !== null) as Array<{
            pattern: UserPattern;
            embedding: SemanticEmbedding;
        }>;

        if (validItems.length < k) {
            k = validItems.length;
        }

        // Initialize centroids randomly
        let centroids = this.initializeRandomCentroids(validItems, k);
        let clusters: PatternCluster[] = [];
        let maxIterations = 10;
        let iteration = 0;

        while (iteration < maxIterations) {
            // Assign patterns to nearest centroid
            const assignments = new Map<number, Array<{ pattern: UserPattern; embedding: SemanticEmbedding }>>();
            
            for (let i = 0; i < k; i++) {
                assignments.set(i, []);
            }

            for (const item of validItems) {
                let bestCluster = 0;
                let bestSimilarity = -1;

                for (let i = 0; i < centroids.length; i++) {
                    const similarity = this.calculateSemanticSimilarity(
                        item.embedding,
                        { vector: centroids[i], text: '', dimensions: centroids[i].length }
                    );

                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestCluster = i;
                    }
                }

                assignments.get(bestCluster)?.push(item);
            }

            // Update centroids
            const newCentroids: number[][] = [];
            for (let i = 0; i < k; i++) {
                const clusterItems = assignments.get(i) || [];
                if (clusterItems.length > 0) {
                    newCentroids.push(this.calculateCentroid(clusterItems.map(item => item.embedding)));
                } else {
                    newCentroids.push(centroids[i]); // Keep old centroid if no assignments
                }
            }

            // Check for convergence
            const converged = this.centroidsConverged(centroids, newCentroids);
            centroids = newCentroids;
            iteration++;

            if (converged) break;
        }

        // Create final clusters
        clusters = [];
        for (let i = 0; i < k; i++) {
            const clusterItems = validItems.filter(item => {
                let bestCluster = 0;
                let bestSimilarity = -1;

                for (let j = 0; j < centroids.length; j++) {
                    const similarity = this.calculateSemanticSimilarity(
                        item.embedding,
                        { vector: centroids[j], text: '', dimensions: centroids[j].length }
                    );

                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestCluster = j;
                    }
                }

                return bestCluster === i;
            });

            if (clusterItems.length > 0) {
                clusters.push({
                    id: `cluster_${i}`,
                    centroid: centroids[i],
                    patterns: clusterItems.map(item => item.pattern),
                    category: this.categorizeCluster(clusterItems.map(item => item.pattern)),
                    confidence: this.calculateClusterConfidence(clusterItems.map(item => item.pattern)),
                    lastUpdated: new Date()
                });
            }
        }

        return clusters;
    }

    private initializeRandomCentroids(
        items: Array<{ pattern: UserPattern; embedding: SemanticEmbedding }>,
        k: number
    ): number[][] {
        const centroids: number[][] = [];
        const dimensions = items[0].embedding.dimensions;

        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * items.length);
            centroids.push([...items[randomIndex].embedding.vector]);
        }

        return centroids;
    }

    private calculateCentroid(embeddings: SemanticEmbedding[]): number[] {
        if (embeddings.length === 0) return [];

        const dimensions = embeddings[0].dimensions;
        const centroid = new Array(dimensions).fill(0);

        for (const embedding of embeddings) {
            for (let i = 0; i < dimensions; i++) {
                centroid[i] += embedding.vector[i];
            }
        }

        for (let i = 0; i < dimensions; i++) {
            centroid[i] /= embeddings.length;
        }

        return centroid;
    }

    private centroidsConverged(oldCentroids: number[][], newCentroids: number[][]): boolean {
        const threshold = 0.001;

        for (let i = 0; i < oldCentroids.length; i++) {
            for (let j = 0; j < oldCentroids[i].length; j++) {
                if (Math.abs(oldCentroids[i][j] - newCentroids[i][j]) > threshold) {
                    return false;
                }
            }
        }

        return true;
    }

    private categorizeCluster(patterns: UserPattern[]): string {
        const intents = patterns.map(p => p.trigger.intent);
        const intentCounts = intents.reduce((acc, intent) => {
            acc[intent] = (acc[intent] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const dominantIntent = Object.entries(intentCounts)
            .sort(([,a], [,b]) => b - a)[0][0];

        return dominantIntent || 'general';
    }

    private calculateClusterConfidence(patterns: UserPattern[]): number {
        if (patterns.length === 0) return 0;

        const avgFrequency = patterns.reduce((sum, p) => sum + p.metadata.frequency, 0) / patterns.length;
        const avgSuccessRate = patterns.reduce((sum, p) => sum + p.metadata.success_rate, 0) / patterns.length;

        return Math.min((avgFrequency / 10) * 0.5 + avgSuccessRate * 0.5, 1);
    }

    async recommendPatterns(
        input: { text: string; intent: string; entities: Record<string, any> },
        existingPatterns: UserPattern[],
        limit: number = 5
    ): Promise<PatternRecommendation[]> {
        console.log(`🎯 Generating pattern recommendations for: "${input.text}"`);

        try {
            // Get embedding for input
            const inputEmbedding = await this.getSemanticEmbedding(input.text);
            const recommendations: PatternRecommendation[] = [];

            if (inputEmbedding) {
                // Use semantic similarity
                for (const pattern of existingPatterns) {
                    const patternEmbedding = await this.getSemanticEmbedding(pattern.trigger.text);
                    if (patternEmbedding) {
                        const similarity = this.calculateSemanticSimilarity(inputEmbedding, patternEmbedding);
                        const confidence = this.calculateRecommendationConfidence(pattern, similarity);

                        if (confidence > 0.3) {
                            recommendations.push({
                                pattern,
                                reason: `${(similarity * 100).toFixed(1)}% semantic similarity`,
                                confidence,
                                cluster: this.findPatternCluster(pattern)
                            });
                        }
                    }
                }
            } else {
                // Fallback to basic matching
                for (const pattern of existingPatterns) {
                    const similarity = this.basicSimilarity(
                        { trigger: input } as UserPattern,
                        pattern
                    );
                    const confidence = this.calculateRecommendationConfidence(pattern, similarity);

                    if (confidence > 0.3) {
                        recommendations.push({
                            pattern,
                            reason: `${(similarity * 100).toFixed(1)}% text similarity`,
                            confidence
                        });
                    }
                }
            }

            // Sort by confidence and limit results
            return recommendations
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, limit);

        } catch (error) {
            console.warn('⚠️  Pattern recommendation failed:', error);
            return [];
        }
    }

    private calculateRecommendationConfidence(pattern: UserPattern, similarity: number): number {
        const frequencyScore = Math.min(pattern.metadata.frequency / 10, 1);
        const successScore = pattern.metadata.success_rate;
        const recencyScore = this.calculateRecencyScore(pattern.metadata.lastUsed);

        return (similarity * 0.4) + (frequencyScore * 0.2) + (successScore * 0.3) + (recencyScore * 0.1);
    }

    private calculateRecencyScore(lastUsed: Date): number {
        const daysSinceUsed = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
        return Math.max(0, 1 - (daysSinceUsed / 30)); // Decay over 30 days
    }

    private findPatternCluster(pattern: UserPattern): PatternCluster | undefined {
        for (const cluster of this.clusters.values()) {
            if (cluster.patterns.some(p => p.id === pattern.id)) {
                return cluster;
            }
        }
        return undefined;
    }

    // Utility methods
    getClusters(): PatternCluster[] {
        return Array.from(this.clusters.values());
    }

    getEmbeddingsCacheSize(): number {
        return this.embeddings.size;
    }

    clearCache(): void {
        this.embeddings.clear();
        console.log('🧹 Cleared embeddings cache');
    }

    isAvailable(): boolean {
        return this.hasApiKey;
    }
} 