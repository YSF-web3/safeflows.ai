import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateObject, streamText } from "ai";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export class AiService {
  private model;
  private messages: CoreMessage[] = [];
  private predictionSchema;
  constructor() {
    const openai = createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY!,
      baseURL: "https://api.deepseek.com/v1",
    });
    this.model = openai("deepseek-chat");
    this.predictionSchema = z.object({
      predictedPriceUsd: z.number(),
      message: z.string(),
    });
  }

  async predictTokenPrice(tokenData: object): Promise<{
    predictedPriceUsd: number;
    message: string;
  } | null> {
    console.log("Processing Deep Seek service");

    try {
      const prompt = `${process.env.DEEP_SEEK_PROMPT}

Token Data:
${JSON.stringify(tokenData, null, 2)}`;

      const { object } = await generateObject({
        model: this.model,
        prompt,
        schema: this.predictionSchema,
      });
      console.log(object);
      return object;
    } catch (error) {
      console.error(`Error during token price prediction: ${error}`);
      return null;
    }
  }

  resetConversation() {
    this.messages = [];
  }
}

export const deepSeekService = new AiService();
