import FeaturedCarousel from "@/components/FeaturedCarousel";
export const dynamic = "force-dynamic";

import ArticlesView from "@/components/ArticlesView";
import { request } from "graphql-request";
import { GET_ARTICLES } from "@/gql/queries";
import { Query } from "@/gql/graphql";

async function getArticles() {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  try {
    const data = await request<Query>(endpoint, GET_ARTICLES, {
      limit: 9,
      offset: 0,
    });
    return data?.articles || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

async function getFeaturedArticles() {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  try {
    const data = await request<Query>(endpoint, GET_ARTICLES, {
      featured: true,
    });
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
    <div className="relative min-h-screen font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* === BACKGROUND MESH === */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#f4f7fa]">
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-100/50 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100/50 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto py-24 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Featured Section */}
        <section>
             <FeaturedCarousel articles={featuredArticles} />
        </section>
        
        {/* Main Grid Section */}
        <section>
            <ArticlesView articles={articles} />
        </section>
      </div>
    </div>
  );
}