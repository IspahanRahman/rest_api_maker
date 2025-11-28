'use client';

import React from 'react';
import { Package, CalendarRange, ArrowRight, CircleDot } from 'lucide-react';

interface PackageInfo {
	id: string;
	name: string;
	status: string;
	sell_count: number;
	max_projects: number;
	max_tables_per_project: number;
	features?: string; // JSON string
}

interface PlanInfo {
	id: string;
	plan_type: 'monthly' | 'yearly' | string;
	duration_days: number;
	price: string;
	discount_type: 'fixed' | 'percentage' | string;
	discount_value: string;
	final_price: string;
	status: string;
}

interface ActivePurchaseItem {
	id: string;
	package_id: string;
	package_plan_id: string;
	start_date: string;
	end_date: string;
	amount_paid: string;
	status: string;
	total_project_limit: number;
	total_created_project: number;
	Package: PackageInfo;
	PackagePlan: PlanInfo;
}

interface ActivePurchaseCardsProps {
	activePurchase: ActivePurchaseItem[];
}

function formatDate(dateString: string) {
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch {
		return dateString;
	}
}

function formatPlanType(planType: string) {
	return planType.charAt(0).toUpperCase() + planType.slice(1);
}

export default function ActivePurchaseCards({ activePurchase }: ActivePurchaseCardsProps) {
	if (!activePurchase?.length) {
		return (
			<section className="bg-surface-card dark:bg-surface-card-dark rounded-xl p-6 border border-border-subtle dark:border-border-input">
				<h2 className="text-lg font-semibold text-text-primary-sem dark:text-white mb-2">
					Active Subscription
				</h2>
				<p className="text-sm text-text-secondary dark:text-text-tertiary">
					You don&apos;t have any active subscription yet. Purchase a package to get started.
				</p>
			</section>
		);
	}

	return (
		<section className="bg-surface-card dark:bg-surface-card-dark rounded-xl p-6 border border-border-subtle dark:border-border-input space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-text-primary-sem dark:text-white">
						Active Subscriptions
					</h2>
					<p className="text-sm text-text-secondary dark:text-text-tertiary">
						Manage your current plans, usage and validity.
					</p>
				</div>
				<span className="inline-flex items-center gap-2 rounded-full bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input px-3 py-1 text-xs text-text-secondary dark:text-text-tertiary">
					<CircleDot className="w-3 h-3 text-success-500" />
					{activePurchase.length} active
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{activePurchase.map((purchase) => {
					const plan = purchase.PackagePlan;
					const pkg = purchase.Package;

					const featureObj: Record<string, any> = (() => {
						try {
							return pkg.features ? JSON.parse(pkg.features) : {};
						} catch {
							return {};
						}
					})();

					const usedProjects = purchase.total_created_project;
					const projectLimit = purchase.total_project_limit || pkg.max_projects || 0;
					const progress =
						projectLimit > 0 ? Math.min(100, (usedProjects / projectLimit) * 100) : 0;

					return (
						<div
							key={purchase.id}
							className="bg-surface-card dark:bg-surface-card-dark rounded-xl border border-border-subtle dark:border-border-input shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col"
						>
							<div className="p-5 flex-1 space-y-4">
								{/* Header */}
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-3">
										<div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
											<Package className="w-5 h-5 text-primary-500 dark:text-primary-400" />
										</div>
										<div>
											<h3 className="font-semibold text-text-primary-sem dark:text-white">
												{pkg.name}
											</h3>
											<p className="text-xs text-text-secondary dark:text-text-tertiary">
												{formatPlanType(plan.plan_type)} · {plan.duration_days} days
											</p>
										</div>
									</div>
									<span className="text-xs px-2 py-1 rounded-full border border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900 text-success-600 dark:text-success-400">
										{purchase.status}
									</span>
								</div>

								{/* Billing & validity */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-xs text-text-secondary dark:text-text-tertiary mb-1">
											Amount Paid
										</p>
										<p className="text-base font-semibold text-text-primary-sem dark:text-white">
											${Number(purchase.amount_paid).toFixed(2)}
										</p>
										<p className="text-[11px] text-text-secondary dark:text-text-tertiary mt-1">
											Original: ${Number(plan.price).toFixed(2)} · Discount {plan.discount_value}
											{plan.discount_type === 'percentage' ? '%' : ''}
										</p>
									</div>
									<div>
										<p className="text-xs text-text-secondary dark:text-text-tertiary mb-1 flex items-center gap-1">
											<CalendarRange className="w-3 h-3" />
											Validity
										</p>
										<p className="text-xs text-text-primary-sem dark:text-white">
											{formatDate(purchase.start_date)}
										</p>
										<p className="text-xs text-text-secondary dark:text-text-tertiary flex items-center gap-1">
											<ArrowRight className="w-3 h-3" />
											{formatDate(purchase.end_date)}
										</p>
									</div>
								</div>

								{/* Usage */}
								<div>
									<div className="flex items-center justify-between text-xs mb-1">
										<span className="text-text-secondary dark:text-text-tertiary">Projects used</span>
										<span className="text-text-primary-sem dark:text-white font-medium">
											{usedProjects}/{projectLimit || '∞'}
										</span>
									</div>
									<div className="h-2 rounded-full bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input overflow-hidden">
										<div
											className="h-full rounded-full bg-primary-500 dark:bg-primary-400 transition-all"
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>

								{/* Features */}
								{Object.keys(featureObj).length > 0 && (
									<div>
										<p className="text-xs font-medium text-text-secondary dark:text-text-tertiary mb-1">
											Key features
										</p>
										<div className="flex flex-wrap gap-1">
											{Object.entries(featureObj)
												.slice(0, 4)
												.map(([key, value]) => (
													<span
														key={key}
														className="text-[11px] px-2 py-1 rounded-full bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input text-text-secondary dark:text-text-tertiary"
													>
														{key.replace(/_/g, ' ')}{' '}
														{typeof value === 'number'
															? `(${value})`
															: value === true
																? '✓'
																: ''}
													</span>
												))}
											{Object.keys(featureObj).length > 4 && (
												<span className="text-[11px] text-text-secondary dark:text-text-tertiary">
													+{Object.keys(featureObj).length - 4} more
												</span>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
