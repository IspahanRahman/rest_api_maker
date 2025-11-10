'use client'
import React from 'react'
import { StatsCard } from '@/components/core-panel/user-panel/pages/dashboard/StatsCard'
import { RecentProjects } from '@/components/core-panel/user-panel/pages/dashboard/RecentProjects'
import { RecentPayments } from '@/components/core-panel/user-panel/pages/dashboard/RecentPayments'
import {
  FolderKanban,
  Package,
  CreditCard,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

export default function DashboardPage() {
  const user = getCurrentUser()

  // Mock data - Replace with actual API calls
  const stats = {
    totalProjects: 12,
    activePackages: 3,
    totalPayments: 8,
    monthlySpending: 247.5,
  }

  const recentProjects = [
    {
      id: 1,
      name: 'E-Commerce API',
      description: 'REST API for online shopping platform',
      db_name: 'ecommerce_db',
      db_user: 'ecom_user',
      status: 'active' as const,
      created_at: '2025-10-15T10:00:00Z',
      updated_at: '2025-11-04T14:30:00Z',
    },
    {
      id: 2,
      name: 'Blog Management System',
      description: 'API for content management',
      db_name: 'blog_db',
      db_user: 'blog_user',
      status: 'active' as const,
      created_at: '2025-10-20T09:00:00Z',
      updated_at: '2025-11-03T16:45:00Z',
    },
    {
      id: 3,
      name: 'Inventory Tracker',
      description: 'Stock management API',
      db_name: 'inventory_db',
      db_user: 'inv_user',
      status: 'inactive' as const,
      created_at: '2025-09-10T11:00:00Z',
      updated_at: '2025-10-28T10:20:00Z',
    },
  ]

  const recentPayments = [
    {
      id: 1,
      user_id: user?.id || 1,
      package_id: 2,
      package_name: 'Professional Plan',
      amount: 99.99,
      status: 'completed' as const,
      payment_method: 'Credit Card',
      transaction_id: 'TXN123456789',
      created_at: '2025-11-01T10:00:00Z',
      updated_at: '2025-11-01T10:01:00Z',
    },
    {
      id: 2,
      user_id: user?.id || 1,
      package_id: 1,
      package_name: 'Basic Plan',
      amount: 49.99,
      status: 'completed' as const,
      payment_method: 'PayPal',
      transaction_id: 'TXN987654321',
      created_at: '2025-10-15T14:30:00Z',
      updated_at: '2025-10-15T14:31:00Z',
    },
    {
      id: 3,
      user_id: user?.id || 1,
      package_id: 3,
      package_name: 'Enterprise Plan',
      amount: 199.99,
      status: 'pending' as const,
      payment_method: 'Bank Transfer',
      transaction_id: 'TXN555666777',
      created_at: '2025-11-04T08:15:00Z',
      updated_at: '2025-11-04T08:15:00Z',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary-sem mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-text-secondary">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Active Packages"
          value={stats.activePackages}
          icon={Package}
          trend={{ value: 5, isPositive: true }}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={CreditCard}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          title="Monthly Spending"
          value={`$${stats.monthlySpending}`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: false }}
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 hover:shadow-md transition-all group">
          <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-500 transition-colors">
            <FolderKanban className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-text-primary-sem">Create Project</p>
            <p className="text-sm text-text-secondary">Start a new REST API</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 hover:shadow-md transition-all group">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-500 transition-colors">
            <Package className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-text-primary-sem">Upgrade Plan</p>
            <p className="text-sm text-text-secondary">View pricing options</p>
          </div>
        </button>

        <button className="flex items-center gap-3 p-4 bg-surface-card rounded-xl border border-border-subtle hover:border-primary-500 hover:shadow-md transition-all group">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-500 transition-colors">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-text-primary-sem">API Logs</p>
            <p className="text-sm text-text-secondary">View activity logs</p>
          </div>
        </button>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={recentProjects} />
        <RecentPayments payments={recentPayments} />
      </div>

      {/* Activity Timeline */}
      <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle p-6">
        <h2 className="text-lg font-semibold text-text-primary-sem mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-success-500"></div>
            <div className="flex-1">
              <p className="text-sm text-text-primary-sem">
                <span className="font-semibold">E-Commerce API</span> was updated
              </p>
              <p className="text-xs text-text-secondary">2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
            <div className="flex-1">
              <p className="text-sm text-text-primary-sem">
                Payment of <span className="font-semibold">$99.99</span> completed
              </p>
              <p className="text-xs text-text-secondary">Yesterday</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-warning-500"></div>
            <div className="flex-1">
              <p className="text-sm text-text-primary-sem">
                <span className="font-semibold">Inventory Tracker</span> status changed to inactive
              </p>
              <p className="text-xs text-text-secondary">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

