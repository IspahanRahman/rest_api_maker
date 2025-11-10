// Dashboard API Endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  RECENT_PROJECTS: '/dashboard/projects/recent',
  RECENT_PAYMENTS: '/dashboard/payments/recent',
  ACTIVITY: '/dashboard/activity',
}

// Projects API Endpoints
export const PROJECTS_ENDPOINTS = {
  LIST: '/projects',
  CREATE: '/projects',
  DETAIL: (id: number) => `/projects/${id}`,
  UPDATE: (id: number) => `/projects/${id}`,
  DELETE: (id: number) => `/projects/${id}`,
  TABLES: (id: number) => `/projects/${id}/tables`,
}



// Payments API Endpoints
export const PAYMENTS_ENDPOINTS = {
  LIST: '/payments',
  CREATE: '/payments',
  DETAIL: (id: number) => `/payments/${id}`,
}
