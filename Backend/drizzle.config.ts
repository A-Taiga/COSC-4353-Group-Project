import type { Config } from 'drizzle-kit'

export default {
  schema: './schemas/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.MYSQL_HOST || '',
    user: process.env.MYSQL_USER || '',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || '',
    port: parseInt(process.env.MYSQL_PORT ?? '5432', 10),
    ssl: true,
  },
} as Config
