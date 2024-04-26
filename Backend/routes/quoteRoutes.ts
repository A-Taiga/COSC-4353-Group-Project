import express from 'express'
import {
  getDeliveryAddress,
  getFuelQuoteHistory,
  submitFuelQuote,
} from '../controllers/quoteController'
import verifyTokens from '../middlewares/verifyToken'

const quoteRouter = express.Router()

/* Route to submit a fuel quote */
quoteRouter.post('/', verifyTokens, submitFuelQuote)
quoteRouter.get(
  '/deliveryAddress',
  verifyTokens,
  getDeliveryAddress,
)

/* Route to get fuel quote history for a specific client */
quoteRouter.get(
  '/history',
  verifyTokens,
  getFuelQuoteHistory,
)

export default quoteRouter
