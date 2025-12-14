import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seismic NFT Generator',
  description: 'Transform your X (Twitter) personality into a unique AI-generated NFT',
  keywords: ['NFT', 'AI', 'Twitter', 'X', 'Seismic', 'Web3', 'Generator'],
  authors: [{ name: 'Seismic', url: 'https://x.com/SeismicSys' }],
  openGraph: {
    title: 'Seismic NFT Generator',
    description: 'Transform your X personality into a unique AI-generated NFT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seismic NFT Generator',
    description: 'Transform your X personality into a unique AI-generated NFT',
    creator: '@SeismicSys',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}