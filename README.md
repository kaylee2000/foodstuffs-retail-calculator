# Foodstuffs Retail Calculator

A retail price calculator that applies tiered discounts and region-based tax rates, built with Next.js 15 and TypeScript for the Foodstuffs technical interview.

## Features

- **Clean architecture** with UI and business logic separation
- Calculate order totals with tiered bulk discounts
- Apply region-specific tax rates
- Server-side business logic with Next.js Server Actions
- Full TypeScript type safety
- Input validation with Zod
- Comprehensive test coverage with Vitest
- Responsive, modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Format all files with Prettier
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Usage

1. Enter the number of items
2. Enter the price per item
3. Select your region (AUK, WLG, WAI, CHC, TAS)
4. Click "Calculate" to see your total with discount and tax applied

## Discount Tiers

| Order Value | Discount |
| ----------- | -------- |
| $1,000+     | 3%       |
| $5,000+     | 5%       |
| $7,000+     | 7%       |
| $10,000+    | 10%      |
| $50,000+    | 15%      |

## Tax Rates by Region

| Region | Tax Rate |
| ------ | -------- |
| AUK    | 6.85%    |
| WLG    | 8.00%    |
| WAI    | 6.25%    |
| CHC    | 4.00%    |
| TAS    | 8.25%    |

## Documentation

- **[NOTES.md](./NOTES.md)** - Comprehensive development notes, technical decisions, task breakdown with rationale
