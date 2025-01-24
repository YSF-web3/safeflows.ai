import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from '@/config'
import { healthRouter, pricesRouter, poolsRouter, reservesRouter } from '@/routes'
import { connectDatabase } from '@/db'
import logger from '@/utils/logger'

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter)
app.use('/api', pricesRouter, poolsRouter, reservesRouter)

const startServer = async () => {
  // Connect to database
  // await connectDatabase()

  // Start express server
  app.listen(config.port, () => {
    logger.info(`Server is running on http://localhost:${config.port}`);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
