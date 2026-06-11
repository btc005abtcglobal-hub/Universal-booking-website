import type { Metadata } from 'next';
import { ThemeManager } from './dashboard/ThemeManager';
import './globals.css';

export const metadata: Metadata = {
  title: 'BETA Admin — Merchant Dashboard',
  description: 'Manage your services, bookings, and analytics on BETA Booking Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
