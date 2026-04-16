import type { CityConfig, CalculatorInputs } from './types'
import { serialise, deserialise } from './url-state'

export function serialiseScenarioB(inputs: CalculatorInputs): URLSearchParams {
  const base = serialise(inputs)
  const result = new URLSearchParams()
  for (const [key, value] of base.entries()) {
    result.set(`b_${key}`, value)
  }
  return result
}

export function deserialiseScenarioB(allParams: URLSearchParams, config: CityConfig): CalculatorInputs {
  const bParams = new URLSearchParams()
  for (const [key, value] of allParams.entries()) {
    if (key.startsWith('b_')) {
      bParams.set(key.slice(2), value)
    }
  }
  return deserialise(bParams, config)
}

export function hasScenarioB(params: URLSearchParams): boolean {
  return params.has('b_district')
}

export function mergeScenariosIntoParams(
  aParams: URLSearchParams,
  bParams: URLSearchParams,
): URLSearchParams {
  const merged = new URLSearchParams(aParams)
  for (const [key, value] of bParams.entries()) {
    merged.set(key, value)
  }
  return merged
}
