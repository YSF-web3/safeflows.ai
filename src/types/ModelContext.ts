/**
 * Parameters for model configuration
 */
export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

/**
 * Context data for model execution
 */
export interface ModelContextData {
  parameters: ModelParameters;
  // Add other context-specific data as needed
}

/**
 * Complete context for model execution
 */
export interface ModelContext {
  modelId: string;
  contextData: ModelContextData;
} 