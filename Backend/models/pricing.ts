export interface PricingOptions {
    gallonsRequested: number;
    deliveryDate: Date;
    clientLocation: string;
    // Additional parameters
}

export class Pricing {
    calculatePrice(options: PricingOptions): number {
        // Validate gallonsRequested
        if (options.gallonsRequested < 0) {
            console.error("Error: gallonsRequested cannot be negative");
            return 0;
        }

        // Pricing logic

        // Example calculation
        const basePricePerGallon = 2.50;
        const totalPrice = basePricePerGallon * options.gallonsRequested;
        return totalPrice;
    }
}
