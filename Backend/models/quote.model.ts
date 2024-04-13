import { z } from 'zod';

export interface IFuelQuoteData {
    userId?: string; // Optional if it's auto-populated or not required at insertion
    gallonsRequested: number;
    deliveryDate: Date;
    deliveryAddress: string;
    suggestedPrice: number;
    totalPrice: number;
  }

  // export const FuelQuoteInsertSchema = z.object({
  //   userId: z.string(),
  //   gallonsRequested: z.string(),
  //   deliveryDate: z.date(),
  //   deliveryAddress: z.string(),
  //   suggestedPrice: z.string(),
  //   totalPrice: z.string(),
  // });