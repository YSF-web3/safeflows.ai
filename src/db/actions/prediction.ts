import { Prediction } from '@/db/models'

export const getPrediction = async (mint: string) => {
	return await Prediction.findOne({ mint })
}

export const updatePrediction = async (mint: string, price: number) => {
  return await Prediction.updateOne({ mint }, { price, updatedAt: new Date() })
}

export const createPrediction = async (mint: string, price: number) => {
  return await Prediction.create({ mint, price })
}