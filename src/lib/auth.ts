import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { removeAuthCookies } from './cookies'

/**
 * Clear all auth data from localStorage and cookies
 */
function clearAuthData(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)
	removeAuthCookies()
}

/**
 * Logout user - clear all auth data and redirect to login
 */
export function logout(): void {
	clearAuthData()
	// Hard redirect to ensure middleware state is reset
	window.location.href = '/en/login'
}

/**
 * Check if user is authenticated
 * @returns True if user has a valid access token, false otherwise
 */
export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') return false
	return !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Decode a JWT token payload without verification (for client-side use only)
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
	try {
		const base64Url = token.split('.')[1]
		if (!base64Url) return null
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)
		return JSON.parse(jsonPayload)
	} catch {
		return null
	}
}

/**
 * Check if the current access token is expired
 * @returns True if token is expired or missing, false if still valid
 */
export function isAccessTokenExpired(): boolean {
	if (typeof window === 'undefined') return true

	const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
	if (!token) return true

	const payload = decodeJwtPayload(token)
	if (!payload || !payload.exp) return false // No expiry claim = assume valid

	// exp is in seconds
	const currentTime = Math.floor(Date.now() / 1000)
	return payload.exp < currentTime
}

/**
 * Check if refresh token exists
 * @returns True if refresh token is present in localStorage
 */
export function hasRefreshToken(): boolean {
	if (typeof window === 'undefined') return false
	return !!localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Get the current user from localStorage
 * @returns The user object or null if not found
 */
export function getCurrentUser(): any | null {
	if (typeof window === 'undefined') return null

	const userProfile = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	if (!userProfile) return null

	try {
		return JSON.parse(userProfile)
	} catch (error) {
		console.error('Error parsing user profile:', error)
		return null
	}
}

/**
 * Get the access token from localStorage
 * @returns The token string or null if not found
 */
export function getAccessToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Get the refresh token from localStorage
 * @returns The token string or null if not found
 */
export function getRefreshToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Store both tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken: string): void {
	if (typeof window === 'undefined') return
	localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken)
	localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}
