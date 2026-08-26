import type { ApiEntry, ApisConfig, FetchOptions, FetchResult, UrlOptions } from "./types";

/**
 * Central registry for API configurations.
 *
 * Usage:
 *   useApiManager.initApis(config)
 *   const url = useApiManager.buildApiUrl('github', 'repos', { params: { owner } })
 *   const { data } = await useApiManager.fetchApi<Repo[]>('github', 'repos')
 */
export class ApiManager {
  private static instance: ApiManager | null = null;

  private apis: ApisConfig = {};

  private constructor() {}

  /** Shared app-wide instance. */
  static getInstance(): ApiManager {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  /** Normalize and register an API config. Returns the normalized config. */
  initApis(source: Record<string, unknown>): ApisConfig {
    this.apis = ApiManager.normalize(source);
    return this.apis;
  }

  getApis(): ApisConfig {
    return this.apis;
  }

  buildApiUrl(apiName: string, endpointName: string, options: UrlOptions = {}): string {
    const api: ApiEntry | undefined = this.apis[apiName];
    if (!api) {
      throw new Error(
        `API "${apiName}" not found. Available: ${Object.keys(this.apis).join(", ")}`,
      );
    }

    const endpoints = api.endpoints ?? {};
    const template = endpoints[endpointName];
    if (!template) {
      throw new Error(
        `Endpoint "${endpointName}" not found in "${apiName}". Available: ${Object.keys(endpoints).join(", ")}`,
      );
    }

    let path = template;
    if (options.params) {
      for (const [k, v] of Object.entries(options.params)) {
        path = path.replace(new RegExp(`:${k}\\b`, "g"), encodeURIComponent(String(v)));
      }
    }

    const defaults = api.defaultQueryParams?.[endpointName] ?? {};
    const merged: Record<string, string> = {};
    for (const [k, v] of Object.entries(defaults)) {
      merged[k] = String(v);
    }

    if (options.query) {
      for (const [k, v] of Object.entries(options.query)) {
        if (v === undefined || v === null) {
          delete merged[k];
        } else {
          merged[k] = String(v);
        }
      }
    }

    const url = new URL(`${api.baseUri}${path}`);
    for (const [k, v] of Object.entries(merged)) {
      url.searchParams.set(k, v);
    }

    return url.toString();
  }

  async fetchApi<T = unknown>(
    apiName: string,
    endpointName: string,
    options: FetchOptions = {},
  ): Promise<FetchResult<T>> {
    const { params, query, ...init } = options;
    const url = this.buildApiUrl(apiName, endpointName, { params, query });

    const res = await fetch(url, init);
    if (!res.ok) {
      throw new Error(`API Error [${apiName}/${endpointName}]: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as T;

    return { data, url, status: res.status, ok: res.ok };
  }

  private static trim(value: string): string {
    return value.trim();
  }

  /**
   * Accepts a loose config (snake_case aliases such as `baseUrl` or `routes`)
   * and returns a strict, trimmed ApisConfig.
   */
  private static normalize(raw: Record<string, unknown>): ApisConfig {
    const out: ApisConfig = {};

    for (const [key, val] of Object.entries(raw)) {
      const v = (val ?? {}) as Record<string, unknown>;
      const endpoints = (v.endpoints ?? v.routes ?? {}) as Record<string, string>;
      const baseUri = ApiManager.trim(String(v.baseUri ?? v.baseUrl ?? "")).replace(/\/+$/, "");
      const rawDefaults = (v.defaultQueryParams ?? {}) as Record<string, Record<string, unknown>>;

      const defaults: Record<string, Record<string, string | number>> = {};
      for (const [ep, qs] of Object.entries(rawDefaults)) {
        const endpointKey = ApiManager.trim(ep);
        defaults[endpointKey] = {};
        for (const [qk, qv] of Object.entries(qs)) {
          defaults[endpointKey][ApiManager.trim(qk)] = qv as string | number;
        }
      }

      out[ApiManager.trim(key)] = {
        baseUri,
        endpoints: Object.fromEntries(
          Object.entries(endpoints).map(([k, p]) => [ApiManager.trim(k), ApiManager.trim(p)]),
        ),
        defaultQueryParams: defaults,
      };
    }

    return out;
  }
}

/** App-wide singleton — use this everywhere instead of creating instances. */
export const useFetchApi = ApiManager.getInstance();

export default ApiManager;

// Backwards-compatible function API, delegating to the singleton.
export function initApis(source: Record<string, unknown>): ApisConfig {
  return useFetchApi.initApis(source);
}

export function getApis(): ApisConfig {
  return useFetchApi.getApis();
}

export function buildApiUrl(
  apiName: string,
  endpointName: string,
  options: UrlOptions = {},
): string {
  return useFetchApi.buildApiUrl(apiName, endpointName, options);
}

export function fetchApi<T = unknown>(
  apiName: string,
  endpointName: string,
  options: FetchOptions = {},
): Promise<FetchResult<T>> {
  return useFetchApi.fetchApi<T>(apiName, endpointName, options);
}
