import { useForm } from '@/hooks/useForm'
import { CUSTOMER_ENDPOINTS } from '@/apis/endpoints/customer_apis'

interface UpdateProfileData {
	name: string
	phone_number: string
	address: string
	city: string
	state: string
	country: string
	profile_image: File | null
}

export function useUpdateProfileMutation() {
	const { submit, isLoading, data, errors, setData, register, responseData } =
		useForm<UpdateProfileData>(
			CUSTOMER_ENDPOINTS.UPDATE_PROFILE, // API endpoint URL
			{
				name: { value: '', validation: 'required|min:2' },
				phone_number: {
					value: '',
					validation: 'required|regex:^\\d{10,}$'
				},
				address: { value: '', validation: '' },
				city: { value: '', validation: '' },
				state: { value: '', validation: '' },
				country: { value: '', validation: '' },
				profile_image: { value: null, validation: '' }
			},
			{ method: 'PUT' } // or 'PUT' depending on your API
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
