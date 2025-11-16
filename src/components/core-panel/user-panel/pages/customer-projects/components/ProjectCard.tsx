'use client'
import React from 'react'
import Link from 'next/link'
import {
	FolderKanban,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Database,
	User,
	Copy,
	Eye,
	Edit,
	PlayCircle,
	PauseCircle,
	MoreVertical,
	Settings,
	Code,
	FileText,
	Trash2,
	Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Project } from '@/types/customer-project'
import { toast } from 'react-toastify'

interface ProjectCardProps {
	project: Project
	onEdit: (project: Project) => void
	onDelete: (project: Project) => void
	onToggleStatus: (project: Project) => void
	isUpdating: boolean
	openMenu: number | null
	setOpenMenu: (id: number | null) => void
}

const getStatusConfig = (status: string) => {
	switch (status) {
		case 'active':
			return {
				label: 'Active',
				icon: CheckCircle2,
				className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
				bgColor: 'bg-success-50 dark:bg-success-950/20',
			}
		case 'inactive':
			return {
				label: 'Inactive',
				icon: XCircle,
				className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
				bgColor: 'bg-gray-50 dark:bg-gray-950/20',
			}
		case 'suspended':
			return {
				label: 'Suspended',
				icon: AlertTriangle,
				className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
				bgColor: 'bg-error-50 dark:bg-error-950/20',
			}
		default:
			return {
				label: status,
				icon: AlertTriangle,
				className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
				bgColor: 'bg-gray-50 dark:bg-gray-950/20',
			}
	}
}

export default function ProjectCard({
	project,
	onEdit,
	onDelete,
	onToggleStatus,
	isUpdating,
	openMenu,
	setOpenMenu
}: ProjectCardProps) {
	const statusConfig = getStatusConfig(project.status)
	const StatusIcon = statusConfig.icon
	const createdDate = new Date(project.createdAt)
	const updatedDate = new Date(project.updatedAt)
	const daysSinceUpdate = Math.floor(
		(Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
	)

	const handleCopyDBName = (dbName: string) => {
		navigator.clipboard.writeText(dbName)
		toast.success('Database name copied!')
	}

	return (
		<div
			className={cn(
				'p-6 hover:bg-surface-hover transition-colors group',
				statusConfig.bgColor
			)}
		>
			<div className="flex items-start justify-between gap-6">
				{/* Project Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start gap-4">
						{/* Icon */}
						<div
							className={cn(
								'p-3 rounded-lg shrink-0',
								statusConfig.className.split(' ')[0]
							)}
						>
							<FolderKanban className="w-6 h-6" />
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3 mb-2 flex-wrap">
								<Link
									href={`/dashboard/projects/${project.id}`}
									className="text-lg font-semibold text-text-primary-sem hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate"
								>
									{project.name}
								</Link>
								<span
									className={cn(
										'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
										statusConfig.className
									)}
								>
									<StatusIcon className="w-3.5 h-3.5" />
									{statusConfig.label}
								</span>
							</div>

							{project.description && (
								<p className="text-sm text-text-secondary line-clamp-2 mb-3">
									{project.description}
								</p>
							)}

							{/* Database Info */}
							<div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary mb-2">
								<div className="flex items-center gap-2">
									<Database className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
									<span className="font-mono">{project.db_name}</span>
									<button
										onClick={() => handleCopyDBName(project.db_name)}
										className="ml-1 p-1 hover:bg-surface-input rounded transition-colors opacity-0 group-hover:opacity-100"
										title="Copy database name"
									>
										<Copy className="w-3.5 h-3.5 text-text-secondary hover:text-text-primary" />
									</button>
								</div>
								{project.db_user && (
									<div className="flex items-center gap-2">
										<User className="w-3.5 h-3.5" />
										<span className="font-mono">{project.db_user}</span>
									</div>
								)}
							</div>

							{/* Dates */}
							<div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
								<span>
									Created {createdDate.toLocaleDateString()}
								</span>
								<span>•</span>
								<span>
									Updated {daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate}d ago`}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2 shrink-0">
					{/* Quick Actions */}
					<div className="hidden md:flex items-center gap-1">
						<button
							onClick={() => onToggleStatus(project)}
							disabled={isUpdating}
							className="p-2 rounded-lg hover:bg-surface-input transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
							title={project.status === 'active' ? 'Pause project' : 'Activate project'}
						>
							{isUpdating ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : project.status === 'active' ? (
								<PauseCircle className="w-5 h-5" />
							) : (
								<PlayCircle className="w-5 h-5" />
							)}
						</button>

						<Link
							href={`/dashboard/projects/${project.id}`}
							className="p-2 rounded-lg hover:bg-surface-input transition-colors text-text-secondary hover:text-text-primary"
							title="View details"
						>
							<Eye className="w-5 h-5" />
						</Link>

						<button
							onClick={() => onEdit(project)}
							className="p-2 rounded-lg hover:bg-surface-input transition-colors text-text-secondary hover:text-text-primary"
							title="Edit project"
						>
							<Edit className="w-5 h-5" />
						</button>
					</div>

					{/* More Menu */}
					<div className="relative">
						<button
							onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
							className="p-2 rounded-lg hover:bg-surface-input transition-colors text-text-secondary hover:text-text-primary"
						>
							<MoreVertical className="w-5 h-5" />
						</button>

						{/* Dropdown Menu */}
						{openMenu === project.id && (
							<div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border-subtle rounded-lg shadow-xl z-20 overflow-hidden">
								<Link
									href={`/dashboard/projects/${project.id}/settings`}
									className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover text-text-primary transition-colors border-b border-border-subtle"
								>
									<Settings className="w-4 h-4" />
									Settings
								</Link>

								<button
									className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover text-text-primary transition-colors border-b border-border-subtle text-left"
								>
									<Code className="w-4 h-4" />
									API Documentation
								</button>

								<button
									className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover text-text-primary transition-colors border-b border-border-subtle text-left"
								>
									<FileText className="w-4 h-4" />
									Export Config
								</button>

								<button
									onClick={() => onDelete(project)}
									className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-950/20 text-error-600 dark:text-error-400 transition-colors text-left"
								>
									<Trash2 className="w-4 h-4" />
									Delete Project
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
