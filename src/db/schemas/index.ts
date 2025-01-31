import mongoose from "mongoose";
import { number } from "zod";
import { INotification } from "@/db/types"

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

export const NotificationSettingSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: true,
  },
  collateralThreshold: {
    type: Number,
    required: true,
    default: 0
  },
  healthThreshold: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  oneTime: {
    type: String,
    required: true,
    index: true,
  },
  active: {
    type: String,
    required: false,
    default: true

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notifications: {
    type: [
      {
        walletAddress: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["HEALTH_WARNING", "HEALTH_CRITICAL", "RISK_HIGH"],
          required: true,
        },
        message: {
          type: String,
        },
        healthFactor: {
          type: Number,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
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
    unique: true
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
  predictedTrend: {
    type: Array<number>,
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const AISummarySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  analysis: {
    type: String,
    required: false,
  },
  warnings: {
    type: Array<String>,
    required: false,
  },
  suggestions: {
    type: Array<String>,
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
