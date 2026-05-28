import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beta — Book Everything',
  description: 'Beta by Beta Softnet — the one platform to book every service in the world.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="selection:bg-primary/30">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        {children}
      </body>
    </html>
  );
}
