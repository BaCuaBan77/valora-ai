export interface PerformanceMetric {
  name: string;
  score: number; // 0-100
  weight: number; // Weight in overall calculation
}

export interface OverallPerformanceIndex {
  overallScore: number; // 0-100
  metrics: PerformanceMetric[];
  valueMultiplier: number; // Multiplier for pricing based on performance
}

export interface PriceEstimate {
  estimatedPrice: number;
  fairPrice: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
  confidenceScore: number;
  basePrice: number;
  productCategory: string;
  productBaseCost: number;
  orderQuantity: number;
  factors: {
    valueBasedPricingStrategy: {
      impact: number;
      explanation: string;
      performanceIndex: OverallPerformanceIndex;
    };
    relationshipStrength: {
      impact: number;
      explanation: string;
    };
    productCost: {
      impact: number;
      explanation: string;
    };
    marketConditions: {
      impact: number;
      explanation: string;
    };
    competitorPricing: {
      impact: number;
      explanation: string;
    };
    discountAgreement?: {
      impact: number;
      explanation: string;
    };
    liquidityStatus?: {
      impact: number;
      explanation: string;
    };
    desiredMargin?: {
      impact: number;
      explanation: string;
      desiredMarginPercent: number;
      fairMarginPercent: number;
      warning?: {
        level: 'low' | 'medium' | 'high';
        message: string;
      };
    };
  };
  explanation: string;
}
