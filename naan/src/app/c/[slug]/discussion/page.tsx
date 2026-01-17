import { request } from "graphql-request";
import { GET_GROUP_BY_SLUG } from "@/queries/community";
import { Query } from "@/gql/graphql";
import { notFound, redirect } from "next/navigation";
import DiscussionView from "@/components/community/DiscussionView";

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

export default async function DiscussionPage({
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

  if (!group.isMember) {
    redirect(`/c/${slug}`);
  }

  const isOwner = group.owner.id === session?.user?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <DiscussionView
          groupId={group.id}
          groupName={group.name}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
