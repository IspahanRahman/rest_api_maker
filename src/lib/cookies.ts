/**
 * Set access_token cookie for Next.js middleware to read.
 * This is a non-httpOnly cookie (middleware runs server-side and can't access localStorage).
 * The access_token is a JWT - its security comes from short expiry and signature, not secrecy.
 */
export function setAccessTokenCookie(accessToken: string): void {
	if (typeof window === 'undefined') return

	const maxAge = 15 * 60 // 15 minutes (matches access token expiry)
	const isSecure = window.location.protocol === 'https:'
	const encodedToken = encodeURIComponent(accessToken)

	document.cookie = `access_token=${encodedToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Clear access_token cookie
 */
export function clearAccessTokenCookie(): void {
	if (typeof window === 'undefined') return
	document.cookie = 'access_token=; path=/; max-age=0'
}

/**
 * Get cookie value by name
 * Note: httpOnly cookies cannot be read from JavaScript
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
 * Note: httpOnly cookies cannot be detected from JavaScript
 * @param name - The cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
	return getCookie(name) !== null
}
