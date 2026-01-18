"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GET_GROUPS, GET_MY_GROUPS } from "@/queries/community";
import { Query, GroupType } from "@/gql/graphql";
import { useSession } from "next-auth/react";
import { getGraphQLClient } from "@/lib/graphql";

export default function CommunitySidebar() {
  const { data: session } = useSession();

  const { data: popularGroups, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["publicGroups", session?.backendToken],
    queryFn: async () => {
      const client = getGraphQLClient(session?.backendToken);
      const data = await client.request<Query>(GET_GROUPS, {
        limit: 5,
        offset: 0,
      });
      return data?.publicGroups || [];
    },
    enabled: !!session?.backendToken,
  });

  const { data: myGroups, isLoading: isLoadingMyGroups } = useQuery({
    queryKey: ["myCommunities", session?.backendToken],
    queryFn: async () => {
      if (!session?.backendToken) return [];
      const client = getGraphQLClient(session.backendToken);
      const data = await client.request<Query>(GET_MY_GROUPS);
      return data?.myGroups || [];
    },
    enabled: !!session?.backendToken,
  });

  return (
    <div className="space-y-4 sticky top-20">
      {session?.user && (
        <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              My Communities
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoadingMyGroups ? (
              <div className="p-4 space-y-3">
                <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              myGroups?.map((group) => (
                <Link
                  key={group.id}
                  href={`/c/${group.slug}`}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <span className="font-bold text-xs">
                        {group.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      c/{group.slug}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {group.membersCount} members
                    </p>
                  </div>
                </Link>
              ))
            )}
            {myGroups?.length === 0 && !isLoadingMyGroups && (
              <div className="p-4 text-center text-sm text-gray-500">
                You are not part of any community yet.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Popular Communities
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoadingPopular ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center">
                  <div className="rounded-full bg-gray-200 h-8 w-8 mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            popularGroups?.map((group) => (
              <Link
                key={group.id}
                href={`/c/${group.slug}`}
                className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <span className="font-bold text-xs">
                      {group.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    c/{group.slug}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {group.membersCount} members
                  </p>
                </div>
              </Link>
            ))
          )}

          {popularGroups?.length === 0 && !isLoadingPopular && (
            <div className="p-4 text-center text-sm text-gray-500">
              No public communities found.
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <Link
            href="/c/all"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 uppercase tracking-wide"
          >
            See All Communities
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link
            href="/c/create"
            className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Community
          </Link>
        </div>
      </div>
    </div>
  );
}
