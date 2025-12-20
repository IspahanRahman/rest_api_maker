'use client'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useUpdateProfileMutation } from '@/apis/mutation/customer/useUpdateProfileMutation'
import { useChangePasswordMutation } from '@/apis/mutation/auth/useChangePasswordMutation'
import { useProfile } from '@/apis/query/customer/useProfile'
import { toast } from 'react-toastify'
import { CustomSwal, DangerSwal } from '@/components/lib/swal-config/Swal'

export default function CustomerSettings() {
	const [activeTab, setActiveTab] = useState<'profile' | 'password'>(
		'profile'
	)
	const {
		data: profileData,
		isLoading: profileLoading,
		mutate
	} = useProfile()
	const { data, setData, register, submit, isLoading, errors, responseData } =
		useUpdateProfileMutation()

	const {
		data: passwordData,
		setData: setPasswordData,
		register: registerPassword,
		submit: submitPassword,
		isLoading: isLoadingPassword,
		errors: passwordErrors,
		responseData: passwordResponse
	} = useChangePasswordMutation()

	const [confirmPassword, setConfirmPassword] = useState('')
	const [confirmError, setConfirmError] = useState<string | null>(null)

	//profile update
	React.useEffect(() => {
		if (profileData) {
			setData('name', profileData.name || '')
			setData('phone_number', profileData.phone_number || '')
			setData('address', profileData.address || '')
			setData('city', profileData.city || '')
			setData('state', profileData.state || '')
			setData('country', profileData.country || '')
		}
	}, [profileData])

	//profile update function
	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (!data.name.trim()) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Validation Error',
					text: 'Name is required.'
				})
				return
			}
			if (!data.phone_number.trim()) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Validation Error',
					text: 'Phone number is required.'
				})
				return
			}
			//follow international phone number format
			const phoneRegex = /^\d{10,}$/
			if (!phoneRegex.test(data.phone_number.trim())) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Validation Error',
					text: 'Phone number must be at least 10 digits and contain only numbers.'
				})
				return
			}
			const result = await submit()
			if (!result?.status) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Update Failed',
					text: result?.message || 'Profile update failed.'
				})
				return
			}
			CustomSwal.fire({
				icon: 'success',
				title: 'Profile Updated',
				text: 'Your profile has been updated successfully.'
			})
			mutate() // Refresh profile data after update
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				'An error occurred during profile update'
			DangerSwal.fire({
				icon: 'error',
				title: 'Error',
				text: errorMessage
			})
		}
	}

	//password change function
	const hanldeSubmitPassword = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (
				!passwordData.current_password.trim() ||
				!passwordData.new_password.trim() ||
				!confirmPassword.trim()
			) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Validation Error',
					text: 'All password fields are required.'
				})
				return
			}
			if (passwordData.new_password !== confirmPassword) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Validation Error',
					text: 'New password and confirm password do not match.'
				})
				return
			}
			const result = await submitPassword()
			if (!result?.status) {
				DangerSwal.fire({
					icon: 'error',
					title: 'Change Failed',
					text: result?.message || 'Password change failed.'
				})
				return
			}
			CustomSwal.fire({
				icon: 'success',
				title: 'Password Changed',
				text: 'Your password has been changed successfully.'
			})
			// Clear password fields
			setPasswordData('current_password', '')
			setPasswordData('new_password', '')
			setConfirmPassword('')
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				'An error occurred during password change'
			DangerSwal.fire({
				icon: 'error',
				title: 'Error',
				text: errorMessage
			})
		}
	}

	return (
		<div className='bg-surface min-h-screen'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex gap-2 mb-0 border-b border-border-input'>
					<button
						className={`px-6 py-3 rounded-t-lg font-medium transition-colors cursor-pointer ${
							activeTab === 'profile'
								? 'bg-background text-foreground border-b-2 border-primary-600'
								: 'bg-surface-input text-text-tertiary'
						}`}
						onClick={() => setActiveTab('profile')}
						type='button'
					>
						Profile Settings
					</button>
					<button
						className={`px-6 py-3 rounded-t-lg font-medium transition-colors cursor-pointer ${
							activeTab === 'password'
								? 'bg-background text-foreground border-b-2 border-primary-600'
								: 'bg-surface-input text-text-tertiary'
						}`}
						onClick={() => setActiveTab('password')}
						type='button'
					>
						Password Settings
					</button>
				</div>

				<div className='bg-surface rounded-b-lg shadow-lg p-8'>
					{activeTab === 'profile' && (
						<form
							onSubmit={handleProfileSubmit}
							className='space-y-5'
						>
							<h2 className='text-xl font-semibold text-foreground mb-4'>
								Profile Settings
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{/* Name */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										Name{' '}
										<span className='text-error-500'>
											*
										</span>
									</label>
									<input
										{...register('name')}
										value={
											typeof data.name === 'string'
												? data.name
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='Name'
										disabled={isLoading}
									/>
									{errors.name && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.name}
										</p>
									)}
								</div>
								{/* Phone Number */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										Phone Number{' '}
										<span className='text-error-500'>
											*
										</span>
									</label>
									<input
										{...register('phone_number')}
										value={
											typeof data.phone_number ===
											'string'
												? data.phone_number
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='Phone Number'
										disabled={isLoading}
									/>
									{errors.phone_number && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.phone_number}
										</p>
									)}
								</div>
								{/* Address */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										Address
									</label>
									<input
										{...register('address')}
										value={
											typeof data.address === 'string'
												? data.address
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='Address'
										disabled={isLoading}
									/>
									{errors.address && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.address}
										</p>
									)}
								</div>
								{/* City */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										City
									</label>
									<input
										{...register('city')}
										value={
											typeof data.city === 'string'
												? data.city
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='City'
										disabled={isLoading}
									/>
									{errors.city && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.city}
										</p>
									)}
								</div>
								{/* State */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										State
									</label>
									<input
										{...register('state')}
										value={
											typeof data.state === 'string'
												? data.state
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='State'
										disabled={isLoading}
									/>
									{errors.state && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.state}
										</p>
									)}
								</div>
								{/* Country */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										Country
									</label>
									<input
										{...register('country')}
										value={
											typeof data.country === 'string'
												? data.country
												: ''
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
										placeholder='Country'
										disabled={isLoading}
									/>
									{errors.country && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.country}
										</p>
									)}
								</div>
								{/* Profile Image */}
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										Profile Image
									</label>
									<input
										type='file'
										name='profile_image'
										onChange={
											register('profile_image').onChange
										}
										className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
										text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
										disabled:opacity-50 disabled:cursor-not-allowed
										transition-all'
										disabled={isLoading}
									/>
									{errors.profile_image && (
										<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
											{errors.profile_image}
										</p>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className='flex items-center gap-3 pt-2'>
								<button
									type='submit'
									disabled={isLoading}
									className='flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
                                        text-white rounded-lg font-medium
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-colors flex items-center justify-center gap-2 cursor-pointer'
								>
									{isLoading ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											Saving...
										</>
									) : (
										'Save Profile'
									)}
								</button>
							</div>
							{responseData && (
								<div className='mt-4 text-success-600 text-center font-medium'>
									Profile updated!
								</div>
							)}
						</form>
					)}

					{activeTab === 'password' && (
						<form
							onSubmit={hanldeSubmitPassword}
							className='space-y-5'
						>
							<h2 className='text-xl font-semibold text-primary-700 mb-4'>
								Password Settings
							</h2>
							{/* Current Password */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Current Password{' '}
									<span className='text-error-500'>*</span>
								</label>
								<input
									{...registerPassword('current_password')}
									value={
										typeof passwordData.current_password ===
										'string'
											? passwordData.current_password
											: ''
									}
									type='password'
									className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
									placeholder='Current Password'
									disabled={isLoadingPassword}
								/>
								{passwordErrors.current_password && (
									<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
										{passwordErrors.current_password}
									</p>
								)}
							</div>
							{/* New Password */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									New Password{' '}
									<span className='text-error-500'>*</span>
								</label>
								<input
									{...registerPassword('new_password')}
									value={
										typeof passwordData.new_password ===
										'string'
											? passwordData.new_password
											: ''
									}
									type='password'
									className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
									placeholder='New Password'
									disabled={isLoadingPassword}
								/>
								{passwordErrors.new_password && (
									<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
										{passwordErrors.new_password}
									</p>
								)}
							</div>
							{/* Confirm Password */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Confirm Password{' '}
									<span className='text-error-500'>*</span>
								</label>
								<input
									value={confirmPassword}
									onChange={e =>
										setConfirmPassword(e.target.value)
									}
									type='password'
									className='w-full px-4 py-2.5 bg-surface-input border border-border-input rounded-lg
                                        text-foreground placeholder:text-text-tertiary
                                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all'
									placeholder='Confirm Password'
									disabled={isLoadingPassword}
								/>
								{confirmError && (
									<p className='mt-1.5 text-sm text-error-600 dark:text-error-400'>
										{confirmError}
									</p>
								)}
							</div>
							{/* Actions */}
							<div className='flex items-center gap-3 pt-2'>
								<button
									type='submit'
									disabled={isLoadingPassword}
									className='flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700
                                        text-white rounded-lg font-medium
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-colors flex items-center justify-center gap-2 cursor-pointer'
								>
									{isLoadingPassword ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											Changing...
										</>
									) : (
										'Change Password'
									)}
								</button>
							</div>
							{passwordResponse && (
								<div className='mt-4 text-success-600 text-center font-medium'>
									Password changed!
								</div>
							)}
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
