"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";

  return (
    <SessionProvider>
      <Navbar>
        {children}
        {/* Only show Footer if NOT on Chat page */}
        {!isChat && <Footer />}
      </Navbar>
    </SessionProvider>
  );
}