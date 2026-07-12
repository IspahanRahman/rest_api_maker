/**
 * Cookie utility functions.
 * Auth tokens (access_token, refresh_token) are managed as httpOnly cookies by the backend.
 * Frontend cannot read httpOnly cookies via JavaScript - this is by design for security.
 */

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
