import { createNotificationSetting } from "@/db/actions/alert";
import { INotificationSettingDTO } from "@/db/types";
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
      const { userAddress } = req.query;
      console.log(userAddress);

      if (!userAddress) {
        res.json({ error: "No address provided" });
        return;
      }
      console.log(this);

      const notifiactions = await this.notificationsService.getNotifications(
        userAddress as string
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

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      console.log(userAddress);

      if (!userAddress) {
        res.json({ error: "No address provided" });
        return;
      }
      console.log(this);

      const notifiactions = await this.notificationsService.getNotifications(
        userAddress as string
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

  createNotification = async (req: Request, res: Response) => {
    console.log("Create Notifications");
    
    try {
      
      console.log(req.query);
      console.log(req.body);
      
      if (!req.body.address) {
        res.json({ error: "No address provided" });
        return;
      }

      if (!req.body.email) {
        res.json({ error: "No Email Provided" });
        return;
      }
      console.log(this);

      const notifiactions = await createNotificationSetting(
        req.body as INotificationSettingDTO
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
