import { useForm } from '@/hooks/useForm'
import { resetPassword } from '@/apis/endpoints/auth_apis'

interface ResetPasswordData {
	email: string
	token: string
	new_password: string
	confirm_password: string
}

export function useResetPasswordMutation() {
	const { submit, isLoading, data, errors, setData, register, responseData } =
		useForm<ResetPasswordData>(
			resetPassword, // API endpoint URL
			{
				email: { value: '', validation: 'required|email' },
				token: { value: '', validation: 'required' },
				new_password: { value: '', validation: 'required|min:6' },
				confirm_password: {
					value: '',
					validation: 'required|same:new_password'
				}
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
