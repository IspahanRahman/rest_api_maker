export const PROJECTS_ENDPOINTS = {
	CREATE: '/customer/projects',
	LIST: '/customer/projects',
	UPDATE: (projectId: number) => `/customer/projects/${projectId}`,
	DETAIL: (projectId: number) => `/customer/projects/${projectId}`,
	DELETE: (projectId: number) => `/customer/projects/${projectId}`,
	PATCH: (projectId: number) => `/customer/projects/${projectId}/status`,
}
