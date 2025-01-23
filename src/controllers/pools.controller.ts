import { PoolsService } from '@/services/pools'
import { Request, Response } from 'express'

export class PoolsController {
  private poolsService: PoolsService

  constructor() {
    this.poolsService = new PoolsService()
  }

  async getPools(req: Request, res: Response) {
    try {
      const { wallet } = req.query

      if (!wallet) {
        res.json({ error: 'No wallet provided' })
        return
      }

      const pools = await this.poolsService.getPools(wallet as string)

      res.json({
        pools,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pools' })
    }
  }
}
