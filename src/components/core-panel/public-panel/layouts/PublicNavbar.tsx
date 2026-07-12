'use client'

import { useState, useEffect } from 'react'
import { Menu, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import CustomIconButton from '@/components/lib/ui-elements/icon-button/CustomIconButton'

interface UserNavbarProps {
	onMenuClick: () => void
}

export default function UserNavbar({ onMenuClick }: UserNavbarProps) {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e?.altKey) {
			setTheme('system')
			return
		}
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<header className='fixed inset-x-0 top-0 z-40 h-16 shadow-md bg-background'>
			<div className='mx-auto flex h-full items-center bg-background justify-between px-6'>
				<div className='flex items-center gap-3'>
					{/* Mobile menu */}
					<button
						onClick={onMenuClick}
						className='rounded-md p-2 focus:outline-none focus:ring md:hidden'
						aria-label='Open sidebar'
					>
						<Menu className='h-5 w-5' />
					</button>

					{/* Brand */}
					<div className='font-semibold tracking-tight'>
						<Image
							src='/assets/images/logo.png'
							alt='Logo'
							width={200}
							height={120}
							className='inline-block'
						/>
					</div>
				</div>

				{/* Right actions: theme switcher */}
				<div className='flex items-center gap-3'>
					<CustomIconButton
						onClick={toggleTheme}
						title={
							!mounted
								? 'Toggle theme'
								: theme === 'system'
									? 'Theme: System (Alt+Click to keep system)'
									: `Theme: ${
											theme === 'dark' ? 'Dark' : 'Light'
										} (Alt+Click to System)`
						}
						className='rounded-md p-2 focus:outline-none focus:ring cursor-pointer'
						aria-label='Toggle theme'
						typeMap={{ button: 'button' }}
						iconMap={{}}
						tone='default'
						color='default'
					>
						{mounted && (
							<>
								{theme === 'dark' ? (
									<Sun className='h-5 w-5 text-foreground' />
								) : (
									<Moon className='h-5 w-5 text-foreground' />
								)}
							</>
						)}
						{!mounted && <Moon className='h-5 w-5 text-foreground' />}
					</CustomIconButton>
				</div>
			</div>
		</header>
	)
}
