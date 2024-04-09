import dotenv from 'dotenv'
import { connectDB } from './configs/dbConnection'
import createServer from './utils/server/server'

dotenv.config()

// PORT
// If the port defined in dotenv file doesn't exist, default to 8080
const PORT = process.env.PORT || '8080'

// APP
const app = createServer()
app.listen(PORT, async () => {
  await connectDB()
  console.log(`Server is running on port: ${PORT}`)
})

export default app
