// naan/src/app/ClientLayout.tsx
'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define paths where Navbar/Footer should be HIDDEN
  const isChatPage = pathname?.startsWith('/chat');

  return (
    <>
      {!isChatPage && <Navbar children={undefined} />} 
      {/* Note: You need to import your Navbar here instead of in RootLayout */}
      
      {children}
      
      {!isChatPage && <Footer />}
      {/* Note: You need to import your Footer here instead of in RootLayout */}
    </>
  );
}