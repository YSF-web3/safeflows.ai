import mongoose from 'mongoose'
import { config } from '@/config'
import logger from '@/utils/logger'

export const connectDatabase = async (): Promise<void> => {
	try {
		await mongoose.connect(config.mongoUri)
		logger.info('Connected to MongoDB successfully')

		mongoose.connection.on('error', error => {
			logger.error('MongoDB connection error:', error)
		})

		mongoose.connection.on('disconnected', () => {
			logger.warn('MongoDB disconnected')
		})

		mongoose.connection.on('reconnected', () => {
			logger.info('MongoDB reconnected')
		})
	} catch (error: any) {
		logger.error('Failed to connect to MongoDB:', error)
		process.exit(1)
	}
}
