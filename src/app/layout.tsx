// app/layout.tsx
import './globals.css';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

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
    <html lang='en'>
      <body className="bg-gray-50">
        <NextIntlClientProvider locale='en' messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
