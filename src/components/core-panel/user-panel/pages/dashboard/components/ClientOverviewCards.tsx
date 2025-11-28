'use client';

import React from 'react';
import { Database, Table, ShoppingCart } from 'lucide-react';

interface Totals {
    totalProjects: number;
    totalTables: number;
    totalPurchases: number;
}

interface ClientOverviewCardsProps {
    totals: Totals;
}

const formatter = new Intl.NumberFormat('en-US');

export default function ClientOverviewCards({ totals }: ClientOverviewCardsProps) {
    const cards = [
        {
            label: 'Total Projects',
            value: totals.totalProjects,
            icon: Database,
            chip: 'Projects you created',
        },
        {
            label: 'Total Tables',
            value: totals.totalTables,
            icon: Table,
            chip: 'Tables across all projects',
        },
        {
            label: 'Total Purchases',
            value: totals.totalPurchases,
            icon: ShoppingCart,
            chip: 'Package purchases',
        },
    ];

    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cards.map(card => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="bg-surface-card dark:bg-surface-card-dark rounded-xl p-4 border border-border-subtle dark:border-border-input shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-tertiary">
                                    {card.label}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-text-primary-sem dark:text-white">
                                    {formatter.format(card.value)}
                                </p>
                                <p className="mt-1 text-xs text-text-secondary dark:text-text-tertiary">
                                    {card.chip}
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input">
                                <Icon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
