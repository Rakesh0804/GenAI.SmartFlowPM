import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { ToastProvider } from '../contexts/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SmartFlowPM - Project Management System',
  description: 'A comprehensive project management system with modern UI and powerful features',
  keywords: ['project management', 'task tracking', 'team collaboration', 'productivity'],
  authors: [{ name: 'SmartFlowPM Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
