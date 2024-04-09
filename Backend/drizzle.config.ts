import type { Config } from 'drizzle-kit'

export default {
  schema: './schemas/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.PGHOST || '',
    user: process.env.PGUSER || '',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGHDATABASE || '',
    port: parseInt(process.env.PGPORT ?? '5432', 10),
    ssl: true,
  },
} as Config
