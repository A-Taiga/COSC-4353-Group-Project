import express from 'express';
import { calculatePrice } from '../controllers/pricingController';
import verifyTokens from '../middlewares/verifyToken'

const router = express.Router()

router
  .route('/calculate-price')
  .get(verifyTokens, calculatePrice)

export default router;
