import { NotificationsController } from "@/controllers/notifications.controller";
import { Router } from "express";

const router = Router();
const notificationsController = new NotificationsController();
console.log(notificationsController);

router.get("/", notificationsController.getNotifications);

export default router;
