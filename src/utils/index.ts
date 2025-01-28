import { Prediction } from "@/types/ai";

export const updateHappenedMoreThan1HourAgo = (lastUpdated: Date): boolean => {
    return lastUpdated.getTime() < Date.now() - 1000 * 60 * 60;
  };
  
  interface PriceWithTimestamp {
    price: number;
    timestamp: string;
  }
  
  
  
  interface PredictionResult {
    predictedPriceUsd: number;
    predictedTrend: PriceWithTimestamp[];
    lastCalculated: Date;
  }
  
  export function mapPredictionTrends(predictions: Prediction): { [key: string]: PredictionResult } {
    const result: { [key: string]: PredictionResult } = {};
  
    for (const [mint, prediction] of Object.entries(predictions)) {
      const { predictedTrend, lastCalculated, predictedPriceUsd } = prediction;
      const baseTimestamp = new Date(lastCalculated);
      
      const trendsWithTimestamps = predictedTrend.map((price: number, index: number) => {
        const timestamp = new Date(baseTimestamp);
        timestamp.setHours(timestamp.getHours() + index);
        
        return {
          price,
          timestamp: timestamp.toISOString()
        };
      });
  
      result[mint] = {
        predictedPriceUsd,
        predictedTrend: trendsWithTimestamps,
        lastCalculated: lastCalculated
      };
    }
  
    return result;
  }