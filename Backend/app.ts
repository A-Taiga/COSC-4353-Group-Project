import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import { connectDB } from './config/db'

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
app.use(`${authURL}/login`)
