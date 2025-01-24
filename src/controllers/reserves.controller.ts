import { ReservesService } from '@/services/reserves'
import { Request, Response } from 'express'

export class ReservesController {
	private reservesService: ReservesService

	constructor() {
		this.reservesService = new ReservesService()
	}

	async getReserves(req: Request, res: Response) {
		try {
			const { market } = req.query

			if (!market) {
				res.json({ error: 'No wallet provided' })
				return
			}

			const { reserves, lastUpdatedSlot } = await this.reservesService.getReserves(
				market as string
			)

			res.json({
				reserves,
        lastUpdatedSlot,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch reserves' })
		}
	}
}
