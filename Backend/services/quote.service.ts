import { db } from '../configs/dbConnection';
import { fuelQuotes } from '../schemas/schema'; // Import your Drizzle schema
import {IFuelQuoteData} from '../models/quote.model'


/**
 * Inserts a new fuel quote into the database.
 * @param {Object} quoteData The validated fuel quote data.
 * @returns The inserted fuel quote record.
 */
export async function insertFuelQuote(quoteData: IFuelQuoteData): Promise<any> {
    const insertedQuote = await db.table(fuelQuotes).insert(quoteData).returning('*').execute();
    return insertedQuote[0]; // Assuming returning the first record is sufficient
}