#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

class TranscriptToBlueprint {
  constructor() {
    this.config = {
      sections: [
        "Main Section Headings (emoji + bold, double line break)",
        "Subsections (bold, no emoji, single line break)", 
        "Cross-Project Themes (🔗)",
        "Immediate Actions (⚡)",
        "Strategic Insights (💎)"
      ],
      userProfile: {
        style: "Analytical & Structured, Visual Learner, Concise & Direct, Iterative, Execution-First"
      },
      outputFormat: {
        majorSectionHeadings: { bold: true, emoji: true, doubleLineBreaks: true },
        subsectionHeadings: { bold: true, emoji: false, singleLineBreak: true },
        bulletPoints: { bold: false, emoji: false, energyTagsBold: true }
      }
    };

    this.energyTags = {
      high: '🔥',
      medium: '⚡', 
      low: '💡'
    };

    this.actionPatterns = [
      /(?:need to|should|must|will|going to|plan to|should)\s+(.+?)(?:\.|$)/gi,
      /(?:action|todo|task):\s*(.+?)(?:\.|$)/gi,
      /(?:next step|first step|then)\s+(.+?)(?:\.|$)/gi,
      /(?:implement|build|create|setup|configure)\s+(.+?)(?:\.|$)/gi
    ];

    this.urgencyKeywords = {
      thisWeek: ['urgent', 'asap', 'immediately', 'today', 'tomorrow', 'this week', 'priority'],
      next30Days: ['soon', 'next month', 'coming weeks', 'short term'],
      lowFriction: ['when possible', 'eventually', 'nice to have', 'low priority']
    };

    this.strategicPatterns = [
      /(?:insight|pattern|trend|dynamic|leverage|system|counter-intuitive)/gi,
      /(?:market|competition|positioning|strategy)/gi,
      /(?:feedback loop|system-level|root cause)/gi
    ];
  }

