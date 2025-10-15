import { z } from 'zod';

/**
 * Schema for calculation input validation with transform from FormData
 */
export const calculationInputSchema = z.object({
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((val) => !isNaN(Number(val)), 'Quantity must be a valid number')
    .transform(Number)
    .refine((val) => Number.isInteger(val), 'Quantity must be a whole number')
    .refine((val) => val > 0, 'Quantity must be greater than 0'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)), 'Price must be a valid number')
    .transform(Number)
    .refine((val) => val > 0, 'Price must be greater than 0')
    .refine((val) => val >= 0.01, 'Price must be at least $0.01'),
  region: z
    .string()
    .min(1, 'Region is required')
    .refine(
      (val) => ['AUK', 'WLG', 'WAI', 'CHC', 'TAS'].includes(val),
      'Please select a valid region'
    ),
});

/**
 * TypeScript type inferred from the schema
 */
export type CalculationInput = z.infer<typeof calculationInputSchema>;

/**
 * Schema for calculation result validation
 */
export const calculationResultSchema = z.object({
  subtotal: z.number(),
  discountAmount: z.number(),
  discountRate: z.number(),
  discountedPrice: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  total: z.number(),
  error: z.string().optional(),
});

/**
 * TypeScript type inferred from the result schema
 */
export type CalculationResult = z.infer<typeof calculationResultSchema>;
