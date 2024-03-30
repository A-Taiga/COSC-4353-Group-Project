import { Pricing, PricingOptions } from '../models/pricing';

describe('Pricing', () => {
    describe('calculatePrice', () => {
        test('should calculate the price of fuel correctly', () => {
            const pricing = new Pricing();
            const options: PricingOptions = {
                gallonsRequested: 100,
                deliveryDate: new Date(),
                clientLocation: 'New York',
                // Additional parameters
            };
            const totalPrice = pricing.calculatePrice(options);
            // Assume base price is $2.50 per gallon
            expect(totalPrice).toBe(250);
        });

        test('should handle zero gallons requested', () => {
            const pricing = new Pricing();
            const options: PricingOptions = {
                gallonsRequested: 0,
                deliveryDate: new Date(),
                clientLocation: 'New York',
            };
            const totalPrice = pricing.calculatePrice(options);
            expect(totalPrice).toBe(0);
        });

        test('should handle negative gallons requested', () => {
            const pricing = new Pricing();
            const options: PricingOptions = {
                gallonsRequested: -50,
                deliveryDate: new Date(),
                clientLocation: 'New York',
            };
            const totalPrice = pricing.calculatePrice(options);
            expect(totalPrice).toBe(0);
        });

        test('should handle undefined options', () => {
            const pricing = new Pricing();
            const options: PricingOptions | undefined = undefined;
            const totalPrice = pricing.calculatePrice(options!);
            expect(totalPrice).toBe(0);
        });

        test('should handle missing gallonsRequested in options', () => {
            const options: Partial<PricingOptions> = {
                // missing gallonsRequested
                deliveryDate: new Date(),
                clientLocation: 'New York',
            };
            const pricing = new Pricing();
            const totalPrice = pricing.calculatePrice(options as PricingOptions);
            expect(totalPrice).toBe(0);
        });

        test('should handle non-numeric gallonsRequested', () => {
            const pricing = new Pricing();
            const options: PricingOptions = {
                gallonsRequested: NaN,
                deliveryDate: new Date(),
                clientLocation: 'New York',
            };
            const totalPrice = pricing.calculatePrice(options);
            expect(totalPrice).toBe(0);
        });
    });
});
