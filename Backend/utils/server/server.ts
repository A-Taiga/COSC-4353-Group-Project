import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import errorHandler from '../../middlewares/errorHandler'
import loginRouter from '../../routes/loginRoutes'
import pricingRouter from '../../routes/pricingRoutes'
import profileRouter from '../../routes/profileRoutes'
import quoteRouter from '../../routes/quoteRoutes'
import registerRouter from '../../routes/registerRoutes'

const createServer = () => {
  const app = express()
  // MIDDLEWARE
  // app.use(cors(corsOptions))
  app.use(cors({
    origin: 'http://localhost:5173'  
  }))
  app.use(express.json())
  app.use(
    express.urlencoded({
      extended: true,
    }),
  )
  app.use(cookieParser())
  const baseURL = '/api'
  const authURL = `${baseURL}/auth`

  // ROUTES
  app.use(`${authURL}/login`, loginRouter)
  app.use(`${authURL}/register`, registerRouter)
  app.use(`${baseURL}/profile-management`, profileRouter)
  app.use(`${baseURL}/fuelQuote`, quoteRouter)
  app.use(`${baseURL}/pricing`, pricingRouter)
  app.use(errorHandler)

  return app
}

export default createServer
