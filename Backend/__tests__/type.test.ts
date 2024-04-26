import {
    userLookUpSchema,
    insertUserSchema,
    selectUserSchema,
    userProfileSchema,
    FuelQuoteInsertSchema,
  } from '../types/type';
  
  describe('Zod Validation Schemas', () => {
    describe('User Lookup Schema', () => {
      it('should validate correct data', () => {
        const result = userLookUpSchema.safeParse({
          username: 'testUser',
          password: 'testPassword123',
        });
        expect(result.success).toBe(true);
      });
  
      it('should reject data with too short username', () => {
        const result = userLookUpSchema.safeParse({
          username: 'tu',
          password: 'testPassword123',
        });
        expect(result.success).toBe(false);
      });
  
      it('should handle missing password as optional', () => {
        const result = userLookUpSchema.safeParse({
          username: 'testUser',
        });
        expect(result.success).toBe(true);
      });
    });
  
    describe('Insert User Schema', () => {
      it('should enforce minimum password length for security', () => {
        const result = insertUserSchema.safeParse({
          username: 'testUser',
          password: 'a'.repeat(60),
        });
        expect(result.success).toBe(true);
      });
  
      it('should reject short passwords', () => {
        const result = insertUserSchema.safeParse({
          username: 'testUser',
          password: 'short',
        });
        expect(result.success).toBe(false);
      });
    });
  
    describe('Select User Schema', () => {
      it('should accept optional fields with valid UUID', () => {
        const result = selectUserSchema.safeParse({
          id: '123e4567-e89b-12d3-a456-426614174000',
          password: 'testPassword123',
        });
        expect(result.success).toBe(true);
      });
  
      it('should reject invalid UUID', () => {
        const result = selectUserSchema.safeParse({
          id: 'invalid-uuid',
          password: 'testPassword123',
        });
        expect(result.success).toBe(false);
      });
    });
  
    describe('User Profile Schema', () => {
      it('should validate a complete user profile correctly', () => {
        const result = userProfileSchema.safeParse({
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'Anytown',
          state: 'TX',
          zipcode: '12345',
        });
        expect(result.success).toBe(true);
      });
    });
  
    describe('Fuel Quote Insert Schema', () => {
        it('should handle valid fuel quote data including transformation for date', () => {
          const result = FuelQuoteInsertSchema.safeParse({
            userId: '123e4567-e89b-12d3-a456-426614174000',
            gallonsRequested: '500',
            deliveryDate: '2021-09-15',
            deliveryAddress: '123 Main St',
            suggestedPrice: '2.5',
            totalPrice: '1250',
          });
          
          expect(result.success).toBe(true);
          if (result.success) { // Only access .data if parsing was successful
            expect(result.data.deliveryDate).toBeInstanceOf(Date);
          } else {
            fail('Expected result to be successful but got failure'); // Explicitly fail the test if not successful
          }
        });
      });
      
    });
  