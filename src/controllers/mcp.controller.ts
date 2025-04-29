import { Request, Response } from 'express';
import { ModelAdapter } from '../services/mcp/ModelAdapter';
import { ModelType } from '../types/mcp.types';

/**
 * Controller for handling MCP-related endpoints
 */
export class MCPController {
  private modelAdapter: ModelAdapter;

  constructor() {
    this.modelAdapter = new ModelAdapter();
  }

  /**
   * Initialize a new conversation
   */
  public async initializeConversation(req: Request, res: Response): Promise<void> {
    try {
      const { modelId, modelType, systemPrompt, parameters } = req.body;

      const contextId = await this.modelAdapter.initializeConversation(
        modelId,
        modelType as ModelType,
        systemPrompt,
        parameters
      );

      res.json({ contextId });
    } catch (error) {
      console.error('Error initializing conversation:', error);
      res.status(500).json({ error: 'Failed to initialize conversation' });
    }
  }

  /**
   * Send a message in an existing conversation
   */
  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { contextId } = req.params;
      const { message } = req.body;

      const response = await this.modelAdapter.sendMessage(contextId, message);

      res.json({ response });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  /**
   * Get conversation history
   */
  public async getConversationHistory(req: Request, res: Response): Promise<void> {
    try {
      const { contextId } = req.params;

      const history = this.modelAdapter.getConversationHistory(contextId);

      res.json({ history });
    } catch (error) {
      console.error('Error getting conversation history:', error);
      res.status(500).json({ error: 'Failed to get conversation history' });
    }
  }
} 