"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";
import FormattedDate from "@/components/FormattedDate";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  User as UserIcon,
  Link as LinkIcon,
  Check,
  Pause,
  Headphones,
  MessageSquare,
} from "lucide-react";
import { Article } from "@/gql/graphql";

const Markdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false },
);

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ArticleView({ data }: { data: Article }) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  const headings = useMemo(() => {
    if (!data.content) return [];
    const regex = /^(#{1,6})\s+(.+)$/gm;
    const extracted: TOCItem[] = [];
    let match: RegExpExecArray | null;
    const slugify = (text: string) =>
      text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

    while ((match = regex.exec(data.content)) !== null) {
      extracted.push({
        level: match[1].length,
        text: match[2],
        id: slugify(match[2]),
      });
    }
    return extracted;
  }, [data.content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stripMarkdown = (markdown: string) =>
    markdown
      .replace(/[#*`]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/!\[(.*?)\]\(.*?\)/g, "")
      .replace(/\n/g, ". ");

  const handleSpeak = () => {
    if (!synthesisRef.current || !data?.content) return;
    if (isPaused) {
      synthesisRef.current.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    if (isSpeaking) {
      synthesisRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
      return;
    }

    const text = `${data.title}. By ${data.author?.name || "Unknown Author"}. ${stripMarkdown(data.content)}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    synthesisRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const readMinutes = Math.max(1, Math.ceil(data.content.length / 1000));

  return (
    <div className="min-h-screen bg-[#f3f3ff] text-[#333]">
      <section className="bg-[#2d2d2d] text-white pb-8">
        <div className="mx-auto max-w-[1280px] px-6 pt-16">
          <h1 className="font-[var(--font-playfair,_Playfair_Display)] text-3xl md:text-4xl font-normal leading-tight animate-[slideUpFade_0.8s_ease-out_0.2s_backwards]">
            {data.title}
          </h1>
        </div>
        <div className="relative mt-4 h-[35vh] min-h-[260px] w-full animate-[slideUpFade_0.8s_ease-out_0.4s_backwards]">
          <Image
            src={data.thumbnail || "/images/placeholder.png"}
            alt={data.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="hero-overlay absolute inset-0 flex items-end justify-between px-6 md:px-[8%] pb-4 text-[0.78rem] text-white/90">
            <div className="meta-info flex flex-wrap items-center gap-5 mb-1">
              <span className="meta-item flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <FormattedDate date={data.createdAt} />
              </span>
              <span className="meta-item flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readMinutes} min read
              </span>
              <span className="meta-item flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                {data.author?.name || "WikiNITT Contributor"}
              </span>
            </div>
            <button
              className="share-btn inline-flex items-center gap-2 rounded-[2px] bg-[#ffd1d1] px-5 py-2 text-[0.8rem] font-semibold text-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-[3px] hover:scale-[1.02] hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 md:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-[200px_1fr]">
          <aside className="hidden lg:block sticky top-6 h-fit animate-[slideUpFade_0.8s_ease-out_0.6s_backwards]">
            <h3 className="contents-title font-[var(--font-playfair,_Playfair_Display)] text-lg text-[#555] mb-3">
              Contents
            </h3>
            <ul className="toc-list">
              {headings.map((heading, index) => (
                <li
                  key={`${heading.id}-${index}`}
                  onClick={() => document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-[0.85rem] text-[#777] mb-2 cursor-pointer transition-all duration-200 relative left-0 hover:text-[#333] hover:left-[5px]"
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </aside>

          <article className="min-w-0 animate-[slideUpFade_0.8s_ease-out_0.6s_backwards]">
            <div
              data-color-mode="light"
              className="article-markdown prose prose-slate max-w-none"
            >
              <Markdown source={data.content} remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSlug]} />
            </div>
          </article>
        </div>

        <button
          onClick={handleSpeak}
          className="mt-10 inline-flex items-center gap-2 rounded-sm border border-[#d0d2df] bg-white px-4 py-2 text-sm text-[#2f3035] shadow-sm hover:-translate-y-[1px] transition-transform"
        >
          {isSpeaking && !isPaused ? <Pause className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
          {isSpeaking ? "Pause Audio" : "Listen"}
        </button>

        <div className="fab-chat fixed right-8 top-1/2 -translate-y-1/2 text-[#222] opacity-60 transition-transform duration-200 hover:opacity-100 hover:scale-110 hidden sm:block">
          <MessageSquare className="h-6 w-6" />
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-playfair: "Playfair Display", "Times New Roman", serif;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .article-markdown .wmde-markdown,
        .article-markdown[data-color-mode*="light"] {
          background: transparent !important;
          color: #555 !important;
          font-family: "Inter", system-ui, -apple-system, sans-serif !important;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .article-markdown .wmde-markdown h1,
        .article-markdown .wmde-markdown h2,
        .article-markdown .wmde-markdown h3,
        .article-markdown .wmde-markdown h4 {
          font-family: var(--font-playfair), serif !important;
          color: #444 !important;
          border-bottom: none !important;
          font-weight: 400 !important;
          line-height: 1.2 !important;
        }
        .article-markdown .wmde-markdown h1 { font-size: 2rem !important; }
        .article-markdown .wmde-markdown h2 { font-size: 1.8rem !important; }
        .article-markdown .wmde-markdown p { margin-bottom: 18px !important; text-align: justify !important; }
        .article-markdown .wmde-markdown a { color: #6a7c92 !important; }
        .article-markdown .wmde-markdown strong { font-weight: 600 !important; }
      `}</style>
    </div>
  );
}
