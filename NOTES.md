# Foodstuffs Retail Calculator - Development Notes

## Overview

This project is a retail calculator built for the Foodstuffs technical interview. It demonstrates incremental value delivery through 14 tasks, each shipping customer value independently.

## Technical Decisions

### Next.js 15 with Server Components

- **Server-side business logic**: Calculations happen on the server via Server Actions
- **Type safety**: Full TypeScript integration from client to server
- **No HTTP boilerplate**: Server Actions eliminate need for axios or manual fetch()
- **Real-world architecture**: Separates UI from business logic, ready to scale

### Zod from the Start

- **Less code**: Schema = validation + types in one place (DRY principle)
- **Runtime safety**: TypeScript types disappear at runtime; Zod validates actual data
- **Better errors**: Automatic, detailed error messages for validation failures
- **Production-ready**: Industry standard for Server Action validation
- **No refactoring**: Starting with Zod avoids rewriting manual validation later

### Vitest over Jest

- **Faster**: Significantly faster than Jest for running tests
- **Modern**: Built for Vite ecosystem, better TypeScript support
- **Better DX**: Cleaner API, better error messages

### Why NOT Test-Driven Development (TDD)?

The exercise emphasizes "shipping incremental value to customers" with each task. While TDD is valuable, it would make the PR story less clear:

- ❌ "Wrote tests for discount logic" - no customer value yet
- ❌ "Implemented discount logic" - value exists, but split across 2 PRs

Instead: Implement features with immediate customer value, then add comprehensive tests (Task 9). Each PR clearly states customer benefit: "Users can now see bulk order savings."

## Task Breakdown - Rationale

Each task is designed to deliver standalone customer value. Here's the detailed breakdown:

### Task 1: Project Initialization [5 points]

**What**: Set up Next.js 15, TypeScript, Vitest, Tailwind, Zod, Prettier, ESLint
**Why**: Foundation for all development
**Value**: Development environment ready - team can start building

### Task 2: Basic UI Structure [2 points]

**What**: Landing page with form (quantity, price, region inputs) and labels
**Why**: Users need to see and understand the interface
**Value**: Visual progress - users can see what to enter

### Task 3: Simple Calculation Display [2 points]

**What**: Calculate subtotal (quantity × price), display result
**Why**: Prove the basic flow works (form → server → result)
**Value**: Users can calculate basic order totals (no discount/tax yet)

### Task 4: Add Discount Calculation Logic [5 points]

**What**: Implement 5-tier discount system, apply to subtotal, display savings
**Why**: Core business requirement - bulk order pricing
**Value**: Users see savings from bulk orders
**Discount tiers**:

- $1,000+: 3% discount
- $5,000+: 5% discount
- $7,000+: 7% discount
- $10,000+: 10% discount
- $50,000+: 15% discount

### Task 5: Add Tax Calculation [3 points]

**What**: Implement region-based tax rates, apply to discounted price
**Why**: Complete the pricing calculation (final requirement)
**Value**: Users see complete, accurate final price with tax
**Tax rates**:

- AUK: 6.85%
- WLG: 8.00%
- WAI: 6.25%
- CHC: 4.00%
- TAS: 8.25%

### Task 6: Input Validation with Zod [5 points]

**What**: Create Zod schemas, validate in Server Actions, show errors
**Why**: Prevent invalid calculations, protect against malicious input
**Value**: Reliable calculator - users get clear error messages for bad input
**Validates**:

- Quantity: positive integer
- Price: positive number
- Region: must be one of 5 valid codes

### Task 7: Client-Side Form Validation [3 points]

**What**: HTML5 validation attributes, client error display, disable invalid submit
**Why**: Immediate feedback without server round-trip
**Value**: Better UX - instant validation feedback

### Task 8: Add Calculation Breakdown [3 points]

**What**: Show itemized breakdown (subtotal, discount %, tax, total)
**Why**: Transparency builds trust
**Value**: Users understand exactly how price is calculated

### Task 9: Add Unit Tests [5 points]

**What**: Comprehensive tests for all calculation functions
**Why**: Satisfies "at least one test" requirement, ensures accuracy
**Value**: Confidence in calculation correctness
**Tests**:

