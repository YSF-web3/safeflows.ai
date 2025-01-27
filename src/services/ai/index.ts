import OpenAI from "openai";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const OPEN_AI_ASSISTANT_ID = process.env.OPEN_AI_ASSISTANT_ID;

export class AiService {
  private openai: OpenAI;
  private threadIds: Map<string, string> = new Map(); // Use a Map to store thread IDs per user

  constructor() {
    this.openai = new OpenAI({
      apiKey: OPEN_AI_API_KEY,
      dangerouslyAllowBrowser: false, // Disable browser-specific feature
    });
  }

  async newThread(
    userId: string, // Accept userId to track threads
    prompt: string
  ): Promise<{
    predictedPriceUsd: number;
  } | null> {
    try {
      let threadId = this.threadIds.get(userId); // Get the thread ID for the user

      // Create a new thread if none exists for the user
      if (!threadId) {
        const thread = await this.openai.beta.threads.create();
        threadId = thread.id;
        this.threadIds.set(userId, threadId); // Store the thread ID for the user
      }

      // Add message to the existing thread
      await this.openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: prompt,
      });

      const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: OPEN_AI_ASSISTANT_ID!,
      });

      const messages = await this.openai.beta.threads.messages.list(threadId);

      const lastMessageForRun = messages.data
        .filter(
          (message: any) =>
            message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      const predictionRaw = JSON.parse(
        JSON.stringify(lastMessageForRun?.content[0])
      ).text.value;

      const predictionCleaned = predictionRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const prediction: {
        predictedPriceUsd: number;
        message: "";
      } = JSON.parse(predictionCleaned);

      return prediction;
    } catch (error) {
      console.error(`Processing request: ${error}`);
      return null;
    }
  }

  // Optional: Method to reset thread ID for a specific user
  resetThread(userId: string) {
    this.threadIds.delete(userId); // Clears the thread ID for the user
  }
}

export const openAiService = new AiService();
