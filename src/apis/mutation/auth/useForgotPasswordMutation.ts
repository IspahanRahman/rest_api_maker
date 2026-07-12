import { useForm } from '@/hooks/useForm'
import { forgotPassword } from '@/apis/endpoints/auth_apis'

interface ForgotPasswordData {
	email: string
}

export function useForgotPasswordMutation() {
	const { submit, isLoading, data, errors, setData, register, responseData } =
		useForm<ForgotPasswordData>(
			forgotPassword, // API endpoint URL
			{
				email: { value: '', validation: 'required|email' }
			},
			{ method: 'POST' }
		)

	return {
		submit,
		isLoading,
		data,
		errors,
		setData,
		register,
		responseData
	}
}
