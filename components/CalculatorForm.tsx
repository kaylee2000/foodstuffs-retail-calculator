'use client';

import { calculatePriceAction } from '@/app/actions';
import { calculationInputSchema } from '@/lib/schemas';
import { useState } from 'react';
import PriceBreakdown from './PriceBreakdown';

export default function CalculatorForm() {
  const [result, setResult] = useState<{
    subtotal: number;
    discountAmount: number;
    discountRate: number;
    discountedPrice: number;
    taxAmount: number;
    taxRate: number;
    total: number;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    price: '',
    region: '',
  });
  const [errors, setErrors] = useState<{
    quantity?: string;
    price?: string;
    region?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

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
        taxAmount: 0,
        taxRate: 0,
        total: 0,
        error: 'Failed to calculate',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validateForm(): boolean {
    const validationResult = calculationInputSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: typeof errors = {};

      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof errors;
        if (field) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
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
            min="1"
            step="1"
            required
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.quantity ? (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Enter the quantity of items you want to purchase
            </p>
          )}
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
            min="0.01"
            step="0.01"
            required
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price ? (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Enter the price per item in dollars
            </p>
          )}
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
            required
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.region ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your region...</option>
            <option value="AUK">AUK - Auckland (6.85% tax)</option>
            <option value="WLG">WLG - Wellington (8.00% tax)</option>
            <option value="WAI">WAI - Waikato (6.25% tax)</option>
            <option value="CHC">CHC - Christchurch (4.00% tax)</option>
            <option value="TAS">TAS - Tasmania (8.25% tax)</option>
          </select>
          {errors.region ? (
            <p className="mt-1 text-sm text-red-600">{errors.region}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Select your region for tax calculation
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            Object.keys(errors).some(
              (key) => errors[key as keyof typeof errors]
            )
          }
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Calculating...' : 'Calculate Total'}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          {result.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-800 font-medium">
                  Error: {result.error}
                </span>
              </div>
            </div>
          ) : (
            <PriceBreakdown
              subtotal={result.subtotal}
              discountAmount={result.discountAmount}
              discountRate={result.discountRate}
              discountedPrice={result.discountedPrice}
              taxAmount={result.taxAmount}
              taxRate={result.taxRate}
              total={result.total}
            />
          )}
        </div>
      )}
    </div>
  );
}
