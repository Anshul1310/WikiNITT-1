import Link from "next/link";
import { LandingSearch } from "@/components/LandingSearch";
import {
  Calendar,
  MessageCircle,
  User,
  MessageSquare
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import { request } from "graphql-request";
import { GET_ARTICLES } from "@/gql/queries";
import { Query, Article } from "@/gql/graphql";

// Add Next.js cache revalidation if you want fresh data automatically
export const revalidate = 60; 

// Fetch all articles
async function getArticles() {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8080/query";
  try {
    const data = await request<Query>(endpoint, GET_ARTICLES, { limit: 20, offset: 0 });
    return data?.articles || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

// Fetch featured articles specifically
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

// Date formatter helper
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default async function Home({ searchParams }: { searchParams: { cat?: string } }) {
  const categoryParam = searchParams.cat;

  // Run both queries in parallel
  const [allArticles, featuredData] = await Promise.all([
    getArticles(),
    getFeaturedArticles()
  ]);

  // Extract unique categories dynamically from the DB results
  const dynamicCategories = Array.from(new Set(allArticles.map(a => a?.category).filter(Boolean))) as string[];
  const categories = ["All Categories", ...dynamicCategories];

  // Pick the featured article (fallback to the latest article if no featured ones exist)
  const featuredArticle = featuredData.length > 0 ? featuredData[0] : allArticles[0];

  // Filter the list by the selected category (from the URL)
  let displayedArticles = categoryParam && categoryParam !== "All Categories" 
    ? allArticles.filter(a => a?.category === categoryParam) 
    : allArticles;
  
  // Exclude the featured article from the list and limit to exactly 3 items
  const recentArticles = displayedArticles
    .filter(a => a?.id !== featuredArticle?.id)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-[Manrope,sans-serif] bg-[#fdfcff] text-[#1a1a1a]">
      
      {/* Background Ambient Blobs */}
      <div className="ambient-blob top-blob"></div>
      <div className="ambient-blob bottom-blob"></div>

      <LandingNavbar />

      <main className="w-full max-w-[1200px] mx-auto px-5 pb-[60px] flex flex-col gap-[60px]">
        
        {/* --- Hero Section (The Glass Box) --- */}
        <section className="hero-box">
          <span className="tag-pill animate-up delay-1">Digital Campus Hub</span>
          <h1 className="hero-title animate-up delay-2">
            Explore the <span>Pulse</span> of<br />NITT
          </h1>
          
          <div className="animate-up delay-3 w-full max-w-[600px] mt-6 relative z-20">
            <LandingSearch />
          </div>
        </section>

        {/* --- Dynamic Categories --- */}
        <section className="flex justify-center gap-3 flex-wrap animate-up delay-3">
          {categories.map((cat) => {
            const isActive = categoryParam === cat || (!categoryParam && cat === "All Categories");
            return (
              <Link 
                key={cat} 
                href={cat === "All Categories" ? "/" : `/?cat=${encodeURIComponent(cat)}`}
                className={`cat-btn ${isActive ? "active" : ""}`}
              >
                {cat}
              </Link>
            );
          })}
        </section>

        {/* --- Featured Article --- */}
        {featuredArticle && (
          <section className="flex justify-center mt-5">
            <Link href={`/articles/${featuredArticle.slug}`} className="featured-card group cursor-pointer block">
              <span className="floating-tag">Featured</span>
              <img 
                src={featuredArticle.thumbnail || "/images/placeholder.png"} 
                alt={featuredArticle.title} 
              />
              <div className="featured-content">
                <h2>{featuredArticle.title}</h2>
                <p className="line-clamp-2">{featuredArticle.description || "Read more about this story in the WikiNITT hub..."}</p>
                <div className="meta-tags">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(featuredArticle.createdAt)}</span>
                  {/* Note: If comment count is stored in DB, map it here. Defaulting to 0 for now. */}
                  <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Join Discussion</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featuredArticle.author?.name || "Contributor"}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* --- 3 Article List --- */}
        <section className="flex flex-col gap-10 max-w-[650px] mx-auto w-full">
          {recentArticles.length > 0 ? (
            recentArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="article-item group cursor-pointer block">
                <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px] items-start w-full">
                  <img src={article.thumbnail || "/images/placeholder.png"} alt={article.title} />
                  <div className="article-text">
                    <div className="date-line">
                      <span>{formatDate(article.createdAt)}</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author?.name || "Contributor"}</span>
                    </div>
                    <h3 className="group-hover:text-[#3b28cc] transition-colors">{article.title}</h3>
                    <p>{article.description || article.content?.substring(0, 150) + "..."}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-[#666] py-10 font-medium">
              No articles found for "{categoryParam}".
            </div>
          )}
        </section>

      </main>

      {/* --- Floating Chat --- */}
      <Link href="/chat" className="fixed bottom-10 right-10 bg-black text-white w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-[100] transition-transform duration-300 hover:scale-110 hover:rotate-6">
        <MessageSquare className="w-6 h-6" />
      </Link>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,500;1,600&display=swap');

        :root {
          --primary-blue: #3b28cc;
        }

        /* Ambient Blobs */
        .ambient-blob {
          position: absolute;
          width: 60vw;
          height: 60vh;
          z-index: -1;
        }
        .top-blob {
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, rgba(169, 196, 255, 0.4) 0%, rgba(255,255,255,0) 70%);
          animation: floatBlob 10s infinite alternate;
        }
        .bottom-blob {
          top: 10%;
          right: -10%;
          background: radial-gradient(circle, rgba(245, 200, 255, 0.4) 0%, rgba(255,255,255,0) 70%);
          animation: floatBlob 10s infinite alternate-reverse;
        }

        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, 40px) scale(1.1); }
        }

        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .animate-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }

        /* Hero Box */
        .hero-box {
          width: 100%;
          height: calc(100vh - 120px); 
          min-height: 500px;
          padding: 0 20px;
          margin-top: 10px;
          background: linear-gradient(125deg, rgba(255, 255, 255, 0.6) 0%, rgba(240, 245, 255, 0.4) 50%, rgba(255, 240, 250, 0.3) 100%);
          backdrop-filter: blur(30px) saturate(120%);
          -webkit-backdrop-filter: blur(30px) saturate(120%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05), inset 0 0 0 2px rgba(255, 255, 255, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.8);
          animation: float 6s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: visible; /* Allows search dropdown to overlap */
        }

        .tag-pill {
          display: inline-block;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          color: var(--primary-blue);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(59, 40, 204, 0.1);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 4.5rem;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #050505;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(255,255,255,0.8);
        }
        .hero-title span {
          font-style: italic;
          color: var(--primary-blue);
          font-weight: 600;
        }

        /* Categories */
        .cat-btn {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 0.9rem;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }
        .cat-btn:not(.active) {
          background-color: rgba(255,255,255,0.5);
          border: 1px solid rgba(0,0,0,0.05);
          color: #666;
        }
        .cat-btn:hover { transform: translateY(-2px); background: white; }
        .cat-btn.active {
          background-color: var(--primary-blue);
          color: white;
          box-shadow: 0 5px 15px rgba(59, 40, 204, 0.2);
        }

        /* Featured Card */
        .featured-card {
          position: relative;
          width: 100%;
          max-width: 650px;
          height: 600px;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transition: transform 0.4s ease;
        }
        .featured-card:hover { transform: translateY(-5px); }
        .featured-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }
        .featured-card:hover img { transform: scale(1.05); }
        .featured-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 40px;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
          color: white;
        }
        .featured-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 500;
          margin-bottom: 15px;
          line-height: 1.2;
        }
        .featured-content p {
          font-size: 0.95rem;
          opacity: 0.9;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .meta-tags {
          display: flex;
          gap: 20px;
          font-size: 0.8rem;
          opacity: 0.8;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .floating-tag {
          position: absolute;
          top: 30px;
          left: 30px;
          background: white;
          color: #333;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          z-index: 2;
        }

        /* Article List */
        .article-item {
          transition: transform 0.3s;
        }
        .article-item:hover { transform: translateX(10px); }
        .article-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
        }
        @media (min-width: 768px) {
          .article-item img {
            width: 180px;
            height: 140px;
          }
        }
        .article-text { flex: 1; padding-top: 5px; }
        .date-line {
          font-size: 0.75rem;
          color: #888;
          margin-bottom: 10px;
          display: flex;
          gap: 15px;
          align-items: center;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .article-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: #222;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .article-text p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.8rem; }
          .hero-box { height: auto; min-height: 450px; padding: 60px 20px; }
          .featured-card { height: 450px; }
          .featured-content { padding: 30px 20px; }
          .featured-content h2 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}