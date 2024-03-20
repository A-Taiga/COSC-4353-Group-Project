import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import { connectDB } from './config/db'
import errorHandler from './middlewares/errorHandler'
import loginRouter from './routes/loginRoutes'
import profileRouter from './routes/profileRoutes'

// const __filename = fileURLToPath(import.meta.url)
// export const __dirname = path.dirname(__filename)
// dotenv.config({ path: path.join(__dirname, '/.env') })
dotenv.config()

// PORT
// If the port defined in dotenv file doesn't exist, default to 8080
const PORT = process.env.PORT || '8080'

// APP
const app = express()

app.listen(PORT, async () => {
  //   await connectDB()
  console.log(`Server is running on port: ${PORT}`)
})

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
app.use(`/api/profile`, profileRouter)
app.use(errorHandler)


export default app