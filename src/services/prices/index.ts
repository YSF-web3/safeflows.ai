import {
  createPrediction,
  getPrediction,
  updatePrediction,
} from "@/db/actions/prediction";
import { Prediction } from "@/types/ai";
import { Price } from "@/types/solend";
import { openAiService } from "../ai";

type SolendPriceResponse = {
  symbol: string;
  price: string;
  mint: string;
  identifier: string;
};

type SolendPricesResponse = {
  results: SolendPriceResponse[];
};

const updateHappenedMoreThan1HourAgo = (lastUpdated: Date): boolean => {
  return lastUpdated.getTime() < Date.now() - 1000 * 60 * 60;
};

export class PricesService {
  private solendPricesUrl: string;
  private dexScreenerUrl: string;

  constructor() {
    this.solendPricesUrl =
      process.env.SOLEND_GLOBAL_API! + "/v1/prices?symbols=";
    this.dexScreenerUrl = process.env.DEXSCREENER_API! + "/latest/dex/tokens/";
  }

  async getPrices(symbols: string): Promise<Price[]> {
    let prices: Price[] = [];

    const response = await fetch(this.solendPricesUrl + symbols);

    const { results } = (await response.json()) as SolendPricesResponse;

    prices = results.map((result) => {
      return {
        price: parseFloat(result.price),
        symbol: result.symbol,
        mint: result.mint,
      };
    });

    return prices;
  }

  async getPredictions(mints: string[]): Promise<Prediction> {
    let predictions: Prediction = {};

    for (const mint of mints) {
      const predictionExists = await getPrediction(mint);

      if (
        !predictionExists ||
        (predictionExists &&
          updateHappenedMoreThan1HourAgo(predictionExists.updatedAt))
      ) {
        const response = await fetch(this.dexScreenerUrl + mint);
        const { pairs } = await response.json();

        if (!pairs) continue;

        const {
          baseToken,
          priceUsd,
          txns,
          volume,
          priceChange,
          liquidity,
          fdv,
        } = pairs[0];

        const tokenData = {
          ...baseToken,
          priceUsd: Number(priceUsd),
          txns,
          volume,
          priceChange,
          liquidity,
          fdv,
        };

        const prediction: { predictedPriceUsd: number } | null =
          await openAiService.newThread("1", JSON.stringify(tokenData));

        if (!prediction) continue;

        predictions[mint] = prediction.predictedPriceUsd;

        if (predictionExists) {
          await updatePrediction(mint, predictions[mint]);
        } else {
          await createPrediction(mint, predictions[mint]);
        }
      } else {
        predictions[mint] = predictionExists.price;
      }
    }

    return predictions;
  }
}
