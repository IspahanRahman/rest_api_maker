import { useQuery } from '@/hooks/useQuery'
import { CUSTOMER_ENDPOINTS } from '@/apis/endpoints/customer_apis'

export const useProfile = () => {
	return useQuery<any>(CUSTOMER_ENDPOINTS.PROFILE)
}
