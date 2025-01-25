import { PricesController } from '@/controllers/prices.controller'
import { Router } from 'express'

const router = Router()
const pricesController = new PricesController()

router.get('/prices', (req, res) => pricesController.getPrices(req, res))
router.get('/predictions', (req, res) => pricesController.getPredictions(req, res))

export default router
