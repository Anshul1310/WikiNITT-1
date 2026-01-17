"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_POST } from "@/queries/community";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";
import { useSession } from "next-auth/react";
import { getGraphQLClient } from "@/lib/graphql";

interface CreatePostFormProps {
  groupId: string;
  groupSlug: string;
}

export default function CreatePostForm({
  groupId,
  groupSlug,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const client = getGraphQLClient(session?.backendToken);
      await client.request(CREATE_POST, {
        input: {
          groupId,
          title,
          content,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupSlug] });
      router.push(`/c/${groupSlug}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createPostMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Give your post a title"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <div className="mt-1" data-color-mode="light">
          <Editor
            value={content}
            onChange={(val) => setContent(val)}
            height={400}
            preview="edit"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createPostMutation.isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
