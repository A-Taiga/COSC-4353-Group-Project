import { relations, sql } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import {
  createInsertSchema,
  createSelectSchema,
} from 'drizzle-zod'

// Drizzle DOCUMENATION: https://orm.drizzle.team/docs/get-started-postgresql

// Define users tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', {
    length: 256,
  })
    .notNull()
    .unique(),
  password: varchar('password', {
    length: 60,
  }).notNull(), // bcrypt generates a 60-character string,
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

// Define user_profiles table
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  firstName: varchar('first_name', {
    length: 256,
  }).notNull(),
  lastName: varchar('last_name', {
    length: 256,
  }).notNull(),
  addressOne: varchar('address_one', {
    length: 256,
  }).notNull(),
  addressTwo: varchar('address_two', {
    length: 256,
  }),
  city: varchar('city', {
    length: 256,
  }).notNull(),
  state: varchar('state', {
    enum: [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
    ],
  }).notNull(),
  zip: varchar('zip', {
    length: 20,
  }).notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

// Define fuel_quotes table
export const fuelQuotes = pgTable('fuel_quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  gallonsRequested: varchar('gallons_requested', {
    length: 256,
  }).notNull(),
  deliveryDate: timestamp('delivery_date').notNull(),
  deliveryAddress: varchar('delivery_address', {
    length: 256,
  }).notNull(),
  suggestedPrice: varchar('suggested_price', {
    length: 256,
  }).notNull(),
  totalPrice: varchar('total_price', {
    length: 256,
  }).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

// Define session table
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }), // Refers to the users table provided in the code
  fingerprint: varchar('fingerprint', {
    length: 256,
  }).notNull(), // A unique identifier for the device
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
})

// Define all relations
export const userRelations = relations(
  users,
  ({ one, many }) => ({
    profile: one(userProfiles, {
      fields: [users.id],
      references: [userProfiles.userId],
    }),
    fuelQuotes: many(fuelQuotes),
    sessions: many(sessions),
  }),
)

export const profileRelations = relations(
  userProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [userProfiles.userId],
      references: [users.id],
    }),
  }),
)

export const fuelQuotesRelations = relations(
  fuelQuotes,
  ({ one }) => ({
    user: one(users, {
      fields: [fuelQuotes.userId],
      references: [users.id],
    }),
  }),
)

export const sessionRelations = relations(
  sessions,
  ({ one }) => ({
    user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
    }),
  }),
)

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i


export const insertUserProfileSchema = createInsertSchema(userProfiles)
export const selectUserProfileSchema = createSelectSchema(userProfiles)
export const insertFuelQuoteSchema = createInsertSchema(fuelQuotes)
export const selectFuelQuoteSchema = createSelectSchema(fuelQuotes)
