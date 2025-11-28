'use client';

import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from 'recharts';
import { BarChart3, LayoutTemplate } from 'lucide-react';

interface ProjectChartItem {
    month: string;
    count: number;
}

interface TableStatItem {
    project_id: string;
    tables: number;
    Project: {
        name: string;
    };
}

interface ChartsData {
    projectChart: ProjectChartItem[];
    tableStats: TableStatItem[];
}

interface ClientDashboardChartsProps {
    charts: ChartsData;
}

function formatMonthLabel(month: string) {
    try {
        const date = new Date(`${month}-01`);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            year: '2-digit',
        });
    } catch {
        return month;
    }
}

export default function ClientDashboardCharts({ charts }: ClientDashboardChartsProps) {
    const projectChartData =
        charts.projectChart?.map((item) => ({
            label: formatMonthLabel(item.month),
            projects: item.count,
        })) ?? [];

    const tableStatsData =
        charts.tableStats?.map((item) => ({
            project: item.Project.name,
            tables: item.tables,
        })) ?? [];

    // Chart colors for light/dark mode
    const gridStroke = 'var(--chart-grid, #e5e7eb)';
    const axisStroke = 'var(--chart-axis, #9ca3af)';
    const lineStroke = 'var(--chart-line, #3b82f6)';
    const barFill = 'var(--chart-bar, #22c55e)';

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Project Growth */}
            <div className="bg-surface-card dark:bg-surface-card-dark rounded-xl border border-border-subtle dark:border-border-input p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input">
                            <BarChart3 className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary-sem dark:text-white">
                                Project Growth
                            </h3>
                            <p className="text-xs text-text-secondary dark:text-text-tertiary">
                                Number of projects created over time.
                            </p>
                        </div>
                    </div>
                </div>
                {projectChartData.length ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={projectChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--chart-axis-text, #9ca3af)' }} stroke={axisStroke} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--chart-axis-text, #9ca3af)' }} stroke={axisStroke} allowDecimals={false} />
                                <Tooltip
                                    wrapperClassName="!bg-surface-card dark:!bg-surface-card-dark !border !border-border-subtle dark:!border-border-input !text-text-primary-sem dark:!text-white"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="projects"
                                    stroke={lineStroke}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-xs text-text-secondary dark:text-text-tertiary text-center py-10">
                        Project growth data will appear once you start creating projects.
                    </p>
                )}
            </div>

            {/* Tables per Project */}
            <div className="bg-surface-card dark:bg-surface-card-dark rounded-xl border border-border-subtle dark:border-border-input p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-surface-input dark:bg-surface-card border border-border-subtle dark:border-border-input">
                            <LayoutTemplate className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary-sem dark:text-white">
                                Tables per Project
                            </h3>
                            <p className="text-xs text-text-secondary dark:text-text-tertiary">
                                How your tables are distributed across projects.
                            </p>
                        </div>
                    </div>
                </div>
                {tableStatsData.length ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tableStatsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--chart-axis-text, #9ca3af)' }} stroke={axisStroke} allowDecimals={false} />
                                <YAxis
                                    dataKey="project"
                                    type="category"
                                    tick={{ fontSize: 11, fill: 'var(--chart-axis-text, #9ca3af)' }}
                                    width={120}
                                    stroke={axisStroke}
                                />
                                <Tooltip
                                    wrapperClassName="!bg-surface-card dark:!bg-surface-card-dark !border !border-border-subtle dark:!border-border-input !text-text-primary-sem dark:!text-white"
                                />
                                <Bar dataKey="tables" radius={[0, 6, 6, 0]} fill={barFill} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-xs text-text-secondary dark:text-text-tertiary text-center py-10">
                        Table statistics will appear once you create tables in your projects.
                    </p>
                )}
            </div>
        </section>
    );
}
