'use client'
import React from 'react'
import { X, Loader2 } from 'lucide-react'
import { useCreateProjectMutation } from '@/apis/mutation/customerProject/useCreateProjectMutation'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'

interface CreateProjectModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
	const { data, setData, submit, isLoading, errors } = useCreateProjectMutation()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await submit(e)

		if (response?.status) {
			toast.success('Project created successfully!')
			onSuccess()
			onClose()
			// Reset form
			setData('name', '')
			setData('description', '')
		}
	}

	const handleClose = () => {
		if (!isLoading) {
			onClose()
			// Reset form
			setData('name', '')
			setData('description', '')
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<div className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full mx-4">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border-subtle">
					<h2 className="text-xl font-semibold text-text-primary">Create New Project</h2>
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
						<label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
							Project Name <span className="text-error-500">*</span>
						</label>
						<input
							id="name"
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
						<label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
							Description
						</label>
						<textarea
							id="description"
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

					{/* Info Message */}
					<div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 rounded-lg p-4">
						<p className="text-sm text-primary-700 dark:text-primary-300">
							A database and API will be automatically generated for your project upon creation.
						</p>
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
									Creating...
								</>
							) : (
								'Create Project'
							)}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}
