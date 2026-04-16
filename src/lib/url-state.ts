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
  params.set('phone', String(inputs.lifestyle.phone))
  params.set('gym', String(inputs.lifestyle.gym))
  params.set('streaming', String(inputs.lifestyle.streaming))
  params.set('other', String(inputs.lifestyle.other))

  if (inputs.transportOverride !== undefined) {
    params.set('transport', String(inputs.transportOverride))
  }
  if (inputs.healthInsuranceOverride !== undefined) {
    params.set('health', String(inputs.healthInsuranceOverride))
  }

  return params
}

export function deserialise(params: URLSearchParams, config: CityConfig): CalculatorInputs {
  const districtParam = params.get('district')
  const district = config.districts.find(d => d.id === districtParam) ?? config.districts[0]

  const typeParam = params.get('type') as PropertyType | null
  const propertyType = typeParam && VALID_PROPERTY_TYPES.includes(typeParam)
    ? typeParam
    : '1bed'

  const peopleParam = Number(params.get('people'))
  const occupants: 1 | 2 = peopleParam === 1 || peopleParam === 2 ? peopleParam : 1

  const parseLifestyle = (key: string) => parsePositiveNumber(params.get(key)) ?? 0

  const transportOverride = parsePositiveNumber(params.get('transport'))
  const healthInsuranceOverride = parsePositiveNumber(params.get('health'))

  return {
    districtId: district.id,
    propertyType,
    occupants,
    lifestyle: {
      phone: parseLifestyle('phone'),
      gym: parseLifestyle('gym'),
      streaming: parseLifestyle('streaming'),
      other: parseLifestyle('other'),
    },
    ...(transportOverride !== undefined && { transportOverride }),
    ...(healthInsuranceOverride !== undefined && { healthInsuranceOverride }),
  }
}
