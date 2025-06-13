import { TranscriptToBlueprint } from '../../scripts/transcript-to-blueprint.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * MCP Tool: Convert transcript to structured blueprint
 * 
 * Processes voice transcripts, meeting notes, or strategy documents
 * and extracts structured blueprints with actions, themes, and insights.
 */

export const transcriptToBlueprintTool = {
  name: "transcript_to_blueprint",
  description: "Convert transcript or notes into structured blueprint with actions, themes, and strategic insights",
  inputSchema: {
    type: "object", 
    properties: {
      inputFile: {
        type: "string",
        description: "Path to the transcript file to process (.txt, .md, etc.)"
      },
      outputFile: {
        type: "string", 
        description: "Optional: Path for the generated blueprint file (defaults to input-blueprint.md)"
      },
      extractActions: {
        type: "boolean",
        description: "Whether to extract and categorise action items (default: true)"
      },
      extractThemes: {
        type: "boolean", 
        description: "Whether to identify cross-project themes (default: true)"
      },
      extractInsights: {
        type: "boolean",
        description: "Whether to extract strategic insights (default: true)"
      }
    },
    required: ["inputFile"]
  }
};

export async function handleTranscriptToBlueprint(params) {
  const { 
    inputFile, 
    outputFile, 
    extractActions = true,
    extractThemes = true, 
    extractInsights = true 
  } = params;

  try {
    // Validate input file exists
    await fs.access(inputFile);
    
    // Process the transcript
    const processor = new TranscriptToBlueprint();
    
    // Configure processor based on flags
    if (!extractActions) {
      processor.actionPatterns = [];
    }
    
    if (!extractThemes) {
      processor.themePatterns = [];
    }
    
    if (!extractInsights) {
      processor.strategicPatterns = [];
    }
    
    const resultFile = await processor.processTranscript(inputFile, outputFile);
    
    // Read the generated blueprint for preview
    const blueprint = await fs.readFile(resultFile, 'utf-8');
    const lines = blueprint.split('\n');
    const preview = lines.slice(0, 20).join('\n') + (lines.length > 20 ? '\n...(truncated)' : '');
    
    return {
      content: [
        {
          type: "text",
          text: `✅ **Blueprint Created Successfully**

**File:** ${resultFile}
**Size:** ${(blueprint.length / 1000).toFixed(1)}k characters

**Preview:**
\`\`\`markdown
${preview}
\`\`\`

The blueprint includes:
${extractActions ? '✅ Action items categorised by priority' : '❌ Actions skipped'}
${extractThemes ? '✅ Cross-project themes with leverage points' : '❌ Themes skipped'}  
${extractInsights ? '✅ Strategic insights and patterns' : '❌ Insights skipped'}
✅ Structured sections with proper formatting
✅ Quality check questions for validation

**Next Steps:**
- Review the generated blueprint at: \`${resultFile}\`
- Use the quality check questions to validate completeness
- Extract specific actions for your task management system`
        }
      ]
    };
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        content: [
          {
            type: "text", 
            text: `❌ **File Not Found**

The transcript file \`${inputFile}\` doesn't exist.

**Supported formats:** .txt, .md, .rtf, or any text file
**Example usage:** 
- \`transcript_to_blueprint\` with \`inputFile: "docs/meeting-notes.txt"\`
- \`transcript_to_blueprint\` with \`inputFile: "voice-recording-transcript.md"\`

Make sure the file path is correct and the file exists.`
          }
        ]
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `❌ **Processing Error**

Failed to process transcript: ${error.message}

**Common issues:**
- File encoding problems (ensure UTF-8)
- Very large files (consider splitting)
- Malformed content structure

**Solutions:**
- Check file is readable text format
- Verify content has clear section breaks  
- Try with a smaller sample first`
        }
      ]
    };
  }
}

// Optional: Helper function for batch processing
export async function processBatchTranscripts(inputDir, outputDir = null) {
  const files = await fs.readdir(inputDir);
  const transcriptFiles = files.filter(file => 
    file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.rtf')
  );
  
  const processor = new TranscriptToBlueprint();
  const results = [];
  
  for (const file of transcriptFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = outputDir 
      ? path.join(outputDir, `${path.parse(file).name}-blueprint.md`)
      : null;
    
    try {
      const resultFile = await processor.processTranscript(inputPath, outputPath);
      results.push({ file, status: 'success', output: resultFile });
    } catch (error) {
      results.push({ file, status: 'error', error: error.message });
    }
  }
  
  return results;
} 