import { PricesService } from '@/services/prices'
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
}
