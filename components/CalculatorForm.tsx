'use client';

export default function CalculatorForm() {
  return (
    <form className="space-y-6">
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
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate Total
      </button>
    </form>
  );
}
