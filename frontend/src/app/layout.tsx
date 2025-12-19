import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ary - Strength-Spotting AI Companion',
  description: 'See and articulate your professional capabilities through natural conversation. Not an assessment. Not therapy. Just clarity.',
  keywords: ['career', 'strengths', 'professional development', 'self-reflection', 'competence'],
  authors: [{ name: 'Ary' }],
  openGraph: {
    title: 'Ary - Strength-Spotting AI Companion',
    description: 'See and articulate your professional capabilities through natural conversation',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
