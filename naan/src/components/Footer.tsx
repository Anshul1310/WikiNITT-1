"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Mail,
  Globe,
  Linkedin,
} from "lucide-react";
import LogoIcon from "@/components/logo.svg";

export default function Footer() {
  const pathname = usePathname();
  const isArticleDetail = pathname?.startsWith("/articles/") && pathname !== "/articles";

  if (isArticleDetail) {
    return (
      <footer className="w-full mt-auto bg-[#ececf8] border-t border-[#d6d8e3]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-8 text-sm text-[#5f6270] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span>© 2026 NITT. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <Link href="#" className="hover:text-[#2f3035] transition-colors" aria-label="Instagram">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-[#2f3035] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-[#2f3035] transition-colors" aria-label="Mail">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <Link href="/c" className="text-[#2f3035] hover:underline underline-offset-4 flex items-center gap-2">
            Contact Us
            <span className="text-xs">▲</span>
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full mt-auto bg-slate-50 border-t border-border-light pt-16 pb-8">
      <div className="layout-container flex justify-center">
        <div className="w-full max-w-[1280px] px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1 pr-4">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <LogoIcon className="h-8 w-8 mr-2 fill-white bg-blue-900 rounded-md p-1.5" />
                <span className="self-center text-xl font-bold whitespace-nowrap text-blue-900">
                  Wiki
                </span>
                <span className="self-center text-xl font-bold whitespace-nowrap text-amber-600">
                  NITT
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                The open-source, student-maintained encyclopedia for NIT
                Trichy. Documenting campus life since 2026.
              </p>
              <div className="flex gap-4">
                <Link
                  className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  href="#"
                >
                  <Mail className="w-5 h-5" />
                </Link>
                <Link
                  className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  href="#"
                >
                  <Globe className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                Quick Directory
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Departments
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Faculty Search
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Clubs & Socs
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Student Council
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  NITT Webmail
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Emergency
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Hostel Office
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Hospital
                </Link>
                <Link
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                  href="#"
                >
                  Alumni Relations
                </Link>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
                Contribute
              </h3>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">
                  Become an Editor
                </h4>
                <p className="text-xs text-text-muted mb-4">
                  Join 120+ students maintaining the wiki.
                </p>
                <button className="w-full py-2 rounded bg-primary text-white text-xs font-bold hover:bg-primary-light transition-colors shadow-sm">
                  Start Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
