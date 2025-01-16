import mongoose from "mongoose";
import { config } from "./index";
import logger from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB successfully");

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

const PositionSchema = new mongoose.Schema({
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

const AlertSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["HEALTH_WARNING", "HEALTH_CRITICAL", "RISK_HIGH"],
    required: true,
  },
  message: String,
  healthFactor: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const RiskScoreSchema = new mongoose.Schema({
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

export const Position = mongoose.model("Position", PositionSchema);
export const Alert = mongoose.model("Alert", AlertSchema);
export const RiskScore = mongoose.model("RiskScore", RiskScoreSchema);

export const createPosition = async (positionData: any) => {
  const position = new Position(positionData);
  return await position.save();
};

export const updatePosition = async (
  walletAddress: string,
  positionData: any
) => {
  return await Position.findOneAndUpdate({ walletAddress }, positionData, {
    new: true,
    upsert: true,
  });
};

export const createAlert = async (alertData: any) => {
  const alert = new Alert(alertData);
  return await alert.save();
};

export const updateRiskScore = async (poolAddress: string, scoreData: any) => {
  return await RiskScore.findOneAndUpdate({ poolAddress }, scoreData, {
    new: true,
    upsert: true,
  });
};

export const db = {
  createPosition,
  updatePosition,
  createAlert,
  updateRiskScore,
  Position,
  Alert,
  RiskScore,
};
