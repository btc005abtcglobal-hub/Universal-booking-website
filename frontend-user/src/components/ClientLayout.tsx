'use client';

import { usePathname } from 'next/navigation';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // We exclude administrative dashboard portals /sales and /superadmin
  const isExcluded = pathname?.startsWith('/sales') || pathname?.startsWith('/superadmin');

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNav />
      {children}
      <BottomNav />
    </>
  );
}
