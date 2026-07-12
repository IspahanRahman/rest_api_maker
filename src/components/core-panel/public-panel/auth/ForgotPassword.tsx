'use client'
import React from 'react'
import { useForgotPasswordMutation } from '@/apis/mutation/auth/useForgotPasswordMutation'
import { toast } from 'react-toastify'
import { CustomSwal, DangerSwal } from '@/components/lib/swal-config/Swal'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function ForgotPassword() {
	const router = useRouter()
	const params = useParams()
	const locale = params?.locale || 'en'
	const { submit, isLoading, data, errors, setData } =
		useForgotPasswordMutation()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!data.email.trim()) {
			toast.error('Please enter your email')
			return
		}

		try {
			const result = await submit()
			if (!result?.status) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Failed',
					text: result?.message || 'Failed to process your request.'
				})
				return
			}

			CustomSwal.fire({
				icon: 'success',
				title: 'Success',
				text: 'If an account with that email exists, a password reset link has been sent.'
			})
		} catch (error) {
			DangerSwal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An unexpected error occurred. Please try again later.'
			})
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				{/* Header */}
				<div className='text-center'>
					<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4'>
						{/* You can use a lock icon here for password reset */}
						<svg
							className='w-8 h-8 text-primary-600 dark:text-primary-400'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 17v1m0-8a4 4 0 00-4 4v3a4 4 0 008 0v-3a4 4 0 00-4-4zm0 0V7a4 4 0 118 0v2'
							/>
						</svg>
					</div>
					<h2 className='text-3xl font-bold text-text-primary-sem'>
						Forgot Password
					</h2>
					<p className='mt-2 text-sm text-text-secondary'>
						Enter your email to receive a password reset link
					</p>
				</div>

				{/* Form Card */}
				<div className='bg-surface-card rounded-2xl shadow-lg p-8'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Email Input */}
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-text-primary-sem mb-2'
							>
								Email Address
							</label>
							<input
								id='email'
								type='email'
								className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-input text-foreground ${errors?.email ? 'border-red-500' : 'border-border-input'}`}
								placeholder='you@example.com'
								value={data.email}
								onChange={e => setData('email', e.target.value)}
								disabled={isLoading}
								required
								autoComplete='email'
							/>
							{errors?.email && (
								<p className='text-red-500 text-xs mt-2'>
									{errors.email}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<button
							type='submit'
							className='w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60'
							disabled={isLoading}
						>
							{isLoading ? 'Sending...' : 'Send Reset Link'}
						</button>
					</form>
				</div>

				{/* Back to Login Link */}
				<div className='text-center'>
					<p className='text-sm text-text-secondary'>
						Remember your password?{' '}
						<Link
							href={`/${locale}/login`}
							className='font-semibold text-primary-500 hover:text-primary-600 transition-colors'
						>
							Back to Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
