import { PricesService } from '@/services/prices'
import { mapPredictionTrends } from '@/utils'

import { Request, Response } from 'express'

export class PricesController {
	private pricesService: PricesService

	constructor() {
		this.pricesService = new PricesService()
	}

	async getPrices(req: Request, res: Response) {
		try {
			const { symbols } = req.query

			if (!symbols) {
				res.json({ error: 'No symbols provided' })
				return
			}

			const prices = await this.pricesService.getPrices(symbols as string)

			res.json({
				prices,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch prices' })
		}
	}



	async getPredictions(req: Request, res: Response) {
		try {
			const { mints } = req.query

			if (!mints) {
				res.json({ error: 'No mint addresses provided' })
				return
			}

			const predictions = await this.pricesService.getPredictions(
				(mints as string).split(',')
			)


			const mappedPredictions = mapPredictionTrends(predictions)
			
			res.json({
				predictions:mappedPredictions,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			console.log(error);
			
			res.status(500).json({ error: 'Failed to fetch predictions' })
		}
	}
}
