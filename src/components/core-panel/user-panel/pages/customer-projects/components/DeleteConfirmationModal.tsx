'use client'
import React from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import Modal from '@/components/common/Modal'

interface DeleteConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	projectName: string
	isDeleting: boolean
}

export default function DeleteConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	projectName,
	isDeleting
}: DeleteConfirmationModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={isDeleting ? () => {} : onClose}>
			<div className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full mx-4">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-border-subtle">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-lg">
							<AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
						</div>
						<h2 className="text-xl font-semibold text-text-primary">Delete Project</h2>
					</div>
					<button
						onClick={onClose}
						disabled={isDeleting}
						className="p-2 hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<X className="w-5 h-5 text-text-secondary" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-4">
					<p className="text-text-primary">
						Are you sure you want to delete <span className="font-semibold">"{projectName}"</span>?
					</p>

					<div className="bg-error-50 dark:bg-error-950/20 border border-error-200 dark:border-error-900 rounded-lg p-4">
						<p className="text-sm text-error-700 dark:text-error-300 font-medium mb-2">
							⚠️ This action cannot be undone!
						</p>
						<ul className="text-sm text-error-600 dark:text-error-400 space-y-1 list-disc list-inside">
							<li>All project data will be permanently deleted</li>
							<li>Database and tables will be removed</li>
							<li>API endpoints will be deactivated</li>
							<li>This cannot be recovered</li>
						</ul>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 p-6 border-t border-border-subtle">
					<button
						type="button"
						onClick={onClose}
						disabled={isDeleting}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
							text-text-secondary hover:bg-surface-hover
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="flex-1 px-4 py-2.5 bg-error-600 hover:bg-error-700
							text-white rounded-lg font-medium
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-colors flex items-center justify-center gap-2"
					>
						{isDeleting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<AlertTriangle className="w-4 h-4" />
								Delete Project
							</>
						)}
					</button>
				</div>
			</div>
		</Modal>
	)
}
