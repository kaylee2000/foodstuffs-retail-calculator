'use client';

import { calculatePriceAction } from '@/app/actions';
import { useState } from 'react';

export default function CalculatorForm() {
  const [result, setResult] = useState<{
    subtotal: number;
    discountAmount: number;
    discountRate: number;
    discountedPrice: number;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    price: '',
    region: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // Create FormData from our state
    const formDataObj = new FormData();
    formDataObj.append('quantity', formData.quantity);
    formDataObj.append('price', formData.price);
    formDataObj.append('region', formData.region);

    try {
      const calculationResult = await calculatePriceAction(formDataObj);
      setResult(calculationResult);
    } catch (error) {
      setResult({
        subtotal: 0,
        discountAmount: 0,
        discountRate: 0,
        discountedPrice: 0,
        error: 'Failed to calculate',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Items
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="e.g., 100"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the quantity of items you want to purchase
          </p>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Price Per Item
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="e.g., 150.00"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the price per item in dollars
          </p>
        </div>

        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Region Code
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={(e) => handleInputChange('region', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select your region...</option>
            <option value="AUK">AUK - Auckland (6.85% tax)</option>
            <option value="WLG">WLG - Wellington (8.00% tax)</option>
            <option value="WAI">WAI - Waikato (6.25% tax)</option>
            <option value="CHC">CHC - Christchurch (4.00% tax)</option>
            <option value="TAS">TAS - Tasmania (8.25% tax)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select your region for tax calculation
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Calculating...' : 'Calculate Total'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          {result.error ? (
            <div className="text-red-600 font-medium">
              Error: {result.error}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Calculation Result
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    ${result.subtotal.toLocaleString()}
                  </span>
                </div>

                {result.discountAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Discount ({Math.round(result.discountRate * 100)}%):
                      </span>
                      <span className="font-medium text-green-600">
                        -${result.discountAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Discounted Price:
                        </span>
                        <span className="font-bold text-blue-600 text-lg">
                          ${result.discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {result.discountAmount === 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    No discount applied. Order $1,000+ for bulk discounts.
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-3">
                Tax will be calculated based on your selected region in the next
                step.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
