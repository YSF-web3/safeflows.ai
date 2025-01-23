import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5003,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/safeflows",
  solanaRpc: process.env.SOLANA_RPC || "https://api.devnet.solana.com",
  solendProgramId: process.env.SOLEND_PROGRAM_ID || "So1endD1dNtR3a11yM4k3Th",
};
