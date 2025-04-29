import { OpenAIApi, ChatCompletionCreateParams } from '@ai-sdk/openai';
import { DeepseekApi, CompletionCreateParams } from '@ai-sdk/deepseek';
import { ModelContext } from '../types/ModelContext';
import { RiskAnalysisResult } from '../types/RiskAnalysisResult';

export class ModelAdapter {
  private async handleGPTRiskAnalysis(
    context: ModelContext,
    prompt: string
  ): Promise<RiskAnalysisResult> {
    const openai = new OpenAIApi();
    
    try {
      const params: ChatCompletionCreateParams = {
        model: context.modelId,
        messages: [{
          role: 'system',
          content: 'You are a DeFi risk analysis assistant specializing in Solend positions.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: context.contextData.parameters.temperature,
        max_tokens: context.contextData.parameters.maxTokens,
        top_p: context.contextData.parameters.topP,
        frequency_penalty: context.contextData.parameters.frequencyPenalty,
        presence_penalty: context.contextData.parameters.presencePenalty
      };

      const completion = await openai.createChatCompletion(params);

      return {
        success: true,
        content: completion.data.choices[0]?.message?.content || '',
        model: context.modelId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in GPT risk analysis:', error);
      return {
        success: false,
        error: 'Unable to complete risk analysis. Please try again.',
        model: context.modelId,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async handleDeepseekRiskAnalysis(
    context: ModelContext,
    prompt: string
  ): Promise<RiskAnalysisResult> {
    const deepseek = new DeepseekApi();
    
    try {
      const params: CompletionCreateParams = {
        model: context.modelId,
        prompt: prompt,
        temperature: context.contextData.parameters.temperature,
        max_tokens: context.contextData.parameters.maxTokens,
        top_p: context.contextData.parameters.topP,
        frequency_penalty: context.contextData.parameters.frequencyPenalty,
        presence_penalty: context.contextData.parameters.presencePenalty
      };

      const completion = await deepseek.createCompletion(params);

      return {
        success: true,
        content: completion.data.choices[0]?.text || '',
        model: context.modelId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in Deepseek risk analysis:', error);
      return {
        success: false,
        error: 'Unable to complete risk analysis. Please try again.',
        model: context.modelId,
        timestamp: new Date().toISOString()
      };
    }
  }
}