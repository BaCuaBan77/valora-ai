import { PriceEstimate } from '../types';
import FairValueScatterPlot from './FairValueScatterPlot';

interface PriceEstimateDisplayProps {
  estimate: PriceEstimate;
}

export default function PriceEstimateDisplay({ 
  estimate,
}: PriceEstimateDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyWithDecimals = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate margin percentage
  const marginPercentage = ((estimate.estimatedPrice - estimate.basePrice) / estimate.basePrice * 100).toFixed(1);
  const isPositiveMargin = estimate.estimatedPrice > estimate.basePrice;

  return (
    <div className="space-y-6">
      {/* Main Price Estimate Card */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-yellow-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#002366] to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#002366]">Price Estimate</h2>
          </div>
          <div className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-md ${
            isPositiveMargin 
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#002366] border-2 border-yellow-600' 
              : 'bg-gradient-to-r from-red-400 to-red-500 text-white border-2 border-red-600'
          }`}>
            {isPositiveMargin ? '+' : ''}{marginPercentage}% Margin
          </div>
        </div>

        <div className="mb-6 pb-6 border-b-2 border-yellow-500/20">
          <div className="text-6xl font-bold bg-gradient-to-r from-[#002366] to-blue-900 bg-clip-text text-transparent mb-3">
            {formatCurrency(estimate.estimatedPrice)}
          </div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg border border-blue-200">
              <svg className="w-4 h-4 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[#002366] font-semibold">Base Cost:</span>
              <span className="font-bold text-[#002366]">{formatCurrency(estimate.basePrice)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg border border-yellow-300">
              <svg className="w-4 h-4 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span className="text-[#002366] font-semibold">Quantity:</span>
              <span className="font-bold text-[#002366]">{estimate.orderQuantity.toLocaleString()} units</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-100 rounded-lg border border-indigo-200">
              <svg className="w-4 h-4 text-[#002366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-[#002366] font-semibold">Per Unit:</span>
              <span className="font-bold text-[#002366]">{formatCurrencyWithDecimals(estimate.estimatedPrice / estimate.orderQuantity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fair-Value Scatter Plot */}
      <FairValueScatterPlot
        currentPerformanceIndex={estimate.factors.valueBasedPricingStrategy.performanceIndex}
        currentPrice={estimate.estimatedPrice}
        fairPrice={estimate.fairPrice}
        productCategory={estimate.productCategory}
        productBaseCost={estimate.productBaseCost}
        orderQuantity={estimate.orderQuantity}
        factors={estimate.factors}
      />
    </div>
  );
}
