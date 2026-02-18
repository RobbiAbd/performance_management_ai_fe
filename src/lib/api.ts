import { appConfig } from './config'
import { getToken } from './auth'

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
function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const api = {
  get: async (endpoint: string) => {
    const baseUrl = normalizeBaseUrl(appConfig.apiBaseUrl)
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`

    const response = await fetch(url, {
      method: 'GET',
      headers: authHeaders(),
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
      headers: authHeaders(),
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

// --- Auth API ---

export interface LoginResponse {
  message: string
  status: string
  code: number
  data: {
    access_token: string
    token_type: string
    user: {
      id: number
      username: string
      full_name: string
      email: string
      role_id: number
      employee_id: number
    }
  }
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return api.post('auth/login/json', { username, password }) as Promise<LoginResponse>
}

// --- Motivation API ---

export interface MotivationGenerateResponse {
  message: string
  status: string
  code: number
  data: {
    id: number
    motivation: string
    created_at: string
  }
}

export async function generateMotivation(): Promise<MotivationGenerateResponse> {
  return api.post('motivation/generate') as Promise<MotivationGenerateResponse>
}

// --- Performance Management API ---

export interface PerformanceSummaryAiSummary {
  summary: string
  achieved_kpi: string[]
  not_achieved_kpi: string[]
  recommendations: string[]
  motivation: string
}

export interface PerformanceSummaryResponse {
  message: string
  status: string
  code: number
  data: {
    employee_id: number
    period: string
    ai_summary: PerformanceSummaryAiSummary
    generated_at: string
  }
}

export interface PerformanceAnalyticsResponse {
  message: string
  status: string
  code: number
  data: {
    period: string
    avg_score_per_department: { department: string; avg_score: number; employee_count: number }[]
    top_performers: { employee_id: number; full_name: string; total_score: number; performance_category: string }[]
    underperformers: { employee_id: number; full_name: string; total_score: number; performance_category: string }[]
    category_distribution: { category: string; count: number }[]
  }
}

export async function getPerformanceSummary(
  employeeCode: string,
  period: string
): Promise<PerformanceSummaryResponse> {
  return api.get(`performance/summary/${encodeURIComponent(employeeCode)}/${period}`) as Promise<PerformanceSummaryResponse>
}

/** POST: generate/regenerate AI summary untuk karyawan & periode */
export async function generatePerformanceSummary(
  employeeCode: string,
  period: string
): Promise<unknown> {
  return api.post(`performance/generate/${encodeURIComponent(employeeCode)}/${period}`)
}

export async function getPerformanceAnalytics(period: string): Promise<PerformanceAnalyticsResponse> {
  return api.get(`performance/analytics/${period}`) as Promise<PerformanceAnalyticsResponse>
}

export default api

