import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { clearAccessTokenCookie } from './cookies'

/**
 * Clear all auth data from localStorage and access_token cookie
 */
function clearAuthData(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)
	clearAccessTokenCookie()
	// Note: refresh_token is in httpOnly cookie, cleared by backend logout endpoint
}

/**
 * Logout user - call backend endpoint to clear refresh token cookie, then clear local data
 */
export async function logout(): Promise<void> {
	try {
		// Use raw axios to avoid interceptor loops and circular imports
		const axios = (await import('axios')).default
		await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
			{},
			{ withCredentials: true }
		)
	} catch {
		// Even if backend call fails, clear local data
	}
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
 * Store access token in localStorage
 * Note: refresh_token is stored as httpOnly cookie by the backend
 */
export function setAccessToken(accessToken: string): void {
	if (typeof window === 'undefined') return
	localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken)
}
