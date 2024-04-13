import express from 'express';
import { calculatePrice } from '../controllers/pricingController'

const router = express.Router()

router
  .route('/calculate-price')
  // .get(verifyTokens, calculatePrice)
  .get(calculatePrice)

export default router;
