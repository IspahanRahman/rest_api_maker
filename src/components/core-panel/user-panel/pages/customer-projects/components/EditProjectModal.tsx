'use client'
import React, { useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useUpdateProjectMutation } from '@/apis/mutation/customerProject/useUpdateProjectMutation'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import { Project } from '@/types/customer-project'

interface EditProjectModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	project: Project | null
}

export default function EditProjectModal({ isOpen, onClose, onSuccess, project }: EditProjectModalProps) {
	const { data, setData, submit, isLoading, errors } = useUpdateProjectMutation(project?.id || 0)

	// Pre-fill form when project changes
	useEffect(() => {
		if (project) {
			setData('name', project.name)
			setData('description', project.description || '')
			setData('status', project.status)
		}
	}, [project, setData])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await submit(e)

		if (response?.status) {
			toast.success('Project updated successfully!')
			onSuccess()
			onClose()
		}
	}

	const handleClose = () => {
		if (!isLoading) {
			onClose()
		}
	}

	if (!project) return null

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<div className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full mx-4">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border-subtle">
					<h2 className="text-xl font-semibold text-text-primary">Edit Project</h2>
					<button
						onClick={handleClose}
						disabled={isLoading}
						className="p-2 hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<X className="w-5 h-5 text-text-secondary" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{/* Project Name */}
					<div>
						<label htmlFor="edit-name" className="block text-sm font-medium text-text-primary mb-2">
							Project Name <span className="text-error-500">*</span>
						</label>
						<input
							id="edit-name"
							type="text"
							value={data.name}
							onChange={(e) => setData('name', e.target.value)}
							placeholder="Enter project name"
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
								text-text-primary placeholder:text-text-tertiary
								focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
								disabled:opacity-50 disabled:cursor-not-allowed
								transition-all"
						/>
						{errors.name && (
							<p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.name}</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label htmlFor="edit-description" className="block text-sm font-medium text-text-primary mb-2">
							Description
						</label>
						<textarea
							id="edit-description"
							value={data.description}
							onChange={(e) => setData('description', e.target.value)}
							placeholder="Enter project description (optional)"
							rows={4}
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
								text-text-primary placeholder:text-text-tertiary
								focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
								disabled:opacity-50 disabled:cursor-not-allowed
								transition-all resize-none"
						/>
						{errors.description && (
							<p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.description}</p>
						)}
					</div>

					{/* Status */}
					<div>
						<label htmlFor="edit-status" className="block text-sm font-medium text-text-primary mb-2">
							Status <span className="text-error-500">*</span>
						</label>
						<select
							id="edit-status"
							value={data.status}
							onChange={(e) => setData('status', e.target.value as 'active' | 'inactive' | 'suspended')}
							disabled={isLoading}
							className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
								text-text-primary
								focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
								disabled:opacity-50 disabled:cursor-not-allowed
								transition-all"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="suspended">Suspended</option>
						</select>
						{errors.status && (
							<p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.status}</p>
						)}
					</div>

					{/* Database Info (Read-only) */}
					<div className="bg-surface-hover border border-border-subtle rounded-lg p-4">
						<p className="text-sm font-medium text-text-primary mb-2">Database Information</p>
						<div className="space-y-1.5 text-sm text-text-secondary">
							<div className="flex justify-between">
								<span>Database Name:</span>
								<span className="font-mono text-text-primary">{project.db_name}</span>
							</div>
							{project.db_user && (
								<div className="flex justify-between">
									<span>Database User:</span>
									<span className="font-mono text-text-primary">{project.db_user}</span>
								</div>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							disabled={isLoading}
							className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
								text-text-secondary hover:bg-surface-hover
								disabled:opacity-50 disabled:cursor-not-allowed
								transition-colors font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
								text-white rounded-lg font-medium
								disabled:opacity-50 disabled:cursor-not-allowed
								transition-colors flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Updating...
								</>
							) : (
								'Update Project'
							)}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}
