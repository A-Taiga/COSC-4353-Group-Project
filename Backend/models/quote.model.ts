export interface IFuelQuoteData {
    userId?: string; // Optional if it's auto-populated or not required at insertion
    gallonsRequested: number;
    deliveryDate: Date;
    deliveryAddress: string;
    suggestedPrice: number;
    totalPrice: number;
  }