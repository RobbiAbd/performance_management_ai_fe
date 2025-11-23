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

