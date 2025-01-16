import { Alert } from "@/db/models"

export const createAlert = async (alertData: any) => {
	const alert = new Alert(alertData)
	return await alert.save()
}
