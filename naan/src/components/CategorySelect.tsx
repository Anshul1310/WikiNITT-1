import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { GET_CATEGORIES_QUERY, CREATE_CATEGORY_MUTATION } from "@/gql/admin";
import { Category } from "@/gql/graphql";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CategorySelect({
  value,
  onChange,
  error,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const getClient = () => {
    if (!session?.backendToken) return null;
    return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_URL!, {
      headers: { Authorization: `Bearer ${session.backendToken}` },
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const client = getClient();
      if (!client) return { categories: [] };
      return client.request<{ categories: Category[] }>(GET_CATEGORIES_QUERY);
    },
    enabled: !!session?.backendToken,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const client = getClient();
      if (!client) throw new Error("Not authenticated");
      return client.request(CREATE_CATEGORY_MUTATION, { name });
    },
    onSuccess: (data: { createCategory: Category }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onChange(data.createCategory.name);
      setIsOpen(false);
      setSearch("");
    },
  });

  const categories = data?.categories || [];
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const exactMatch = categories.find(
    (c) => c.name.toLowerCase() === search.toLowerCase(),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = async () => {
    if (!search.trim()) return;
    try {
      await createMutation.mutateAsync(search);
    } catch (error) {
      console.error("Failed to create category", error);
      alert("Failed to create category");
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={twMerge(
          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={clsx(!value && "text-gray-500")}>
          {value || "Select a category..."}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div className="sticky top-0 border-b bg-white p-2">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search or create..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-100 hover:text-blue-900",
                    value === category.name
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-900",
                  )}
                  onClick={() => {
                    onChange(category.name);
                    setIsOpen(false);
                  }}
                >
                  <span className="block truncate font-medium">
                    {category.name}
                  </span>
                  {value === category.name && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              ))}

              {search && !exactMatch && (
                <div
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-blue-600 hover:bg-blue-50"
                  onClick={handleCreate}
                >
                  <div className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="block truncate font-medium">
                      Create "{search}"
                    </span>
                  </div>
                  {createMutation.isPending && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  )}
                </div>
              )}

              {filteredCategories.length === 0 && !search && (
                <div className="p-4 text-center text-gray-500">
                  No categories found. Type to create one.
                </div>
              )}
            </>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
