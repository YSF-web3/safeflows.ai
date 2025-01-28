export type Prediction = {
  [key: string]: {
    predictedPriceUsd: number
    predictedTrend: number[]
    lastCalculated: Date
  }
}

export interface PriceWithTimestamp {
  price: number;
  timestamp: string;
}