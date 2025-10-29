import axios from 'axios'
import { ApiRequestConfig } from '@/types/config'
import { LOCAL_STORAGE_KEYS } from '@/config/constants'

const API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_APP_URL || 'https://api.example.com';



if (!API_BASE_URL) {
	throw new Error('API_BASE_URL is not defined in .env')
}


const AxiosAPI = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	withCredentials: false
})

AxiosAPI.interceptors.request.use((config) => {
	const token = typeof window !== 'undefined'
	? window.localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
	: null;
	// window.localStorage.setItem("user_id", "1");
	// window.localStorage.setItem("organization_id", "1");
	// const token =
	// 	'd40478aa4c136eb977f0315113bc075bd5ab4dfc3b303e2120742b2cf44aec85'
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})


export const AxiosFetcher = async (args: string | ApiRequestConfig) => {
	if (typeof args === 'string') {
		// Check for export in URL
		const isExport = args.includes('/export');
		return await AxiosAPI.get(args, {
			responseType: isExport ? 'arraybuffer' : 'json'
		}).then((res) => res.data);
	} else {
		const { data, ...rest } = args
		// Detect export by URL or add `isExport: true` in custom config
		const isExport = rest.url?.includes('/export') || rest.responseType === 'arraybuffer';

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
		}).then((res) => res.data)
	}
}
