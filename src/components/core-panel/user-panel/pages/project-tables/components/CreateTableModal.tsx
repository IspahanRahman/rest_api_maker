'use client'
import React, { useState } from 'react'
import { Loader2, Plus, Table, Trash2, X } from 'lucide-react'
import { useCreateTableMutation } from '@/apis/mutation/projectTable/useCreateTableMutation'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Swal from 'sweetalert2'
import Select from '@/components/common/Select'

interface CreateTableModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	projectId: string
}

interface ColumnDef {
	id: string
	name: string
	data_type: string
	is_nullable: boolean
	is_primary_key: boolean
	is_unique: boolean
	default_value?: string
	max_length?: number
}

const DATA_TYPES = [
	'INTEGER',
	'BIGINT',
	'VARCHAR',
	'TEXT',
	'BOOLEAN',
	'DATE',
	'DATETIME',
	'TIMESTAMP',
	'DECIMAL',
	'FLOAT',
	'DOUBLE',
	'JSON',
]

export default function CreateTableModal({ isOpen, onClose, onSuccess, projectId }: CreateTableModalProps) {
	const { data, setData, submit, isLoading, errors } = useCreateTableMutation()
	const [columns, setColumns] = useState<ColumnDef[]>([
		{
			id: '1',
			name: 'id',
			data_type: 'INTEGER',
			is_nullable: false,
			is_primary_key: true,
			is_unique: true,
		},
	])

	const addColumn = () => {
		const newColumn: ColumnDef = {
			id: Date.now().toString(),
			name: '',
			data_type: 'VARCHAR',
			is_nullable: true,
			is_primary_key: false,
			is_unique: false,
		}
		setColumns([...columns, newColumn])
	}

	const removeColumn = (id: string) => {
		if (columns.length === 1) {
			toast.error('Table must have at least one column')
			return
		}
		setColumns(columns.filter((col) => col.id !== id))
	}

	const updateColumn = (id: string, field: keyof ColumnDef, value: any) => {
		setColumns(
			columns.map((col) =>
				col.id === id
					? {
							...col,
							[field]: value,
					  }
					: col
			)
		)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!data.table_name.trim()) {
			toast.error('Table name is required')
			return
		}

		// Validate columns
		for (const col of columns) {
			if (!col.name.trim()) {
				toast.error('All columns must have a name')
				return
			}
		}

		// Set project_id and table_columns
		data.project_id = projectId
		data.table_columns = columns.map((col) => ({
			name: col.name,
			data_type: col.data_type,
			is_nullable: col.is_nullable,
			is_primary_key: col.is_primary_key,
			is_unique: col.is_unique,
			default_value: col.default_value || null,
			max_length: col.data_type === 'VARCHAR' ? col.max_length : null,
		}))

		try {
			const response = await submit()
			if (!response?.status) {
				Swal.fire({
					icon: 'error',
					title: 'Creation Failed',
					text: response?.message || 'Table creation failed',
				})
				return
			}
			toast.success('Table created successfully!')
			onSuccess()
			handleClose()
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Creation Failed',
				text: 'An unexpected error occurred during table creation.',
			})
		}
	}

	const handleClose = () => {
		if (!isLoading) {
			onClose()
			setData('name', '')
			setData('description', '')
			setColumns([
				{
					id: '1',
					name: 'id',
					data_type: 'INTEGER',
					is_nullable: false,
					is_primary_key: true,
					is_unique: true,
				},
			])
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Create New Table"
			size="lg"
			className="max-h-[90vh] overflow-y-auto"
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Table Name */}
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
						Table Name <span className="text-error-500">*</span>
					</label>
					<input
						id="name"
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
					<label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
						Description
					</label>
					<textarea
						id="description"
						value={data.description}
						onChange={(e) => setData('description', e.target.value)}
						placeholder="Enter table description (optional)"
						rows={2}
						disabled={isLoading}
						className="w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
							text-foreground placeholder:text-text-tertiary
							focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
							disabled:opacity-50 disabled:cursor-not-allowed
							transition-all resize-none"
					/>
				</div>

				{/* Columns Section */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<label className="block text-sm font-medium text-foreground">
							Columns <span className="text-error-500">*</span>
						</label>
						<button
							type="button"
							onClick={addColumn}
							disabled={isLoading}
							className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
						>
							<Plus className="w-4 h-4" />
							Add Column
						</button>
					</div>

					<div className="space-y-3 max-h-96 overflow-y-auto border border-border-subtle dark:border-border-input rounded-lg p-4 bg-surface-hover dark:bg-surface-card">
						{columns.map((column, index) => (
							<div key={column.id} className="bg-white dark:bg-surface-card border border-border-input rounded-lg p-4 space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-text-secondary">Column {index + 1}</span>
									{columns.length > 1 && (
										<button
											type="button"
											onClick={() => removeColumn(column.id)}
											disabled={isLoading}
											className="p-1 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="block text-xs text-text-secondary mb-1">Column Name *</label>
										<input
											type="text"
											value={column.name}
											onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
											placeholder="column_name"
											disabled={isLoading}
											className="w-full px-3 py-2 text-sm bg-surface-input border border-border-input rounded-lg
												text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>

									<div>
										<label className="block text-xs text-text-secondary mb-1">Data Type *</label>
										<select
											value={column.data_type}
											onChange={(e) => updateColumn(column.id, 'data_type', e.target.value)}
											disabled={isLoading}
											className="w-full px-3 py-2 text-sm bg-surface-input border border-border-input rounded-lg
												text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
										>
											{DATA_TYPES.map((type) => (
												<option key={type} value={type}>
													{type}
												</option>
											))}
										</select>
									</div>

									{column.data_type === 'VARCHAR' && (
										<div>
											<label className="block text-xs text-text-secondary mb-1">Max Length</label>
											<input
												type="number"
												value={column.max_length || 255}
												onChange={(e) => updateColumn(column.id, 'max_length', parseInt(e.target.value))}
												disabled={isLoading}
												className="w-full px-3 py-2 text-sm bg-surface-input border border-border-input rounded-lg
													text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
										</div>
									)}

									<div className="flex items-center gap-4 col-span-full">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={column.is_nullable}
												onChange={(e) => updateColumn(column.id, 'is_nullable', e.target.checked)}
												disabled={isLoading}
												className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
											/>
											<span className="text-sm text-text-secondary">Nullable</span>
										</label>

										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={column.is_primary_key}
												onChange={(e) => updateColumn(column.id, 'is_primary_key', e.target.checked)}
												disabled={isLoading}
												className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
											/>
											<span className="text-sm text-text-secondary">Primary Key</span>
										</label>

										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={column.is_unique}
												onChange={(e) => updateColumn(column.id, 'is_unique', e.target.checked)}
												disabled={isLoading}
												className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
											/>
											<span className="text-sm text-text-secondary">Unique</span>
										</label>
									</div>
								</div>
							</div>
						))}
					</div>
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
								Creating...
							</>
						) : (
							'Create Table'
						)}
					</button>
				</div>
			</form>
		</Modal>
	)
}
