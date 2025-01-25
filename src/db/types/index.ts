interface Collateral {
  mint: string;
  amount: number;
  value: number;
  pythPriceAccount: string;
}

interface Borrowed {
  mint: string;
  amount: number;
  value: number;
  pythPriceAccount: string;
}

export interface IPrediction {
  mint: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPosition {
  walletAddress: string;
  collateral: Collateral[];
  borrowed: Borrowed[];
  healthFactor: number;
  lastUpdated?: Date;
}

export interface IRiskScore {
  poolAddress: string;
  score: number;
  metrics: {
    ltv: number;
    volatility: number;
    liquidationEvents: number;
  };
  timestamp?: Date;
}

export interface Notification {
  walletAddress: string;
  type: "HEALTH_WARNING" | "HEALTH_CRITICAL" | "RISK_HIGH";
  message?: string;
  healthFactor?: number;
  timestamp?: Date;
  isRead?: boolean;
}

export enum NotificationType {
  HEALTH_WARNING = "HEALTH_WARNING",
  HEALTH_CRITICAL = "HEALTH_CRITICAL",
  RISK_HIGH = "RISK_HIGH",
}