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
	withCredentials: false
})

// Request interceptor - attach access token
AxiosAPI.interceptors.request.use(config => {
	const token =
		typeof window !== 'undefined'
			? window.localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
			: null

	if (token) {
		config.headers.set('Authorization', `Bearer ${token}`)
	}
	return config
})

// Response interceptor - handle auth errors and token refresh
let isRefreshing = false
let failedQueue: Array<{
	resolve: (value: unknown) => void
	reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error)
		} else {
			resolve(token)
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
		if (status === 401 && !originalRequest._retry) {
			const refreshToken = localStorage.getItem(
				LOCAL_STORAGE_KEYS.REFRESH_TOKEN
			)

			// No refresh token available - redirect to login
			if (!refreshToken) {
				clearAuthAndRedirect(currentPath)
				return Promise.reject(error)
			}

			// If already refreshing, queue this request
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
				const { data } = await axios.post(
					`${env.apiBaseUrl}/auth/refresh`,
					{ refresh_token: refreshToken },
					{ headers: { 'Content-Type': 'application/json' } }
				)

				if (data?.status && data?.data?.access_token) {
					const newAccessToken = data.data.access_token
					const newRefreshToken =
						data.data.refresh_token || refreshToken

					// Store new tokens
					localStorage.setItem(
						LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
						newAccessToken
					)
					localStorage.setItem(
						LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
						newRefreshToken
					)

					// Update cookie with encoded tokens
					const rememberMe =
						localStorage.getItem(LOCAL_STORAGE_KEYS.REMEMBER_ME) ===
						'true'
					const maxAge = rememberMe
						? 60 * 60 * 24 * 30
						: 60 * 60 * 24 * 7
					const isSecure = window.location.protocol === 'https:'
					const encodedAccessToken =
						encodeURIComponent(newAccessToken)
					const encodedRefreshToken =
						encodeURIComponent(newRefreshToken)
					document.cookie = `${LOCAL_STORAGE_KEYS.ACCESS_TOKEN}=${encodedAccessToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
					document.cookie = `${LOCAL_STORAGE_KEYS.REFRESH_TOKEN}=${encodedRefreshToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
					// Process queued requests
					processQueue(null, newAccessToken)

					return AxiosAPI(originalRequest)
				} else {
					throw new Error('Invalid refresh response')
				}
			} catch (refreshError) {
				processQueue(refreshError, null)
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
	localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_PROFILE)
	localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME)
	document.cookie = `${LOCAL_STORAGE_KEYS.ACCESS_TOKEN}=; path=/; max-age=0`
	document.cookie = `${LOCAL_STORAGE_KEYS.REFRESH_TOKEN}=; path=/; max-age=0`
	const locale = currentPath.match(/^\/(en|bn)/)?.[1] || 'en'
	window.location.href = `/${locale}/login?${reason}=1`
}

export const AxiosFetcher = async (args: string | ApiRequestConfig) => {
	if (typeof args === 'string') {
		// Check for export in URL
		const isExport = args.includes('/export')
		return await AxiosAPI.get(args, {
			responseType: isExport ? 'arraybuffer' : 'json'
		}).then(res => res.data)
	} else {
		const { data, ...rest } = args
		// Detect export by URL or add `isExport: true` in custom config
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
