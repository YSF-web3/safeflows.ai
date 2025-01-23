import { PoolsController } from '@/controllers/pools.controller'
import { Router } from 'express'

const router = Router()
const poolsController = new PoolsController()

router.get('/pools', (req, res) => poolsController.getPools(req, res))

export default router
