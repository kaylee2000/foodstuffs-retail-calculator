'use client';

import { calculatePriceAction } from '@/app/actions';
import { calculationInputSchema } from '@/lib/schemas';
import { useState } from 'react';
import PriceBreakdown from './PriceBreakdown';
import Select from './ui/Select';
import Input from './ui/Input';
import Alert from './ui/Alert';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

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

        <Button
          type="submit"
          disabled={
            isLoading ||
            Object.keys(errors).some(
              (key) => errors[key as keyof typeof errors]
            )
          }
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner className="-ml-1 mr-3 text-white" />
              Calculating...
            </div>
          ) : (
            'Calculate Total'
          )}
        </Button>
      </form>

      {result && (
        <div className="mt-6">
          {result.error ? (
            <Alert
              variant="error"
              title="Calculation Error"
              onClose={() => {
                setResult(null);
                setErrors({});
              }}
            >
              {result.error}
            </Alert>
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
