import { Connection, PublicKey } from "@solana/web3.js";
import { config } from "../../config";

export class SolendClient {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(config.solanaRpc);
  }

  async getUserPosition(walletAddress: string): Promise<UserPosition> {
    const userWallet = new PublicKey(walletAddress);
    const programId = new PublicKey(config.solendProgramId);

    // Get user's obligation account (lending position)
    const [obligationAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("obligation"), userWallet.toBuffer()],
      programId
    );

    const accountInfo = await this.connection.getAccountInfo(obligationAccount);

    // Implement parsing logic for the obligation account data
    // This is a simplified example
    return {
      walletAddress,
      collateral: [],
      borrowed: [],
      healthFactor: 0,
    };
  }
}
