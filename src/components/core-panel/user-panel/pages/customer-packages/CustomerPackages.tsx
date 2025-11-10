'use client'
import React, { useState } from 'react'
import { usePackages } from '@/apis/query/customerPackages/useCustomerPackages'
import {
	Package,
	Check,
	X,
	Zap,
	Crown,
	Rocket,
	Sparkles,
	ArrowRight,
	Star,
	TrendingUp,
	Shield,
	Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'

interface PackageType {
	id: number;
	name: string;
	price: number;
	duration_days: number;
	max_projects?: number;
	max_tables_per_project?: number;
	// max_rows_per_table: number
	features?: Record<string, any>
	// status: 'active' | 'inactive'
}

export default function CustomerPackages() {
	const { data: packages, isLoading, error } = usePackages();
	console.log('Fetched packages:', packages);
	const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')
	const [processingId, setProcessingId] = useState<number | null>(null)

	const handlePurchase = async (packageId: number) => {
		setProcessingId(packageId)
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))
			toast.success('Package purchase initiated! Redirecting to payment...')
		} catch (err) {
			toast.error('Failed to purchase package')
		} finally {
			setProcessingId(null)
		}
	}

	const getPackageIcon = (index: number) => {
		const icons = [Package, Zap, Crown, Rocket]
		return icons[index % icons.length]
	}

	const getPackageColor = (index: number) => {
		const colors = [
			{
				bg: 'bg-blue-100 dark:bg-blue-900/30',
				text: 'text-blue-600 dark:text-blue-400',
				border: 'border-blue-500',
				button: 'bg-blue-500 hover:bg-blue-600',
				gradient: 'from-blue-500 to-blue-600',
			},
			{
				bg: 'bg-purple-100 dark:bg-purple-900/30',
				text: 'text-purple-600 dark:text-purple-400',
				border: 'border-purple-500',
				button: 'bg-purple-500 hover:bg-purple-600',
				gradient: 'from-purple-500 to-purple-600',
			},
			{
				bg: 'bg-orange-100 dark:bg-orange-900/30',
				text: 'text-orange-600 dark:text-orange-400',
				border: 'border-orange-500',
				button: 'bg-orange-500 hover:bg-orange-600',
				gradient: 'from-orange-500 to-orange-600',
			},
			{
				bg: 'bg-green-100 dark:bg-green-900/30',
				text: 'text-green-600 dark:text-green-400',
				border: 'border-green-500',
				button: 'bg-green-500 hover:bg-green-600',
				gradient: 'from-green-500 to-green-600',
			},
		]
		return colors[index % colors.length]
	}

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="animate-pulse">
					<div className="h-12 bg-surface-card rounded w-1/3 mb-4"></div>
					<div className="h-6 bg-surface-card rounded w-1/2"></div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-96 bg-surface-card rounded-2xl animate-pulse"></div>
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<div className="p-4 rounded-full bg-error-100 dark:bg-error-900/30 mb-4">
					<X className="w-12 h-12 text-error-500" />
				</div>
				<h2 className="text-2xl font-bold text-text-primary-sem mb-2">Failed to Load Packages</h2>
				<p className="text-text-secondary mb-6">Please try again later</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
				>
					Retry
				</button>
			</div>
		)
	}

	const packageData = (packages as any)?.data || packages || []

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center max-w-3xl mx-auto">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
					<Sparkles className="w-4 h-4" />
					Pricing Plans
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-text-primary-sem mb-4">
					Choose Your Perfect Plan
				</h1>
				<p className="text-lg text-text-secondary">
					Select the package that best fits your needs. Upgrade or downgrade anytime.
				</p>
			</div>

			{/* Period Toggle */}
			<div className="flex justify-center">
				<div className="inline-flex items-center gap-2 p-1 bg-surface-card rounded-lg border border-border-subtle">
					<button
						onClick={() => setSelectedPeriod('monthly')}
						className={cn(
							'px-6 py-2 rounded-md text-sm font-medium transition-all',
							selectedPeriod === 'monthly'
								? 'bg-primary-500 text-white shadow-sm'
								: 'text-text-secondary hover:text-text-primary-sem'
						)}
					>
						Monthly
					</button>
					<button
						onClick={() => setSelectedPeriod('yearly')}
						className={cn(
							'px-6 py-2 rounded-md text-sm font-medium transition-all',
							selectedPeriod === 'yearly'
								? 'bg-primary-500 text-white shadow-sm'
								: 'text-text-secondary hover:text-text-primary-sem'
						)}
					>
						Yearly
						<span className="ml-2 text-xs px-2 py-0.5 bg-success-500 text-white rounded-full">
							Save 20%
						</span>
					</button>
				</div>
			</div>

			{/* Packages Grid */}
			{packageData.length === 0 ? (
				<div className="flex flex-col items-center justify-center min-h-[40vh]">
					<div className="p-4 rounded-full bg-surface-card mb-4">
						<Package className="w-12 h-12 text-text-secondary opacity-50" />
					</div>
					<h2 className="text-xl font-semibold text-text-primary-sem mb-2">No Packages Available</h2>
					<p className="text-text-secondary">Check back later for new packages</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{packageData.map((pkg:PackageType, index: number) => {
						const IconComponent = getPackageIcon(index)
						const colors = getPackageColor(index)
						const isPopular = index === 1 // Make second package popular
						const isPurchasing = processingId === pkg.id

						return (
							<div
								key={pkg.id}
								className={cn(
									'relative bg-surface-card rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
									isPopular
										? `${colors.border} shadow-lg`
										: 'border-border-subtle hover:border-primary-500'
								)}
							>
								{/* Popular Badge */}
								{isPopular && (
									<div className={cn(
										'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-1',
										colors.gradient
									)}>
										<Star className="w-4 h-4 fill-current" />
										Most Popular
									</div>
								)}

								<div className="p-6 md:p-8">
									{/* Icon */}
									<div className={cn('inline-flex p-3 rounded-xl mb-4', colors.bg)}>
										<IconComponent className={cn('w-6 h-6', colors.text)} />
									</div>

									{/* Package Name */}
									<h3 className="text-2xl font-bold text-text-primary-sem mb-2">{pkg.name}</h3>

									{/* Price */}
									<div className="mb-6">
										<div className="flex items-baseline gap-2">
											<span className="text-4xl font-bold text-text-primary-sem">
												${selectedPeriod === 'yearly' ? (pkg.price * 12 * 0.8).toFixed(0) : pkg.price}
											</span>
											<span className="text-text-secondary">/{selectedPeriod === 'yearly' ? 'year' : 'month'}</span>
										</div>
										{selectedPeriod === 'yearly' && (
											<p className="text-sm text-success-500 font-medium mt-1">
												Save ${(pkg.price * 12 * 0.2).toFixed(0)} per year
											</p>
										)}
									</div>

									{/* Features */}
									<ul className="space-y-3 mb-8">
										<li className="flex items-start gap-3">
											<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5">
												<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
											</div>
											<span className="text-sm text-text-secondary">
												<span className="font-semibold text-text-primary-sem">
													{pkg.max_tables_per_project}
												</span>{' '}
												Tables per project
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5">
												<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
											</div>
											<span className="text-sm text-text-secondary">
												<span className="font-semibold text-text-primary-sem">
													{/* {pkg.max_rows_per_table.toLocaleString()} */} 10
												</span>{' '}
												Rows per table
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5">
												<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
											</div>
											<span className="text-sm text-text-secondary">
												<span className="font-semibold text-text-primary-sem">
													{pkg.duration_days}
												</span>{' '}
												Days duration
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5">
												<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
											</div>
											<span className="text-sm text-text-secondary">24/7 Support</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="p-0.5 rounded-full bg-success-100 dark:bg-success-900/30 mt-0.5">
												<Check className="w-4 h-4 text-success-600 dark:text-success-400" />
											</div>
											<span className="text-sm text-text-secondary">API Documentation</span>
										</li>
									</ul>

									{/* CTA Button */}
									<button
										onClick={() => handlePurchase(pkg.id)}
										// disabled={isPurchasing || pkg.status === 'inactive'}
										className={cn(
											'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2',
											isPopular
												? `${colors.button} text-white shadow-md hover:shadow-lg`
												: 'bg-surface-input hover:bg-surface-hover text-text-primary-sem border border-border-subtle',
											isPurchasing && 'opacity-70 cursor-not-allowed',
											// pkg.status === 'inactive' && 'opacity-50 cursor-not-allowed'
										)}
									>
										{isPurchasing ? (
											<>
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												Processing...
											</>
										) : pkg.status === 'inactive' ? (
											'Not Available'
										) : (
											<>
												Get Started
												<ArrowRight className="w-5 h-5" />
											</>
										)}
									</button>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{/* Features Comparison */}
			<div className="mt-16">
				<h2 className="text-3xl font-bold text-text-primary-sem text-center mb-8">
					Why Choose Our Packages?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
						<div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 inline-flex mb-4">
							<TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 className="text-lg font-semibold text-text-primary-sem mb-2">Scalable Solutions</h3>
						<p className="text-text-secondary">
							Grow your projects seamlessly with our flexible table and row limits.
						</p>
					</div>
					<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
						<div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 inline-flex mb-4">
							<Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
						<h3 className="text-lg font-semibold text-text-primary-sem mb-2">Secure & Reliable</h3>
						<p className="text-text-secondary">
							Enterprise-grade security with 99.9% uptime guarantee for your APIs.
						</p>
					</div>
					<div className="p-6 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
						<div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 inline-flex mb-4">
							<Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
						</div>
						<h3 className="text-lg font-semibold text-text-primary-sem mb-2">Quick Setup</h3>
						<p className="text-text-secondary">
							Get your REST API up and running in minutes, not hours or days.
						</p>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="mt-16 text-center">
				<h2 className="text-2xl font-bold text-text-primary-sem mb-4">Still have questions?</h2>
				<p className="text-text-secondary mb-6">
					Our support team is here to help you choose the right package
				</p>
				<button className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
					Contact Support
				</button>
			</div>
		</div>
	)
}

