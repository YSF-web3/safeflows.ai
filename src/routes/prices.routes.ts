import { PricesController } from '@/controllers/prices.controller'
import { Router } from 'express'

const router = Router()
const pricesController = new PricesController()

router.get('/prices', (req, res) => pricesController.getPrices(req, res))

export default router
