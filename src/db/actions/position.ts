import { Position } from "@/db/models"

export const createPosition = async (positionData: any) => {
	const position = new Position(positionData)
	return await position.save()
}

export const updatePosition = async (walletAddress: string, positionData: any) => {
	return await Position.findOneAndUpdate({ walletAddress }, positionData, {
		new: true,
		upsert: true,
	})
}