- All 5 discount tiers
- Boundary cases (999, 1000, 1001 for each tier)
- All 5 region tax rates
- Edge cases (zero, negative, very large numbers)

**Priority 1 (Must Complete): Tasks 1-6**

- Foundation + all core features working
- Total: 22 points (42% of work)

**Priority 2 (If Time Allows): Tasks 7-9**

- Polish + tests
- Total: 11 points (21% of work)

**Combined Priority 1+2: Tasks 1-9**

- Total: 33 points (62% of work)

### Task 10: Error Handling and User Feedback [3 points]

**What**: Loading states, error boundaries, user feedback messages
**Why**: Professional polish
**Value**: Reliable, trustworthy experience

### Task 11: Responsive Design and Styling [5 points]

**What**: Mobile layout, Tailwind styling, accessibility
**Why**: Professional appearance, works on all devices
**Value**: Beautiful, accessible calculator

### Task 12: Format Currency Properly [2 points]

**What**: $X,XXX.XX formatting throughout
**Why**: Professional appearance
**Value**: Easy-to-read pricing

### Task 13: Integration Tests [5 points]

**What**: Test Server Action + business logic together, test full user flow
**Why**: Confidence that pieces work together
**Value**: End-to-end reliability

### Task 14: Migrate to React Hook Form [5 points]

**What**: Replace manual form handling with react-hook-form + Zod integration
**Why**: Professional form library, better state management
**Value**: Enhanced form UX, easier maintenance

## Architecture

### Data Flow

```
User fills form (Client Component)
       ↓
Calls Server Action: calculatePriceAction(formData)
       ↓
Server validates input with Zod
       ↓
Server calls business logic: calculateFinalPrice()
       ↓
Business logic:
  - calculateSubtotal()
  - calculateDiscountAmount()
  - applyDiscount()
  - calculateTaxAmount()
  - calculateTotal()
       ↓
Server Action returns result
       ↓
Client displays breakdown
```

### Folder Structure

```
app/
  page.tsx              - Server Component (page layout)
  actions.ts            - Server Actions ('use server')
  globals.css           - Global styles
  layout.tsx            - Root layout

components/
  CalculatorForm.tsx    - Client Component (form with 'use client')
  PriceBreakdown.tsx    - Display calculation results
  InputField.tsx        - Reusable input component (if needed)

lib/
  calculator.ts         - Pure calculation functions
  constants.ts          - Discount tiers, tax rates
  schemas.ts            - Zod validation schemas
  formatters.ts         - Currency formatting utilities

types/
  index.ts              - TypeScript type definitions

__tests__/
  calculator.test.ts    - Unit tests for calculations
  actions.test.ts       - Integration tests for Server Actions
```

### Inputs

- Number of items (quantity)
- Price per item
- 3-letter region code

### Calculations

1. Subtotal = quantity × price
2. Apply discount based on subtotal:
   - $1,000+: 3%
   - $5,000+: 5%
   - $7,000+: 7%
   - $10,000+: 10%
   - $50,000+: 15%
3. Calculate tax on discounted price based on region:
   - AUK: 6.85%
   - WLG: 8.00%
   - WAI: 6.25%
   - CHC: 4.00%
   - TAS: 8.25%
4. Total = discounted price + tax

### Output

- Display total price with breakdown

## Assumptions Made

1. **Currency**: All prices in NZD ($)
2. **Discount logic**: Apply highest applicable discount tier only (not cumulative)
3. **Region codes**: Case-sensitive, must be uppercase (AUK, WLG, WAI, CHC, TAS)
4. **Tax calculation**: Tax applies to discounted price, not original subtotal
5. **Quantity**: Must be positive integer (no fractional items)
6. **Price**: Can have decimal places (cents)
7. **No persistence**: No database - calculations are stateless
8. **Single calculation**: No shopping cart - one calculation at a time

## Success Criteria

- Clean, readable TypeScript code following coding principles
- At least one comprehensive test suite (Task 9)
- Each completed task has a PR showing incremental value
- Clear communication in PRs, issues, and these notes
- Working application that meets all product specifications
- Demonstrates understanding of modern app architecture
- Shows ability to slice work for incremental delivery
