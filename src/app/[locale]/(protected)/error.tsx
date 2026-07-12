'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const router = useRouter()
	const params = useParams()
	const locale = params?.locale || 'en'

	return (
		<div className='min-h-screen bg-surface flex items-center justify-center p-4'>
			<div className='max-w-md w-full text-center space-y-6'>
				<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-50 dark:bg-error-900/20'>
					<AlertTriangle className='w-8 h-8 text-error-500' />
				</div>
				<div className='space-y-2'>
					<h2 className='text-2xl font-bold text-text-primary-sem'>
						Something went wrong
					</h2>
					<p className='text-text-secondary'>
						{error.message || 'An unexpected error occurred. Please try again.'}
					</p>
				</div>
				<div className='flex items-center justify-center gap-3'>
					<button
						onClick={() => reset()}
						className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer'
					>
						<RefreshCw className='w-4 h-4' />
						Try Again
					</button>
					<button
						onClick={() => router.push(`/${locale}/dashboard`)}
						className='px-4 py-2 rounded-lg border border-border-subtle text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer'
					>
						Go to Dashboard
					</button>
				</div>
			</div>
		</div>
	)
}
