'use server';

import { calculateSubtotal } from '@/lib/calculator';

export type CalculationResult = {
  subtotal: number;
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
        error: 'Please enter valid numbers',
      };
    }

    if (quantity <= 0 || pricePerItem <= 0) {
      return {
        subtotal: 0,
        error: 'Quantity and price must be positive numbers',
      };
    }

    const subtotal = calculateSubtotal(quantity, pricePerItem);

    return {
      subtotal,
    };
  } catch (error) {
    return {
      subtotal: 0,
      error: 'An error occurred during calculation',
    };
  }
}
