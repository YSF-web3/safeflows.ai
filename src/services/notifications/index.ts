import { Notification } from "@/db/types";

export class NotificationsService {
  constructor() {}

  async getNotifications(address: string): Promise<Notification[]> {
    let notifications: Notification[] = [];

    return notifications;
  }
}
