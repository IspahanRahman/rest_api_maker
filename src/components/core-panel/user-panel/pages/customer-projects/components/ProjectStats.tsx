'use client'
import React from 'react'
import { FolderKanban, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectStatsProps {
	total: number
	active: number
	inactive: number
	suspended: number
}

export default function ProjectStats({ total, active, inactive, suspended }: ProjectStatsProps) {
	const stats = [
		{
			label: 'Total Projects',
			value: total,
			icon: FolderKanban,
			color: 'text-primary-600 dark:text-primary-400',
			bgColor: 'bg-primary-100 dark:bg-primary-900/30',
			borderColor: 'border-primary-200 dark:border-primary-800',
		},
		{
			label: 'Active',
			value: active,
			icon: CheckCircle2,
			color: 'text-success-600 dark:text-success-400',
			bgColor: 'bg-success-100 dark:bg-success-900/30',
			borderColor: 'border-success-200 dark:border-success-800',
		},
		{
			label: 'Inactive',
			value: inactive,
			icon: XCircle,
			color: 'text-gray-600 dark:text-gray-400',
			bgColor: 'bg-gray-100 dark:bg-gray-800',
			borderColor: 'border-gray-200 dark:border-gray-700',
		},
		{
			label: 'Suspended',
			value: suspended,
			icon: AlertTriangle,
			color: 'text-error-600 dark:text-error-400',
			bgColor: 'bg-error-100 dark:bg-error-900/30',
			borderColor: 'border-error-200 dark:border-error-800',
		},
	]

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat, index) => {
				const Icon = stat.icon
				const percentage = total > 0 ? ((stat.value / total) * 100).toFixed(0) : 0

				return (
					<div
						key={stat.label}
						className={cn(
							'bg-surface-card border rounded-xl p-5 transition-all hover:shadow-md',
							stat.borderColor
						)}
					>
						<div className="flex items-start justify-between mb-3">
							<div className={cn('p-3 rounded-lg', stat.bgColor)}>
								<Icon className={cn('w-6 h-6', stat.color)} />
							</div>
							{index > 0 && total > 0 && (
								<div className="flex items-center gap-1 text-xs font-medium text-text-tertiary">
									<TrendingUp className="w-3 h-3" />
									{percentage}%
								</div>
							)}
						</div>

						<div>
							<p className="text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
							<p className="text-sm text-text-secondary font-medium">{stat.label}</p>
						</div>

						{/* Progress Bar */}
						{index > 0 && total > 0 && (
							<div className="mt-3 h-1.5 bg-surface-hover rounded-full overflow-hidden">
								<div
									className={cn('h-full rounded-full transition-all', stat.bgColor)}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
