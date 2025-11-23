'use client'
import React, { useEffect } from 'react'
import { Edit, Loader2, Table } from 'lucide-react'
import { useUpdateTableMutation } from '@/apis/mutation/projectTable/useUpdateTableMutation'
import { ProjectTable } from '@/types/project-table'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Swal from 'sweetalert2'

interface EditTableModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	table: ProjectTable | null
}

const STATUS_OPTIONS = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
]

export default function EditTableModal({ isOpen, onClose, onSuccess, table }: EditTableModalProps) {
	const { data, setData, submit, isLoading, errors } = useUpdateTableMutation(table?.id || '')

	// Pre-fill form when table changes
	useEffect(() => {
		if (table) {
			setData('name', table.name)
			setData('description', table.description || '')
			setData('status', table.status)
		}
	}, [table])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!data.name?.trim()) {
			toast.error('Table name is required')
			return
		}

		try {
			const response = await submit()
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Update Failed',
					text: response?.message || 'Table update failed',
				})
				return
			}
			toast.success('Table updated successfully!')
			onSuccess()
			handleClose()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Update Failed',
				text: 'An unexpected error occurred during table update.',
			})
		}
	}

	const handleClose = () => {
		if (!isLoading) {
			onClose()
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Edit Table" size="md">
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Header */}
				<div className="flex items-start gap-3 pb-4 border-b border-border-subtle dark:border-border-input">
					<div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
						<Edit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-foreground">Edit Table Details</h3>
						<p className="text-sm text-text-secondary mt-0.5">Update table name, description, and status</p>
					</div>
				</div>

				{/* Read-only info */}
				{table && (
					<div className="bg-surface-hover dark:bg-surface-card border border-border-subtle dark:border-border-input rounded-lg p-4">
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div>
								<span className="text-text-secondary block mb-1">Columns</span>
								<span className="font-semibold text-foreground">{table.columns_count}</span>
							</div>
							<div>
								<span className="text-text-secondary block mb-1">Rows</span>
								<span className="font-semibold text-foreground">{table.row_count}</span>
							</div>
						<div>
							<span className="text-text-secondary block mb-1">Created</span>
							<span className="font-semibold text-foreground">{new Date(table.createdAt).toLocaleDateString()}</span>
						</div>
						</div>
					</div>
				)}

				{/* Table Name */}
				<div>
					<label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-2">
						Table Name <span className="text-error-500">*</span>
					</label>
					<input
						id="edit-name"
						type="text"
						value={data.name}
						onChange={(e) => setData('name', e.target.value)}
						placeholder="e.g., users, products, orders"
						disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all"
					/>
					{errors.name && <p className="mt-1.5 text-sm text-error-600 dark:text-error-400">{errors.name}</p>}
				</div>

				{/* Description */}
				<div>
					<label htmlFor="edit-description" className="block text-sm font-medium text-foreground mb-2">
						Description
					</label>
					<textarea
						id="edit-description"
						value={data.description}
						onChange={(e) => setData('description', e.target.value)}
						placeholder="Enter table description (optional)"
						rows={3}
						disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all resize-none"
					/>
				</div>

				{/* Status */}
				<div>
					<label htmlFor="edit-status" className="block text-sm font-medium text-foreground mb-2">
						Status
					</label>
					<select
					id="edit-status"
					value={data.status}
					onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
					disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all"
					>
						{STATUS_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isLoading}
						className="flex-1 px-4 py-2.5 border border-border-input rounded-lg
							text-text-secondary hover:bg-surface-hover dark:hover:bg-surface-card
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
							'Update Table'
						)}
					</button>
				</div>
			</form>
		</Modal>
	)
}
