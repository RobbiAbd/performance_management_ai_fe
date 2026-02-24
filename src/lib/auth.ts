const TOKEN_KEY = "performance_token"
const REFRESH_TOKEN_KEY = "performance_refresh_token"
const USER_KEY = "performance_user"

export interface AuthUser {
  id: number
  username: string
  full_name: string
  email: string
  role_id: number
  employee_id: number
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** Set auth after login. Pass refreshToken when login response includes it. */
export function setAuth(accessToken: string, user: AuthUser, refreshToken?: string | null): void {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  if (refreshToken != null && refreshToken !== "") {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

/** Update tokens after refresh. Keeps existing user. */
export function setTokens(accessToken: string, refreshToken?: string | null): void {
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken != null && refreshToken !== "") {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
