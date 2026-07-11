import { LOCAL_STORAGE_KEYS } from '@/config/constants'

/**
 * Set authentication tokens in cookies
 * @param accessToken - The access token
 * @param refreshToken - The refresh token
 * @param rememberMe - Whether to remember the user (affects expiry time)
 */
export function setAuthCookies(
	accessToken: string,
	refreshToken: string,
	rememberMe: boolean = false
): void {
	if (typeof window === 'undefined') return

	const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
	const isSecure = window.location.protocol === 'https:'

	// Encode tokens to handle special characters safely
	const encodedAccessToken = encodeURIComponent(accessToken)
	const encodedRefreshToken = encodeURIComponent(refreshToken)

	document.cookie = `${LOCAL_STORAGE_KEYS.ACCESS_TOKEN}=${encodedAccessToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
	document.cookie = `${LOCAL_STORAGE_KEYS.REFRESH_TOKEN}=${encodedRefreshToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Remove authentication cookies
 */
export function removeAuthCookies(): void {
	if (typeof window === 'undefined') return

	document.cookie = `${LOCAL_STORAGE_KEYS.ACCESS_TOKEN}=; path=/; max-age=0`
	document.cookie = `${LOCAL_STORAGE_KEYS.REFRESH_TOKEN}=; path=/; max-age=0`
}

/**
 * Get cookie value by name
 * @param name - The cookie name
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
	if (typeof window === 'undefined') return null

	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)

	if (parts.length === 2) {
		const cookieValue = parts.pop()?.split(';').shift()
		// Decode the cookie value to handle special characters
		return cookieValue ? decodeURIComponent(cookieValue) : null
	}

	return null
}

/**
 * Check if a cookie exists
 * @param name - The cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
	return getCookie(name) !== null
}
