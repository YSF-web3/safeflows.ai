interface Position {
  // What you've deposited
  collateral: {
    amount: number; // e.g., 10 SOL
    currentPrice: number; // e.g., $100 per SOL
    totalValue: number; // e.g., $1000
  };

  // What you've borrowed
  borrowed: {
    amount: number; // e.g., 500 USDC
    totalValue: number; // e.g., $500
  };

  // Health metrics
  healthFactor: number; // e.g., 2.0 (safe) or 1.2 (risky)
  liquidationThreshold: number; // e.g., 80%
}
