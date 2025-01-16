interface PoolRisk {
  // Current pool metrics
  metrics: {
    totalDeposits: number; // e.g., 1000000 USDC
    totalBorrows: number; // e.g., 800000 USDC
    utilizationRate: number; // e.g., 80%
    liquidationEvents24h: number; // e.g., 5
    averageLTV: number; // e.g., 65%
  };

  // Risk factors
  riskFactors: {
    // Higher utilization = higher risk
    utilizationRisk: number; // 0-100

    // More liquidations = higher risk
    liquidationRisk: number; // 0-100

    // Asset volatility
    volatilityRisk: number; // 0-100

    // Overall score
    totalRiskScore: number; // 0-100
  };
}
