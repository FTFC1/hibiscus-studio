
import { ReportData } from './types';

export const copyToClipboard = async (text: string, showToast: (message: string) => void) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copy successful!');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showToast('Failed to copy.');
  }
};

export const getMarkdownContent = (report: ReportData): string => {
  const { tldr, audioTranscript, keyPoints, sceneBreakdown, feedbackAndRequirements, videoFileName, analysisDurationSeconds, suggestedTitle } = report;

  const keyPointsMarkdown = keyPoints.map(point => `- ${point}`).join('\n');
  const feedbackMarkdown = feedbackAndRequirements.map(point => `- ${point}`).join('\n');
  const scenesMarkdown = sceneBreakdown.map(scene => `- **${scene.timestamp.toFixed(1)}s:** ${scene.description}`).join('\n');

  const markdownContent = `
# ${suggestedTitle}

(Original file: ${videoFileName} | Analysis took ${analysisDurationSeconds.toFixed(1)} seconds)

## TL;DR
${tldr}

---

## Key Points
${keyPointsMarkdown}

---

## Audio Transcript
${audioTranscript}

---

## Feedback & Requirements
${feedbackMarkdown}

---

## Scene Breakdown
${scenesMarkdown}
  `;

  return markdownContent.trim();
};

export const downloadMarkdown = (report: ReportData) => {
  const markdownContent = getMarkdownContent(report);
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.suggestedTitle.replace(/[\W_]+/g,"-")}-analysis.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};