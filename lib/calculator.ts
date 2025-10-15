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
