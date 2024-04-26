import express from 'express';
import { calculatePrice } from '../controllers/pricingController'
import verifyToken from '../middlewares/verifyToken'
const pricingRouter = express.Router()

pricingRouter.route('/').post(verifyToken, calculatePrice)

export default pricingRouter