  async processTranscript(inputFile, outputFile = null) {
    try {
      const transcript = await fs.readFile(inputFile, 'utf-8');
      const blueprint = await this.extractBlueprint(transcript);
      
      if (!outputFile) {
        const baseName = path.basename(inputFile, path.extname(inputFile));
        outputFile = path.join(path.dirname(inputFile), `${baseName}-blueprint.md`);
      }

      await fs.writeFile(outputFile, blueprint, 'utf-8');
      console.log(`✅ Blueprint created: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('❌ Error processing transcript:', error.message);
      throw error;
    }
  }

  async extractBlueprint(transcript) {
    const metadata = this.extractMetadata(transcript);
    const sections = this.extractSections(transcript);
    const actions = this.extractActions(transcript);
    const themes = this.extractCrossProjectThemes(transcript);
    const insights = this.extractStrategicInsights(transcript);

    return this.formatBlueprint({
      metadata,
      sections,
      actions,
      themes, 
      insights,
      originalLength: transcript.length
    });
  }

  extractMetadata(transcript) {
    const dateMatch = transcript.match(/(?:date|recorded|created):\s*([^\n]+)/i);
    const sourceMatch = transcript.match(/(?:source|from|speaker):\s*([^\n]+)/i);
    
    return {
      date: dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0],
      source: sourceMatch ? sourceMatch[1].trim() : 'Transcript',
      tags: this.extractTags(transcript)
    };
  }

  extractTags(transcript) {
    const tagPatterns = [
      /(?:project|product|feature):\s*([^\n,]+)/gi,
      /(?:technology|tech|tool):\s*([^\n,]+)/gi,
      /(?:strategy|approach|method):\s*([^\n,]+)/gi
    ];

    const tags = new Set();
    tagPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(transcript)) !== null) {
        tags.add(match[1].trim().toLowerCase());
      }
    });

    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  extractSections(transcript) {
    const lines = transcript.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = null;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect major section headings
      if (this.isMajorHeading(trimmed)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: this.formatMajorHeading(trimmed),
          content: [],
          subsections: []
        };
      }
      // Detect subsections
      else if (this.isSubheading(trimmed) && currentSection) {
        currentSection.subsections.push({
          title: this.formatSubheading(trimmed),
          content: []
        });
      }
      // Add content
      else if (trimmed && currentSection) {
        const target = currentSection.subsections.length > 0 
          ? currentSection.subsections[currentSection.subsections.length - 1].content
          : currentSection.content;
        target.push(this.formatContent(trimmed));
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  isMajorHeading(text) {
    return text.length < 100 && (
      /^[A-Z][^.]*[^.]$/.test(text) ||
      /^\d+\.\s/.test(text) ||
      /^(overview|introduction|background|process|implementation|next steps|conclusion)/i.test(text)
    );
  }

  isSubheading(text) {
    return text.length < 80 && (
      /^[a-z].*[^.]$/i.test(text) ||
      /^\w+ing\s/i.test(text) ||
      /^(setup|config|testing|deployment)/i.test(text)
    );
  }

  formatMajorHeading(text) {
    const emoji = this.selectEmoji(text);
    return `${emoji} **${text}**`;
  }

  formatSubheading(text) {
    return `**${text}**`;
  }

  formatContent(text) {
    // Clean up bullet points and formatting
    let formatted = text.replace(/^[-*•]\s*/, '- ');
    if (!formatted.startsWith('-') && !formatted.match(/^\d+\./)) {
      formatted = `- ${formatted}`;
    }
    return formatted;
  }

  selectEmoji(text) {
    const emojiMap = {
      'overview|introduction|start': '🎯',
      'process|workflow|steps': '⚙️',
      'implementation|build|create': '🔨',
      'strategy|plan|approach': '📋',
      'results|outcome|conclusion': '📊',
      'next|future|roadmap': '🚀',
      'problem|issue|challenge': '⚠️',
      'solution|fix|resolve': '✅',
      'data|analysis|research': '📈',
      'team|people|collaboration': '👥'
    };

    for (const [pattern, emoji] of Object.entries(emojiMap)) {
      if (new RegExp(pattern, 'i').test(text)) {
        return emoji;
      }
    }
    return '📌';
  }

  extractActions(transcript) {
    const actions = {
      thisWeek: [],
      next30Days: [],
      lowFriction: []
    };

    // Extract potential actions using patterns
    const potentialActions = new Set();
    
    this.actionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(transcript)) !== null) {
        const action = match[1].trim();
        if (action.length > 10 && action.length < 200) {
          potentialActions.add(action);
        }
      }
    });

    // Categorise actions by urgency
    for (const action of potentialActions) {
      const urgency = this.categoriseUrgency(action, transcript);
      const impact = this.rateImpact(action);
      const energyTag = this.getEnergyTag(action);
      
      const formattedAction = `- ${action} - Impact: ${impact}/5 **${this.energyTags[energyTag]}** ${this.getActionContext(action, transcript)}`;
      
      actions[urgency].push(formattedAction);
    }

    return actions;
  }

  categoriseUrgency(action, transcript) {
    const context = this.getActionContext(action, transcript, 200);
    
    for (const [category, keywords] of Object.entries(this.urgencyKeywords)) {
      for (const keyword of keywords) {
        if (context.toLowerCase().includes(keyword)) {
          return category;
        }
      }
    }

    // Default categorisation based on action content
    if (/(?:setup|install|configure|initial)/i.test(action)) {
      return 'thisWeek';
    } else if (/(?:optimise|refactor|improve|enhance)/i.test(action)) {
      return 'lowFriction';
    }
    
    return 'next30Days';
  }

  rateImpact(action) {
    const highImpact = /(?:system|architecture|foundation|core|integration|platform)/i;
    const mediumImpact = /(?:feature|component|module|service|api)/i;
    const crossProject = /(?:shared|common|reusable|template|framework)/i;

    if (crossProject.test(action)) return 5;
    if (highImpact.test(action)) return 4;
    if (mediumImpact.test(action)) return 3;
    return 2;
  }

  getEnergyTag(action) {
    if (/(?:urgent|critical|blocker|asap)/i.test(action)) return 'high';
    if (/(?:nice|improve|optimise|when)/i.test(action)) return 'low';
    return 'medium';
  }

  getActionContext(action, transcript, maxLength = 50) {
    const actionIndex = transcript.toLowerCase().indexOf(action.toLowerCase());
    if (actionIndex === -1) return '';

    const contextStart = Math.max(0, actionIndex - 100);
    const contextEnd = Math.min(transcript.length, actionIndex + action.length + 100);
    const context = transcript.slice(contextStart, contextEnd);
    
    // Extract why/because clauses
    const whyMatch = context.match(/(?:because|since|due to|for|to)\s+([^.]{10,50})/i);
    if (whyMatch) {
      return `(${whyMatch[1].trim()})`;
    }

    return '';
  }

  extractCrossProjectThemes(transcript) {
    const themes = [];
    const themePatterns = [
      /(?:across|multiple|all)\s+projects?\s+(.+?)(?:\.|$)/gi,
      /(?:common|shared|recurring)\s+(.+?)(?:\.|$)/gi,
      /(?:pattern|theme|trend)\s+(.+?)(?:\.|$)/gi
    ];

    const potentialThemes = new Set();
    
    themePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(transcript)) !== null) {
        const theme = match[1].trim();
        if (theme.length > 15 && theme.length < 100) {
          potentialThemes.add(theme);
        }
      }
    });

    // Format themes according to specification
    for (const theme of potentialThemes) {
      const projects = this.identifyAffectedProjects(theme, transcript);
      const rootCause = this.extractRootCause(theme, transcript);
      const leveragePoint = this.identifyLeveragePoint(theme, transcript);
      const nextAction = this.extractNextAction(theme, transcript);

      if (projects.length > 1) {
        themes.push({
          name: this.extractThemeName(theme),
          projects,
          rootCause,
          leveragePoint,
          nextAction
        });
      }
    }

    return themes.slice(0, 5); // Limit to top 5 themes
  }

  identifyAffectedProjects(theme, transcript) {
    const projectKeywords = ['project', 'product', 'service', 'platform', 'tool', 'system'];
    const projects = new Set();
    
    // Look for project names in context around the theme
    const themeIndex = transcript.toLowerCase().indexOf(theme.toLowerCase());
    if (themeIndex !== -1) {
      const contextStart = Math.max(0, themeIndex - 300);
      const contextEnd = Math.min(transcript.length, themeIndex + theme.length + 300);
      const context = transcript.slice(contextStart, contextEnd);
      
      projectKeywords.forEach(keyword => {
        const regex = new RegExp(`(\\w+)\\s+${keyword}`, 'gi');
        let match;
        while ((match = regex.exec(context)) !== null) {
          projects.add(match[1]);
        }
      });
    }

    return Array.from(projects).slice(0, 4);
  }

  extractThemeName(theme) {
    // Extract key concepts for theme naming
    const concepts = theme.match(/\b\w{4,}\b/g) || [];
    return concepts.slice(0, 2).map(c => 
      c.charAt(0).toUpperCase() + c.slice(1)
    ).join(' ');
  }

  extractRootCause(theme, transcript) {
    const causePatterns = [
      /(?:because|since|due to|caused by)\s+([^.]{20,80})/gi,
      /(?:root cause|underlying|fundamental)\s+([^.]{20,80})/gi
    ];

    for (const pattern of causePatterns) {
      const match = pattern.exec(transcript);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Multiple projects sharing similar requirements';
  }

  identifyLeveragePoint(theme, transcript) {
    const leveragePatterns = [
      /(?:single|one)\s+(?:action|change|fix)\s+([^.]{20,80})/gi,
      /(?:leverage|unlock|enable)\s+([^.]{20,80})/gi
    ];

    for (const pattern of leveragePatterns) {
      const match = pattern.exec(transcript);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Standardise approach across projects';
  }

  extractNextAction(theme, transcript) {
    const actionPatterns = [
      /(?:next step|first step|start by)\s+([^.]{15,60})/gi,
      /(?:test|validate|prototype)\s+([^.]{15,60})/gi
    ];

    for (const pattern of actionPatterns) {
      const match = pattern.exec(transcript);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Map current implementations and identify commonalities';
  }

  extractStrategicInsights(transcript) {
    const insights = [];
    const insightPatterns = [
      /(?:insight|realisation|discovery):\s*(.{30,150})/gi,
      /(?:counter-intuitive|surprising|unexpected):\s*(.{30,150})/gi,
      /(?:leverage|system|dynamic|pattern):\s*(.{30,150})/gi,
      /(?:market|competition|positioning):\s*(.{30,150})/gi
    ];

    const strategicKeywords = [
      'market', 'competition', 'leverage', 'system', 'dynamic', 
      'positioning', 'feedback', 'counter-intuitive', 'volume', 
      'efficiency', 'premium', 'automation'
    ];

    // Extract sentences that contain strategic keywords
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    for (const sentence of sentences) {
      const hasStrategicKeyword = strategicKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      );
      
      if (hasStrategicKeyword && this.isStrategicInsight(sentence)) {
        insights.push(this.formatInsight(sentence.trim()));
      }
    }

    // Use patterns as backup
    insightPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(transcript)) !== null) {
        const insight = match[1].trim();
        if (this.isStrategicInsight(insight)) {
          insights.push(this.formatInsight(insight));
        }
      }
    });

    return [...new Set(insights)].slice(0, 8); // Remove duplicates, limit to 8
  }

  isStrategicInsight(text) {
    // Filter out tactical/process/tool tips
    const tacticalKeywords = [
      'install', 'configure', 'setup', 'click', 'run', 'command',
      'file', 'folder', 'button', 'menu', 'option', 'setting'
    ];

    const hasStrategicIndicators = /(?:leverage|system|market|dynamic|counter|insight|pattern|strategy)/i.test(text);
    const hasTacticalIndicators = tacticalKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    return hasStrategicIndicators && !hasTacticalIndicators && text.length > 30;
  }

  formatInsight(insight) {
    // Clean and format insight
    let formatted = insight.replace(/^[-*•]\s*/, '').trim();
    if (!formatted.endsWith('.') && !formatted.endsWith('!')) {
      formatted += '.';
    }
    return `- ${formatted}`;
  }

  formatBlueprint({ metadata, sections, actions, themes, insights, originalLength }) {
    let blueprint = '';

    // Header
    blueprint += `# Transcript Blueprint\n\n`;
    blueprint += `**Date:** ${metadata.date}\n`;
    blueprint += `**Source:** ${metadata.source}\n`;
    blueprint += `**Tags:** ${metadata.tags.join(', ')}\n`;
    blueprint += `**Original Length:** ${(originalLength / 1000).toFixed(1)}k characters\n\n`;

    // Main sections
    if (sections.length > 0) {
      for (const section of sections) {
        blueprint += `${section.title}\n\n`;
        
        section.content.forEach(content => {
          blueprint += `${content}\n`;
        });

        section.subsections.forEach(subsection => {
          blueprint += `\n${subsection.title}\n`;
          subsection.content.forEach(content => {
            blueprint += `${content}\n`;
          });
        });

        blueprint += '\n\n';
      }
    }

    // Cross-Project Themes
    if (themes.length > 0) {
      blueprint += `🔗 **Cross-Project Themes**\n\n`;
      
      themes.forEach(theme => {
        blueprint += `**${theme.name}** (affects ${theme.projects.length} projects: ${theme.projects.join(', ')})\n`;
        blueprint += `- **Root cause:** ${theme.rootCause}\n`;
        blueprint += `- **Leverage point:** ${theme.leveragePoint}\n`;
        blueprint += `- **Next action:** ${theme.nextAction}\n\n`;
      });
    }

    // Immediate Actions
    if (Object.values(actions).some(arr => arr.length > 0)) {
      blueprint += `⚡ **Immediate Actions**\n\n`;
      
      if (actions.thisWeek.length > 0) {
        blueprint += `**This Week (🔥 High Priority)**\n`;
        actions.thisWeek.forEach(action => blueprint += `${action}\n`);
        blueprint += '\n';
      }

      if (actions.next30Days.length > 0) {
        blueprint += `**Next 30 Days (⚡ Medium Priority)**\n`;
        actions.next30Days.forEach(action => blueprint += `${action}\n`);
        blueprint += '\n';
      }

      if (actions.lowFriction.length > 0) {
        blueprint += `**When Energy Available (💡 Low Friction)**\n`;
        actions.lowFriction.forEach(action => blueprint += `${action}\n`);
        blueprint += '\n';
      }
    }

    // Strategic Insights
    if (insights.length > 0) {
      blueprint += `💎 **Strategic Insights**\n\n`;
      insights.forEach(insight => {
        blueprint += `${insight}\n`;
      });
      blueprint += '\n';
    }

    // Quality check questions
    blueprint += `---\n\n`;
    blueprint += `**Quality Check Questions:**\n`;
    blueprint += `- What can I do RIGHT NOW with my current energy?\n`;
    blueprint += `- What are the strategic threads connecting my projects?\n`;
    blueprint += `- What did I decide that I might forget?\n`;
    blueprint += `- What patterns am I seeing that I should double down on?\n`;

    return blueprint;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔹 **Transcript to Blueprint Processor**

Usage: node transcript-to-blueprint.js <input-file> [output-file]

Examples:
  node transcript-to-blueprint.js interview.txt
  node transcript-to-blueprint.js meeting-notes.md custom-blueprint.md
  
Features:
  ✅ Action extraction with priority grouping
  ✅ Cross-project theme mapping  
  ✅ Strategic insight identification
  ✅ Proper formatting with emojis and structure
  ✅ Impact rating and energy tagging
    `);
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || null;

  try {
    const processor = new TranscriptToBlueprint();
    await processor.processTranscript(inputFile, outputFile);
  } catch (error) {
    console.error('❌ Failed to process transcript:', error.message);
    process.exit(1);
  }
}

// Export for use as module
export { TranscriptToBlueprint };

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 