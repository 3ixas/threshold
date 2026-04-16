import type { CityConfig, CalculatorInputs, MonthlyCosts, UpfrontCosts } from './types'

function getDistrict(config: CityConfig, districtId: string) {
  const district = config.districts.find(d => d.id === districtId)
  if (!district) throw new Error(`District "${districtId}" not found in ${config.id}`)
  return district
}

function getRent(config: CityConfig, inputs: CalculatorInputs): number {
  const district = getDistrict(config, inputs.districtId)
  const rent = district.rent[inputs.propertyType]
  if (rent === undefined) {
    throw new Error(`No rent data for "${inputs.propertyType}" in district "${inputs.districtId}"`)
  }
  return rent
}

export function calculateUpfront(config: CityConfig, inputs: CalculatorInputs): UpfrontCosts {
  const rent = getRent(config, inputs)

  const securityDeposit = config.depositRule === 'five_weeks'
    ? Math.round((rent * 12 / 52) * 5 * 100) / 100
    : rent * 3

  const movingCosts = inputs.movingCostsOverride ?? config.defaults.movingCosts
  const furnitureBudget = inputs.furnitureBudgetOverride ?? config.defaults.furnitureBudget

  return {
    securityDeposit,
    firstMonthRent: rent,
    movingCosts,
    furnitureBudget,
    total: Math.round((securityDeposit + rent + movingCosts + furnitureBudget) * 100) / 100,
  }
}

export function calculateMonthly(config: CityConfig, inputs: CalculatorInputs): MonthlyCosts {
  const district = getDistrict(config, inputs.districtId)
  const rent = getRent(config, inputs)
  const { occupants } = inputs
  const d = config.defaults

  // Shared costs divided by occupant count
  const rentPerPerson = rent / occupants
  const utilitiesPerPerson = d.utilities / occupants
  const broadband = inputs.broadbandOverride ?? d.broadband
  const broadbandPerPerson = broadband / occupants

  // Council tax — London only, shared + optional single-person discount
  let councilTax = 0
  if (district.councilTaxBandD !== undefined) {
    const monthlyBandD = district.councilTaxBandD / 12
    const discounted = occupants === 1 ? monthlyBandD * 0.75 : monthlyBandD
    councilTax = discounted / occupants
  }

  // Transport — per-person, TfL zone lookup for London
  let transport: number
  if (inputs.transportOverride !== undefined) {
    transport = inputs.transportOverride
  } else if (district.tflZone !== undefined && config.tflAnnualCosts) {
    const annual = config.tflAnnualCosts[district.tflZone] ?? d.transport * 12
    transport = annual / 12
  } else {
    transport = d.transport
  }

  // Health insurance — Swiss, per-person, user-overridable
  const healthInsurance = inputs.healthInsuranceOverride ?? d.healthInsurance ?? 0
  const mediaFee = d.mediaFee ?? 0
  const tvLicence = d.tvLicence ?? 0

  // Per-person costs never divided
  const food = inputs.food ?? d.food
  const contentsInsurance = d.contentsInsurance

  const { lifestyle: ls } = inputs
  const lifestyle = ls.phone + ls.subscriptions + ls.gym + ls.eatingOut + ls.personalCare + ls.savingsTarget

  const total = Math.round((
    rentPerPerson + transport + utilitiesPerPerson + broadbandPerPerson
    + councilTax + healthInsurance + mediaFee + tvLicence
    + food + contentsInsurance + lifestyle
  ) * 100) / 100

  return {
    rent: rentPerPerson,
    transport,
    utilities: utilitiesPerPerson,
    broadband: broadbandPerPerson,
    councilTax,
    healthInsurance,
    mediaFee,
    tvLicence,
    food,
    contentsInsurance,
    lifestyle,
    total,
  }
}
