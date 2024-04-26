import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import corsOptions from '../../configs/corsOptions'
import errorHandler from '../../middlewares/errorHandler'
import loginRouter from '../../routes/loginRoutes'
import logoutRouter from '../../routes/logoutRoutes'
import pricingRouter from '../../routes/pricingRoutes'
import profileRouter from '../../routes/profileRoutes'
import quoteRouter from '../../routes/quoteRoutes'
import refreshRouter from '../../routes/refreshRoutes'
import registerRouter from '../../routes/registerRoutes'
const createServer = () => {
  const app = express()
  // MIDDLEWARE

  app.use(cors(corsOptions))
  // app.use(cors())

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
  app.use(`${authURL}/logout`, logoutRouter)
  app.use(`${baseURL}/profile-management`, profileRouter)
  app.use(`${baseURL}/fuelQuote`, quoteRouter)
  app.use(`${baseURL}/pricing`, pricingRouter)
  app.use(`${baseURL}/refresh`, refreshRouter)
  app.use(errorHandler)

  return app
}

export default createServer
