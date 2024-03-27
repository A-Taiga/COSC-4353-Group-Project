import express from 'express';
import { submitFuelQuote } from '../controllers/quoteController';

const router = express.Router();

router.post('/api/fuelQuote', submitFuelQuote);

export default router;
