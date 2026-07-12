import axios from 'axios'
import { ApiRequestConfig } from '@/types/config'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'
import { env } from '@/config/env'

// Validate environment variables on initialization
if (!env.apiBaseUrl) {
	throw new Error(
		'NEXT_PUBLIC_API_BASE_URL is not defined in .env\n' +
			'Please check your .env file and ENV_GUIDE.md for setup instructions.'
	)
}

const AxiosAPI = axios.create({
	baseURL: env.apiBaseUrl,
	timeout: env.apiTimeout,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	withCredentials: true
})

// Response interceptor - handle auth errors and token refresh
let isRefreshing = false
let failedQueue: Array<{
	resolve: (value: unknown) => void
	reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown) {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error)
		} else {
			resolve(undefined)
		}
	})
	failedQueue = []
}

AxiosAPI.interceptors.response.use(
	response => response,
	async error => {
		if (typeof window === 'undefined') return Promise.reject(error)

		const originalRequest = error.config
		const status = error?.response?.status
		const currentPath = window.location.pathname

		// Skip interceptor on login/register pages to let components handle errors
		const isAuthPage =
			currentPath.includes('/login') ||
			currentPath.includes('/register') ||
			currentPath.includes('/forgot-password') ||
			currentPath.includes('/reset-password')

		if (isAuthPage) {
			return Promise.reject(error)
		}

		// Handle 401 Unauthorized - try token refresh
		// Both access_token and refresh_token are httpOnly cookies, sent automatically
		if (status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				}).then(() => {
					return AxiosAPI(originalRequest)
				})
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				// Refresh token cookie is sent automatically by the browser
				// Backend sets new access_token and refresh_token as httpOnly cookies
				await AxiosAPI.post('/auth/refresh')

				// Process queued requests
				processQueue(null)

				return AxiosAPI(originalRequest)
			} catch (refreshError) {
				processQueue(refreshError)
				clearAuthAndRedirect(currentPath)
				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		// Handle 401 on refresh endpoint itself - redirect to login
		if (status === 401) {
			clearAuthAndRedirect(currentPath)
		}

		// Handle 403 Forbidden - account deactivated
		if (status === 403) {
			clearAuthAndRedirect(currentPath, 'deactivated')
		}

		return Promise.reject(error)
	}
)

function clearAuthAndRedirect(
	currentPath: string,
	reason: 'expired' | 'deactivated' = 'expired'
) {
	// Clear non-sensitive local data
	// Auth tokens are httpOnly cookies, cleared by backend logout endpoint
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)
	const locale = currentPath.match(/^\/(en|bn)/)?.[1] || 'en'
	window.location.href = `/${locale}/login?${reason}=1`
}

export const AxiosFetcher = async (args: string | ApiRequestConfig) => {
	if (typeof args === 'string') {
		const isExport = args.includes('/export')
		return await AxiosAPI.get(args, {
			responseType: isExport ? 'arraybuffer' : 'json'
		}).then(res => res.data)
	} else {
		const { data, ...rest } = args
		const isExport =
			rest.url?.includes('/export') || rest.responseType === 'arraybuffer'

		if (data && data instanceof FormData) {
			rest.headers = {
				...rest.headers,
				'Content-Type': 'multipart/form-data'
			}
		}
		return await AxiosAPI.request({
			data,
			responseType: isExport ? 'arraybuffer' : 'json',
			...rest
		}).then(res => res.data)
	}
}
