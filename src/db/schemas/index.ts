import mongoose from "mongoose"

export const PositionSchema = new mongoose.Schema({
	walletAddress: {
		type: String,
		required: true,
		index: true,
	},
	collateral: [
		{
			mint: String,
			amount: Number,
			value: Number,
			pythPriceAccount: String,
		},
	],
	borrowed: [
		{
			mint: String,
			amount: Number,
			value: Number,
			pythPriceAccount: String,
		},
	],
	healthFactor: Number,
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
})

export const AlertSchema = new mongoose.Schema({
	walletAddress: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ['HEALTH_WARNING', 'HEALTH_CRITICAL', 'RISK_HIGH'],
		required: true,
	},
	message: String,
	healthFactor: Number,
	timestamp: {
		type: Date,
		default: Date.now,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
})

export const RiskScoreSchema = new mongoose.Schema({
	poolAddress: {
		type: String,
		required: true,
	},
	score: Number,
	metrics: {
		ltv: Number,
		volatility: Number,
		liquidationEvents: Number,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
})
