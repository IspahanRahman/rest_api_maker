'use client'
import React from 'react'
import { usePackages } from '@/apis/query/customerPackages/useCustomerPackages'
export default function CustomerPackages() {
	const { data, isLoading, error } = usePackages();
	console.log('packages data:', data);
	return (
		<div>CustomerPackages</div>
	)
}

