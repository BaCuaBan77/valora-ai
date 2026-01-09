/**
 * Mock CRM Data Generator Service
 * 
 * Generates realistic sample data for development and testing purposes.
 * This service simulates CRM data including customers, competitors, products,
 * and market conditions.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  employeeCount: number;
  annualRevenue: number;
  location: {
    country: string;
    region: string;
    city: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  historicalPurchaseBehavior: {
    totalOrders: number;
    averageOrderValue: number;
    lastOrderDate: Date;
    preferredPaymentTerms: string;
    orderFrequency: 'monthly' | 'quarterly' | 'annually' | 'irregular';
  };
  relationshipStrength: number; // 0-100 score
  customerValuePreferences: string[]; // Value proposition keywords
  createdAt: Date;
  updatedAt: Date;
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number; // Percentage
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  valuePropositions: string[];
  winLossRate: {
    wins: number;
    losses: number;
    winRate: number; // Percentage
  };
  strengths: string[];
  weaknesses: string[];
  targetIndustries: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  baseCost: number;
  serviceTiers: ServiceTier[];
  features: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  targetCustomerSize: ('small' | 'medium' | 'large' | 'enterprise')[];
  costBreakdown: {
    base: number;
    perUser?: number;
    perFeature?: number;
    support: number;
    infrastructure: number;
  };
}

export interface MarketCondition {
  id: string;
  date: Date;
  industry: string;
  region: string;
  indicators: {
    economicIndex: number; // 0-100
    demandIndex: number; // 0-100
    competitionIntensity: number; // 0-100
    seasonalFactor: number; // Multiplier (0.8-1.2)
  };
  trends: {
    pricingTrend: 'increasing' | 'stable' | 'decreasing';
    marketGrowth: number; // Percentage
    keyDrivers: string[];
  };
  regionalPricingVariations: {
    [region: string]: number; // Multiplier relative to base
  };
  createdAt: Date;
}

// ============================================================================
// Data Generators
// ============================================================================

class MockCRMDataGenerator {
  private customers: Customer[] = [];
  private competitors: Competitor[] = [];
  private products: Product[] = [];
  private marketConditions: MarketCondition[] = [];

  // Industry and company name pools - Focused on Electronics Wholesale
  private readonly industries = [
    'Electronics Wholesale', 'Electronics Distribution', 'Component Wholesale',
    'Electronic Parts Distribution', 'Semiconductor Distribution', 'Consumer Electronics Wholesale',
    'Industrial Electronics', 'Electronics Manufacturing', 'Technology Distribution',
    'Electronics Supply Chain', 'Electronic Components', 'Electronics Retail'
  ];

  private readonly companyNamePrefixes = [
    'Global', 'Advanced', 'Premier', 'Elite', 'Pro', 'Tech', 'Digital', 'Smart',
    'Innovative', 'Strategic', 'Prime', 'Apex', 'Summit', 'Vertex', 'Nexus',
    'Electro', 'Component', 'Circuit', 'Micro', 'Nano', 'Semiconductor'
  ];

  private readonly companyNameSuffixes = [
    'Electronics', 'Components', 'Distribution', 'Wholesale', 'Supply', 'Group', 'Corp',
    'Enterprises', 'Industries', 'Partners', 'Associates', 'Holdings', 'Ventures',
    'Systems', 'Solutions', 'Trading', 'Import/Export'
  ];

  private readonly cities = [
    { city: 'New York', region: 'Northeast', country: 'USA' },
    { city: 'Los Angeles', region: 'West', country: 'USA' },
    { city: 'Chicago', region: 'Midwest', country: 'USA' },
    { city: 'Houston', region: 'South', country: 'USA' },
    { city: 'London', region: 'Europe', country: 'UK' },
    { city: 'Toronto', region: 'North America', country: 'Canada' },
    { city: 'Sydney', region: 'Asia-Pacific', country: 'Australia' },
    { city: 'Berlin', region: 'Europe', country: 'Germany' },
    { city: 'Tokyo', region: 'Asia-Pacific', country: 'Japan' },
    { city: 'Singapore', region: 'Asia-Pacific', country: 'Singapore' }
  ];

  private readonly valuePropositions = [
    'Cost Efficiency', 'Volume Discounts', 'Fast Delivery', 'Quality Assurance', 'Reliability',
    'Customer Support', 'Inventory Management', 'Custom Packaging', 'Bulk Pricing', 'Compliance',
    'Supply Chain Integration', 'Technical Support', 'Just-In-Time Delivery', 'Flexibility', 'Speed',
    'Warranty Coverage', 'Product Availability', 'Competitive Pricing'
  ];

  private readonly competitorNames = [
    'ElectroDist Wholesale', 'Component Source Inc', 'Global Electronics Supply',
    'Advanced Component Distributors', 'Prime Electronics Group', 'TechParts Wholesale',
    'Strategic Electronics Partners', 'Apex Component Solutions', 'Summit Electronics Supply',
    'Vertex Wholesale Electronics', 'Circuit Components Corp', 'MicroElectronics Distribution'
  ];

  private readonly productCategories = [
    'Semiconductors', 'Electronic Components', 'Circuit Boards', 'Connectors & Cables',
    'Power Supplies', 'Sensors & Actuators', 'Displays & LEDs', 'Passive Components',
    'Electromechanical Components', 'Wire & Cable', 'Tools & Equipment', 'Test Equipment'
  ];

  /**
   * Generate a random integer between min and max (inclusive)
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random float between min and max
   */
  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Pick a random element from an array
   */
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Pick multiple random elements from an array
   */
  private randomChoices<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Generate a random date within the last N days
   */
  private randomDate(daysAgo: number = 365): Date {
    const now = new Date();
    const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
  }

  /**
   * Generate a unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a company name - Electronics Wholesale focused
   */
  private generateCompanyName(): string {
    const prefix = this.randomChoice(this.companyNamePrefixes);
    const suffix = this.randomChoice(this.companyNameSuffixes);
    
    // Electronics wholesale company name patterns
    const pattern = this.randomInt(0, 4);
    
    switch (pattern) {
      case 0:
        return `${prefix} ${suffix}`;
      case 1:
        return `${prefix} Electronics ${suffix}`;
      case 2:
        return `${prefix} Component ${suffix}`;
      case 3:
        return `${prefix} ${suffix} Electronics`;
      case 4:
        return `${this.randomChoice(['Electro', 'Component', 'Circuit', 'Micro'])} ${suffix}`;
      default:
        return `${prefix} ${suffix}`;
    }
  }

  /**
   * Generate customer data
   */
  generateCustomer(): Customer {
    const size = this.randomChoice(['small', 'medium', 'large', 'enterprise'] as const);
    // Bias towards Electronics Wholesale industry (70% chance)
    const industry = Math.random() < 0.7 
      ? 'Electronics Wholesale' 
      : this.randomChoice(this.industries);
    const location = this.randomChoice(this.cities);
    const companyName = this.generateCompanyName();
    
    // Size-based attributes
    const sizeConfig = {
      small: { employees: [10, 50], revenue: [500000, 5000000] },
      medium: { employees: [51, 250], revenue: [5000001, 50000000] },
      large: { employees: [251, 1000], revenue: [50000001, 500000000] },
      enterprise: { employees: [1001, 10000], revenue: [500000001, 5000000000] }
    };

    const config = sizeConfig[size];
    const employeeCount = this.randomInt(config.employees[0], config.employees[1]);
    const annualRevenue = this.randomInt(config.revenue[0], config.revenue[1]);

    // Historical purchase behavior (electronics wholesale typically has frequent orders)
    const totalOrders = this.randomInt(1, size === 'enterprise' ? 200 : size === 'large' ? 100 : size === 'medium' ? 50 : 20);
    const averageOrderValue = this.randomInt(5000, annualRevenue / 10);
    const lastOrderDate = this.randomDate(90); // More recent orders for wholesale
    // Electronics wholesale tends to have more frequent orders
    const orderFrequency = this.randomChoice(['monthly', 'quarterly', 'monthly', 'monthly', 'quarterly'] as const);
    const preferredPaymentTerms = this.randomChoice(['Net 30', 'Net 60', 'Net 30', 'Net 30', 'Net 90', 'Due on Receipt']);

    // Relationship strength (0-100)
    const relationshipStrength = this.randomInt(20, 100);

    // Customer value preferences (2-5 preferences)
    const valuePreferences = this.randomChoices(this.valuePropositions, this.randomInt(2, 5));

    const customerId = this.generateId('CUST');
    const domain = companyName.toLowerCase().replace(/\s+/g, '');
    
    return {
      id: customerId,
      name: companyName,
      industry,
      size,
      employeeCount,
      annualRevenue,
      location: {
        country: location.country,
        region: location.region,
        city: location.city
      },
      contactInfo: {
        email: `contact@${domain}.com`,
        phone: `+1-${this.randomInt(200, 999)}-${this.randomInt(200, 999)}-${this.randomInt(1000, 9999)}`,
        website: `https://www.${domain}.com`
      },
      historicalPurchaseBehavior: {
        totalOrders,
        averageOrderValue,
        lastOrderDate,
        preferredPaymentTerms,
        orderFrequency
      },
      relationshipStrength,
      customerValuePreferences: valuePreferences,
      createdAt: this.randomDate(730),
      updatedAt: new Date()
    };
  }

  /**
   * Generate competitor data
   */
  generateCompetitor(): Competitor {
    const name = this.randomChoice(this.competitorNames);
    const marketShare = this.randomFloat(5, 25); // 5-25% market share
    const averagePrice = this.randomInt(10000, 200000);
    const priceRange = {
      min: Math.round(averagePrice * 0.6),
      max: Math.round(averagePrice * 1.4)
    };

    const valuePropositions = this.randomChoices(this.valuePropositions, this.randomInt(3, 6));
    const strengths = this.randomChoices([
      'Strong brand recognition', 'Lower pricing', 'Better customer support',
      'Wide product selection', 'Fast shipping', 'Better inventory management',
      'Volume discounts', 'More flexible payment terms', 'Technical expertise',
      'Global supply chain', 'Quality assurance programs'
    ], this.randomInt(2, 4));

    const weaknesses = this.randomChoices([
      'Limited product range', 'Higher pricing', 'Slow delivery',
      'Poor customer support', 'Inventory shortages', 'Limited customization',
      'Slow order processing', 'Rigid payment terms', 'Limited technical support'
    ], this.randomInt(1, 3));

    // Competitors in electronics wholesale primarily target electronics-related industries
    const targetIndustries = this.randomChoices(this.industries, this.randomInt(2, 6));

    // Win/loss rate
    const totalDeals = this.randomInt(50, 500);
    const winRate = this.randomFloat(30, 70);
    const wins = Math.round(totalDeals * (winRate / 100));
    const losses = totalDeals - wins;

    return {
      id: this.generateId('COMP'),
      name,
      marketShare,
      averagePrice,
      priceRange,
      valuePropositions,
      winLossRate: {
        wins,
        losses,
        winRate: Math.round(winRate * 100) / 100
      },
      strengths,
      weaknesses,
      targetIndustries,
      createdAt: this.randomDate(1095),
      updatedAt: new Date()
    };
  }

  /**
   * Generate product/service data - Electronics Wholesale focused
   */
  generateProduct(): Product {
    const category = this.randomChoice(this.productCategories);
    // Electronics wholesale products have wider price ranges
    const baseCost = this.randomInt(1000, 100000);
    
    const productNames = {
      'Semiconductors': ['Microprocessors', 'Memory Chips', 'Integrated Circuits', 'Transistors', 'Diodes'],
      'Electronic Components': ['Resistors', 'Capacitors', 'Inductors', 'Oscillators', 'Crystals'],
      'Circuit Boards': ['PCBs', 'Prototype Boards', 'Development Boards', 'Custom PCBs'],
      'Connectors & Cables': ['USB Cables', 'HDMI Cables', 'Power Connectors', 'Data Cables', 'Adapter Cables'],
      'Power Supplies': ['AC/DC Adapters', 'Power Modules', 'Battery Packs', 'Chargers', 'Voltage Regulators'],
      'Sensors & Actuators': ['Temperature Sensors', 'Motion Sensors', 'Pressure Sensors', 'Servo Motors'],
      'Displays & LEDs': ['LCD Screens', 'OLED Displays', 'LED Strips', '7-Segment Displays', 'Touchscreens'],
      'Passive Components': ['Resistors', 'Capacitors', 'Inductors', 'Transformers', 'Fuses'],
      'Electromechanical Components': ['Switches', 'Relays', 'Motors', 'Solenoids', 'Connectors'],
      'Wire & Cable': ['Copper Wire', 'Fiber Optic Cable', 'Coaxial Cable', 'Ethernet Cable', 'Power Cable'],
      'Tools & Equipment': ['Soldering Stations', 'Multimeters', 'Oscilloscopes', 'Test Probes', 'Workbenches'],
      'Test Equipment': ['Signal Generators', 'Power Supplies', 'Logic Analyzers', 'Spectrum Analyzers']
    };

    const nameOptions = productNames[category as keyof typeof productNames] || ['Component'];
    const name = `${this.randomChoice(nameOptions)} - ${category}`;

    // Generate service tiers
    const tierNames = ['Starter', 'Professional', 'Enterprise', 'Premium'];
    const serviceTiers: ServiceTier[] = tierNames.map((tierName, index) => {
      const tierMultiplier = [0.6, 1.0, 1.5, 2.0][index];
      const tierPrice = Math.round(baseCost * tierMultiplier);
      
      const baseFeatures = [
        'Standard packaging',
        'Basic support',
        'Standard delivery',
        'Email support',
        'Product datasheets'
      ];

      const tierFeatures = [...baseFeatures];
      if (index >= 1) tierFeatures.push('Priority support', 'Volume discounts', 'Faster shipping');
      if (index >= 2) tierFeatures.push('Dedicated account manager', 'Custom packaging', 'Technical consultation');
      if (index >= 3) tierFeatures.push('24/7 support', 'White-glove service', 'Custom labeling', 'Just-in-time delivery');

      return {
        id: this.generateId('TIER'),
        name: tierName,
        price: tierPrice,
        features: tierFeatures,
        targetCustomerSize: index === 0 ? ['small'] : 
                          index === 1 ? ['small', 'medium'] :
                          index === 2 ? ['medium', 'large'] : 
                          ['large', 'enterprise'],
        costBreakdown: {
          base: Math.round(tierPrice * 0.5),
          perUser: index >= 1 ? this.randomInt(10, 50) : undefined,
          perFeature: index >= 2 ? this.randomInt(100, 500) : undefined,
          support: Math.round(tierPrice * 0.2),
          infrastructure: Math.round(tierPrice * 0.3)
        }
      };
    });

    const allFeatures = [
      'Bulk pricing available', 'Quality certification', 'RoHS compliant', 'Custom packaging',
      'Technical documentation', 'Sample availability', 'Warranty coverage', 'Fast shipping',
      'Inventory tracking', 'Drop shipping', 'Kitting services', 'Assembly services',
      'Custom specifications', 'Multi-location fulfillment'
    ];

    return {
      id: this.generateId('PROD'),
      name,
      category,
      baseCost,
      serviceTiers,
      features: this.randomChoices(allFeatures, this.randomInt(5, 8)),
      description: `High-quality ${category.toLowerCase()} for electronics wholesale and distribution.`,
      createdAt: this.randomDate(1095),
      updatedAt: new Date()
    };
  }

  /**
   * Generate market condition data
   */
  generateMarketCondition(): MarketCondition {
    // Bias towards Electronics Wholesale industry (70% chance)
    const industry = Math.random() < 0.7 
      ? 'Electronics Wholesale' 
      : this.randomChoice(this.industries);
    const region = this.randomChoice(this.cities).region;
    const date = this.randomDate(90); // Last 90 days

    // Economic indicators (0-100)
    const economicIndex = this.randomInt(40, 90);
    const demandIndex = this.randomInt(30, 95);
    const competitionIntensity = this.randomInt(50, 100);

    // Seasonal factor (0.8-1.2 multiplier)
    const month = date.getMonth();
    const seasonalFactor = month >= 10 || month <= 1 ? 1.1 : // Q4/Q1 higher
                         month >= 6 && month <= 8 ? 0.9 : // Summer lower
                         1.0;

    // Pricing trend
    const pricingTrend = this.randomChoice(['increasing', 'stable', 'decreasing'] as const);
    const marketGrowth = this.randomFloat(-5, 15); // -5% to +15%

    const keyDrivers = this.randomChoices([
      'Supply chain optimization', 'Component shortages', 'Regulatory compliance (RoHS, REACH)',
      'Market consolidation', 'Technology innovation', 'Customer demand',
      'Economic conditions', 'Competitive pricing', 'Global trade policies',
      'Semiconductor demand', 'IoT growth', 'Automotive electronics demand',
      'Consumer electronics trends', 'Manufacturing automation'
    ], this.randomInt(2, 4));

    // Regional pricing variations
    const regions = ['Northeast', 'West', 'Midwest', 'South', 'Europe', 'Asia-Pacific', 'North America'];
    const regionalPricingVariations: { [key: string]: number } = {};
    regions.forEach(reg => {
      regionalPricingVariations[reg] = this.randomFloat(0.85, 1.15);
    });

    return {
      id: this.generateId('MKT'),
      date,
      industry,
      region,
      indicators: {
        economicIndex,
        demandIndex,
        competitionIntensity,
        seasonalFactor
      },
      trends: {
        pricingTrend,
        marketGrowth: Math.round(marketGrowth * 100) / 100,
        keyDrivers
      },
      regionalPricingVariations,
      createdAt: new Date()
    };
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  /**
   * Generate a batch of customers
   */
  generateCustomers(count: number = 50): Customer[] {
    const customers: Customer[] = [];
    for (let i = 0; i < count; i++) {
      customers.push(this.generateCustomer());
    }
    this.customers = [...this.customers, ...customers];
    return customers;
  }

  /**
   * Generate a batch of competitors
   */
  generateCompetitors(count: number = 10): Competitor[] {
    const competitors: Competitor[] = [];
    for (let i = 0; i < count; i++) {
      competitors.push(this.generateCompetitor());
    }
    this.competitors = [...this.competitors, ...competitors];
    return competitors;
  }

  /**
   * Generate a batch of products
   */
  generateProducts(count: number = 15): Product[] {
    const products: Product[] = [];
    for (let i = 0; i < count; i++) {
      products.push(this.generateProduct());
    }
    this.products = [...this.products, ...products];
    return products;
  }

  /**
   * Generate a batch of market conditions
   */
  generateMarketConditions(count: number = 30): MarketCondition[] {
    const conditions: MarketCondition[] = [];
    for (let i = 0; i < count; i++) {
      conditions.push(this.generateMarketCondition());
    }
    this.marketConditions = [...this.marketConditions, ...conditions];
    return conditions;
  }

  /**
   * Generate all data types with default counts
   */
  generateAllData(options?: {
    customers?: number;
    competitors?: number;
    products?: number;
    marketConditions?: number;
  }): {
    customers: Customer[];
    competitors: Competitor[];
    products: Product[];
    marketConditions: MarketCondition[];
  } {
    return {
      customers: this.generateCustomers(options?.customers || 50),
      competitors: this.generateCompetitors(options?.competitors || 10),
      products: this.generateProducts(options?.products || 15),
      marketConditions: this.generateMarketConditions(options?.marketConditions || 30)
    };
  }

  /**
   * Get all generated customers
   */
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  /**
   * Get all generated competitors
   */
  getCompetitors(): Competitor[] {
    return [...this.competitors];
  }

  /**
   * Get all generated products
   */
  getProducts(): Product[] {
    return [...this.products];
  }

  /**
   * Get all generated market conditions
   */
  getMarketConditions(): MarketCondition[] {
    return [...this.marketConditions];
  }

  /**
   * Get a customer by ID
   */
  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  /**
   * Get a competitor by ID
   */
  getCompetitorById(id: string): Competitor | undefined {
    return this.competitors.find(c => c.id === id);
  }

  /**
   * Get a product by ID
   */
  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  /**
   * Clear all generated data
   */
  clearAll(): void {
    this.customers = [];
    this.competitors = [];
    this.products = [];
    this.marketConditions = [];
  }

  /**
   * Get statistics about generated data
   */
  getStatistics(): {
    customers: number;
    competitors: number;
    products: number;
    marketConditions: number;
  } {
    return {
      customers: this.customers.length,
      competitors: this.competitors.length,
      products: this.products.length,
      marketConditions: this.marketConditions.length
    };
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const mockCRMService = new MockCRMDataGenerator();

// Export the class for testing or custom instances
export default MockCRMDataGenerator;

