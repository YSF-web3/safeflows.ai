import mongoose from "mongoose"
import { PositionSchema, RiskScoreSchema, PredictionSchema, AISummarySchema } from '@/db/schemas'
import { IPosition, IRiskScore, IPrediction, ISummary } from "@/db/types"


export const Position = mongoose.model<IPosition>('Position', PositionSchema)
export const RiskScore = mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema)
export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema)
export const AISummary = mongoose.model<ISummary>('AISummary',AISummarySchema )
