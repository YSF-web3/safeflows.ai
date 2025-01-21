import { Connection, PublicKey } from "@solana/web3.js";
import { PriceStatus, parsePriceData } from "@pythnetwork/client";
import { config } from "@/config";

export class PythPriceService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(config.solanaRpc);
  }

  async getPrice(priceAccount: string): Promise<number> {
    try {
      const account = new PublicKey(priceAccount);
      const accountInfo = await this.connection.getAccountInfo(account);

      if (!accountInfo) {
        throw new Error("Price account not found");
      }

      const priceData = parsePriceData(accountInfo.data);

      // Check if the price is valid
      if (priceData.price && priceData.status === PriceStatus.Trading) {
        // Return the price in a human-readable format
        return priceData.price * Math.pow(10, priceData.exponent);
      } else {
        throw new Error("Price is not valid");
      }
    } catch (error) {
      console.error("Error fetching Pyth price:", error);
      throw error;
    }
  }

  async getPriceWithConfidence(priceAccount: string): Promise<{
    price: number;
    confidence: number;
  }> {
    try {
      const account = new PublicKey(priceAccount);
      const accountInfo = await this.connection.getAccountInfo(account);

      if (!accountInfo) {
        throw new Error("Price account not found");
      }

      const priceData = parsePriceData(accountInfo.data);

      if (
        priceData.price &&
        priceData.confidence &&
        priceData.status === PriceStatus.Trading
      ) {
        const price = priceData.price * Math.pow(10, priceData.exponent);
        const confidence =
          priceData.confidence * Math.pow(10, priceData.exponent);

        return { price, confidence };
      } else {
        throw new Error("Price or confidence is not valid");
      }
    } catch (error) {
      console.error("Error fetching Pyth price with confidence:", error);
      throw error;
    }
  }
}
