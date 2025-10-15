import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  findDiscountRate,
  calculateDiscountAmount,
  applyDiscount,
  calculateTaxAmount,
  calculateTotal,
} from '@/lib/calculator';

describe('Calculator Functions', () => {
  describe('calculateSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      expect(calculateSubtotal(100, 150)).toBe(15000);
      expect(calculateSubtotal(50, 100)).toBe(5000);
      expect(calculateSubtotal(1, 999)).toBe(999);
    });

    it('should handle decimal prices', () => {
      expect(calculateSubtotal(100, 15.99)).toBe(1599);
      expect(calculateSubtotal(3, 0.99)).toBeCloseTo(2.97, 2);
    });

    it('should handle zero values', () => {
      expect(calculateSubtotal(0, 100)).toBe(0);
      expect(calculateSubtotal(100, 0)).toBe(0);
    });
  });

  describe('findDiscountRate', () => {
    it('should return 15% discount for $50,000+', () => {
      expect(findDiscountRate(50000)).toEqual({ rate: 0.15, threshold: 50000 });
      expect(findDiscountRate(100000)).toEqual({
        rate: 0.15,
        threshold: 50000,
      });
    });

    it('should return 10% discount for $10,000+', () => {
      expect(findDiscountRate(10000)).toEqual({ rate: 0.1, threshold: 10000 });
      expect(findDiscountRate(25000)).toEqual({ rate: 0.1, threshold: 10000 });
    });

    it('should return 7% discount for $7,000+', () => {
      expect(findDiscountRate(7000)).toEqual({ rate: 0.07, threshold: 7000 });
      expect(findDiscountRate(9999)).toEqual({ rate: 0.07, threshold: 7000 });
    });

    it('should return 5% discount for $5,000+', () => {
      expect(findDiscountRate(5000)).toEqual({ rate: 0.05, threshold: 5000 });
      expect(findDiscountRate(6999)).toEqual({ rate: 0.05, threshold: 5000 });
    });

    it('should return 3% discount for $1,000+', () => {
      expect(findDiscountRate(1000)).toEqual({ rate: 0.03, threshold: 1000 });
      expect(findDiscountRate(4999)).toEqual({ rate: 0.03, threshold: 1000 });
    });

    it('should return no discount for orders under $1,000', () => {
      expect(findDiscountRate(999)).toEqual({ rate: 0, threshold: 0 });
      expect(findDiscountRate(500)).toEqual({ rate: 0, threshold: 0 });
      expect(findDiscountRate(0)).toEqual({ rate: 0, threshold: 0 });
    });

    it('should test boundary values', () => {
      // Just below thresholds - should use lower tier
      expect(findDiscountRate(999.99).rate).toBe(0);
      expect(findDiscountRate(4999.99).rate).toBe(0.03);
      expect(findDiscountRate(6999.99).rate).toBe(0.05);
      expect(findDiscountRate(9999.99).rate).toBe(0.07);
      expect(findDiscountRate(49999.99).rate).toBe(0.1);

      // Just above thresholds - should use current tier
      expect(findDiscountRate(1000.01).rate).toBe(0.03);
      expect(findDiscountRate(5000.01).rate).toBe(0.05);
      expect(findDiscountRate(7000.01).rate).toBe(0.07);
      expect(findDiscountRate(10000.01).rate).toBe(0.1);
      expect(findDiscountRate(50000.01).rate).toBe(0.15);
    });
  });

  describe('calculateDiscountAmount', () => {
    it('should calculate 3% discount correctly', () => {
      const result = calculateDiscountAmount(1000);
      expect(result.discountAmount).toBe(30);
      expect(result.discountRate).toBe(0.03);
      expect(result.threshold).toBe(1000);
    });

    it('should calculate 5% discount correctly', () => {
      const result = calculateDiscountAmount(5000);
      expect(result.discountAmount).toBe(250);
      expect(result.discountRate).toBe(0.05);
    });

    it('should calculate 7% discount correctly', () => {
      const result = calculateDiscountAmount(7000);
      expect(result.discountAmount).toBeCloseTo(490, 2);
      expect(result.discountRate).toBe(0.07);
    });

    it('should calculate 10% discount correctly', () => {
      const result = calculateDiscountAmount(10000);
      expect(result.discountAmount).toBe(1000);
      expect(result.discountRate).toBe(0.1);
    });

    it('should calculate 15% discount correctly', () => {
      const result = calculateDiscountAmount(50000);
      expect(result.discountAmount).toBe(7500);
      expect(result.discountRate).toBe(0.15);
    });

    it('should return zero discount for orders under $1,000', () => {
      const result = calculateDiscountAmount(999);
      expect(result.discountAmount).toBe(0);
      expect(result.discountRate).toBe(0);
    });
  });

  describe('applyDiscount', () => {
    it('should apply discount correctly', () => {
      expect(applyDiscount(1000)).toBe(970); // 1000 - 30 (3%)
      expect(applyDiscount(5000)).toBe(4750); // 5000 - 250 (5%)
      expect(applyDiscount(10000)).toBe(9000); // 10000 - 1000 (10%)
    });

    it('should return original price when no discount applies', () => {
      expect(applyDiscount(999)).toBe(999);
      expect(applyDiscount(500)).toBe(500);
    });
  });

  describe('calculateTaxAmount', () => {
    it('should calculate AUK tax (6.85%) correctly', () => {
      const result = calculateTaxAmount(1000, 'AUK');
      expect(result.taxAmount).toBe(68.5);
      expect(result.taxRate).toBe(0.0685);
    });

    it('should calculate WLG tax (8.00%) correctly', () => {
      const result = calculateTaxAmount(1000, 'WLG');
      expect(result.taxAmount).toBe(80);
      expect(result.taxRate).toBe(0.08);
    });

    it('should calculate WAI tax (6.25%) correctly', () => {
      const result = calculateTaxAmount(1000, 'WAI');
      expect(result.taxAmount).toBe(62.5);
      expect(result.taxRate).toBe(0.0625);
    });

    it('should calculate CHC tax (4.00%) correctly', () => {
      const result = calculateTaxAmount(1000, 'CHC');
      expect(result.taxAmount).toBe(40);
      expect(result.taxRate).toBe(0.04);
    });

    it('should calculate TAS tax (8.25%) correctly', () => {
      const result = calculateTaxAmount(1000, 'TAS');
      expect(result.taxAmount).toBe(82.5);
      expect(result.taxRate).toBe(0.0825);
    });

    it('should return zero tax for invalid region', () => {
      const result = calculateTaxAmount(1000, 'INVALID');
      expect(result.taxAmount).toBe(0);
      expect(result.taxRate).toBe(0);
    });

    it('should handle decimal prices', () => {
      const result = calculateTaxAmount(99.99, 'AUK');
      expect(result.taxAmount).toBeCloseTo(6.85, 2);
    });
  });

  describe('calculateTotal', () => {
    it('should add discounted price and tax correctly', () => {
      expect(calculateTotal(1000, 100)).toBe(1100);
      expect(calculateTotal(5000, 250)).toBe(5250);
    });

    it('should handle decimal values', () => {
      expect(calculateTotal(99.99, 6.85)).toBeCloseTo(106.84, 2);
    });

    it('should handle zero tax', () => {
      expect(calculateTotal(1000, 0)).toBe(1000);
    });
  });

  describe('Full Calculation Flow - Integration Tests', () => {
    it('should calculate full order with 3% discount and AUK tax', () => {
      // Order: 100 items × $15 = $1,500
      const subtotal = calculateSubtotal(100, 15);
      expect(subtotal).toBe(1500);

      // Discount: 3% on $1,500 = $45
      const { discountAmount, discountRate } =
        calculateDiscountAmount(subtotal);
      expect(discountAmount).toBe(45);
      expect(discountRate).toBe(0.03);

      // Discounted price: $1,500 - $45 = $1,455
      const discountedPrice = applyDiscount(subtotal);
      expect(discountedPrice).toBe(1455);

      // Tax: 6.85% on $1,455 = $99.67
      const { taxAmount } = calculateTaxAmount(discountedPrice, 'AUK');
      expect(taxAmount).toBeCloseTo(99.67, 2);

      // Total: $1,455 + $99.67 = $1,554.67
      const total = calculateTotal(discountedPrice, taxAmount);
      expect(total).toBeCloseTo(1554.67, 2);
    });

    it('should calculate full order with 10% discount and CHC tax', () => {
      // Order: 100 items × $100 = $10,000
      const subtotal = calculateSubtotal(100, 100);
      expect(subtotal).toBe(10000);

      // Discount: 10% on $10,000 = $1,000
      const { discountAmount } = calculateDiscountAmount(subtotal);
      expect(discountAmount).toBe(1000);

      // Discounted price: $10,000 - $1,000 = $9,000
      const discountedPrice = applyDiscount(subtotal);
      expect(discountedPrice).toBe(9000);

      // Tax: 4% on $9,000 = $360
      const { taxAmount } = calculateTaxAmount(discountedPrice, 'CHC');
      expect(taxAmount).toBe(360);

      // Total: $9,000 + $360 = $9,360
      const total = calculateTotal(discountedPrice, taxAmount);
      expect(total).toBe(9360);
    });

    it('should calculate order with no discount and TAS tax', () => {
      // Order: 10 items × $50 = $500
      const subtotal = calculateSubtotal(10, 50);
      expect(subtotal).toBe(500);

      // No discount (under $1,000)
      const { discountAmount } = calculateDiscountAmount(subtotal);
      expect(discountAmount).toBe(0);

      // Discounted price: $500 (no discount)
      const discountedPrice = applyDiscount(subtotal);
      expect(discountedPrice).toBe(500);

      // Tax: 8.25% on $500 = $41.25
      const { taxAmount } = calculateTaxAmount(discountedPrice, 'TAS');
      expect(taxAmount).toBe(41.25);

      // Total: $500 + $41.25 = $541.25
      const total = calculateTotal(discountedPrice, taxAmount);
      expect(total).toBe(541.25);
    });

    it('should calculate order with 15% discount and WLG tax', () => {
      // Order: 500 items × $100 = $50,000
      const subtotal = calculateSubtotal(500, 100);
      expect(subtotal).toBe(50000);

      // Discount: 15% on $50,000 = $7,500
      const { discountAmount } = calculateDiscountAmount(subtotal);
      expect(discountAmount).toBe(7500);

      // Discounted price: $50,000 - $7,500 = $42,500
      const discountedPrice = applyDiscount(subtotal);
      expect(discountedPrice).toBe(42500);

      // Tax: 8% on $42,500 = $3,400
      const { taxAmount } = calculateTaxAmount(discountedPrice, 'WLG');
      expect(taxAmount).toBe(3400);

      // Total: $42,500 + $3,400 = $45,900
      const total = calculateTotal(discountedPrice, taxAmount);
      expect(total).toBe(45900);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const subtotal = calculateSubtotal(10000, 1000);
      expect(subtotal).toBe(10000000);

      const { discountAmount } = calculateDiscountAmount(subtotal);
      expect(discountAmount).toBe(1500000); // 15% of 10M
    });

    it('should handle very small numbers', () => {
      const subtotal = calculateSubtotal(1, 0.01);
      expect(subtotal).toBe(0.01);

      const { taxAmount } = calculateTaxAmount(0.01, 'AUK');
      expect(taxAmount).toBeCloseTo(0.000685, 6);
    });

    it('should handle decimal boundary values', () => {
      // Exactly at $1,000 threshold
      const result1 = calculateDiscountAmount(1000.0);
      expect(result1.discountRate).toBe(0.03);

      // Just below $1,000 threshold
      const result2 = calculateDiscountAmount(999.99);
      expect(result2.discountRate).toBe(0);
    });
  });
});
