import { useCallback, useState } from 'react'

type NavigationOptions = {
  replace?: boolean
}

export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams, options?: NavigationOptions) => void,
] {
  const [searchParams, setSearchParamsState] = useState(
    () => new URLSearchParams(window.location.search),
  )

  const setSearchParams = useCallback((params: URLSearchParams, options: NavigationOptions = {}) => {
    const nextParams = new URLSearchParams(params)
    const query = nextParams.toString()
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    const method = options.replace ? 'replaceState' : 'pushState'

    window.history[method]({}, '', nextUrl)
    setSearchParamsState(nextParams)
  }, [])

  return [searchParams, setSearchParams]
}
