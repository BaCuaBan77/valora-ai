import { PriceEstimate, OverallPerformanceIndex, PerformanceMetric } from '../types';
import { customers, products, competitors, marketConditions } from '../data/mockData';

export interface PricingOptions {
  includeRelationshipStrength?: boolean;
  includeMarketConditions?: boolean;
  includeDiscountAgreement?: boolean;
  includeLiquidityStatus?: boolean;
}

export function estimatePrice(
  customerId: string,
  productId: string,
  amount: number,
  desiredMarginPercent: number | null = null,
  options: PricingOptions = {
    includeRelationshipStrength: true,
    includeMarketConditions: true,
    includeDiscountAgreement: true,
    includeLiquidityStatus: true,
  }
): PriceEstimate {
  const customer = customers.find(c => c.id === customerId);
  const productData = products.find(p => p.id === productId);
  
  if (!customer || !productData) {
    throw new Error(`Customer or product not found: customerId=${customerId}, productId=${productId}`);
  }
  
  // This function is deprecated - use getStaticEstimate from staticEstimates.ts instead
  // Keeping for backwards compatibility but should not be used
  
  const basePrice = productData.baseCost * amount;
  const factors: PriceEstimate['factors'] = {
    valueBasedPricingStrategy: { 
      impact: 0, 
      explanation: '',
      performanceIndex: {
        overallScore: 0,
        metrics: [],
        valueMultiplier: 1.0,
      },
    },
    relationshipStrength: { impact: 0, explanation: '' },
    productCost: { impact: 0, explanation: '' },
    marketConditions: { impact: 0, explanation: '' },
    competitorPricing: { impact: 0, explanation: '' },
  };

  // Value-Based Pricing Strategy - Overall Performance Index Calculation
  // Based on multiple performance metrics that determine customer's willingness to pay
  
  // 1. Product-Customer Fit Score (0-100)
  const productFitScore = customer.valuePreferences.length > 0 
    ? Math.min(100, 60 + (customer.valuePreferences.length * 10) + (productData.tier === 'Enterprise' ? 20 : productData.tier === 'Premium' ? 15 : productData.tier === 'Standard' ? 10 : 5))
    : 50;
  
  // 2. Quality & Reliability Score (0-100)
  const qualityScore = productData.tier === 'Enterprise' ? 95 
    : productData.tier === 'Premium' ? 85 
    : productData.tier === 'Standard' ? 75 
    : 65;
  
  // 3. Delivery Performance Score (0-100) - based on relationship and past deals
  const deliveryScore = customer.relationshipStrength > 0.8 ? 90
    : customer.relationshipStrength > 0.6 ? 80
    : customer.relationshipStrength > 0.4 ? 70
    : 60;
  
  // 4. Technical Support Score (0-100) - based on product tier and customer needs
  const supportScore = productData.features.some(f => f.toLowerCase().includes('support') || f.toLowerCase().includes('warranty'))
    ? 85
    : 70;
  
  // 5. Innovation & Features Score (0-100) - based on product features
  const innovationScore = productData.features.length > 4 ? 90
    : productData.features.length > 3 ? 80
    : productData.features.length > 2 ? 70
    : 60;
  
  // 6. Cost Efficiency Score (0-100) - based on product tier and market position
  // Find relevant competitors for this product category
  const relevantCompetitors = competitors.filter(c => 
    c.productCategory === productData.category
  );
  const avgCompetitorPrice = relevantCompetitors.length > 0
    ? relevantCompetitors.reduce((sum, c) => sum + c.basePrice, 0) / relevantCompetitors.length
    : productData.baseCost;
  const costEfficiencyScore = productData.baseCost < avgCompetitorPrice * 0.9 ? 90
    : productData.baseCost < avgCompetitorPrice * 0.95 ? 85
    : productData.baseCost <= avgCompetitorPrice * 1.05 ? 75
    : productData.baseCost <= avgCompetitorPrice * 1.1 ? 65
    : 55;

  // Define performance metrics with weights
  const performanceMetrics: PerformanceMetric[] = [
    { name: 'Product-Customer Fit', score: productFitScore, weight: 0.25 },
    { name: 'Quality & Reliability', score: qualityScore, weight: 0.20 },
    { name: 'Delivery Performance', score: deliveryScore, weight: 0.15 },
    { name: 'Technical Support', score: supportScore, weight: 0.15 },
    { name: 'Innovation & Features', score: innovationScore, weight: 0.15 },
    { name: 'Cost Efficiency', score: costEfficiencyScore, weight: 0.10 },
  ];

  // Calculate weighted overall performance index
  const overallScore = performanceMetrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0);
  
  // Convert performance index to value multiplier (0.95 to 1.15 range)
  // Higher performance = higher willingness to pay = higher price
  const valueMultiplier = 0.95 + (overallScore / 100) * 0.20; // Maps 0-100 score to 0.95-1.15 multiplier
  
  const performanceIndex: OverallPerformanceIndex = {
    overallScore,
    metrics: performanceMetrics,
    valueMultiplier,
  };

  // STEP 1: Calculate Fair Price from Value-Based Pricing Strategy
  // This is the base fair price based on performance index
  const fairPrice = basePrice * valueMultiplier;
  const valueBasedImpact = fairPrice - basePrice;
  
  factors.valueBasedPricingStrategy = {
    impact: valueBasedImpact,
    explanation: `Value-Based Pricing Strategy: Overall Performance Index of ${overallScore.toFixed(1)}/100. This reflects the value delivered across ${performanceMetrics.length} key dimensions. The performance score determines the fair price of $${fairPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${((valueMultiplier - 1) * 100).toFixed(1)}% ${valueMultiplier > 1 ? 'premium' : 'adjustment'} from base cost) based on customer's perceived value and willingness to pay.`,
    performanceIndex,
  };

  // Product Cost Base
  factors.productCost = {
    impact: 0,
    explanation: `Base cost: $${productData.baseCost.toFixed(2)} per unit × ${amount.toLocaleString()} units = $${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Product tier: ${productData.tier}. Category: ${productData.category}.`,
  };

  // STEP 2: Apply Relationship Strength to Fair Price (if enabled)
  let currentPrice = fairPrice;
  const relationshipMultiplier = 1 + (customer.relationshipStrength - 0.5) * 0.1;
  const relationshipImpact = (relationshipMultiplier - 1) * fairPrice;
  
  if (options.includeRelationshipStrength) {
    currentPrice = fairPrice * relationshipMultiplier;
  }
  
  factors.relationshipStrength = {
    impact: options.includeRelationshipStrength ? relationshipImpact : 0,
    explanation: `Relationship strength score of ${(customer.relationshipStrength * 100).toFixed(0)}% with ${customer.pastDeals.length} past ${customer.pastDeals.length === 1 ? 'deal' : 'deals'}. ${options.includeRelationshipStrength ? `Applied to fair price: ${customer.relationshipStrength > 0.7 ? 'Strong relationship allows for premium pricing adjustment.' : customer.relationshipStrength > 0.5 ? 'Moderate relationship maintained.' : 'Newer relationship, competitive pricing adjustment applied.'}` : 'Not applied to pricing.'}`,
  };

  // STEP 3: Apply Market Conditions to current price (if enabled)
  const marketMultiplier = marketConditions.economicIndicator * marketConditions.seasonalFactor;
  const marketImpact = (marketMultiplier - 1) * currentPrice;
  
  if (options.includeMarketConditions) {
    currentPrice = currentPrice * marketMultiplier;
  }
  
  factors.marketConditions = {
    impact: options.includeMarketConditions ? marketImpact : 0,
    explanation: `Market trend: ${marketConditions.trendDirection}. Economic indicator: ${((marketConditions.economicIndicator - 1) * 100).toFixed(1)}%. Seasonal factor: ${((marketConditions.seasonalFactor - 1) * 100).toFixed(1)}%. ${options.includeMarketConditions ? 'Applied to current price.' : 'Not applied to pricing.'} ${marketConditions.news.join(' ')}`,
  };

  // STEP 4: Apply Discount Agreement (if exists and enabled)
  if (customer.discountAgreement) {
    const discountAmount = (customer.discountAgreement.percentage / 100) * currentPrice;
    if (options.includeDiscountAgreement) {
      currentPrice = currentPrice - discountAmount;
    }
    factors.discountAgreement = {
      impact: options.includeDiscountAgreement ? -discountAmount : 0,
      explanation: `${customer.discountAgreement.type.charAt(0).toUpperCase() + customer.discountAgreement.type.slice(1)} discount agreement: ${customer.discountAgreement.percentage}% off. ${options.includeDiscountAgreement ? 'Applied to current price.' : 'Not applied to pricing.'}`,
    };
  }

  // STEP 5: Apply Customer Liquidity Status (if exists and enabled)
  if (customer.liquidityStatus) {
    const liquidityMultiplier = customer.liquidityStatus === 'high' ? 1.03 : customer.liquidityStatus === 'low' ? 0.97 : 1.0;
    const liquidityImpact = (liquidityMultiplier - 1) * currentPrice;
    if (options.includeLiquidityStatus) {
      currentPrice = currentPrice * liquidityMultiplier;
    }
    factors.liquidityStatus = {
      impact: options.includeLiquidityStatus ? liquidityImpact : 0,
      explanation: `Customer liquidity status: ${customer.liquidityStatus}. ${options.includeLiquidityStatus ? `Applied to current price. ${customer.liquidityStatus === 'high' ? 'High liquidity allows for premium pricing adjustment.' : customer.liquidityStatus === 'low' ? 'Limited budget, competitive pricing adjustment applied.' : 'Standard pricing approach.'}` : 'Not applied to pricing.'} ${customer.news ? customer.news.join(' ') : ''}`,
    };
  }

  // Remove competitor pricing from factors (still calculated for display/info but not applied)
  // Keep it for informational purposes but don't apply to price
  factors.competitorPricing = {
    impact: 0,
    explanation: `Average competitor price: $${avgCompetitorPrice.toFixed(2)} per unit. ${relevantCompetitors.map(c => c.name).join(', ')} ${relevantCompetitors.length === 1 ? 'is' : 'are'} active in this component category. Competitor pricing is shown for reference but does not affect the fair-price calculation.`,
  };

  // Final price before margin
  let estimatedPrice = currentPrice;

  // Check if any factors are actually applied (have non-zero impact)
  const hasAppliedFactors = 
    (options.includeRelationshipStrength && Math.abs(factors.relationshipStrength.impact) > 0.01) ||
    (options.includeMarketConditions && Math.abs(factors.marketConditions.impact) > 0.01) ||
    (options.includeDiscountAgreement && factors.discountAgreement && Math.abs(factors.discountAgreement.impact) > 0.01) ||
    (options.includeLiquidityStatus && factors.liquidityStatus && Math.abs(factors.liquidityStatus.impact) > 0.01);

  // Only apply margin if factors are applied OR if user explicitly sets a desired margin
  // If no factors are applied and no margin is set, price equals fair price (no margin)
  let marginImpact = 0;
  let marginWarning: { level: 'low' | 'medium' | 'high'; message: string } | undefined;
  
  if (hasAppliedFactors || desiredMarginPercent !== null) {
    // Calculate fair margin based on factors (excluding competitor pricing)
    // Base fair margin: 20-30% depending on relationship and market
    let fairMarginPercent = 20;
    if (customer.relationshipStrength > 0.7) fairMarginPercent += 5;
    if (customer.relationshipStrength < 0.5) fairMarginPercent -= 3;
    if (marketConditions.trendDirection === 'Up') fairMarginPercent += 3;
    if (marketConditions.trendDirection === 'Down') fairMarginPercent -= 2;
    if (customer.liquidityStatus === 'high') fairMarginPercent += 2;
    if (customer.liquidityStatus === 'low') fairMarginPercent -= 3;
    
    fairMarginPercent = Math.max(10, Math.min(35, fairMarginPercent)); // Clamp between 10% and 35%

    // Apply margin - margin is applied to the price after factors
    const priceBeforeMargin = estimatedPrice;
    const marginPercentToApply = desiredMarginPercent !== null ? desiredMarginPercent : fairMarginPercent;
    
    // Apply margin: margin is a percentage on top of the price after factors
    marginImpact = priceBeforeMargin * (marginPercentToApply / 100);
    estimatedPrice = priceBeforeMargin + marginImpact;
  
    if (desiredMarginPercent !== null) {
      const marginDifference = desiredMarginPercent - fairMarginPercent;
      
      // Determine warning level
      if (marginDifference > 10) {
        marginWarning = {
          level: 'high',
          message: `Desired margin (${desiredMarginPercent.toFixed(1)}%) is significantly higher than the fair margin (${fairMarginPercent.toFixed(1)}%). This may result in lost deals. Consider reducing to ${(fairMarginPercent + 5).toFixed(1)}% or less for better competitiveness.`,
        };
      } else if (marginDifference > 5) {
        marginWarning = {
          level: 'medium',
          message: `Desired margin (${desiredMarginPercent.toFixed(1)}%) is above the recommended fair margin (${fairMarginPercent.toFixed(1)}%). This may reduce win probability. Fair margin range: ${(fairMarginPercent - 2).toFixed(1)}% - ${(fairMarginPercent + 2).toFixed(1)}%.`,
        };
      } else if (marginDifference < -5) {
        marginWarning = {
          level: 'low',
          message: `Desired margin (${desiredMarginPercent.toFixed(1)}%) is below the fair margin (${fairMarginPercent.toFixed(1)}%). You may be leaving money on the table. Consider increasing to ${(fairMarginPercent - 2).toFixed(1)}% or more.`,
        };
      }
      
      factors.desiredMargin = {
        impact: marginImpact,
        explanation: `Desired margin of ${desiredMarginPercent.toFixed(1)}% applied. Fair margin recommendation: ${fairMarginPercent.toFixed(1)}% based on relationship strength, market conditions, and competitive positioning.`,
        desiredMarginPercent,
        fairMarginPercent,
        warning: marginWarning,
      };
    } else if (hasAppliedFactors) {
      factors.desiredMargin = {
        impact: marginImpact,
        explanation: `AI-recommended fair margin of ${fairMarginPercent.toFixed(1)}% applied based on relationship strength (${(customer.relationshipStrength * 100).toFixed(0)}%), market conditions (${marketConditions.trendDirection}), and competitive analysis.`,
        desiredMarginPercent: fairMarginPercent,
        fairMarginPercent,
      };
    }
    // If no factors applied and no desired margin, don't add margin factor
  }

  // Ensure price is positive and reasonable
  estimatedPrice = Math.max(estimatedPrice, basePrice * 0.7);

  // Calculate confidence score based on data completeness
  let confidenceScore = 0.7;
  if (customer.pastDeals.length > 0) confidenceScore += 0.1;
  if (customer.relationshipStrength > 0.7) confidenceScore += 0.1;
  if (relevantCompetitors.length > 0) confidenceScore += 0.1;
  confidenceScore = Math.min(confidenceScore, 0.95);

  const confidenceRange = estimatedPrice * 0.05; // 5% confidence interval
  const confidenceIntervalLower = estimatedPrice - confidenceRange;
  const confidenceIntervalUpper = estimatedPrice + confidenceRange;

  // Generate explanation
  const explanation = `Pricing workflow: Fair price of $${fairPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} calculated from value-based pricing strategy (Performance Index: ${overallScore.toFixed(1)}/100). Then adjusted by relationship strength (${(customer.relationshipStrength * 100).toFixed(0)}%), ${marketConditions.trendDirection.toLowerCase()} market conditions${customer.discountAgreement ? `, ${customer.discountAgreement.percentage}% discount agreement` : ''}${customer.liquidityStatus ? `, and ${customer.liquidityStatus} liquidity status` : ''}. Final estimated price: $${estimatedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;

  return {
    estimatedPrice,
    fairPrice,
    confidenceIntervalLower,
    confidenceIntervalUpper,
    confidenceScore,
    basePrice,
    productCategory: productData.category,
    productBaseCost: productData.baseCost,
    orderQuantity: amount,
    factors,
    explanation,
  };
}
