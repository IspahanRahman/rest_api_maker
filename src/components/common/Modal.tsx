'use client'

import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils';

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	subTitle?: string
	description?: string
	children?: React.ReactNode
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'max'
	className?: string
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	subTitle,
	children,
	size = 'md',
	className
}) => {
	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		},
		[onClose]
	)

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('overflow-hidden')
			window.addEventListener('keydown', handleEscape)
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			window.removeEventListener('keydown', handleEscape)
			document.body.classList.remove('overflow-hidden')
		}
	}, [isOpen, handleEscape])

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			// onClick={onClose}
			>
				<motion.div
					className={cn(
						`bg-white dark:bg-bg_dark rounded-lg shadow-lg  relative ${size === 'sm' ? 'w-80' : size === 'md' ? 'w-96' : size === 'lg' ? 'w-[32rem]' : size === 'xl' ? 'w-[60vw]' : size === 'max' ? 'w-[70vw] overflow-y-auto' : 'w-80'} max-h-[90vh]  scrollbar-hide`,
						className
					)}
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					exit={{ scale: 0.9 }}
					transition={{ type: 'spring', stiffness: 200 }}
					onClick={e => e.stopPropagation()}
					role='dialog'
					aria-modal='true'
					tabIndex={-1}
				>
					{/* Modal Header */}
					<div className='flex justify-between items-center px-4 pt-4'>
						{title && (
							<div>
								<h2 className='text-lg text-black font-bold dark:text-text-primary'>
									{title}
								</h2>
								{subTitle && (
									<p className='text-md text-gray-500 dark:text-text-secondary'>
										Payslip for the duration {subTitle}
									</p>
								)}
							</div>
						)}
						<button
							onClick={onClose}
							aria-label='Close modal'
							className='p-2 rounded-full bg-gray-100 hover:bg-gray-200  dark:bg-bg_dark dark:hover:bg-bg_secondary  transition-colors duration-500 cursor-pointer'
						>
							<X className='w-5 h-5 text-gray-600 dark:text-text-primary hover:text-red-500 transition-colors duration-500' />
						</button>
					</div>
					<hr className='my-2 border-gray-300' />

					{/* Modal Content */}
					<div className='px-4 pb-4'>{children}</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default Modal
