// Packages API Endpoints
export const PACKAGES_ENDPOINTS = {
  LIST: '/customer/package',
  PURCHASE: (id: number) => `/customer/package/buy`,
  PURCHASED_PACKAGES: '/customer/package/purchased',
}
