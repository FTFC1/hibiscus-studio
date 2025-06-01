import axios, { AxiosInstance } from 'axios';
import {
  TrelloConfig,
  TrelloCard,
  TrelloList,
  TrelloAction,
  TrelloAttachment,
  TrelloBoard,
  TrelloWorkspace,
} from './types.js';
import { createTrelloRateLimiters } from './rate-limiter.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Path for storing active board/workspace configuration
const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.trello-mcp');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export class TrelloClient {
  private axiosInstance: AxiosInstance;
  private rateLimiter;
  private activeConfig: TrelloConfig;

  constructor(private config: TrelloConfig) {
    this.activeConfig = { ...config };

    this.axiosInstance = axios.create({
      baseURL: 'https://api.trello.com/1',
      params: {
        key: config.apiKey,
        token: config.token,
      },
    });

    this.rateLimiter = createTrelloRateLimiters();

    // Add rate limiting interceptor
    this.axiosInstance.interceptors.request.use(async config => {
      await this.rateLimiter.waitForAvailableToken();
      return config;
    });
  }

  /**
   * Load saved configuration from disk
   */
  public async loadConfig(): Promise<void> {
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      const data = await fs.readFile(CONFIG_FILE, 'utf8');
      const savedConfig = JSON.parse(data);

      // Only update boardId and workspaceId, keep credentials from env
      if (savedConfig.boardId) {
        this.activeConfig.boardId = savedConfig.boardId;
      }
      if (savedConfig.workspaceId) {
        this.activeConfig.workspaceId = savedConfig.workspaceId;
      }

      console.log(
        `Loaded configuration: Board ID ${this.activeConfig.boardId}, Workspace ID ${this.activeConfig.workspaceId || 'not set'}`
      );
    } catch (error) {
      // File might not exist yet, that's okay
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Save current configuration to disk
   */
  private async saveConfig(): Promise<void> {
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      const configToSave = {
        boardId: this.activeConfig.boardId,
        workspaceId: this.activeConfig.workspaceId,
      };
      await fs.writeFile(CONFIG_FILE, JSON.stringify(configToSave, null, 2));
    } catch (error) {
      console.error('Failed to save configuration:', error);
      throw new Error('Failed to save configuration');
    }
  }

  /**
   * Get the current active board ID
   */
  get activeBoardId(): string {
    return this.activeConfig.boardId;
  }

  /**
   * Get the current active workspace ID
   */
  get activeWorkspaceId(): string | undefined {
    return this.activeConfig.workspaceId;
  }

  /**
   * Set the active board
   */
  async setActiveBoard(boardId: string): Promise<TrelloBoard> {
    // Verify the board exists
    const board = await this.getBoardById(boardId);
    this.activeConfig.boardId = boardId;
    await this.saveConfig();
    return board;
  }

  /**
   * Set the active workspace
   */
  async setActiveWorkspace(workspaceId: string): Promise<TrelloWorkspace> {
    // Verify the workspace exists
    const workspace = await this.getWorkspaceById(workspaceId);
    this.activeConfig.workspaceId = workspaceId;
    await this.saveConfig();
    return workspace;
  }

  private async handleRequest<T>(request: () => Promise<T>): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          // Rate limit exceeded, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.handleRequest(request);
        }
        throw new Error(`Trello API error: ${error.response?.data?.message ?? error.message}`);
      }
      throw error;
    }
  }

  /**
   * List all boards the user has access to
   */
  async listBoards(): Promise<TrelloBoard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/members/me/boards');
      return response.data;
    });
  }

  /**
   * Get a specific board by ID
   */
  async getBoardById(boardId: string): Promise<TrelloBoard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${boardId}`);
      return response.data;
    });
  }

  /**
   * List all workspaces the user has access to
   */
  async listWorkspaces(): Promise<TrelloWorkspace[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/members/me/organizations');
      return response.data;
    });
  }

  /**
   * Get a specific workspace by ID
   */
  async getWorkspaceById(workspaceId: string): Promise<TrelloWorkspace> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/organizations/${workspaceId}`);
      return response.data;
    });
  }

  /**
   * List boards in a specific workspace
   */
  async listBoardsInWorkspace(workspaceId: string): Promise<TrelloBoard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/organizations/${workspaceId}/boards`);
      return response.data;
    });
  }

  async getCardsByList(listId: string): Promise<TrelloCard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/lists/${listId}/cards`);
      return response.data;
    });
  }

  async getLists(): Promise<TrelloList[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.activeConfig.boardId}/lists`);
      return response.data;
    });
  }

  async getRecentActivity(limit: number = 10): Promise<TrelloAction[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(
        `/boards/${this.activeConfig.boardId}/actions`,
        {
          params: { limit },
        }
      );
      return response.data;
    });
  }

  async addCard(params: {
    listId: string;
    name: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    pos?: string;
  }): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post('/cards', {
        idList: params.listId,
        name: params.name,
        desc: params.description,
        due: params.dueDate,
        idLabels: params.labels,
        pos: params.pos || "top",
      });
      return response.data;
    });
  }

  async updateCard(params: {
    cardId: string;
    name?: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
  }): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/cards/${params.cardId}`, {
        name: params.name,
        desc: params.description,
        due: params.dueDate,
        idLabels: params.labels,
      });
      return response.data;
    });
  }

  async archiveCard(cardId: string): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/cards/${cardId}`, {
        closed: true,
      });
      return response.data;
    });
  }

  async moveCard(cardId: string, listId: string): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/cards/${cardId}`, {
        idList: listId,
      });
      return response.data;
    });
  }

  async addList(name: string): Promise<TrelloList> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post('/lists', {
        name,
        idBoard: this.activeConfig.boardId,
      });
      return response.data;
    });
  }

  async archiveList(listId: string): Promise<TrelloList> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/lists/${listId}/closed`, {
        value: true,
      });
      return response.data;
    });
  }

  async getMyCards(): Promise<TrelloCard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/members/me/cards');
      return response.data;
    });
  }

  async attachImageToCard(
    cardId: string,
    imageUrl: string,
    name?: string
  ): Promise<TrelloAttachment> {
    return this.handleRequest(async () => {
      // Attaching an image directly from URL without downloading it
      const response = await this.axiosInstance.post(`/cards/${cardId}/attachments`, {
        url: imageUrl,
        name: name || 'Image Attachment',
      });
      return response.data;
    });
  }

  // --- Start of Refactored Helper Methods ---

  private async getLabelIdByName(labelName: string): Promise<string | null> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.activeConfig.boardId}/labels`);
      const labels = response.data as { id: string; name: string }[];
      const foundLabel = labels.find(label => label.name.trim().toLowerCase() === labelName.trim().toLowerCase());
      if (!foundLabel) {
        console.warn(`Label '${labelName}' not found on board '${this.activeConfig.boardId}'.`);
        return null;
      }
      return foundLabel.id;
    });
  }

  private async getCardsOnBoardWithLabel(labelId: string): Promise<TrelloCard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.activeConfig.boardId}/cards`, {
        params: { fields: 'id,name,desc,idLabels' },
      });
      const allCards = response.data as TrelloCard[];
      const cardsWithLabel = allCards.filter(card => card.idLabels?.includes(labelId));
      if (cardsWithLabel.length === 0) {
        // console.log(`No cards found with label ID '${labelId}' on board '${this.activeConfig.boardId}'.`);
      }
      return cardsWithLabel;
    });
  }

  private async attachTextAsFileToCard(cardId: string, textContent: string, filename: string): Promise<boolean> {
    return this.handleRequest(async () => {
      try {
        const formData = new FormData();
        formData.append('file', new Blob([textContent], { type: 'text/plain' }), filename);
        formData.append('name', filename);
        formData.append('mimeType', 'text/plain');
        await this.axiosInstance.post(`/cards/${cardId}/attachments`, formData, {
          // Axios should set Content-Type for FormData automatically, including boundary
        });
        // console.log(`Successfully attached '${filename}' to card ID: ${cardId}`);
        return true;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error attaching file '${filename}' to card ${cardId}: ${errorMessage}`);
        if (axios.isAxiosError(e) && e.response) {
          console.error('Trello API response:', e.response.data);
        }
        return false;
      }
    });
  }

  private async removeLabelFromCard(cardId: string, labelId: string): Promise<boolean> {
    return this.handleRequest(async () => {
      try {
        await this.axiosInstance.delete(`/cards/${cardId}/idLabels/${labelId}`);
        // console.log(`Successfully removed label ID '${labelId}' from card ID '${cardId}'.`);
        return true;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error removing label '${labelId}' from card ${cardId}: ${errorMessage}`);
        return false;
      }
    });
  }

  private async addLabelToCard(cardId: string, labelId: string): Promise<boolean> {
    return this.handleRequest(async () => {
      try {
        await this.axiosInstance.post(`/cards/${cardId}/idLabels`, { value: labelId });
        // console.log(`Successfully added label ID '${labelId}' to card ID '${cardId}'.`);
        return true;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error adding label '${labelId}' to card ${cardId}: ${errorMessage}`);
        return false;
      }
    });
  }

  private async getCardAttachments(cardId: string): Promise<TrelloAttachment[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/cards/${cardId}/attachments`, {
        params: { fields: 'id,name,url,mimeType,date' },
      });
      return response.data as TrelloAttachment[];
    });
  }

  private async downloadAttachmentText(attachmentUrl: string): Promise<string | null> {
    if (!this.config.apiKey || !this.config.token) {
      console.error('Trello API key or token is missing in config for downloading attachment.');
      return null;
    }
    try {
      const response = await axios.get(attachmentUrl, {
        headers: {
          'Authorization': `OAuth oauth_consumer_key="${this.config.apiKey}", oauth_token="${this.config.token}"`
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as import('axios').AxiosError;
      console.error(`Error downloading attachment content from ${attachmentUrl}: ${axiosError.message}`);
      if (axiosError.response) {
        console.error('Response data:', axiosError.response.data);
        console.error('Response status:', axiosError.response.status);
      }
      return null;
    }
  }

  private async summarizeTextWithOpenRouter(
    textToSummarize: string,
    modelName: string = "openai/gpt-4o"
  ): Promise<{ full_summary: string; action_items: string[] } | null> {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      console.error("OPENROUTER_API_KEY environment variable is not set.");
      return { full_summary: "Error: OpenRouter API key not configured.", action_items: [] };
    }
    if (!textToSummarize.trim()) {
      return { full_summary: "No content to summarize.", action_items: [] };
    }
    const system_prompt = `You are a helpful assistant. Summarize the following text from my perspective (use "I", "my" where appropriate).
Structure your response with these exact headings, each on a new line, and each prepended with an apt emoji.
Ensure there is an empty line (a double newline) after each heading before its content begins.

📊 Overall Summary
(Provide a concise bullet-point summary of my key topics and discussion points. Ensure an empty line between each bullet point.)

🤔 Key Questions/Ponderings
(Identify any underlying questions, open loops, or areas I am contemplating. Ensure an empty line between each point if multiple.)

🎯 Suggested Goal(s)
(Based on the text, suggest the primary goal or objective I might be aiming for. If multiple, list them, ensuring an empty line between each.)

✅ Actionable Tasks
(List specific, actionable tasks derived from the text. If no direct tasks are mentioned, state "None identified". Each task should be on a new line, with an empty line between each task.)

Ensure there is also an empty line (a double newline) separating the content of one section from the heading of the next.
`;
    const user_prompt = `Please process the following text according to the structured format described in the system prompt:\n\n---\n${textToSummarize}\n---`;
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        { model: modelName, messages: [{ role: "system", content: system_prompt },{ role: "user", content: user_prompt }] },
        { headers: { 'Authorization': `Bearer ${openRouterApiKey}`, 'Content-Type': 'application/json' } }
      );
      const full_response_text = response.data.choices[0].message.content.trim();
      const action_items: string[] = [];
      let in_actions_section = false;
      for (const line of full_response_text.split(/\r?\n/)) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes("Actionable Tasks")) { in_actions_section = true; continue; }
        if (trimmedLine.startsWith("📊") || trimmedLine.startsWith("🤔") || trimmedLine.startsWith("🎯")) { in_actions_section = false; continue; }
        if (in_actions_section && trimmedLine && trimmedLine.toLowerCase() !== "none identified") {
          let cleaned_line = trimmedLine;
          if (cleaned_line.startsWith("- ") || cleaned_line.startsWith("* ")) { cleaned_line = cleaned_line.substring(2); }
          else if (cleaned_line.match(/^\\\\d+\\\\.\\\\s+/)) { cleaned_line = cleaned_line.replace(/^\\\\d+\\\\.\\\\s+/, ''); }
          action_items.push(cleaned_line.trim());
        }
      }
      return { full_summary: full_response_text, action_items };
    } catch (error) {
      const axiosError = error as import('axios').AxiosError;
      console.error(`Error summarizing text with OpenRouter (model: ${modelName}): ${axiosError.message}`);
      if (axiosError.response) { console.error('OpenRouter API response status:', axiosError.response.status); console.error('OpenRouter API response data:', axiosError.response.data); }
      return { full_summary: "Error during summarization.", action_items: [] };
    }
  }

  public async getOrCreateChecklist(cardId: string, checklistName: string): Promise<string | null> {
    try {
      // First, try to find an existing checklist with the same name on the card
      const checklists = await this.handleRequest(async () => {
        const response = await this.axiosInstance.get(`/cards/${cardId}/checklists`);
        return response.data;
      });

      const existingChecklist = checklists.find((cl: any) => cl.name === checklistName);
      if (existingChecklist) {
        return existingChecklist.id;
      }

      // If not found, create a new one
      const response = await this.handleRequest(async () => 
        this.axiosInstance.post(`/cards/${cardId}/checklists`, {
          name: checklistName,
        })
      );
      return response.data.id;
    } catch (error) {
      console.error(`Error getting or creating checklist '${checklistName}' on card ${cardId}:`, error);
      return null;
    }
  }

  public async getChecklistDetails(checklistId: string): Promise<{id: string, name: string, state: string}[] | null> {
    return this.handleRequest(async () => {
      try {
        const response = await this.axiosInstance.get(`/checklists/${checklistId}/checkItems`);
        return response.data as {id: string, name: string, state: string}[];
      } catch (e) {
        console.error(`Error fetching checklist details for ${checklistId}: ${e instanceof Error ? e.message : String(e)}`);
        return null;
      }
    });
  }

  private async getChecklistItems(checklistId: string): Promise<{id: string, name: string}[] | null> {
    return this.handleRequest(async () => {
      try {
        const response = await this.axiosInstance.get(`/checklists/${checklistId}/checkItems`);
        // Return an array of objects, each containing the id and name of the checkItem
        return (response.data as {id: string, name: string, state: string}[]).map(item => ({id: item.id, name: item.name}));
      } catch (e) {
        console.error(`Error fetching items for checklist ${checklistId}: ${e instanceof Error ? e.message : String(e)}`);
        return null;
      }
    });
  }

  public async addItemToChecklist(checklistId: string, itemName: string, pos: string = "bottom", checked: boolean = false): Promise<boolean> {
    try {
      await this.handleRequest(async () => 
        this.axiosInstance.post(`/checklists/${checklistId}/checkItems`, {
          name: itemName,
          pos: pos,
          checked: checked
        })
      );
      return true;
    } catch (error) {
      console.error(`Error adding item '${itemName}' to checklist ${checklistId}:`, error);
      return false;
    }
  }

  public async deleteChecklist(checklistId: string): Promise<boolean> {
    try {
      await this.handleRequest(async () => 
        this.axiosInstance.delete(`/checklists/${checklistId}`)
      );
      return true;
    } catch (error) {
      console.error(`Error deleting checklist ${checklistId}:`, error);
      return false;
    }
  }

  public async updateChecklistItem(cardId: string, checkItemId: string, name?: string, state?: string): Promise<boolean> {
    try {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (state !== undefined) updateData.state = state;
      
      if (Object.keys(updateData).length === 0) {
        return true; // No changes to make, consider it a success
      }

      await this.handleRequest(async () => 
        this.axiosInstance.put(`/cards/${cardId}/checkItem/${checkItemId}`, updateData)
      );
      return true;
    } catch (error) {
      console.error(`Error updating checklist item ${checkItemId}:`, error);
      return false;
    }
  }

  public async deleteChecklistItem(checklistId: string, checkItemId: string): Promise<boolean> {
    try {
      await this.handleRequest(async () =>
        this.axiosInstance.delete(`/checklists/${checklistId}/checkItems/${checkItemId}`)
      );
      // console.error(`[DEBUG] TrelloClient: Successfully removed checkItem ID '${checkItemId}' from checklist ID '${checklistId}'.`);
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`[DEBUG] TrelloClient: Error removing checkItem ID '${checkItemId}' from checklist ID '${checklistId}': ${errorMessage}`);
      return false;
    }
  }

  // --- End of Refactored Helper Methods ---

  async summariseWaffleAttachments(): Promise<{ status: string; processedCards: number; errors: string[] }> {
    const WAFFLE_ARCHIVED_LABEL_NAME = 'WAFFLE ARCHIVED';
    const WAFFLE_SUMMARISED_LABEL_NAME = 'WAFFLE SUMMARISED';
    const CHECKLIST_NAME = "AI Suggested Actions";
    const results = {
      processedCards: 0,
      errors: [] as string[],
      status: "Starting waffle summarization...",
    };

    console.error(`[DEBUG] summariseWaffleAttachments: Starting process. Looking for label: "${WAFFLE_ARCHIVED_LABEL_NAME}"`);

    const waffleArchivedLabelId = await this.getLabelIdByName(WAFFLE_ARCHIVED_LABEL_NAME);
    if (!waffleArchivedLabelId) {
      const errorMsg = `Label '${WAFFLE_ARCHIVED_LABEL_NAME}' not found. Cannot proceed.`;
      console.error(`[DEBUG] summariseWaffleAttachments: ${errorMsg}`);
      results.errors.push(errorMsg);
      results.status = errorMsg;
      return results;
    }
    console.error(`[DEBUG] summariseWaffleAttachments: Found label ID for "${WAFFLE_ARCHIVED_LABEL_NAME}": ${waffleArchivedLabelId}`);

    const waffleSummarisedLabelId = await this.getLabelIdByName(WAFFLE_SUMMARISED_LABEL_NAME);
    if (!waffleSummarisedLabelId) {
      // This is not a critical error for finding cards, but we'll need it later.
      console.warn(`[DEBUG] summariseWaffleAttachments: Label '${WAFFLE_SUMMARISED_LABEL_NAME}' not found. Will attempt to create it if needed, or fail if adding is required.`);
    } else {
      console.error(`[DEBUG] summariseWaffleAttachments: Found label ID for "${WAFFLE_SUMMARISED_LABEL_NAME}": ${waffleSummarisedLabelId}`);
    }

    const cardsToProcess = await this.getCardsOnBoardWithLabel(waffleArchivedLabelId);
    console.error(`[DEBUG] summariseWaffleAttachments: Found ${cardsToProcess.length} card(s) with label "${WAFFLE_ARCHIVED_LABEL_NAME}".`);

    if (cardsToProcess.length === 0) {
      const statusMsg = `No cards found with the '${WAFFLE_ARCHIVED_LABEL_NAME}' label. Nothing to summarise.`;
      // console.log(statusMsg); // Keep this one commented
      results.status = statusMsg;
      return results;
    }

    for (const card of cardsToProcess) {
      const cardName = card.name || card.id;
      console.error(`[DEBUG] summariseWaffleAttachments: Processing card: "${cardName}" (ID: ${card.id})`);
      try {
        const attachments = await this.getCardAttachments(card.id);
        const waffleTexts: string[] = [];

        console.error(`[DEBUG] summariseWaffleAttachments: Card "${cardName}" has ${attachments.length} attachment(s).`);

        for (const attachment of attachments) {
          if (attachment.name?.toLowerCase().includes('waffle_archive') && attachment.name.toLowerCase().endsWith('.txt')) {
            console.error(`[DEBUG] summariseWaffleAttachments: Found waffle archive attachment: "${attachment.name}" for card "${cardName}"`);
            const textContent = await this.downloadAttachmentText(attachment.url);
            if (textContent) {
              waffleTexts.push(textContent);
              console.error(`[DEBUG] summariseWaffleAttachments: Downloaded text for "${attachment.name}". Length: ${textContent.length}`);
            } else {
              console.warn(`[DEBUG] summariseWaffleAttachments: Could not download text for attachment "${attachment.name}" on card "${cardName}".`);
            }
          }
        }

        if (waffleTexts.length === 0) {
          console.error(`[DEBUG] summariseWaffleAttachments: No relevant waffle archive attachments found for card "${cardName}". Skipping summarization for this card.`);
          results.errors.push(`No waffle_archive.txt attachments found for card: ${cardName} (ID: ${card.id})`);
          continue;
        }

        const combinedWaffleText = waffleTexts.join("\n\n---\n\n");
        console.error(`[DEBUG] Combined waffle text for card ${cardName}: ${combinedWaffleText.substring(0, 200)}...`);

        const summaryData = await this.summarizeTextWithOpenRouter(combinedWaffleText);
        console.error(`[DEBUG] summaryData from OpenRouter for card ${cardName}:`, JSON.stringify(summaryData, null, 2));

        if (summaryData && summaryData.full_summary && summaryData.full_summary !== "Error during summarization." && summaryData.full_summary !== "No content to summarize." && summaryData.full_summary !== "Error: OpenRouter API key not configured.") {
          // Use the AI summary directly as the new description (prefix removed)
          let sanitizedDescription = summaryData.full_summary;
          
          // Sanitize the description
          // Remove ### headers (should not be produced by AI anymore with new prompt, but keep as safeguard for now or remove if confident)
          // sanitizedDescription = sanitizedDescription.replace(/^###\s+/gm, ''); 
          
          // Collapse multiple newlines into a maximum of two (like paragraphs)
          sanitizedDescription = sanitizedDescription.replace(/\n{2,}/g, '\n\n'); // Max 2 newlines
          // Remove any lines that are now empty or just whitespace
          sanitizedDescription = sanitizedDescription.split('\n').filter(line => line.trim() !== '').join('\n');

          await this.updateCard({ cardId: card.id, description: sanitizedDescription });
          console.error(`[DEBUG] summariseWaffleAttachments: Attempted to update card "${cardName}" (ID: ${card.id}) with FULL SANITIZED description (first 100 chars): "${sanitizedDescription.substring(0,100)}..."`);

          // Manage labels: remove "WAFFLE ARCHIVED", add "WAFFLE SUMMARISED"
          await this.removeLabelFromCard(card.id, waffleArchivedLabelId);
          console.error(`[DEBUG] summariseWaffleAttachments: Removed label "${WAFFLE_ARCHIVED_LABEL_NAME}" from card "${cardName}".`);

          if (waffleSummarisedLabelId) {
            await this.addLabelToCard(card.id, waffleSummarisedLabelId);
            console.error(`[DEBUG] summariseWaffleAttachments: Added label "${WAFFLE_SUMMARISED_LABEL_NAME}" to card "${cardName}".`);
          } else {
            const errMsg = `Cannot add '${WAFFLE_SUMMARISED_LABEL_NAME}' label as it was not found or couldn't be created.`;
            console.error(`[DEBUG] summariseWaffleAttachments: ${errMsg} for card "${cardName}".`);
            results.errors.push(`${errMsg} for card: ${cardName}`);
          }

          // Manage checklist
          if (summaryData.action_items && summaryData.action_items.length > 0) {
            const checklistId = await this.getOrCreateChecklist(card.id, CHECKLIST_NAME);
            if (checklistId) {
              console.error(`[DEBUG] summariseWaffleAttachments: Ensured checklist "${CHECKLIST_NAME}" exists for card "${cardName}" (ID: ${checklistId}). Adding ${summaryData.action_items.length} items.`);
              
              // Fetch existing items to prevent duplicates and remove old ones
              const existingItemsRaw = await this.getChecklistItems(checklistId);
              const aiSuggestedItemsLower = summaryData.action_items.map(aiItem => aiItem.trim().toLowerCase());
              
              if (existingItemsRaw) {
                for (const existingItem of existingItemsRaw) {
                  if (!aiSuggestedItemsLower.includes(existingItem.name.trim().toLowerCase())) {
                    console.error(`[DEBUG] summariseWaffleAttachments: Removing outdated checklist item "${existingItem.name}" (ID: ${existingItem.id}) as it's not in the new AI suggestions.`);
                    await this.deleteChecklistItem(checklistId, existingItem.id);
                  }
                }
              }
              
              // Refresh existing items after deletion before adding new ones
              const currentChecklistItemsRawAfterDeletions = await this.getChecklistItems(checklistId);
              const currentChecklistItemsLower = currentChecklistItemsRawAfterDeletions?.map(item => item.name.trim().toLowerCase()) || [];
              console.error(`[DEBUG] summariseWaffleAttachments: Checklist items after deletions:`, currentChecklistItemsLower);

              let itemsAddedCount = 0;
              for (const item of summaryData.action_items) {
                if (!currentChecklistItemsLower.includes(item.trim().toLowerCase())) {
                  await this.addItemToChecklist(checklistId, item);
                  itemsAddedCount++;
                } else {
                  console.error(`[DEBUG] summariseWaffleAttachments: Item "${item}" already exists in checklist or was just added. Skipping.`);
                }
              }
              console.error(`[DEBUG] summariseWaffleAttachments: Added ${itemsAddedCount} new action item(s) to checklist for card "${cardName}".`);
            } else {
               const errMsg = `Could not get or create checklist '${CHECKLIST_NAME}'.`;
               console.error(`[DEBUG] summariseWaffleAttachments: ${errMsg} for card "${cardName}".`);
               results.errors.push(`${errMsg} for card: ${cardName}`);
            }
          } else {
            console.error(`[DEBUG] summariseWaffleAttachments: No action items provided by summary for card "${cardName}".`);
          }
          results.processedCards++;
        } else {
          let errorReason = "Summarization failed or returned no content.";
          if (summaryData && summaryData.full_summary === "Error: OpenRouter API key not configured.") {
            errorReason = "OpenRouter API key is missing or invalid. Please check .env and MCP configuration.";
          } else if (summaryData && summaryData.full_summary) {
            errorReason = summaryData.full_summary; // e.g. "No content to summarize."
          }
          const errMsg = `Failed to get a valid summary for card "${cardName}". Reason: ${errorReason}`;
          console.error(`[DEBUG] summariseWaffleAttachments: ${errMsg}`);
          results.errors.push(errMsg);
        }
      } catch (e: any) {
        const errorDetail = e.message || e.toString();
        console.error(`[DEBUG] summariseWaffleAttachments: Error processing card "${cardName}": ${errorDetail}`);
        results.errors.push(`Error processing card ${cardName} (ID: ${card.id}): ${errorDetail}`);
      }
    }

    const finalStatus = `SummaryTool COMPLETED. P: ${results.processedCards}, E: ${results.errors.length}`;
    results.status = finalStatus;
    return results;
  }

  async processWaffleCards(): Promise<{ status: string; processedCards: number; errors: string[] }> {
    const WAFFLE_LABEL_NAME = 'WAFFLE';
    const WAFFLE_ARCHIVED_LABEL_NAME = 'WAFFLE ARCHIVED';
    const results = {
      status: 'Processing started.',
      processedCards: 0,
      errors: [] as string[],
    };

    // console.log(`Starting waffle processing for board ID '${this.activeConfig.boardId}'...`);

    const waffleLabelId = await this.getLabelIdByName(WAFFLE_LABEL_NAME);
    const waffleArchivedLabelId = await this.getLabelIdByName(WAFFLE_ARCHIVED_LABEL_NAME);

    if (!waffleLabelId) {
      const errorMsg = `Could not find '${WAFFLE_LABEL_NAME}' label. Aborting.`;
      console.error(errorMsg);
      results.errors.push(errorMsg);
      results.status = 'Failed: Missing WAFFLE label.';
      return results;
    }
    if (!waffleArchivedLabelId) {
      const errorMsg = `Could not find '${WAFFLE_ARCHIVED_LABEL_NAME}' label. Aborting.`;
      console.error(errorMsg);
      results.errors.push(errorMsg);
      results.status = 'Failed: Missing WAFFLE ARCHIVED label.';
      return results;
    }

    const cardsToProcess = await this.getCardsOnBoardWithLabel(waffleLabelId);

    if (cardsToProcess.length === 0) {
      results.status = "No cards found with the 'WAFFLE' label. Nothing to do.";
      // console.log(results.status);
      return results;
    }

    // console.log(`Found ${cardsToProcess.length} card(s) to process.`);
    results.status = `Found ${cardsToProcess.length} card(s). Processing...`;

    for (const card of cardsToProcess) {
      const cardId = card.id;
      const cardName = card.name;
      const cardDesc = card.desc || ''; // Ensure desc is a string
      // console.log(`\nProcessing card: '${cardName}' (ID: ${cardId})`);

      if (!cardDesc.trim()) {
        console.log(`Card '${cardName}' has no description to archive. Skipping label change, but removing 'WAFFLE' label.`);
        if (card.idLabels?.includes(waffleLabelId)) {
          await this.removeLabelFromCard(cardId, waffleLabelId);
        }
        results.processedCards++;
        continue;
      }

      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ''); // e.g., 17May24
      const attachmentFilename = `waffle_archive_${dateStr}.txt`;

      console.log(`Archiving description to '${attachmentFilename}'...`);
      if (await this.attachTextAsFileToCard(cardId, cardDesc, attachmentFilename)) {
        console.log("Updating card description...");
        // Assuming updateCard returns the updated card object or a boolean success
        const updateResult = await this.updateCard({ cardId, description: "Original waffle archived. Summary pending." });
        if (updateResult) { // Check if updateResult indicates success
          console.log("Swapping labels...");
          if (await this.removeLabelFromCard(cardId, waffleLabelId)) {
            await this.addLabelToCard(cardId, waffleArchivedLabelId);
          } else {
            const errorMsg = `Could not remove 'WAFFLE' label from '${cardName}'. Archival label not added.`;
            console.error(errorMsg);
            results.errors.push(errorMsg);
          }
        } else {
          const errorMsg = `Could not update description for '${cardName}'. Labels not changed.`;
          console.error(errorMsg);
          results.errors.push(errorMsg);
        }
      } else {
        const errorMsg = `Could not attach waffle archive for '${cardName}'. Description and labels not changed.`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
      results.processedCards++;
    }

    const finalStatus = `Waffle processing finished. Processed: ${results.processedCards}. Errors: ${results.errors.length}.`;
    // console.log(`\n${finalStatus}`);
    results.status = finalStatus;
    return results;
  }

  /**
   * Backup the entire active board (lists, cards, labels, checklists, attachments, comments) to a timestamped JSON file in /data
   */
  public async backupBoardToFile(): Promise<{ filePath: string; summary: Record<string, number> }> {
    console.error('[DEBUG_BACKUP] Entered backupBoardToFile');
    const backupDir = path.join(process.cwd(), 'data');
    await fs.mkdir(backupDir, { recursive: true });
    console.error('[DEBUG_BACKUP] Directory created/verified');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filePath = path.join(backupDir, `trello-backup-${dateStr}.json`);
    console.error(`[DEBUG_BACKUP] Backup file path: ${filePath}`);
    try {
      console.error('[DEBUG_BACKUP] Fetching board info...');
      const board = await this.getBoardById(this.activeConfig.boardId);
      console.error('[DEBUG_BACKUP] Board info fetched.');
      console.error('[DEBUG_BACKUP] Fetching lists...');
      const lists = await this.getLists();
      console.error(`[DEBUG_BACKUP] Lists fetched: ${lists.length}`);
      console.error('[DEBUG_BACKUP] Fetching labels...');
      const labels = await this.handleRequest(async () => {
        const response = await this.axiosInstance.get(`/boards/${this.activeConfig.boardId}/labels`);
        return response.data;
      });
      console.error(`[DEBUG_BACKUP] Labels fetched: ${labels.length}`);
      console.error('[DEBUG_BACKUP] Fetching cards...');
      const cards = await this.handleRequest(async () => {
        const response = await this.axiosInstance.get(`/boards/${this.activeConfig.boardId}/cards`);
        return response.data;
      });
      console.error(`[DEBUG_BACKUP] Cards fetched: ${cards.length}`);
      console.error('[DEBUG_BACKUP] Fetching per-card details...');
      const cardsWithDetails = await Promise.all(cards.map(async (card: any, idx: number) => {
        console.error(`[DEBUG_BACKUP] [${idx+1}/${cards.length}] Fetching details for card: ${card.name || card.id}`);
        const checklists = await this.handleRequest(async () => {
          const resp = await this.axiosInstance.get(`/cards/${card.id}/checklists`);
          return resp.data;
        });
        const attachments = await this.getCardAttachments(card.id);
        const comments = await this.handleRequest(async () => {
          const resp = await this.axiosInstance.get(`/cards/${card.id}/actions`, { params: { filter: 'commentCard' } });
          return resp.data;
        });
        console.error(`[DEBUG_BACKUP] [${idx+1}/${cards.length}] Details fetched.`);
        return { ...card, checklists, attachments, comments };
      }));
      console.error('[DEBUG_BACKUP] All card details fetched. Writing backup file...');
      const backup = {
        board,
        lists,
        labels,
        cards: cardsWithDetails,
        backedUpAt: new Date().toISOString(),
      };
      await fs.writeFile(filePath, JSON.stringify(backup, null, 2), 'utf8');
      console.error(`[DEBUG_BACKUP] Successfully wrote backup file to: ${filePath}`);
      return {
        filePath,
        summary: {
          lists: lists.length,
          labels: labels.length,
          cards: cards.length,
        },
      };
    } catch (err: any) {
      console.error(`[DEBUG_BACKUP] Error during backup:`, err && err.stack ? err.stack : err);
      throw err;
    }
  }
}
