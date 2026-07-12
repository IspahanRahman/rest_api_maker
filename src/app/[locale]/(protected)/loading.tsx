export default function Loading() {
	return (
		<div className='min-h-screen bg-surface animate-pulse'>
			{/* Sidebar skeleton */}
			<aside className='fixed inset-y-0 left-0 z-50 w-64 bg-surface-card border-r border-border-subtle hidden lg:block'>
				<div className='flex flex-col h-full'>
					{/* Logo */}
					<div className='flex items-center h-16 px-6 border-b border-border-subtle'>
						<div className='w-8 h-8 rounded-lg bg-surface-hover' />
						<div className='ml-2 h-5 w-32 rounded bg-surface-hover' />
					</div>
					{/* Nav items */}
					<div className='flex-1 px-4 py-6 space-y-2'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-3 px-4 py-3 rounded-lg'
							>
								<div className='w-5 h-5 rounded bg-surface-hover' />
								<div
									className='h-4 rounded bg-surface-hover'
									style={{
										width: `${60 + Math.random() * 30}%`
									}}
								/>
							</div>
						))}
					</div>
					{/* User section */}
					<div className='p-4 border-t border-border-subtle'>
						<div className='flex items-center gap-3 p-3'>
							<div className='w-10 h-10 rounded-full bg-surface-hover' />
							<div className='flex-1 space-y-1.5'>
								<div className='h-4 w-24 rounded bg-surface-hover' />
								<div className='h-3 w-32 rounded bg-surface-hover' />
							</div>
						</div>
					</div>
				</div>
			</aside>

			{/* Main content */}
			<div className='lg:pl-64'>
				{/* Header skeleton */}
				<header className='sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-surface-card border-b border-border-subtle'>
					<div className='flex items-center gap-4'>
						<div className='w-9 h-9 rounded-lg bg-surface-hover' />
						<div className='hidden md:block w-96 h-9 rounded-lg bg-surface-hover' />
					</div>
					<div className='flex items-center gap-2'>
						<div className='w-9 h-9 rounded-lg bg-surface-hover' />
						<div className='w-9 h-9 rounded-lg bg-surface-hover' />
						<div className='w-8 h-8 rounded-full bg-surface-hover' />
					</div>
				</header>

				{/* Page content skeleton */}
				<div className='p-4 sm:p-6 lg:p-8 space-y-6'>
					<div className='h-8 w-48 rounded bg-surface-hover' />
					<div className='h-4 w-64 rounded bg-surface-hover' />
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='h-28 rounded-xl bg-surface-card border border-border-subtle'
							/>
						))}
					</div>
					<div className='h-64 rounded-xl bg-surface-card border border-border-subtle' />
				</div>
			</div>
		</div>
	)
}
