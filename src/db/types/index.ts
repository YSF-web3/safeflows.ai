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
  predictedTrend: number[];
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


export interface INotificationSetting {
  collateralThreshold: number
  description: string
  email: string
  oneTime:boolean
  healthThreshold:number
  createdAt: Date
  notificatiosn: INotification[]
}

export interface INotificationSettingDTO {
  address: Date,
  collateralThreshold: number
  description: string
  email: string
  oneTime:boolean
  healthThreshold:number
}




export interface INotification {
  walletAddress: string;
  type: "HEALTH_WARNING" | "HEALTH_CRITICAL" | "RISK_HIGH";
  message?: string;
  healthFactor?: number;
  timestamp?: Date;
  isRead?: boolean;
}

export interface ISummary {
  address:string,
  analysis:string
  warnings:string[],
  suggestions:string[],
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  HEALTH_WARNING = "HEALTH_WARNING",
  HEALTH_CRITICAL = "HEALTH_CRITICAL",
  RISK_HIGH = "RISK_HIGH",
}

