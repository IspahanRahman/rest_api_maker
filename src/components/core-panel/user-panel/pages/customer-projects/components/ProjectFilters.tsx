'use client'
import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectFiltersProps {
	searchQuery: string
	setSearchQuery: (query: string) => void
	statusFilter: 'all' | 'active' | 'inactive' | 'suspended'
	setStatusFilter: (filter: 'all' | 'active' | 'inactive' | 'suspended') => void
	sortBy: 'name' | 'created' | 'updated'
	setSortBy: (sort: 'name' | 'created' | 'updated') => void
	showFilters: boolean
	setShowFilters: (show: boolean) => void
	totalProjects: number
	filteredCount: number
}

export default function ProjectFilters({
	searchQuery,
	setSearchQuery,
	statusFilter,
	setStatusFilter,
	sortBy,
	setSortBy,
	showFilters,
	setShowFilters,
	totalProjects,
	filteredCount
}: ProjectFiltersProps) {
	const statusOptions: Array<{ value: 'all' | 'active' | 'inactive' | 'suspended'; label: string; count?: number }> = [
		{ value: 'all', label: 'All Projects' },
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'suspended', label: 'Suspended' },
	]

	const sortOptions: Array<{ value: 'name' | 'created' | 'updated'; label: string }> = [
		{ value: 'name', label: 'Name' },
		{ value: 'created', label: 'Created Date' },
		{ value: 'updated', label: 'Last Updated' },
	]

	return (
		<div className="space-y-4">
			{/* Search and Filter Toggle */}
			<div className="flex flex-col sm:flex-row gap-3">
				{/* Search Input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search projects by name, database, or description..."
						className="w-full pl-10 pr-10 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-text-primary placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery('')}
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-hover rounded transition-colors"
						>
							<X className="w-4 h-4 text-text-secondary" />
						</button>
					)}
				</div>

				{/* Filter Toggle Button */}
				<button
					onClick={() => setShowFilters(!showFilters)}
					className={cn(
						'flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-all',
						showFilters
							? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-primary-300'
							: 'bg-surface-input border-border-input text-text-secondary hover:bg-surface-hover'
					)}
				>
					<Filter className="w-5 h-5" />
					<span>Filters</span>
					<ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
				</button>
			</div>

			{/* Results Count */}
			<div className="flex items-center justify-between text-sm">
				<p className="text-text-secondary">
					{filteredCount === totalProjects ? (
						<>Showing all <span className="font-semibold text-text-primary">{totalProjects}</span> projects</>
					) : (
						<>Showing <span className="font-semibold text-text-primary">{filteredCount}</span> of <span className="font-semibold">{totalProjects}</span> projects</>
					)}
				</p>
			</div>

			{/* Expanded Filters */}
			{showFilters && (
				<div className="bg-surface-card border border-border-subtle rounded-lg p-6 space-y-6">
					{/* Status Filter */}
					<div>
						<label className="block text-sm font-medium text-text-primary mb-3">
							Filter by Status
						</label>
						<div className="flex flex-wrap gap-2">
							{statusOptions.map((option) => (
								<button
									key={option.value}
									onClick={() => setStatusFilter(option.value)}
									className={cn(
										'px-4 py-2 rounded-lg text-sm font-medium transition-all',
										statusFilter === option.value
											? 'bg-primary-600 text-white shadow-sm'
											: 'bg-surface-input text-text-secondary hover:bg-surface-hover border border-border-input'
									)}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					{/* Sort Options */}
					<div>
						<label className="block text-sm font-medium text-text-primary mb-3">
							Sort by
						</label>
						<div className="flex flex-wrap gap-2">
							{sortOptions.map((option) => (
								<button
									key={option.value}
									onClick={() => setSortBy(option.value)}
									className={cn(
										'px-4 py-2 rounded-lg text-sm font-medium transition-all',
										sortBy === option.value
											? 'bg-primary-600 text-white shadow-sm'
											: 'bg-surface-input text-text-secondary hover:bg-surface-hover border border-border-input'
									)}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>

					{/* Clear Filters */}
					{(searchQuery || statusFilter !== 'all' || sortBy !== 'updated') && (
						<div className="pt-4 border-t border-border-subtle">
							<button
								onClick={() => {
									setSearchQuery('')
									setStatusFilter('all')
									setSortBy('updated')
								}}
								className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
							>
								Clear all filters
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
