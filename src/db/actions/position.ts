import { Position } from "@/db/models"
import { IPosition } from "@/db/types"

export const createPosition = async (positionData: IPosition) => {
	const position = new Position(positionData)
	return await position.save()
}

export const updatePosition = async (walletAddress: string, positionData: IPosition) => {
	return await Position.findOneAndUpdate({ walletAddress }, positionData, {
		new: true,
		upsert: true,
	})
}
