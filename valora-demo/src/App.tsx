import { useState } from 'react';
import { customers, products } from './data/mockData';
import { PriceEstimate } from './types';
import PriceEstimateDisplay from './components/PriceEstimateDisplay';
import CustomerSelector from './components/CustomerSelector';
import ProductSelector from './components/ProductSelector';
import AmountInput from './components/AmountInput';

// Hardcoded price estimate (all values are static)
const HARDCODED_ESTIMATE: PriceEstimate = {
  estimatedPrice: 10650,
  fairPrice: 9545.5,
  confidenceIntervalLower: 10467,
  confidenceIntervalUpper: 11569,
  confidenceScore: 0.95,
  basePrice: 8500,
  productCategory: 'Wireless Modules',
  productBaseCost: 8.50,
  orderQuantity: 1000,
  factors: {
    valueBasedPricingStrategy: {
      impact: 1045.5,
      explanation: 'Value-Based Pricing Strategy: Overall Performance Index of 86.5/100. This reflects the value delivered across 6 key dimensions. The performance score determines the fair price of $9,545.50 (12.3% premium from base cost) based on customer\'s perceived value and willingness to pay.',
      performanceIndex: {
        overallScore: 86.5,
        metrics: [
          { name: 'Product-Customer Fit', score: 85, weight: 0.25 },
          { name: 'Quality & Reliability', score: 90, weight: 0.20 },
          { name: 'Delivery Performance', score: 88, weight: 0.15 },
          { name: 'Technical Support', score: 85, weight: 0.15 },
          { name: 'Innovation & Features', score: 82, weight: 0.15 },
          { name: 'Cost Efficiency', score: 87, weight: 0.10 },
        ],
        valueMultiplier: 1.123,
      },
    },
    productCost: {
      impact: 0,
      explanation: 'Base cost: $8.50 per unit × 1,000 units = $8,500.00. Product tier: Standard. Category: Wireless Modules.',
    },
    relationshipStrength: {
      impact: 401,
      explanation: 'Relationship strength score of 92% with 2 past deals. Applied to fair price: Strong relationship allows for premium pricing adjustment.',
    },
    marketConditions: {
      impact: 763,
      explanation: 'Market trend: Up. Economic indicator: 5.0%. Seasonal factor: 2.0%. Applied to current price. Electronics component demand up 15% YoY. IoT and smart device market driving growth.',
    },
    competitorPricing: {
      impact: 0,
      explanation: 'Average competitor price: $10.50 per unit. Competitors are active in this component category. Competitor pricing is shown for reference but does not affect the fair-price calculation.',
    },
    discountAgreement: {
      impact: -477,
      explanation: 'Strategic discount agreement: 5% off. Applied to current price.',
    },
    liquidityStatus: {
      impact: 286,
      explanation: 'Customer liquidity status: high. Applied to current price. High liquidity allows for premium pricing adjustment. Expanding to 50 new store locations Strong Q1 2024 sales performance',
    },
  },
  explanation: 'Pricing workflow: Fair price of $9,545.50 calculated from value-based pricing strategy (Performance Index: 86.5/100). Then adjusted by relationship strength, market conditions, discount agreement, liquidity status. Final estimated price: $11,018.00.',
};

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [amount, setAmount] = useState<number>(1000);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    { icon: '👤', message: 'Analyzing customer profile and preferences...' },
    { icon: '🤝', message: 'Evaluating relationship strength and history...' },
    { icon: '📊', message: 'Conducting competitor pricing analysis...' },
    { icon: '📈', message: 'Processing market dynamics and trends...' },
    { icon: '🎯', message: 'Aligning with strategic objectives...' },
    { icon: '🧮', message: 'Optimizing price recommendation...' },
  ];

  const handleCalculate = () => {
    setIsCalculating(true);
    setLoadingStage(0);
    setPriceEstimate(null);

    // Progress through loading stages
    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    // Complete after all stages
    setTimeout(() => {
      clearInterval(stageInterval);
      setPriceEstimate(HARDCODED_ESTIMATE);
      setIsCalculating(false);
      setLoadingStage(0);
    }, loadingStages.length * 800 + 500);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header */}
      <header className="bg-[#002366]/95 backdrop-blur-md shadow-2xl border-b-2 border-yellow-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Star Logo */}
                <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                  <path d="M50 10 L35 40 L50 50 L65 40 Z M50 90 L35 60 L50 50 L65 60 Z M10 50 L40 35 L50 50 L40 65 Z M90 50 L60 35 L50 50 L60 65 Z" 
                    stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="50" cy="30" r="4" fill="#F59E0B"/>
                  <circle cx="50" cy="70" r="4" fill="#F59E0B"/>
                  <circle cx="30" cy="50" r="4" fill="#F59E0B"/>
                  <circle cx="70" cy="50" r="4" fill="#F59E0B"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Valora AI
                </h1>
                <p className="text-sm text-yellow-400 font-medium mt-0.5">AI-Powered Wholesale Pricing Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#002366] text-sm font-bold rounded-full border-2 border-yellow-300 shadow-lg">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Demo Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-yellow-500/30 p-7 sticky top-24 hover:shadow-yellow-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-yellow-500/20">
                <div className="w-10 h-10 bg-gradient-to-br from-[#002366] to-blue-900 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#002366]">
                  Request Quote
                </h2>
              </div>
              
              <div className="space-y-5">
                <CustomerSelector
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelect={setSelectedCustomer}
                />

                <ProductSelector
                  products={products}
                  selectedProduct={selectedProduct}
                  onSelect={setSelectedProduct}
                />

                <AmountInput
                  amount={amount}
                  onChange={setAmount}
                />

                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-[#002366] font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/50 hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2 border-2 border-yellow-600"
                >
                  {isCalculating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#002366]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get AI Price Estimate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {isCalculating ? (
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border-2 border-yellow-500/30 p-16 text-center">
                <div className="max-w-2xl mx-auto">
                  {/* Animated Logo */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#002366] to-blue-900 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                      <svg className="w-16 h-16 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-yellow-400/30 rounded-full opacity-50 blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-400/30 rounded-full opacity-50 blur-xl animate-pulse"></div>
                  </div>

                  {/* Loading Title */}
                  <h3 className="text-3xl font-bold text-[#002366] mb-3">
                    Calculating Your Price
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Our AI is analyzing multiple factors to generate the optimal price...
                  </p>

                  {/* Progress Stages */}
                  <div className="space-y-3 mb-8">
                    {loadingStages.map((stage, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                          index === loadingStage
                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 shadow-lg scale-105'
                            : index < loadingStage
                            ? 'bg-green-50 border-2 border-green-300'
                            : 'bg-gray-50 border-2 border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-2xl">
                          {index < loadingStage ? '✓' : stage.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold ${
                            index === loadingStage ? 'text-[#002366]' : 
                            index < loadingStage ? 'text-green-800' : 'text-gray-500'
                          }`}>
                            {stage.message}
                          </p>
                        </div>
                        {index === loadingStage && (
                          <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 font-medium">
                    {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}% Complete
                  </p>
                </div>
              </div>
            ) : priceEstimate ? (
              <PriceEstimateDisplay 
                estimate={priceEstimate}
              />
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-yellow-500/30 p-16 text-center hover:shadow-yellow-500/20 transition-all duration-300">
                <div className="max-w-lg mx-auto">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#002366] to-blue-900 rounded-3xl flex items-center justify-center shadow-lg">
                      <svg
                        className="h-16 w-16 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-yellow-400/30 rounded-full opacity-50 blur-xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-400/30 rounded-full opacity-50 blur-xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#002366] mb-3">
                    Ready to Generate Your Price Estimate
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed mb-6">
                    Select a customer, electronic component, and quantity from the form on the left, 
                    then click <span className="font-bold text-[#002366] bg-yellow-100 px-2 py-0.5 rounded">"Get AI Price Estimate"</span> to see 
                    intelligent wholesale pricing analysis powered by our advanced AI model.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <div className="w-10 h-10 mx-auto bg-[#002366] rounded-lg flex items-center justify-center mb-2 shadow-md">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-[#002366]">Customer Analysis</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
                      <div className="w-10 h-10 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mb-2 shadow-md">
                        <svg className="w-6 h-6 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-[#002366]">Market Insights</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-indigo-200">
                      <div className="w-10 h-10 mx-auto bg-[#002366] rounded-lg flex items-center justify-center mb-2 shadow-md">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-[#002366]">AI Optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
