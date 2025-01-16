import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

const router = Router();
const healthController = new HealthController();

router.get("/position/:walletAddress", (req, res) =>
  healthController.getHealth(req, res)
);

export default router;
