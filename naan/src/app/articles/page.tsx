import FeaturedCarousel from "@/components/FeaturedCarousel";
import ArticlesView from "@/components/ArticlesView";
import LandingNavbar from "@/components/LandingNavbar";
import { request } from "graphql-request";
import { GET_ARTICLES } from "@/gql/queries";
import { Query } from "@/gql/graphql";

export const dynamic = "force-dynamic";

async function getArticles() {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  try {
    const data = await request<Query>(endpoint, GET_ARTICLES, { limit: 9, offset: 0 });
    return data?.articles || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

async function getFeaturedArticles() {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  try {
    const data = await request<Query>(endpoint, GET_ARTICLES, { featured: true });
    return data?.articles || [];
  } catch (error) {
    console.error("Failed to fetch featured articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const [articles, featuredArticles] = await Promise.all([
    getArticles(),
    getFeaturedArticles(),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "rgba(237, 236, 255, 1)" }}>
      <LandingNavbar />
      <div className="max-w-[1440px] mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16 pb-8">
        <section><FeaturedCarousel articles={featuredArticles} /></section>
        <section><ArticlesView articles={articles} /></section>
      </div>
    </div>
  );
}