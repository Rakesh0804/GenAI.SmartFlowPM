import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { ToastProvider } from '../contexts/ToastContext';

export const metadata: Metadata = {
  title: 'SmartFlowPM - Project Management System',
  description: 'A comprehensive project management system with modern UI and powerful features',
  keywords: ['project management', 'task tracking', 'team collaboration', 'productivity'],
  authors: [{ name: 'SmartFlowPM Team' }],
  icons: {
    icon: '/flow-logo.ico',
  },
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
    <html lang="en">
      <body className="font-ubuntu antialiased">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
