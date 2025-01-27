import mongoose from "mongoose";

export const PositionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
  },
  collateral: [
    {
      mint: String,
      amount: Number,
      value: Number,
      pythPriceAccount: String,
    },
  ],
  borrowed: [
    {
      mint: String,
      amount: Number,
      value: Number,
      pythPriceAccount: String,
    },
  ],
  healthFactor: Number,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const RiskScoreSchema = new mongoose.Schema({
  poolAddress: {
    type: String,
    required: true,
  },
  score: Number,
  metrics: {
    ltv: Number,
    volatility: Number,
    liquidationEvents: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const PredictionSchema = new mongoose.Schema({
  mint: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
