import { GET_GROUP_BY_SLUG } from "@/queries/community";
import { Query } from "@/gql/graphql";
import { notFound } from "next/navigation";
import CreatePostForm from "@/components/community/CreatePostForm";
import { auth } from "@/auth";
import { getGraphQLClient } from "@/lib/graphql";

async function getGroup(slug: string, token?: string) {
  try {
    const client = getGraphQLClient(token);
    const data = await client.request<Query>(GET_GROUP_BY_SLUG, {
      slug,
      postLimit: 0,
      postOffset: 0,
    });
    return data?.group;
  } catch (error) {
    console.error("Failed to fetch group:", error);
    return null;
  }
}

export default async function CreatePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const group = await getGroup(slug, session?.backendToken);

  if (!group) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Post in {group.name}
          </h1>
          <CreatePostForm groupId={group.id} groupSlug={group.slug} />
        </div>
      </div>
    </div>
  );
}
