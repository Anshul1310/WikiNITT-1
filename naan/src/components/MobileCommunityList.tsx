"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { GET_GROUPS } from "@/queries/community";
import { Query } from "@/gql/graphql";

export default function MobileCommunityList() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["publicGroups"],
    queryFn: async () => {
      const endpoint =
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
        "http://localhost:8080/query";
      const data = await request<Query>(endpoint, GET_GROUPS, {
        limit: 10, 
        offset: 0,
      });
      return data.groups.filter((g) => g.type === "PUBLIC");
    },
  });

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="shrink-0 w-32 h-12 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
        Popular Communities
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/c/${group.slug}`}
            className="shrink-0 flex items-center bg-white border border-gray-200 rounded-lg p-2 pr-4 shadow-sm hover:shadow-md transition-shadow active:scale-95 transform duration-100"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 shrink-0">
              <span className="font-bold text-xs">
                {group.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                c/{group.slug}
              </span>
              <span className="text-[10px] text-gray-500">
                {group.membersCount} members
              </span>
            </div>
          </Link>
        ))}
        <Link
          href="/c/all"
          className="shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-2 px-4 shadow-sm hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">
            View All
          </span>
        </Link>
      </div>
    </div>
  );
}
