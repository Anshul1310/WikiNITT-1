"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ChatFAB() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isChatPage = pathname === "/chat";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-show tooltip on first load
  useEffect(() => {
    if (isVisible && !hasShownIntro) {
      const introTimer = setTimeout(() => {
        setShowTooltip(true);
        setHasShownIntro(true);
        hideTimer.current = setTimeout(() => setShowTooltip(false), 2000);
      }, 2000);
      return () => clearTimeout(introTimer);
    }
  }, [isVisible, hasShownIntro]);

  const handleMouseEnter = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Keep visible for 2.5s after mouse leaves
    hideTimer.current = setTimeout(() => setShowTooltip(false), 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!isVisible || isChatPage) return null;

  return (
    <div
      className="fixed bottom-8 right-8 z-[100] flex items-end gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      <div
        className={`
          flex items-center gap-2 px-4 py-3 rounded-2xl rounded-br-none text-[0.82rem] font-semibold shadow-2xl
          transition-all duration-500 origin-bottom-right
          ${showTooltip
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-90 translate-x-4 pointer-events-none"
          }
        `}
        style={{
          background: "#1a1a1a",
          color: "#fff",
          fontFamily: "Manrope, sans-serif",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span className="text-base">✨</span>
        <span>Ask me anything about NITT</span>
      </div>

      {/* FAB Button */}
      <Link href="/chat" aria-label="Open chat assistant">
        <div className="group relative w-14 h-14 rounded-full bg-[#111] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
          <MessageCircle className="w-6 h-6 relative z-10 group-hover:rotate-[-8deg] transition-transform duration-300" />
          {/* Glow ring on hover */}
          <span className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-[#3b28cc] to-[#7c3aed] opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-500" />
          {/* Subtle pulse dot */}
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#3b28cc] border-2 border-[#111]">
            <span className="absolute inset-0 rounded-full bg-[#3b28cc] animate-ping opacity-75" />
          </span>
        </div>
      </Link>
    </div>
  );
}
