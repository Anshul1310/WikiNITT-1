"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/gql/graphql";

interface FeaturedCarouselProps {
  articles?: Partial<Article>[];
}

export default function FeaturedCarousel({
  articles = [],
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12 group font-[Manrope,sans-serif]">
      {articles.map((article, index) => (
        <Link
          href={`/articles/${article.slug}`}
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <Image
            src={article.thumbnail || "/images/placeholder.png"}
            alt={article.title || "Featured Article"}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 text-white">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[#3b28cc] rounded-full">
              {article.category}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight font-[Playfair_Display]">
              {article.title}
            </h2>
            <span
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#3b28cc] rounded-lg hover:bg-[#2e20a8] transition-colors duration-200"
            >
              Read Article
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
          </div>
        </Link>
      ))}

      { }
      <div className="absolute bottom-8 right-8 flex space-x-2 z-10">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
