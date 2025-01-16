import { Request, Response } from 'express'
import { HealthMonitorService } from '@/services/health/monitor'

export class HealthController {
	private healthService: HealthMonitorService

	constructor() {
		this.healthService = new HealthMonitorService()
	}

	async getHealth(req: Request, res: Response) {
		try {
			const { walletAddress } = req.params

			const healthFactor = await this.healthService.calculateHealthFactor(walletAddress)
			const riskLevel = this.healthService.getRiskLevel(healthFactor)

			res.json({
				walletAddress,
				healthFactor,
				riskLevel,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch health data' })
		}
	}
}
