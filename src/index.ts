import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "@/config";
import healthRoutes from "@/routes/health.routes";
import { connectDatabase } from "@/config/database";
// import riskRoutes from "@/routes/risk.routes";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

const startServer = async () => {
  // Connect to database
  // await connectDatabase();

  // Start express server
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer().catch(console.error);
