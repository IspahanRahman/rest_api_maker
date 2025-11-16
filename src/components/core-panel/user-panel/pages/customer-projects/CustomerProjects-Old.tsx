import React from 'react'
import { useCustomerProjects } from '@/apis/query/customerProjects/useCutomerProjects';
import PaginatedTable from '@/components/common/PaginatedTable';
export default  function CustomerProjects() {
	const { data, isLoading, error, mutate } = useCustomerProjects();
  return (
	<div>CustomerProjects</div>
  )
}

