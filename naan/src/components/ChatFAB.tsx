"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChatFAB() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Hide on chat page
  const isChatPage = pathname === "/chat";

  useEffect(() => {
    // Delay visibility slightly to allow hydration and play animation smoothly
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || isChatPage) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] group animate-in fade-in zoom-in slide-in-from-bottom-10 duration-1000 ease-out-spring fill-mode-forwards">
      
      {/* 1. Subtle Idle Glow (Behind) */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl group-hover:bg-indigo-500/50 transition-all duration-700 animate-pulse-slow" />
      
      {/* 2. Main Glass Capsule */}
      <Link
        href="/chat"
        className="relative flex items-center gap-3 pl-4 pr-5 h-14 rounded-full 
        bg-slate-900/60 backdrop-blur-xl border border-white/20 
        text-white shadow-2xl hover:-translate-y-1 hover:shadow-indigo-500/20 
        transition-all duration-300 overflow-hidden"
      >
        {/* Shimmer Effect overlay */}
        <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-transform duration-1000 ease-in-out" />

        {/* Icon Container with subtle gradient bg */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-inner border border-white/10">
            <MessageCircle className="w-4 h-4 text-white" />
            <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" style={{ animationDuration: '3s' }} />
            </div>
        </div>

        {/* Text */}
        <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-bold tracking-widest uppercase text-indigo-200 opacity-80">
                AI Assistant
            </span>
            <span className="text-sm font-semibold text-white tracking-wide">
                Ask WikiNITT
            </span>
        </div>
      </Link>

      {/* Custom CSS for the spring animation if not in tailwind config */}
      <style jsx>{`
        .ease-out-spring {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
        }
        /* Custom pulse that is subtler than standard tailwind */
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}