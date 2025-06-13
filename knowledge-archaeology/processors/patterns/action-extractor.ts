import { NLPAnalysis, ActionItem } from '../intelligence/nlp-pipeline.js';

export interface TrelloAction {
    type: 'create_card' | 'update_card' | 'move_card' | 'archive_card' | 'add_comment' | 'set_due_date' | 'add_member';
    parameters: Record<string, any>;
    confidence: number;
    sourceText: string;
    priority: 'high' | 'medium' | 'low';
}

export interface ActionExtractionResult {
    actions: TrelloAction[];
    confidence: number;
    summary: string;
    ambiguities: string[];
}

export class ActionExtractor {
    
    async extractActions(text: string, nlpAnalysis: NLPAnalysis): Promise<ActionExtractionResult> {
        const actions: TrelloAction[] = [];
        const ambiguities: string[] = [];
        
        // Extract primary action based on intent
        const primaryAction = this.extractPrimaryAction(text, nlpAnalysis);
        if (primaryAction) {
            actions.push(primaryAction);
        }
        
        // Extract secondary actions from action items
        const secondaryActions = this.extractSecondaryActions(nlpAnalysis.actionItems, text);
        actions.push(...secondaryActions);
        
        // Check for ambiguities
        const detectedAmbiguities = this.detectAmbiguities(text, nlpAnalysis);
        ambiguities.push(...detectedAmbiguities);
        
        // Calculate overall confidence
        const confidence = this.calculateOverallConfidence(actions, nlpAnalysis.confidence);
        
        // Generate summary
        const summary = this.generateActionSummary(actions);
        
        return {
            actions,
            confidence,
            summary,
            ambiguities
        };
    }
    
    private extractPrimaryAction(text: string, nlpAnalysis: NLPAnalysis): TrelloAction | null {
        const intent = nlpAnalysis.intent;
        const entities = nlpAnalysis.entities;
        
        switch (intent) {
            case 'create_card':
                return this.buildCreateCardAction(text, entities, nlpAnalysis);
                
            case 'update_card':
                return this.buildUpdateCardAction(text, entities, nlpAnalysis);
                
            case 'move_card':
                return this.buildMoveCardAction(text, entities, nlpAnalysis);
                
            case 'archive_card':
                return this.buildArchiveCardAction(text, entities, nlpAnalysis);
                
            default:
                return null;
        }
    }
    
    private buildCreateCardAction(text: string, entities: any[], nlpAnalysis: NLPAnalysis): TrelloAction {
        const taskEntity = entities.find(e => e.type === 'TASK');
        const listEntity = entities.find(e => e.type === 'LIST');
        const priorityEntity = entities.find(e => e.type === 'PRIORITY');
        const dateEntity = entities.find(e => e.type === 'DATE');
        
        const parameters: Record<string, any> = {
            name: taskEntity?.value || this.extractTaskFromText(text),
            desc: this.generateCardDescription(text, nlpAnalysis),
        };
        
        if (listEntity) {
            parameters.listName = listEntity.value;
        }
        
        if (dateEntity) {
            parameters.dueDate = this.parseDate(dateEntity.value);
        }
        
        if (priorityEntity) {
            parameters.priority = priorityEntity.value;
        }
        
        // Add labels based on urgency and sentiment
        parameters.labels = this.generateLabels(nlpAnalysis);
        
        return {
            type: 'create_card',
            parameters,
            confidence: Math.min(nlpAnalysis.confidence, taskEntity?.confidence || 0.6),
            sourceText: text,
            priority: this.mapUrgencyToPriority(nlpAnalysis.urgency)
        };
    }
    
    private buildUpdateCardAction(text: string, entities: any[], nlpAnalysis: NLPAnalysis): TrelloAction {
        const taskEntity = entities.find(e => e.type === 'TASK');
        const parameters: Record<string, any> = {};
        
        // Determine what to update based on text patterns
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('rename') || lowerText.includes('change title')) {
            parameters.name = taskEntity?.value || this.extractTaskFromText(text);
        }
        
        if (lowerText.includes('description') || lowerText.includes('details')) {
            parameters.desc = this.extractDescriptionFromText(text);
        }
        
        if (lowerText.includes('due date') || lowerText.includes('deadline')) {
            const dateEntity = entities.find(e => e.type === 'DATE');
            if (dateEntity) {
                parameters.dueDate = this.parseDate(dateEntity.value);
            }
        }
        
