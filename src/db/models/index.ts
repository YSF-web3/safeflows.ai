import mongoose from "mongoose"
import { PositionSchema, RiskScoreSchema, PredictionSchema } from '@/db/schemas'
import { IPosition, IRiskScore, IPrediction } from "@/db/types"


export const Position = mongoose.model<IPosition>('Position', PositionSchema)
export const RiskScore = mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema)
export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema)
