export interface Customer {
  id: string;
  name: string;
  industry: string;
  size: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  relationshipStrength: number;
  pastDeals: Array<{
    date: string;
    product: string;
    amount: number;
    price: number;
    status: 'won' | 'lost';
  }>;
  discountAgreement?: {
    type: 'volume' | 'loyalty' | 'strategic';
    percentage: number;
  };
  valuePreferences: string[];
  liquidityStatus?: 'high' | 'normal' | 'low';
  news?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  baseCost: number;
  tier: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  features: string[];
}

export interface Competitor {
  id: string;
  name: string;
  productCategory: string;
  basePrice: number;
  priceRangeMin: number;
  priceRangeMax: number;
  marketShare: number;
}

export interface MarketCondition {
  date: string;
  industry: string;
  trendDirection: 'Up' | 'Down' | 'Stable';
  economicIndicator: number;
  seasonalFactor: number;
  news: string[];
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'ElectroRetail Chain',
    industry: 'Electronics Retail',
    size: 'Enterprise',
    relationshipStrength: 0.92,
    pastDeals: [
      { date: '2024-01-15', product: 'Microcontroller Series (STM32)', amount: 5000, price: 47500, status: 'won' },
      { date: '2023-08-20', product: 'OLED Displays (128x64)', amount: 2000, price: 18000, status: 'won' },
    ],
    discountAgreement: { type: 'strategic', percentage: 5 },
    valuePreferences: ['Fast Lead Times', 'Quality Certifications', 'Bulk Availability'],
    liquidityStatus: 'high',
    news: ['Expanding to 50 new store locations', 'Strong Q1 2024 sales performance'],
  },
  {
    id: '2',
    name: 'CircuitBoard Manufacturing',
    industry: 'Electronics Manufacturing',
    size: 'Large',
    relationshipStrength: 0.75,
    pastDeals: [
      { date: '2023-11-10', product: 'Passive Components Kit', amount: 10000, price: 8500, status: 'won' },
      { date: '2023-05-05', product: 'Resistor Assortment', amount: 5000, price: 4000, status: 'lost' },
    ],
    discountAgreement: { type: 'volume', percentage: 3 },
    valuePreferences: ['Cost Efficiency', 'Consistent Quality', 'Large Volume Orders'],
    liquidityStatus: 'normal',
  },
  {
    id: '3',
    name: 'MakerSpace Electronics',
    industry: 'Electronics Hobbyist',
    size: 'Small',
    relationshipStrength: 0.45,
    pastDeals: [
      { date: '2023-12-01', product: 'Arduino Starter Kit', amount: 50, price: 4500, status: 'won' },
    ],
    valuePreferences: ['Affordability', 'Small Order Quantities', 'Educational Support'],
    liquidityStatus: 'low',
    news: ['Small business, limited purchasing budget'],
  },
  {
    id: '4',
    name: 'SmartDevice Distributors',
    industry: 'Electronics Distribution',
    size: 'Medium',
    relationshipStrength: 0.68,
    pastDeals: [
      { date: '2024-02-01', product: 'WiFi Modules (ESP32)', amount: 3000, price: 27000, status: 'won' },
      { date: '2023-09-15', product: 'Sensors Bundle', amount: 2500, price: 22500, status: 'won' },
    ],
    discountAgreement: { type: 'loyalty', percentage: 2 },
    valuePreferences: ['Reliable Supply Chain', 'Technical Documentation', 'Warranty Coverage'],
    liquidityStatus: 'high',
    news: ['Strong IoT market growth', 'New distribution partnerships'],
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Microcontroller Series (STM32)',
    category: 'Microcontrollers',
    baseCost: 8.50,
    tier: 'Enterprise',
    features: ['ARM Cortex-M4', '512KB Flash', 'Industrial Grade', 'Extended Temperature Range', 'RoHS Compliant'],
  },
  {
    id: '2',
    name: 'OLED Displays (128x64)',
    category: 'Displays',
    baseCost: 9.00,
    tier: 'Premium',
    features: ['I2C Interface', 'High Contrast', 'Low Power Consumption', 'Wide Viewing Angle', '3-Year Warranty'],
  },
  {
    id: '3',
    name: 'WiFi Modules (ESP32)',
    category: 'Wireless Modules',
    baseCost: 8.50,
    tier: 'Standard',
    features: ['Dual Core', 'WiFi + Bluetooth', '32 GPIO Pins', 'Arduino Compatible', 'FCC Certified'],
  },
  {
    id: '4',
    name: 'Passive Components Kit',
    category: 'Passive Components',
    baseCost: 7.50,
    tier: 'Basic',
    features: ['Resistors & Capacitors', 'Standard Values', '5% Tolerance', 'Bulk Packaging'],
  },
];

export const competitors: Competitor[] = [
  {
    id: '1',
    name: 'ComponentSource Wholesale',
    productCategory: 'Microcontrollers',
    basePrice: 9.50,
    priceRangeMin: 8.50,
    priceRangeMax: 11.00,
    marketShare: 25,
  },
  {
    id: '2',
    name: 'ElectroParts Direct',
    productCategory: 'Wireless Modules',
    basePrice: 10.80,
    priceRangeMin: 10.50,
    priceRangeMax: 12.50,
    marketShare: 30,
  },
  {
    id: '3',
    name: 'Global Inc',
    productCategory: 'Displays',
    basePrice: 9.50,
    priceRangeMin: 8.50,
    priceRangeMax: 10.50,
    marketShare: 20,
  },
];

export const marketConditions: MarketCondition = {
  date: '2024-03-15',
  industry: 'Electronics Wholesale',
  trendDirection: 'Up',
  economicIndicator: 1.05,
  seasonalFactor: 1.02,
  news: [
    'Electronics component demand up 15% YoY',
    'IoT and smart device market driving growth',
    'Supply chain stability improving after chip shortage',
    'Q1 2024 electronics wholesale confidence high',
  ],
};
