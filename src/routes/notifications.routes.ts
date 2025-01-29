import { NotificationsController } from "@/controllers/notifications.controller";
import { Router } from "express";

const router = Router();
const notificationsController = new NotificationsController();
console.log(notificationsController);

router.get("/", notificationsController.getNotifications);
router.post("/", notificationsController.createNotification);

export default router;
