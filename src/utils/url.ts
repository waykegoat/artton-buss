const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export const isDemoBuild = import.meta.env.VITE_DEMO_MODE === 'true'

export function assetUrl(path: string): string {
  return `${basePath}/${path.replace(/^\//, '')}`
}

export function apiUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}/${path.replace(/^\//, '')}` : `/${path.replace(/^\//, '')}`
}
