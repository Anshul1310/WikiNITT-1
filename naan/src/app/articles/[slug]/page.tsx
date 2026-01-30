import { request } from "graphql-request";
import { GET_ARTICLE_BY_SLUG } from "@/gql/queries";
import { Query } from "@/gql/graphql";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticleView from "@/components/ArticleView";

// Type definition for Next.js 15+ Page Props
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. Generate Metadata (SSR SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params; // 👈 Await params here
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
    
    const data = await request<Query>(endpoint, GET_ARTICLE_BY_SLUG, { slug });
    
    if (!data.articleBySlug) return { title: "Article Not Found" };

    return {
      title: `${data.articleBySlug.title} | WikiNITT`,
      description: data.articleBySlug.content.substring(0, 160) + "...",
      openGraph: {
        images: [data.articleBySlug.thumbnail || "/images/placeholder.png"],
      },
    };
  } catch (error) {
    return { title: "Error | WikiNITT" };
  }
}

// 2. The Server Component
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params; // 👈 Await params here (Crucial Fix)
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  
  let articleData;
  try {
    const data = await request<Query>(endpoint, GET_ARTICLE_BY_SLUG, { slug });
    articleData = data.articleBySlug;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    notFound();
  }

  if (!articleData) {
    notFound();
  }

  // Pass data to the Client Component
  return <ArticleView data={articleData} />;
}