'use client';

import React from 'react';
import { Package, Clock } from 'lucide-react';

interface PurchaseItem {
    id: string;
    start_date: string;
    end_date: string;
    amount_paid: string;
    status: string;
    total_created_project: number;
    total_project_limit: number;
    Package: {
        id: string;
        name: string;
    };
    PackagePlan: {
        plan_type: string;
        price: string;
        duration_days: number;
    };
    createdAt: string;
}

interface PurchaseHistoryProps {
    purchases: PurchaseItem[];
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

export default function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
    return (
        <section className="bg-surface-card dark:bg-surface-card-dark rounded-xl border border-border-subtle dark:border-border-input shadow-sm">
            <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input">
                        <Package className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-text-primary-sem dark:text-white">
                            Purchase History
                        </h2>
                        <p className="text-xs text-text-secondary dark:text-text-tertiary">
                            All your package purchases with billing details.
                        </p>
                    </div>
                </div>
                {purchases.length > 0 && (
                    <div className="inline-flex items-center gap-1 text-[11px] text-text-secondary dark:text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        Last purchase: {formatDate(purchases[0].createdAt)}
                    </div>
                )}
            </div>

            {purchases.length === 0 ? (
                <div className="px-4 pb-6">
                    <div className="rounded-lg bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input p-4 text-center text-sm text-text-secondary dark:text-text-tertiary">
                        No purchases yet.
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-t border-border-subtle dark:border-border-input">
                        <thead className="bg-surface-input dark:bg-surface-card">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Package
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Plan
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Period
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Amount
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Usage
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-text-secondary dark:text-text-tertiary uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-border-input">
                            {purchases.map((item) => (
                                <tr key={item.id} className="hover:bg-surface-hover/60 dark:hover:bg-surface-card/70 transition-colors">
                                    <td className="px-4 py-2">
                                        <p className="text-sm font-medium text-text-primary-sem dark:text-white">
                                            {item.Package.name}
                                        </p>
                                        <p className="text-[11px] text-text-secondary dark:text-text-tertiary">
                                            ID: {item.Package.id.slice(0, 8)}…
                                        </p>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-sm text-text-primary-sem dark:text-white capitalize">
                                            {item.PackagePlan.plan_type}
                                        </p>
                                        <p className="text-[11px] text-text-secondary dark:text-text-tertiary">
                                            {item.PackagePlan.duration_days} days · ${Number(item.PackagePlan.price).toFixed(2)}
                                        </p>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p className="text-xs text-text-primary-sem dark:text-white">
                                            {formatDate(item.start_date)}
                                        </p>
                                        <p className="text-xs text-text-secondary dark:text-text-tertiary">
                                            to {formatDate(item.end_date)}
                                        </p>
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm font-semibold text-text-primary-sem dark:text-white">
                                        ${Number(item.amount_paid).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-xs text-text-secondary dark:text-text-tertiary">
                                        {item.total_created_project}/{item.total_project_limit}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium border
                                                ${item.status === 'active'
                                                    ? 'bg-success-50 dark:bg-success-900 text-success-600 dark:text-success-400 border-success-200 dark:border-success-700'
                                                    : 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
