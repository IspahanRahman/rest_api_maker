'use client'
import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

export default function DashboardHeader() {
	const user = getCurrentUser()
	return (
		<header className='bg-surface-card border border-border-subtle rounded-xl px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div className='space-y-2'>
				<div className='inline-flex items-center gap-2 rounded-full bg-surface-input px-3 py-1 border border-border-subtle'>
					<span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-50'>
						<LayoutDashboard className='h-4 w-4 text-primary-500' />
					</span>
					<span className='text-xs font-medium uppercase tracking-wide text-text-secondary'>
						{user?.name} Dashboard
					</span>
				</div>

				<h1 className='text-2xl font-semibold text-text-primary-sem sm:text-3xl'>
					Welcome back 👋
				</h1>

				<p className='max-w-2xl text-sm text-text-secondary'>
					View your projects, tables, and subscriptions in one place.
					Track your usage and stay on top of your active plans.
				</p>
			</div>
		</header>
	)
}
