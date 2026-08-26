import { useMemo } from 'react'
import { useApiManager } from './core'
import type { UrlOptions } from './types'

export function useApiUrl(apiName: string, endpointName: string, options?: UrlOptions): string {
	return useMemo(
		() => useApiManager.buildApiUrl(apiName, endpointName, options),
		[apiName, endpointName, JSON.stringify(options)],
	)
}
