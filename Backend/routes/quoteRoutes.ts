/*
import express from 'express';
import { submitFuelQuote } from '../controllers/quoteController';
import verifyTokens from '../middlewares/verifyToken'

const router = express.Router()

// router.post('/', verifyTokens, submitFuelQuote)
router.post('/', submitFuelQuote)

export default router;
*/

import express from 'express';
import { submitFuelQuote, getFuelQuoteHistory } from '../controllers/quoteController';
import verifyTokens from '../middlewares/verifyToken';

const router = express.Router();

/* Route to submit a fuel quote */
// router.post('/', verifyTokens, submitFuelQuote)
router.post('/', submitFuelQuote)

/* Route to get fuel quote history for a specific client */
router.get('/fuelquote/history/:clientId', getFuelQuoteHistory);

export default router;
