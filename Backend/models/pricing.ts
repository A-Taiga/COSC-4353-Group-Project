interface PricingOptions {
    gallonsRequested: number;
    deliveryDate: Date;
    clientLocation: string;
    // Additional parameters
}

export class Pricing {
    calculatePrice(options: PricingOptions): number {
        // Pricing logic

        // Example calculation
        const basePricePerGallon = 2.50;
        const totalPrice = basePricePerGallon * options.gallonsRequested;
        return totalPrice;
    }
}
