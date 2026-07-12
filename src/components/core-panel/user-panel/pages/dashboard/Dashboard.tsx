'use client'
import React from 'react'
import { useDashboardStats } from '@/apis/query/dashboard/useDashboardQuery'
import { Loader2, AlertCircle } from 'lucide-react'
import DashboardHeader from './components/DashboardHeader'
import ClientOverviewCards from './components/ClientOverviewCards'
import ActivePurchaseCards from './components/ActivePurchaseCards'
import ClientDashboardCharts from './components/ClientDashboardCharts'
import PurchaseHistory from './components/PurchaseHistory'
export default function Dashboard() {
	const { data, isLoading, error } = useDashboardStats()
	const dashboardData = data?.data

	if (isLoading) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center bg-surface'>
				<div className='text-center'>
					<Loader2 className='mx-auto mb-4 h-10 w-10 animate-spin text-blue-600' />
					<p className='text-sm text-slate-600'>
						Loading dashboard data...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex min-h-[60vh] items-center justify-center bg-surface px-4'>
				<div className='max-w-md rounded-2xl border border-red-100 bg-surface p-6 text-center shadow-sm'>
					<div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500'>
						<AlertCircle className='h-6 w-6' />
					</div>
					<h2 className='mb-2 text-lg font-semibold text-foreground'>
						Dashboard failed to load
					</h2>
					<p className='text-sm text-foreground/70'>
						We couldn&apos;t retrieve your stats right now. Please
						refresh the page or try again later.
					</p>
				</div>
			</div>
		)
	}
	const { activePurchase, totals, purchases, charts } = dashboardData

	return (
		<div className='space-y-4'>
			<DashboardHeader />
			<ClientOverviewCards totals={totals} />
			<ActivePurchaseCards activePurchase={activePurchase} />
			<ClientDashboardCharts charts={charts} />
			<PurchaseHistory purchases={purchases} />
		</div>
	)
}
