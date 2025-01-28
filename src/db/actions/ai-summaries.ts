import { AISummary } from "@/db/models"
import { ISummary } from "@/db/types"

export const createSummary = async (summaryData: ISummary) => {
	const position = new AISummary(summaryData)
	return await position.save()
}

export const updateSummary = async (address: string, summaryData: ISummary) => {
	return await AISummary.findOneAndUpdate({ address }, summaryData, {
		new: true,
		upsert: true,
	})
}
