export type CityId = 'london' | 'basel' | 'zurich'
export type Currency = 'GBP' | 'CHF'
export type PropertyType = 'room' | 'studio' | '1bed' | '2bed' | '3bed'

// ── District / neighbourhood ───────────────────

export interface District {
  id: string
  name: string
  rent: Partial<Record<PropertyType, number>>
  /** London only — annual Band D council tax */
  councilTaxBandD?: number
  /** London only — TfL zone (affects transport cost) */
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
    tvLicence?: number       // UK only
    healthInsurance?: number // Swiss only
    mediaFee?: number        // Swiss only
  }
  /** London: 'five_weeks' (Tenant Fees Act 2019). Swiss: 'three_months' (Art. 257e CO). */
  depositRule: 'five_weeks' | 'three_months'
  /** London only — annual Travelcard cost by zone. */
  tflAnnualCosts?: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, number>>
  lastUpdated: string
}

// ── Calculator inputs ──────────────────────────

export interface LifestyleCosts {
  phone: number
  gym: number
  streaming: number
  other: number
}

export interface CalculatorInputs {
  districtId: string
  propertyType: PropertyType
  /** 1 triggers 25% council tax single-person discount in London */
  occupants: 1 | 2
  lifestyle: LifestyleCosts
  /** Override the TfL zone lookup (London) or city default transport cost */
  transportOverride?: number
  /** Override the city-level health insurance default (Swiss cities) */
  healthInsuranceOverride?: number
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
