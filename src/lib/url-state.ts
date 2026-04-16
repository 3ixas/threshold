import type { CalculatorInputs, CityConfig, PropertyType } from './types'

const VALID_PROPERTY_TYPES: PropertyType[] = ['room', 'studio', '1bed', '2bed', '3bed']

function parsePositiveNumber(value: string | null): number | undefined {
  if (value === null) return undefined
  const n = Number(value)
  return isFinite(n) && n >= 0 ? n : undefined
}

export function serialise(inputs: CalculatorInputs): URLSearchParams {
  const params = new URLSearchParams()

  params.set('district', inputs.districtId)
  params.set('type', inputs.propertyType)
  params.set('people', String(inputs.occupants))

  // Lifestyle
  params.set('phone', String(inputs.lifestyle.phone))
  params.set('subs', String(inputs.lifestyle.subscriptions))
  params.set('gym', String(inputs.lifestyle.gym))
  params.set('eating', String(inputs.lifestyle.eatingOut))
  params.set('care', String(inputs.lifestyle.personalCare))
  params.set('savings', String(inputs.lifestyle.savingsTarget))

  // Optional overrides — omit when not set
  if (inputs.food !== undefined)                  params.set('food', String(inputs.food))
  if (inputs.broadbandOverride !== undefined)     params.set('broadband', String(inputs.broadbandOverride))
  if (inputs.movingCostsOverride !== undefined)   params.set('moving', String(inputs.movingCostsOverride))
  if (inputs.furnitureBudgetOverride !== undefined) params.set('furniture', String(inputs.furnitureBudgetOverride))
  if (inputs.transportOverride !== undefined)     params.set('transport', String(inputs.transportOverride))
  if (inputs.healthInsuranceOverride !== undefined) params.set('health', String(inputs.healthInsuranceOverride))
  if (inputs.takeHome !== undefined)              params.set('income', String(inputs.takeHome))
  if (inputs.savings !== undefined)               params.set('cash', String(inputs.savings))

  return params
}

export function deserialise(params: URLSearchParams, config: CityConfig): CalculatorInputs {
  const districtParam = params.get('district')
  const district = config.districts.find(d => d.id === districtParam) ?? config.districts[0]

  const typeParam = params.get('type') as PropertyType | null
  const propertyType = typeParam && VALID_PROPERTY_TYPES.includes(typeParam) ? typeParam : '1bed'

  const peopleParam = Number(params.get('people'))
  const occupants: 1 | 2 | 3 | 4 =
    peopleParam === 1 || peopleParam === 2 || peopleParam === 3 || peopleParam === 4
      ? peopleParam
      : 1

  const parseLifestyle = (key: string) => parsePositiveNumber(params.get(key)) ?? 0

  return {
    districtId: district.id,
    propertyType,
    occupants,
    lifestyle: {
      phone: parseLifestyle('phone'),
      subscriptions: parseLifestyle('subs'),
      gym: parseLifestyle('gym'),
      eatingOut: parseLifestyle('eating'),
      personalCare: parseLifestyle('care'),
      savingsTarget: parseLifestyle('savings'),
    },
    ...optional('food', params),
    ...optional('broadband', params, 'broadbandOverride'),
    ...optional('moving', params, 'movingCostsOverride'),
    ...optional('furniture', params, 'furnitureBudgetOverride'),
    ...optional('transport', params, 'transportOverride'),
    ...optional('health', params, 'healthInsuranceOverride'),
    ...optional('income', params, 'takeHome'),
    ...optional('cash', params, 'savings'),
  }
}

type OverrideKey = keyof Pick<CalculatorInputs,
  'food' | 'broadbandOverride' | 'movingCostsOverride' | 'furnitureBudgetOverride'
  | 'transportOverride' | 'healthInsuranceOverride' | 'takeHome' | 'savings'>

function optional(
  param: string,
  params: URLSearchParams,
  key?: OverrideKey,
): Partial<Pick<CalculatorInputs, OverrideKey>> {
  const value = parsePositiveNumber(params.get(param))
  if (value === undefined) return {}
  return { [key ?? param]: value } as Partial<Pick<CalculatorInputs, OverrideKey>>
}
