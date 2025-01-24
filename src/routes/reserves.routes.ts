import { ReservesController } from '@/controllers/reserves.controller'
import { Router } from 'express'

const router = Router()
const reservesController = new ReservesController()

router.get('/reserves', (req, res) => reservesController.getReserves(req, res))

export default router
