'use server';

import {
  calculateSubtotal,
  calculateDiscountAmount,
  calculateTaxAmount,
  calculateTotal,
} from '@/lib/calculator';
import { calculationInputSchema, type CalculationResult } from '@/lib/schemas';

export async function calculatePriceAction(
  formData: FormData
): Promise<CalculationResult> {
  try {
    // Extract form data
    const rawData = {
      quantity: formData.get('quantity'),
      price: formData.get('price'),
      region: formData.get('region'),
    };

    // Validate and transform input with single Zod schema
    const validationResult = calculationInputSchema.safeParse(rawData);

    if (!validationResult.success) {
      // Collect all validation errors
      const errorMessages = validationResult.error.issues.map(
        (err) => err.message
      );
      const errorMessage = errorMessages.join(', ');

      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        taxAmount: 0,
        taxRate: 0,
        total: 0,
        error: errorMessage,
      };
    }

    const { quantity, price, region } = validationResult.data;

    const subtotal = calculateSubtotal(quantity, price);
    const { discountAmount, discountRate } = calculateDiscountAmount(subtotal);
    const discountedPrice = subtotal - discountAmount;
    const { taxAmount, taxRate } = calculateTaxAmount(discountedPrice, region);
    const total = calculateTotal(discountedPrice, taxAmount);

    return {
      subtotal,
      discountAmount,
      discountRate,
      discountedPrice,
      taxAmount,
      taxRate,
      total,
    };
  } catch (error) {
    return {
      subtotal: 0,
      discountAmount: 0,
      discountRate: 0,
      discountedPrice: 0,
      taxAmount: 0,
      taxRate: 0,
      total: 0,
      error: 'An error occurred during calculation',
    };
  }
}
