"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { SEARCH_ARTICLES } from "@/queries/search";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: articles, isLoading: loadingArticles } = useQuery({
    queryKey: ["searchArticles", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const data = await request<any>(
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
        SEARCH_ARTICLES,
        { query: debouncedQuery, limit: 5 },
      );
      return data.searchArticles;
    },
    enabled: !!debouncedQuery,
  });

  const handleLinkClick = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="flex-1 outline-none text-lg placeholder:text-gray-400"
            placeholder="Search WikiNITT..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="bg-gray-50 min-h-[300px] p-4">
          {loadingArticles ? (
            <div className="text-center text-gray-500 py-8">
              Searching...
            </div>
          ) : articles?.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article: any) => (
                <div
                  key={article.id}
                  onClick={() =>
                    handleLinkClick(`/articles/${article.slug}`)
                  }
                  className="flex gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group border border-transparent hover:border-gray-100"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                    {article.thumbnail ? (
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {article.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : debouncedQuery ? (
            <div className="text-center text-gray-500 py-8">
              No articles found
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Start typing to search articles...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
