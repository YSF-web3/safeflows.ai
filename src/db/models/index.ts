import mongoose from "mongoose"
import { PositionSchema, AlertSchema, RiskScoreSchema } from '@/db/schemas'
import { IAlert, IPosition, IRiskScore } from "@/db/types"


export const Position = mongoose.model<IPosition>('Position', PositionSchema)
export const Alert = mongoose.model<IAlert>('Alert', AlertSchema)
export const RiskScore = mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema)
