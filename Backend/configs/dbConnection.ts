import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
import * as schema from '../schemas/schema'
const { Client } = pkg

dotenv.config()

// Declare db and blobServiceClient at module scope
let db: any
let client: any

const connectDB = async (error: boolean = false) => {
  try {
    // Connect to Postgres
    client = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGHDATABASE,
      port: parseInt(process.env.PGPORT as string, 10),
      // Azure requires SSL connection.
      // For production, consider using more secure settings.
      ssl: {
        rejectUnauthorized: false,
      },
    })

    client.connect()

    if (error) throw new Error('Test connection failed')

    db = drizzle(client, { schema: schema })
  } catch (err) {
    if (err instanceof Error)
      console.log(`Error: ${err.message}`)
    process.exit(1)
  }
}

export { client, connectDB, db }

