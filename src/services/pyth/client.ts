import { PythPriceService } from "./price";

export class Client {
  private pythService: PythPriceService;

  constructor() {
    this.pythService = new PythPriceService();
  }

  async getAssetPrice(priceAccount: string): Promise<number> {
    try {
      return await this.pythService.getPrice(priceAccount);
    } catch (error) {
      console.error("Error getting asset price:", error);
      throw error;
    }
  }

  async getAssetPriceWithConfidence(
    priceAccount: string
  ): Promise<{ price: number; confidence: number }> {
    try {
      return await this.pythService.getPriceWithConfidence(priceAccount);
    } catch (error) {
      console.error("Error getting asset price with confidence:", error);
      throw error;
    }
  }
}
