import { appConfig } from './config'

// Types based on API specification
export interface TSembako {
  id: number
  sembako_id: number
  provinsi_id: string
  provinsi_nama: string | null
  kabupaten_kota_id: string
  kabupaten_kota_nama: string | null
  kecamatan_id: string
  kecamatan_nama: string | null
  kelurahan_id: string
  kelurahan_nama: string | null
  harga: string
  status: 'mahal' | 'murah' | 'normal' | null
  source: string
  survey_at: string
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  sembako: {
    id: number
    nama: string
    satuan: string
    image?: string | null
    nama_pasar?: string | null
  }
}

export interface TSembakoListParams {
  sembako_id?: number
  provinsi_id?: string
  kabupaten_kota_id?: string
  kecamatan_id?: string
  kelurahan_id?: string
  nama_pasar?: string
  source?: string
  page?: number
  limit?: number
}

export interface TSembakoListResponse {
  success: boolean
  message: string
  data: {
    data: TSembako[]
    pagination: {
      page: number
      limit: number
      total: number
      total_pages: number
    }
  }
}

export interface TSembakoSingleResponse {
  success: boolean
  message: string
  data: TSembako
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors: Record<string, string> | null
}

export interface Provinsi {
  id: string
  nama: string
}

export interface ProvinsiListResponse {
  success: boolean
  message: string
  data: Provinsi[]
}

export interface KabupatenKota {
  id: string
  nama: string
}

export interface KabupatenKotaListResponse {
  success: boolean
  message: string
  data: KabupatenKota[]
}

export interface Sembako {
  id: number
  nama: string
  satuan: string
  image?: string | null
}

export interface SembakoSimpleListResponse {
  success: boolean
  message: string
  data: Sembako[]
}

/**
 * Normalize base URL by ensuring it ends with exactly one trailing slash
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '') + '/'
}

/**
 * Build query string from params object
 */
function buildQueryString(params: TSembakoListParams): string {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value))
    }
  })
  
  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Fetch list of TSembako records
 */
export async function getTSembakoList(
  params: TSembakoListParams = {}
): Promise<TSembakoListResponse> {
  const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
  const queryString = buildQueryString(params)
  const url = `${baseUrl}tsembako/${queryString}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    }))
    throw new Error(errorData.message || 'Failed to fetch data')
  }
  
  return response.json()
}

/**
 * Fetch single TSembako record by ID
 */
export async function getTSembakoById(id: number): Promise<TSembakoSingleResponse> {
  const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
  const url = `${baseUrl}tsembako/${id}/`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    }))
    throw new Error(errorData.message || 'Failed to fetch data')
  }

  return response.json()
}

/**
 * Fetch list of Provinsi
 */
export async function getProvinsiList(): Promise<ProvinsiListResponse> {
  const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
  const url = `${baseUrl}provinsi/`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    }))
    throw new Error(errorData.message || 'Failed to fetch provinsi data')
  }

  return response.json()
}

/**
 * Fetch list of Kabupaten/Kota
 */
export async function getKabupatenKotaList(): Promise<KabupatenKotaListResponse> {
  const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
  const url = `${baseUrl}kabupaten-kota/`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    }))
    throw new Error(errorData.message || 'Failed to fetch kabupaten/kota data')
  }

  return response.json()
}

/**
 * Fetch simple list of Sembako (for dropdown/select)
 */
export async function getSembakoSimpleList(): Promise<SembakoSimpleListResponse> {
  const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
  const url = `${baseUrl}sembako/simple/`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
    }))
    throw new Error(errorData.message || 'Failed to fetch sembako data')
  }

  return response.json()
}

/**
 * Generic API client for making HTTP requests
 */
const api = {
  get: async (endpoint: string) => {
    const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        success: false,
        message: `HTTP error! status: ${response.status}`,
        errors: null,
      }))
      throw new Error(errorData.message || 'Failed to fetch data')
    }

    return response.json()
  },

  post: async (endpoint: string, data?: any) => {
    const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        success: false,
        message: `HTTP error! status: ${response.status}`,
        errors: null,
      }))
      throw new Error(errorData.message || 'Failed to post data')
    }

    return response.json()
  },
}

export default api

