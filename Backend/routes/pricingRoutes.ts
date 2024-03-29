import express from 'express';
import { calculatePrice } from '../controllers/pricingController';

const router = express.Router();

router.get('/calculate-price', calculatePrice);

export default router;