        return {
            type: 'update_card',
            parameters,
            confidence: nlpAnalysis.confidence,
            sourceText: text,
            priority: this.mapUrgencyToPriority(nlpAnalysis.urgency)
        };
    }
    
    private buildMoveCardAction(text: string, entities: any[], nlpAnalysis: NLPAnalysis): TrelloAction {
        const taskEntity = entities.find(e => e.type === 'TASK');
        const listEntity = entities.find(e => e.type === 'LIST');
        
        return {
            type: 'move_card',
            parameters: {
                cardName: taskEntity?.value || this.extractTaskFromText(text),
                targetList: listEntity?.value || 'In Progress' // Default assumption
            },
            confidence: Math.min(nlpAnalysis.confidence, (listEntity?.confidence || 0.5)),
            sourceText: text,
            priority: this.mapUrgencyToPriority(nlpAnalysis.urgency)
        };
    }
    
    private buildArchiveCardAction(text: string, entities: any[], nlpAnalysis: NLPAnalysis): TrelloAction {
        const taskEntity = entities.find(e => e.type === 'TASK');
        
        return {
            type: 'archive_card',
            parameters: {
                cardName: taskEntity?.value || this.extractTaskFromText(text)
            },
            confidence: nlpAnalysis.confidence,
            sourceText: text,
            priority: this.mapUrgencyToPriority(nlpAnalysis.urgency)
        };
    }
    
    private extractSecondaryActions(actionItems: ActionItem[], sourceText: string): TrelloAction[] {
        const actions: TrelloAction[] = [];
        
        actionItems.forEach(item => {
            if (item.action === 'add_comment' && item.target) {
                actions.push({
                    type: 'add_comment',
                    parameters: {
                        cardName: item.target,
                        comment: item.parameters.comment || 'Voice note added'
                    },
                    confidence: item.confidence,
                    sourceText,
                    priority: 'low'
                });
            }
            
            if (item.action === 'set_due_date' && item.target) {
                actions.push({
                    type: 'set_due_date',
                    parameters: {
                        cardName: item.target,
                        dueDate: item.parameters.date
                    },
                    confidence: item.confidence,
                    sourceText,
                    priority: 'medium'
                });
            }
        });
        
        return actions;
    }
    
    private detectAmbiguities(text: string, nlpAnalysis: NLPAnalysis): string[] {
        const ambiguities: string[] = [];
        
        // Check for low confidence
        if (nlpAnalysis.confidence < 0.7) {
            ambiguities.push(`Low confidence (${(nlpAnalysis.confidence * 100).toFixed(1)}%) in understanding the intent`);
        }
        
        // Check for missing card name
        const hasTaskEntity = nlpAnalysis.entities.some(e => e.type === 'TASK');
        if (!hasTaskEntity && (nlpAnalysis.intent === 'update_card' || nlpAnalysis.intent === 'move_card')) {
            ambiguities.push('Card name not clearly specified');
        }
        
        // Check for missing list name on move operations
        const hasListEntity = nlpAnalysis.entities.some(e => e.type === 'LIST');
        if (!hasListEntity && nlpAnalysis.intent === 'move_card') {
            ambiguities.push('Target list not specified');
        }
        
        // Check for vague language
        const vaguePatterns = ['something', 'thing', 'stuff', 'this', 'that'];
        const hasVagueLanguage = vaguePatterns.some(pattern => 
            text.toLowerCase().includes(pattern)
        );
        if (hasVagueLanguage) {
            ambiguities.push('Contains vague references that may need clarification');
        }
        
        return ambiguities;
    }
    
    private calculateOverallConfidence(actions: TrelloAction[], baseConfidence: number): number {
        if (actions.length === 0) return 0;
        
        const actionConfidences = actions.map(a => a.confidence);
        const avgActionConfidence = actionConfidences.reduce((sum, conf) => sum + conf, 0) / actionConfidences.length;
        
        return Math.min(baseConfidence, avgActionConfidence);
    }
    
    private generateActionSummary(actions: TrelloAction[]): string {
        if (actions.length === 0) return 'No actionable items detected';
        
        const summaries = actions.map(action => {
            switch (action.type) {
                case 'create_card':
                    return `Create card "${action.parameters.name}"${action.parameters.listName ? ` in ${action.parameters.listName}` : ''}`;
                case 'update_card':
                    return `Update card with new information`;
                case 'move_card':
                    return `Move "${action.parameters.cardName}" to ${action.parameters.targetList}`;
                case 'archive_card':
                    return `Archive card "${action.parameters.cardName}"`;
                case 'add_comment':
                    return `Add comment to "${action.parameters.cardName}"`;
                default:
                    return 'Perform action';
            }
        });
        
        return summaries.join('; ');
    }
    
    // Helper methods
    private extractTaskFromText(text: string): string {
        // Extract task from quoted text or after common patterns
        const patterns = [
            /"([^"]+)"/,
            /(?:create|add|make)\s+(?:a\s+)?(?:card\s+)?(?:for\s+)?([^,.!?]+)/i,
            /(?:task|card|item)[:\s]+([^,.!?]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        // Fallback: use the text but clean it up
        return text.replace(/create|add|new|card|task/gi, '').trim() || 'New task';
    }
    
    private extractDescriptionFromText(text: string): string {
        return `Voice note: ${text}`;
    }
    
    private parseDate(dateString: string): string {
        // Simple date parsing - in production you'd use a proper date library
        const today = new Date();
        const lowerDate = dateString.toLowerCase();
        
        if (lowerDate.includes('today')) {
            return today.toISOString();
        } else if (lowerDate.includes('tomorrow')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString();
        }
        
        return dateString; // Return as-is for now
    }
    
    private generateLabels(nlpAnalysis: NLPAnalysis): string[] {
        const labels: string[] = [];
        
        if (nlpAnalysis.urgency === 'high') {
            labels.push('urgent');
        }
        
        if (nlpAnalysis.sentiment === 'negative') {
            labels.push('issue');
        }
        
        return labels;
    }
    
    private generateCardDescription(text: string, nlpAnalysis: NLPAnalysis): string {
        let description = `Voice input: "${text}"\n\n`;
        
        if (nlpAnalysis.keywords.length > 0) {
            description += `Keywords: ${nlpAnalysis.keywords.join(', ')}\n`;
        }
        
        if (nlpAnalysis.urgency !== 'low') {
            description += `Urgency: ${nlpAnalysis.urgency}\n`;
        }
        
        return description;
    }
    
    private mapUrgencyToPriority(urgency: string): 'high' | 'medium' | 'low' {
        switch (urgency) {
            case 'high': return 'high';
            case 'medium': return 'medium';
            default: return 'low';
        }
    }
} 