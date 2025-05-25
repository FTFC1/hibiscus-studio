import OpenAI from 'openai';

export interface NLPAnalysis {
    intent: string;
    confidence: number;
    entities: EntityResult[];
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    actionItems: ActionItem[];
    urgency: 'low' | 'medium' | 'high';
}

export interface EntityResult {
    type: 'PERSON' | 'DATE' | 'LOCATION' | 'TASK' | 'LIST' | 'PRIORITY' | 'PROJECT';
    value: string;
    confidence: number;
}

export interface ActionItem {
    action: string;
    target?: string;
    parameters: Record<string, any>;
    confidence: number;
}

export class AIProcessor {
    private openai: OpenAI;
    private openrouter: OpenAI | null = null;

    constructor(config?: {
        openaiKey?: string;
        openrouterKey?: string;
        preferOpenRouter?: boolean;
    }) {
        this.openai = new OpenAI({
            apiKey: config?.openaiKey || process.env.OPENAI_API_KEY,
        });

        if (config?.openrouterKey || process.env.OPENROUTER_API_KEY) {
            this.openrouter = new OpenAI({
                apiKey: config?.openrouterKey || process.env.OPENROUTER_API_KEY,
                baseURL: 'https://openrouter.ai/api/v1',
            });
        }
    }

    async analyzeText(text: string, context?: Record<string, any>): Promise<NLPAnalysis> {
        try {
            const systemPrompt = this.buildSystemPrompt(context);
            const userPrompt = this.buildUserPrompt(text);

            const response = await this.callAI(systemPrompt, userPrompt);
            
            // Parse AI response into structured format
            return this.parseAIResponse(response, text);
        } catch (error) {
            console.error('NLP Analysis error:', error);
            // Fallback to basic analysis
            return this.fallbackAnalysis(text);
        }
    }

    private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
        const client = this.openrouter || this.openai;
        const model = this.openrouter ? 'anthropic/claude-3.5-sonnet' : 'gpt-4';

        const completion = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.1, // Low temperature for consistent analysis
            max_tokens: 1000,
        });

        return completion.choices[0].message.content || '';
    }

    private buildSystemPrompt(context?: Record<string, any>): string {
        return `You are an expert voice command analyst for a Trello productivity system. Analyze voice transcriptions and extract:

1. **Intent** (create_card, update_card, move_card, archive_card, show_cards, search_cards)
2. **Entities** (person names, dates, locations, task titles, list names, priorities, projects)
3. **Sentiment** (positive, negative, neutral)
4. **Keywords** (important terms)
5. **Action Items** (specific actions to take)
6. **Urgency** (low, medium, high)

Context: ${context ? JSON.stringify(context) : 'No additional context'}

Return a JSON object with this exact structure:
{
  "intent": "create_card",
  "confidence": 0.95,
  "entities": [
    {"type": "TASK", "value": "task name", "confidence": 0.9},
    {"type": "LIST", "value": "list name", "confidence": 0.8}
  ],
  "sentiment": "positive",
  "keywords": ["important", "urgent"],
  "actionItems": [
    {"action": "create_card", "target": "task name", "parameters": {"list": "todo"}, "confidence": 0.9}
  ],
  "urgency": "high"
}`;
    }

    private buildUserPrompt(text: string): string {
        return `Analyze this voice transcription for Trello actions:

"${text}"

Extract the intent, entities, sentiment, keywords, action items, and urgency level. Focus on actionable Trello commands like creating cards, moving items, updating lists, etc.`;
    }

    private parseAIResponse(response: string, originalText: string): NLPAnalysis {
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || 
                             response.match(/(\{[\s\S]*\})/);
            
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1]);
                return {
                    intent: parsed.intent || 'unknown',
                    confidence: parsed.confidence || 0.5,
                    entities: parsed.entities || [],
                    sentiment: parsed.sentiment || 'neutral',
                    keywords: parsed.keywords || [],
                    actionItems: parsed.actionItems || [],
                    urgency: parsed.urgency || 'low'
                };
            }
            
            throw new Error('No valid JSON found in AI response');
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.fallbackAnalysis(originalText);
        }
    }

    private fallbackAnalysis(text: string): NLPAnalysis {
        const lowerText = text.toLowerCase();
        
        // Basic intent detection
        let intent = 'unknown';
        if (lowerText.includes('create') || lowerText.includes('add') || lowerText.includes('new')) {
            intent = 'create_card';
        } else if (lowerText.includes('move') || lowerText.includes('update')) {
            intent = 'update_card';
        } else if (lowerText.includes('archive') || lowerText.includes('delete')) {
            intent = 'archive_card';
        } else if (lowerText.includes('show') || lowerText.includes('list')) {
            intent = 'show_cards';
        }

        // Basic urgency detection
        let urgency: 'low' | 'medium' | 'high' = 'low';
        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediately')) {
            urgency = 'high';
        } else if (lowerText.includes('soon') || lowerText.includes('today')) {
            urgency = 'medium';
        }

        // Extract basic entities
        const entities: EntityResult[] = [];
        const titleMatch = text.match(/"([^"]+)"/);
        if (titleMatch) {
            entities.push({
                type: 'TASK',
                value: titleMatch[1],
                confidence: 0.8
            });
        }

        return {
            intent,
            confidence: 0.6,
            entities,
            sentiment: 'neutral',
            keywords: text.split(' ').filter(word => word.length > 3).slice(0, 5),
            actionItems: intent !== 'unknown' ? [{
                action: intent,
                target: titleMatch?.[1],
                parameters: {},
                confidence: 0.6
            }] : [],
            urgency
        };
    }

    // Helper method for quick intent detection
    async quickIntentDetection(text: string): Promise<{intent: string; confidence: number}> {
        const analysis = await this.analyzeText(text);
        return {
            intent: analysis.intent,
            confidence: analysis.confidence
        };
    }

    // Helper method for entity extraction only
    async extractEntities(text: string): Promise<EntityResult[]> {
        const analysis = await this.analyzeText(text);
        return analysis.entities;
    }
} 