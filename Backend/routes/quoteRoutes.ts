import express from 'express';
import { submitFuelQuote } from '../controllers/quoteController';
import verifyTokens from '../middlewares/verifyToken'

const router = express.Router()

router.post('/', submitFuelQuote)

export default router;
