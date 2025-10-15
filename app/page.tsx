import CalculatorForm from '@/components/CalculatorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <main className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Retail Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your order total with bulk discounts and regional tax
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <CalculatorForm />
        </div>
      </main>
    </div>
  );
}
