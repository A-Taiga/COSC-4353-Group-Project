import { eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '../configs/dbConnection'
import { fuelQuotes } from '../schemas/schema'
import { FuelQuoteInsertSchema } from '../types/type'

type FuelQuoteData = z.infer<typeof FuelQuoteInsertSchema>

// Insert the fuel quote into the database
export const createFuelQuote = async (
  fuelQuoteData: FuelQuoteData,
): Promise<FuelQuoteData> => {
  // Validate the input data using Zod schema
  const result =
    FuelQuoteInsertSchema.safeParse(fuelQuoteData)

  // Check if the request is valid
  if (!result.success) throw new Error('Validation failed.')

  // Insert the fuel quote into the database
  const queryResult = await db
    .insert(fuelQuotes)
    .values({
      ...result.data,
    })
    .returning()

  const newFuelQuote: FuelQuoteData = queryResult[0]
  console.log('Newly Created Fuel Quote:\n', newFuelQuote)

  return newFuelQuote
}

export const getFuelQuotes = async (
  clientId: string,
): Promise<[FuelQuoteData]> => {
  // Query the database for fuel quote history for the client
  const result = await db
    .select()
    .from(fuelQuotes)
    .where(eq(fuelQuotes.userId, clientId))

  console.log('Fuel Quote History:\n', result)
  return result
}
