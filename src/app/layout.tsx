// app/layout.tsx
import './globals.css';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Rest Api Maker',
  description: 'Your app description',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;

}) {
  const messages = await getMessages();

  return (
    <html lang='en' suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <NextIntlClientProvider locale='en' messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
