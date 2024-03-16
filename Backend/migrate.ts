import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pkg from 'pg'

const { Pool } = pkg
dotenv.config()

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: parseInt(process.env.PGPORT ?? '5432', 10),
  ssl: true,
})

const db = drizzle(pool)

const main = async () => {
  console.log('migration started...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('migration ended...')
  await pool.end()
  process.exit(0)
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
