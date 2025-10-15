'use server';

import {
  calculateSubtotal,
  calculateDiscountAmount,
  calculateTaxAmount,
  calculateTotal,
} from '@/lib/calculator';

export type CalculationResult = {
  subtotal: number;
  discountAmount: number;
  discountRate: number;
  discountedPrice: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  error?: string;
};

export async function calculatePriceAction(
  formData: FormData
): Promise<CalculationResult> {
  try {
    const quantity = Number(formData.get('quantity'));
    const pricePerItem = Number(formData.get('price'));
    const region = formData.get('region') as string;

    // Basic validation
    if (isNaN(quantity) || isNaN(pricePerItem)) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        taxAmount: 0,
        taxRate: 0,
        total: 0,
        error: 'Please enter valid numbers',
      };
    }

    if (quantity <= 0 || pricePerItem <= 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        taxAmount: 0,
        taxRate: 0,
        total: 0,
        error: 'Quantity and price must be positive numbers',
      };
    }

    if (!region) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        taxAmount: 0,
        taxRate: 0,
        total: 0,
        error: 'Please select a region',
      };
    }

    const subtotal = calculateSubtotal(quantity, pricePerItem);
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
