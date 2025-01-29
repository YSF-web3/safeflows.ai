import { createNotificationSetting,  getNotificationSettings } from "@/db/actions/alert";


export class NotificationsService {
  constructor() {}

  async getNotifications(address: string): Promise<Notification[]> {
    let notifications: any = await getNotificationSettings(address);;

    console.log(notifications);
    
    return notifications
    
  }
}
