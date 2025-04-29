/**
 * Model Context Protocol (MCP) Types
 * Defines the core types and interfaces for managing AI model contexts
 */

// Base context interface that all specific contexts must extend
export interface BaseContext {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

// Represents the state of an AI model's context
export interface ModelContext extends BaseContext {
  modelId: string;
  modelType: ModelType;
  contextData: ContextData;
  status: ContextStatus;
  version: string;
}

// Supported AI model types
export enum ModelType {
  GPT = 'gpt',
  DEEPSEEK = 'deepseek',
  CUSTOM = 'custom'
}

// Context status states
export enum ContextStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  ERROR = 'error'
}

// Structure for context data
export interface ContextData {
  conversation: ConversationEntry[];
  parameters: ModelParameters;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

// Structure for conversation entries
export interface ConversationEntry {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Model parameters interface
export interface ModelParameters {
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxTokens: number;
  stop?: string[];
}

// MCP event types
export enum MCPEventType {
  CONTEXT_CREATED = 'context.created',
  CONTEXT_UPDATED = 'context.updated',
  CONTEXT_EXPIRED = 'context.expired',
  CONTEXT_ERROR = 'context.error'
}

// MCP event interface
export interface MCPEvent {
  type: MCPEventType;
  contextId: string;
  timestamp: Date;
  data: any;
} 