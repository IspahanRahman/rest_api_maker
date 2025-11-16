import { useForm } from "@/hooks/useForm";
import { PROJECTS_ENDPOINTS } from "@/apis/endpoints/customerProjects_apis";


export function useDeleteProjectMutation(projectId: number) {
	const { submit, isLoading, data, errors, setData } = useForm(
		PROJECTS_ENDPOINTS.DELETE(projectId),
		{},
		{
			method: 'DELETE'
		}
	)

	return {
		submit,
		isLoading,
		data,
		errors,
		setData
	};
}
