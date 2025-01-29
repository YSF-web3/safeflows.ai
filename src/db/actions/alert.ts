import { NotificationSetting, Position } from "@/db/models"
import { INotification, INotificationSettingDTO, IPosition } from "@/db/types"


export const getNotificationSettings = async (address: string) => {
	const notificationSettings = await NotificationSetting.find({
		address: address
	})

	return notificationSettings
	
	
}

export const createNotificationSetting = async (notifications: INotificationSettingDTO) => {
	const notificationSetting = new NotificationSetting(notifications)
	return await notificationSetting.save()
}

export const updatePosition = async (id: string, positionData: IPosition) => {
	// return await NotificationSetting.findOneAndUpdate({ _id:id }, positionData, {
	// 	new: true,
	// 	upsert: true,
	// })
}


export const deleteNotificationSetting = async (walletAddress: string) => {
	return await NotificationSetting.findOneAndDelete({ walletAddress });
  };

export const addNotification = async (walletAddress: string, notification: INotification) => {
	return await Position.findOneAndUpdate(
	  { walletAddress },
	  { $push: { notifications: notification } },
	  { new: true, upsert: true }
	);
  };
  