'use client';

import { calculatePriceAction } from '@/app/actions';
import { calculationInputSchema } from '@/lib/schemas';
import { useState } from 'react';
import PriceBreakdown from './PriceBreakdown';
import Select from './ui/Select';
import Input from './ui/Input';

type FormErrors = { quantity?: string; price?: string; region?: string };

const regionOptions = [
  { value: 'AUK', label: 'AUK - Auckland (6.85% tax)' },
  { value: 'WLG', label: 'WLG - Wellington (8.00% tax)' },
  { value: 'WAI', label: 'WAI - Waikato (6.25% tax)' },
  { value: 'CHC', label: 'CHC - Christchurch (4.00% tax)' },
  { value: 'TAS', label: 'TAS - Tasmania (8.25% tax)' },
];

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
  const [errors, setErrors] = useState<FormErrors>({});

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
      const newErrors: FormErrors = {};

      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
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
        <Input
          id="quantity"
          name="quantity"
          type="number"
          label="Number of Items"
          value={formData.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          placeholder="e.g., 100"
          min={1}
          step={1}
          required
          error={errors.quantity}
          helpText="Enter the quantity of items you want to purchase"
        />

        <Input
          id="price"
          name="price"
          type="number"
          label="Price Per Item"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          placeholder="e.g., 150.00"
          min={0.01}
          step={0.01}
          required
          error={errors.price}
          helpText="Enter the price per item in dollars"
        />

        <Select
          id="region"
          name="region"
          label="Region Code"
          value={formData.region}
          onChange={(e) => handleInputChange('region', e.target.value)}
          placeholder="Select your region..."
          options={regionOptions}
          required
          error={errors.region}
          helpText="Select your region for tax calculation"
        />

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
