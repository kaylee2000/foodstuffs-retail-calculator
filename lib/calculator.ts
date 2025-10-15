import { DISCOUNT_TIERS, TAX_RATES } from './constants';

/**
 * Calculate the subtotal for an order
 * @param quantity - Number of items
 * @param pricePerItem - Price per individual item
 * @returns Subtotal amount
 */
export function calculateSubtotal(
  quantity: number,
  pricePerItem: number
): number {
  return quantity * pricePerItem;
}

/**
 * Find the applicable discount rate for a given subtotal
 * @param subtotal - Order subtotal amount
 * @returns Discount rate (0-1) and threshold information
 */
export function findDiscountRate(subtotal: number): {
  rate: number;
  threshold: number;
} {
  // Find the highest applicable discount tier
  for (const tier of DISCOUNT_TIERS) {
    if (subtotal >= tier.threshold) {
      return {
        rate: tier.rate,
        threshold: tier.threshold,
      };
    }
  }

  // No discount applies
  return {
    rate: 0,
    threshold: 0,
  };
}

/**
 * Calculate discount amount based on subtotal
 * @param subtotal - Order subtotal amount
 * @returns Discount amount and rate information
 */
export function calculateDiscountAmount(subtotal: number): {
  discountAmount: number;
  discountRate: number;
  threshold: number;
} {
  const { rate, threshold } = findDiscountRate(subtotal);
  const discountAmount = subtotal * rate;

  return {
    discountAmount,
    discountRate: rate,
    threshold,
  };
}

/**
 * Apply discount to subtotal
 * @param subtotal - Original subtotal
 * @returns Discounted price
 */
export function applyDiscount(subtotal: number): number {
  const { discountAmount } = calculateDiscountAmount(subtotal);
  return subtotal - discountAmount;
}

/**
 * Calculate tax amount based on region and discounted price
 * @param discountedPrice - Price after discount applied
 * @param region - Region code (AUK, WLG, WAI, CHC, TAS)
 * @returns Tax amount and rate information
 */
export function calculateTaxAmount(
  discountedPrice: number,
  region: string
): {
  taxAmount: number;
  taxRate: number;
} {
  const taxRate = TAX_RATES[region as keyof typeof TAX_RATES] || 0;
  const taxAmount = discountedPrice * taxRate;

  return {
    taxAmount,
    taxRate,
  };
}

/**
 * Calculate final total including tax
 * @param discountedPrice - Price after discount
 * @param taxAmount - Tax amount to add
 * @returns Final total
 */
export function calculateTotal(
  discountedPrice: number,
  taxAmount: number
): number {
  return discountedPrice + taxAmount;
}
