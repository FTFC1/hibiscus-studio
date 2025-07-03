export const MAX_FILE_SIZE_MB = 1024;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_DURATION_SECONDS = 1800; // 30 minutes

export const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';

// A simplified, estimated cost per minute of video for user feedback.
// This is not for billing, but to give users a general idea of the cost.
export const COST_PER_MINUTE_VIDEO = 0.126; // Example cost: $0.0021/sec * 60

// Pricing for Gemini 1.5 Flash as a reference for cost estimation in chat.
// Prices are per-token.
const GEMINI_FLASH_INPUT_PRICE_PER_MILLION_TOKENS = 0.35;
const GEMINI_FLASH_OUTPUT_PRICE_PER_MILLION_TOKENS = 0.70;

export const INPUT_TOKEN_PRICE = GEMINI_FLASH_INPUT_PRICE_PER_MILLION_TOKENS / 1_000_000;
export const OUTPUT_TOKEN_PRICE = GEMINI_FLASH_OUTPUT_PRICE_PER_MILLION_TOKENS / 1_000_000;