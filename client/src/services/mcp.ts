import axios from 'axios';

/**
 * Initialize a new MCP conversation
 */
export const initializeMCPConversation = async () => {
  try {
    const response = await axios.post('/api/mcp/conversation', {
      modelId: 'gpt-4',
      modelType: 'gpt',
      systemPrompt: 'You are a DeFi risk analyst monitoring Solend positions',
      parameters: {
        riskThreshold: 0.75,
        monitoredAssets: ['SOL', 'ETH', 'USDC'],
        alertLevel: 'conservative'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error initializing MCP conversation:', error);
    throw error;
  }
}; 