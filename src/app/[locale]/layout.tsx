import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'
import '../globals.css'
import ToastProvider from '@/providers/ToastProvider'

export const metadata = {
	title: 'Rest API Maker',
	description: 'Your app description'
}

interface LayoutProps {
	children: React.ReactNode
	params: Promise<{
		locale: string
	}>
}

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
	const { locale } = await params

	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var theme = localStorage.getItem('theme') || 'system';
									var root = document.documentElement;
									if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
										root.classList.add('dark');
									} else {
										root.classList.remove('dark');
									}
								} catch(e) {}
							})();
						`
					}}
				/>
			</head>
			<body className='no-transitions'>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							setTimeout(function() {
								document.body.classList.remove('no-transitions');
							}, 100);
						`
					}}
				/>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem={true}
				>
					<ToastProvider>
						<NextIntlClientProvider messages={messages}>
							{children}
						</NextIntlClientProvider>
					</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
