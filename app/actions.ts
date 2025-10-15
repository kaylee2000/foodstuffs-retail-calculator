'use server';

import { calculateSubtotal, calculateDiscountAmount } from '@/lib/calculator';

export type CalculationResult = {
  subtotal: number;
  discountAmount: number;
  discountRate: number;
  discountedPrice: number;
  error?: string;
};

export async function calculatePriceAction(
  formData: FormData
): Promise<CalculationResult> {
  try {
    const quantity = Number(formData.get('quantity'));
    const pricePerItem = Number(formData.get('price'));

    // Basic validation
    if (isNaN(quantity) || isNaN(pricePerItem)) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        error: 'Please enter valid numbers',
      };
    }

    if (quantity <= 0 || pricePerItem <= 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        error: 'Quantity and price must be positive numbers',
      };
    }

    const subtotal = calculateSubtotal(quantity, pricePerItem);
    const { discountAmount, discountRate } = calculateDiscountAmount(subtotal);
    const discountedPrice = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      discountRate,
      discountedPrice,
    };
  } catch (error) {
    return {
      subtotal: 0,
      discountAmount: 0,
      discountRate: 0,
      discountedPrice: 0,
      error: 'An error occurred during calculation',
    };
  }
}
