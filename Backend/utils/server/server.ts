import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import errorHandler from '../../middlewares/errorHandler'
import loginRouter from '../../routes/loginRoutes'
import profileRouter from '../../routes/profileRoutes'
import quoteRouter from '../../routes/quoteRoutes'
import pricingRouter from '../../routes/pricingRoutes'

const createServer = () => {
  const app = express()
  // MIDDLEWARE
  // app.use(cors(corsOptions))
  app.use(cors())
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
  app.use(`${baseURL}/profile-management`, profileRouter)
  app.use(express.json(), quoteRouter);
  app.use(`${baseURL}/pricing`, pricingRouter)
  app.use(errorHandler)

  return app
}

export default createServer
