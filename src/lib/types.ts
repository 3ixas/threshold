export type CityId = 'london' | 'basel' | 'zurich'
export type Currency = 'GBP' | 'CHF'
export type PropertyType = 'room' | 'studio' | '1bed' | '2bed' | '3bed'

// ── District / neighbourhood ───────────────────

export interface District {
  id: string
  name: string
  rent: Partial<Record<PropertyType, number>>
  councilTaxBandD?: number
  tflZone?: 1 | 2 | 3 | 4 | 5 | 6
}

// ── City configuration ─────────────────────────

export interface CityConfig {
  id: CityId
  name: string
  currency: Currency
  districts: District[]
  defaults: {
    transport: number
    utilities: number
    broadband: number
    food: number
    contentsInsurance: number
    movingCosts: number
    furnitureBudget: number
    tvLicence?: number
    healthInsurance?: number
    mediaFee?: number
  }
  depositRule: 'five_weeks' | 'three_months'
  tflAnnualCosts?: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, number>>
  lastUpdated: string
}

// ── Calculator inputs ──────────────────────────

export interface LifestyleCosts {
  phone: number
  subscriptions: number
  gym: number
  eatingOut: number
  personalCare: number
  savingsTarget: number
}

export interface CalculatorInputs {
  districtId: string
  propertyType: PropertyType
  /** 1 = alone; 2 = with partner or 1 flatmate; 3 = with 2 flatmates; 4 = with 3 flatmates */
  occupants: 1 | 2 | 3 | 4
  lifestyle: LifestyleCosts
  /** User-specified food budget (£/month). Overrides city default. */
  food?: number
  /** Overrides city default broadband cost */
  broadbandOverride?: number
  /** Overrides city default moving cost */
  movingCostsOverride?: number
  /** Overrides city default furniture budget */
  furnitureBudgetOverride?: number
  /** Overrides TfL zone-derived transport cost (London) */
  transportOverride?: number
  /** Overrides city default health insurance (Swiss) */
  healthInsuranceOverride?: number
  /** Monthly net take-home pay (optional affordability input) */
  takeHome?: number
  /** Current savings (optional affordability input) */
  savings?: number
}

// ── Calculation outputs ────────────────────────

export interface MonthlyCosts {
  rent: number
  transport: number
  utilities: number
  broadband: number
  councilTax: number
  healthInsurance: number
  mediaFee: number
  tvLicence: number
  food: number
  contentsInsurance: number
  lifestyle: number
  total: number
}

export interface UpfrontCosts {
  securityDeposit: number
  firstMonthRent: number
  movingCosts: number
  furnitureBudget: number
  total: number
}

export interface CalculationResult {
  monthly: MonthlyCosts
  upfront: UpfrontCosts
  currency: Currency
  districtName: string
  propertyType: PropertyType
}
