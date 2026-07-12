import { LOCAL_STORAGE_KEYS } from '@/config/constants'

/**
 * Clear non-sensitive auth data from localStorage
 * Auth tokens (access_token, refresh_token) are httpOnly cookies managed by the backend
 */
function clearLocalAuthData(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)
}

/**
 * Logout user - call backend endpoint to clear httpOnly cookies, then clear local data
 */
export async function logout(): Promise<void> {
	try {
		const axios = (await import('axios')).default
		await axios.post(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
			{},
			{ withCredentials: true }
		)
	} catch {
		// Even if backend call fails, clear local data
	}
	clearLocalAuthData()
	window.location.href = '/en/login'
}

/**
 * Get the current user from localStorage (user_profile is non-sensitive display data)
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
