import { RiskScore } from "@/db/models"

export const updateRiskScore = async (poolAddress: string, scoreData: any) => {
	return await RiskScore.findOneAndUpdate({ poolAddress }, scoreData, {
		new: true,
		upsert: true,
	})
}
