interface PricingFactorsSelectorProps {
  options: { includeRelationshipStrength?: boolean; includeMarketConditions?: boolean; includeDiscountAgreement?: boolean; includeLiquidityStatus?: boolean };
  onChange: (options: { includeRelationshipStrength?: boolean; includeMarketConditions?: boolean; includeDiscountAgreement?: boolean; includeLiquidityStatus?: boolean }) => void;
  hasDiscountAgreement: boolean;
  hasLiquidityStatus: boolean;
}

export default function PricingFactorsSelector({
  options,
  onChange,
  hasDiscountAgreement,
  hasLiquidityStatus,
}: PricingFactorsSelectorProps) {
  const handleToggle = (key: keyof typeof options) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pricing Factors (Optional)
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Select which factors to apply to the fair price
      </p>
      
      <div className="space-y-3">
        {/* Relationship Strength */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeRelationshipStrength ?? true}
            onChange={() => handleToggle('includeRelationshipStrength')}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Relationship Strength</span>
        </label>

        {/* Market Conditions */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeMarketConditions ?? true}
            onChange={() => handleToggle('includeMarketConditions')}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Market Conditions</span>
        </label>

        {/* Discount Agreement */}
        {hasDiscountAgreement && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeDiscountAgreement ?? true}
              onChange={() => handleToggle('includeDiscountAgreement')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Discount Agreement</span>
          </label>
        )}

        {/* Liquidity Status */}
        {hasLiquidityStatus && (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeLiquidityStatus ?? true}
              onChange={() => handleToggle('includeLiquidityStatus')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Customer Liquidity</span>
          </label>
        )}
      </div>
    </div>
  );
}
