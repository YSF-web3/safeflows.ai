import { NotificationsService } from "@/services/notifications";
import { Request, Response } from "express";

export class NotificationsController {
  private notificationsService: NotificationsService;

  constructor() {
    console.log("Notifications service instantiated");

    this.notificationsService = new NotificationsService();
  }

  getNotifications = async (req: Request, res: Response) => {
    try {
      const { address } = req.query;
      console.log(req.query);

      if (!address) {
        res.json({ error: "No address provided" });
        return;
      }
      console.log(this);

      const notifiactions = await this.notificationsService.getNotifications(
        address as string
      );

      res.json({
        notifiactions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to fetch notifiactions" });
    }
  };
}
