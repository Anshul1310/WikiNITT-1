"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Globe, Linkedin, Heart } from "lucide-react";
import LogoIcon from "@/components/logo.svg";

export default function Footer() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isArticlesPage = pathname === "/articles";
  const isArticleDetail = pathname?.startsWith("/articles/") && pathname !== "/articles";

  // Use simple footer for Landing, Articles list, and Article Detail
  if (isLanding || isArticlesPage || isArticleDetail) {
    return (
      <div id="footer">
        <hr className="border-t border-[#c8c6d8] opacity-50" />
        <footer className="w-full px-[5%] md:px-[8%] h-[110px] box-border flex flex-col md:flex-row justify-between items-center text-[0.75rem] text-[#777] gap-[20px] font-[Inter,sans-serif]" style={{ background: "rgba(237, 236, 255, 1)" }}>
          <div className="flex flex-col md:flex-row items-center gap-[10px] md:gap-[20px]">
            <div>© 2026 NITT. All rights reserved.</div>
            <div className="flex gap-[15px] text-[1rem]">
              <Link href="#" className="hover:text-[#2d2d2d] transition-colors"><Globe className="w-4 h-4" /></Link>
              <Link href="#" className="hover:text-[#2d2d2d] transition-colors"><Linkedin className="w-4 h-4" /></Link>
              <Link href="#" className="hover:text-[#2d2d2d] transition-colors"><Mail className="w-4 h-4" /></Link>
            </div>
          </div>
          <Link href="/c" className="font-medium transition-colors hover:text-[#333]">Contact Us ↗</Link>
        </footer>
      </div>
    );
  }

  return (
    <footer className="w-full mt-auto bg-slate-50 border-t border-border-light pt-16 pb-8">
      {/* ... standard directory footer code ... */}
    </footer>
  );
}