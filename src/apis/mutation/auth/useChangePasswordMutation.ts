import { useForm } from '@/hooks/useForm';
import { CUSTOMER_ENDPOINTS } from '@/apis/endpoints/customer_apis';

interface ChangePasswordData {
	current_password: string;
	new_password: string;
}

export function useChangePasswordMutation() {
	const {
		submit,
		isLoading,
		data,
		errors,
		setData,
		register,
		responseData
	} = useForm<ChangePasswordData>(
		CUSTOMER_ENDPOINTS.CHANGE_PASSWORD, // API endpoint URL
		{
			current_password: { value: '', validation: 'required' },
			new_password: { value: '', validation: 'required' }
		},
		{ method: 'POST' }
	);

	return {
		submit,
		isLoading,
		data,
		errors,
		setData,
		register,
		responseData
	};
}
