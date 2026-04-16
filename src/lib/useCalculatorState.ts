import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CalculatorInputs, CityConfig } from './types'
import { serialise, deserialise } from './url-state'

export function useCalculatorState(config: CityConfig): [CalculatorInputs, (inputs: CalculatorInputs) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo(() => deserialise(searchParams, config), [searchParams, config])

  const setState = useCallback(
    (inputs: CalculatorInputs) => {
      setSearchParams(serialise(inputs), { replace: true })
    },
    [setSearchParams],
  )

  return [state, setState]
}
