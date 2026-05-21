import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BETA — Universal Service Marketplace',
  description: 'Book any service near you. Appointments, car wash, salons, movie tickets, home services and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
