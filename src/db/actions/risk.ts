import { RiskScore } from "@/db/models"
import { IRiskScore } from "@/db/types"

export const updateRiskScore = async (poolAddress: string, scoreData: IRiskScore) => {
	return await RiskScore.findOneAndUpdate({ poolAddress }, scoreData, {
		new: true,
		upsert: true,
	})
}
