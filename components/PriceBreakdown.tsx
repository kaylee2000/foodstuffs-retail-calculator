'use client';

type PriceBreakdownProps = {
  subtotal: number;
  discountAmount: number;
  discountRate: number;
  discountedPrice: number;
  taxAmount: number;
  taxRate: number;
  total: number;
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-NZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function PriceBreakdown({
  subtotal,
  discountAmount,
  discountRate,
  discountedPrice,
  taxAmount,
  taxRate,
  total,
}: PriceBreakdownProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Price Breakdown</h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-semibold text-gray-900">
            ${formatCurrency(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discountAmount > 0 ? (
          <div className="border-t pt-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">
                Bulk Discount ({(discountRate * 100).toFixed(2)}%)
              </span>
              <span className="font-semibold text-green-600">
                -${formatCurrency(discountAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded">
              <span className="font-medium text-gray-900">
                Price After Discount
              </span>
              <span className="font-bold text-gray-900">
                ${formatCurrency(discountedPrice)}
              </span>
            </div>
          </div>
        ) : (
          <div className="border-t pt-2">
            <div className="flex justify-between items-center py-2 text-sm text-gray-500">
              <span>No discount applied</span>
              <span>Order $1,000+ for bulk savings</span>
            </div>
          </div>
        )}

        {/* Tax */}
        <div className="border-t pt-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">
              Regional Tax ({(taxRate * 100).toFixed(2)}%)
            </span>
            <span className="font-semibold text-orange-600">
              +${formatCurrency(taxAmount)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t-2 border-gray-300 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Final Total</span>
            <span className="text-2xl font-bold text-green-600">
              ${formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Message */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          {discountAmount > 0 ? (
            <>
              You saved{' '}
              <span className="font-semibold text-green-600">
                ${formatCurrency(discountAmount)}
              </span>{' '}
              with bulk discount!
            </>
          ) : (
            'Order more to unlock bulk discount savings'
          )}
        </p>
      </div>
    </div>
  );
}
