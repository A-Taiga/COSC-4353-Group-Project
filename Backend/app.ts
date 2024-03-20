import dotenv from 'dotenv'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import { connectDB } from './config/db'
import createServer from './utils/server/server'

// const __filename = fileURLToPath(import.meta.url)
// export const __dirname = path.dirname(__filename)
// dotenv.config({ path: path.join(__dirname, '/.env') })
dotenv.config()

// PORT
// If the port defined in dotenv file doesn't exist, default to 8080
const PORT = process.env.PORT || '8080'

// APP
const app = createServer()
app.listen(PORT, async () => {
  //   await connectDB()
  console.log(`Server is running on port: ${PORT}`)
})

export default app
