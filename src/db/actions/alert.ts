import { Alert } from "@/db/models"
import { IAlert } from "@/db/types"

export const createAlert = async (alertData: IAlert) => {
	const alert = new Alert(alertData)
	return await alert.save()
}
