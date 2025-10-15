/**
 * Discount tiers for bulk orders
 * Each tier represents the minimum order value and discount percentage
 */
export const DISCOUNT_TIERS = [
  { threshold: 50000, rate: 0.15 }, // 15% for orders $50,000+
  { threshold: 10000, rate: 0.1 }, // 10% for orders $10,000+
  { threshold: 7000, rate: 0.07 }, // 7% for orders $7,000+
  { threshold: 5000, rate: 0.05 }, // 5% for orders $5,000+
  { threshold: 1000, rate: 0.03 }, // 3% for orders $1,000+
] as const;

/**
 * Region tax rates
 */
export const TAX_RATES = {
  AUK: 0.0685, // 6.85%
  WLG: 0.08, // 8.00%
  WAI: 0.0625, // 6.25%
  CHC: 0.04, // 4.00%
  TAS: 0.0825, // 8.25%
} as const;
