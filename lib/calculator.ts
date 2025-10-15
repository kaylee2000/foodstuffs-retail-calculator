import { DISCOUNT_TIERS } from './constants';

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
