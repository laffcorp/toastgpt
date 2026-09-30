import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://toastergpt.org'),
  title: 'ToasterGPT™ — BenCorp.net',
  description:
    'The first connected toaster powered by an over-engineered, non-disabling large language model. Breakfast BEYOND THE ALGORITHM.',
  openGraph: {
    title: 'ToasterGPT™ by BenCorp.net',
    description: 'It no longer just heats bread. It interrogates the bread.',
    url: 'https://toastergpt.org',
    siteName: 'BenCorp.net',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
