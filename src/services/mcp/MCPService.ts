import { EventEmitter } from 'events';
import {
  ModelContext,
  ContextStatus,
  MCPEvent,
  MCPEventType,
  ModelType,
  ConversationEntry
} from '../../types/mcp.types';

/**
 * Model Context Protocol (MCP) Service
 * Manages AI model contexts and their lifecycle
 */
export class MCPService {
  private static instance: MCPService;
  private contexts: Map<string, ModelContext>;
  private eventEmitter: EventEmitter;
  private contextTimeouts: Map<string, NodeJS.Timeout>;

  private constructor() {
    this.contexts = new Map();
    this.eventEmitter = new EventEmitter();
    this.contextTimeouts = new Map();
  }

  /**
   * Get the singleton instance of MCPService
   */
  public static getInstance(): MCPService {
    if (!MCPService.instance) {
      MCPService.instance = new MCPService();
    }
    return MCPService.instance;
  }

  /**
   * Create a new model context
   */
  public createContext(
    modelId: string,
    modelType: ModelType,
    initialSystemPrompt?: string
  ): ModelContext {
    const context: ModelContext = {
      id: this.generateContextId(),
      modelId,
      modelType,
      status: ContextStatus.ACTIVE,
      version: '1.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
      contextData: {
        conversation: initialSystemPrompt ? [
          {
            role: 'system',
            content: initialSystemPrompt,
            timestamp: new Date()
          }
        ] : [],
        parameters: {
          temperature: 0.7,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          maxTokens: 2048
        }
      }
    };

    this.contexts.set(context.id, context);
    this.setContextTimeout(context.id);
    this.emitEvent(MCPEventType.CONTEXT_CREATED, context);
    return context;
  }

  /**
   * Add a message to the context conversation
   */
  public addMessage(contextId: string, role: 'user' | 'assistant', content: string): void {
    const context = this.getContext(contextId);
    if (!context) throw new Error(`Context not found: ${contextId}`);

    const message: ConversationEntry = {
      role,
      content,
      timestamp: new Date()
    };

    context.contextData.conversation.push(message);
    context.updatedAt = new Date();
    this.contexts.set(contextId, context);
    this.refreshContextTimeout(contextId);
    this.emitEvent(MCPEventType.CONTEXT_UPDATED, context);
  }

  /**
   * Get a context by ID
   */
  public getContext(contextId: string): ModelContext | undefined {
    return this.contexts.get(contextId);
  }

  /**
   * Update context parameters
   */
  public updateContextParameters(
    contextId: string,
    parameters: Partial<ModelContext['contextData']['parameters']>
  ): void {
    const context = this.getContext(contextId);
    if (!context) throw new Error(`Context not found: ${contextId}`);

    context.contextData.parameters = {
      ...context.contextData.parameters,
      ...parameters
    };
    context.updatedAt = new Date();
    this.contexts.set(contextId, context);
    this.emitEvent(MCPEventType.CONTEXT_UPDATED, context);
  }

  /**
   * Subscribe to MCP events
   */
  public subscribe(eventType: MCPEventType, handler: (event: MCPEvent) => void): void {
    this.eventEmitter.on(eventType, handler);
  }

  /**
   * Unsubscribe from MCP events
   */
  public unsubscribe(eventType: MCPEventType, handler: (event: MCPEvent) => void): void {
    this.eventEmitter.off(eventType, handler);
  }

  /**
   * Clear expired contexts
   */
  public clearExpiredContexts(): void {
    for (const [contextId, context] of this.contexts.entries()) {
      if (context.status === ContextStatus.EXPIRED) {
        this.contexts.delete(contextId);
        this.clearContextTimeout(contextId);
      }
    }
  }

  private generateContextId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private emitEvent(type: MCPEventType, context: ModelContext): void {
    const event: MCPEvent = {
      type,
      contextId: context.id,
      timestamp: new Date(),
      data: context
    };
    this.eventEmitter.emit(type, event);
  }

  private setContextTimeout(contextId: string): void {
    // Set context to expire after 1 hour of inactivity
    const timeout = setTimeout(() => {
      const context = this.getContext(contextId);
      if (context) {
        context.status = ContextStatus.EXPIRED;
        this.contexts.set(contextId, context);
        this.emitEvent(MCPEventType.CONTEXT_EXPIRED, context);
      }
    }, 60 * 60 * 1000); // 1 hour

    this.contextTimeouts.set(contextId, timeout);
  }

  private refreshContextTimeout(contextId: string): void {
    this.clearContextTimeout(contextId);
    this.setContextTimeout(contextId);
  }

  private clearContextTimeout(contextId: string): void {
    const timeout = this.contextTimeouts.get(contextId);
    if (timeout) {
      clearTimeout(timeout);
      this.contextTimeouts.delete(contextId);
    }
  }
} 