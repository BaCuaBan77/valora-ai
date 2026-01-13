# Valora AI Demo

A demonstration UI for the Valora AI B2B Pricing Estimator System. This is a standalone demo application that showcases the pricing estimation capabilities with mocked data.

## Features

- **Customer Selection**: Choose from various customer profiles with different relationship strengths, past deals, and discount agreements
- **Product Selection**: Select from different product tiers (Basic, Standard, Premium, Enterprise)
- **Quantity Input**: Specify the number of units
- **AI-Powered Price Estimation**: Get intelligent price estimates based on:
  - Customer valuation and preferences
  - Relationship strength and history
  - Product base costs
  - Market conditions and trends
  - Competitor pricing intelligence
  - Discount agreements
  - Customer liquidity status

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd valora-demo
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Data

All data in this demo is mocked and does not connect to any backend or database. The demo includes:

- 4 sample customers with varying profiles
- 4 product options across different tiers
- 3 competitor profiles
- Market condition data

## Note

This is a demonstration-only application. For the production system, see the main `frontend` folder.
