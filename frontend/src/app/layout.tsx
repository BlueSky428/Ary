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
  title: 'Ary - Infrastructure for Auditable Human Judgment',
  description: 'Inlyth builds accountability infrastructure for human judgment — compiling decision reasoning into auditable, defensible records without scoring or prediction.',
  keywords: ['auditable judgment', 'human judgment', 'institutional compliance', 'defensible decisions', 'professional judgment'],
  authors: [{ name: 'Inlyth, Inc.' }],
  openGraph: {
    title: 'Ary - Infrastructure for Auditable Human Judgment',
    description: 'Inlyth builds accountability infrastructure for human judgment — compiling decision reasoning into auditable, defensible records without scoring or prediction.',
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
