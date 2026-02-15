"use client";

import Link from "next/link";
import { LandingSearch } from "@/components/LandingSearch";
import {
  Calendar,
  MessageCircle,
  User,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
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
          
          <div className="search-wrapper animate-up delay-3 w-full max-w-[500px]">
            {/* Keeping your functional Search Component */}
            <LandingSearch />
          </div>
        </section>

        {/* --- Categories --- */}
        <section className="flex justify-center gap-3 flex-wrap">
          <button className="cat-btn active">All Categories</button>
          <button className="cat-btn">Campus</button>
          <button className="cat-btn">Academics</button>
          <button className="cat-btn">Students Life</button>
          <button className="cat-btn">Hostels</button>
          <button className="cat-btn">Alumni</button>
        </section>

        {/* --- Featured Article --- */}
        <section className="flex justify-center mt-5">
          <div className="featured-card group">
            <span className="floating-tag">Featured</span>
            <img 
              src="https://images.unsplash.com/photo-1516410303867-c04373208022?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Architecture" 
            />
            <div className="featured-content">
              <h2>For the Architecture & Interiors</h2>
              <p>Los Angeles, United States - Unknown device. And additional description here.</p>
              <div className="meta-tags">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Apr 8, 2026</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> 9 Comments</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Simon Morris</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Article List --- */}
        <section className="flex flex-col gap-10 max-w-[600px] mx-auto">
          
          <article className="article-item">
            <img src="https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Pink Stairs" />
            <div className="article-text">
              <div className="date-line">
                <span>Apr 8, 2026</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Maksim Ostroborodov</span>
              </div>
              <h3>Pink stairs leading to the sky</h3>
              <p>In my opinion, UI/UX design is the foundation of a product, its face and soul. You can create an infinitely high-quality heart, and organize the simulation of breathing...</p>
            </div>
          </article>

          <article className="article-item">
            <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Building" />
            <div className="article-text">
              <div className="date-line">
                <span>Apr 8, 2026</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Mike Yukhtenko</span>
              </div>
              <h3>Building on the corner of the sea</h3>
              <p>Cognitive bias (also known as "cognitive illusion" or "cognitive distortion") refers to errors in thinking that can lead to incorrect perception and decision-making...</p>
            </div>
          </article>

          <article className="article-item">
            <img src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Breakfast" />
            <div className="article-text">
              <div className="date-line">
                <span>Apr 8, 2026</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Eladio Bloom</span>
              </div>
              <h3>The color of the sun for breakfast</h3>
              <p>As is commonly believed, this methodology places the user at the center of the world and focuses on their views and habits. In fact, the product's actual growth revolves around...</p>
            </div>
          </article>

        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-black/5 py-10 px-[5%] mt-20 flex flex-col md:flex-row justify-between items-center text-[#999] text-[0.85rem] max-w-[1400px] mx-auto gap-5 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[30px]">
          <div>© 2026 NITT. All rights reserved.</div>
          <div className="flex gap-[15px] text-[1.1rem] text-[#555]">
            <Instagram className="w-[18px] h-[18px] cursor-pointer hover:text-[#3b28cc] transition-colors" />
            <Linkedin className="w-[18px] h-[18px] cursor-pointer hover:text-[#3b28cc] transition-colors" />
            <Mail className="w-[18px] h-[18px] cursor-pointer hover:text-[#3b28cc] transition-colors" />
          </div>
        </div>
        <div className="text-[#333] font-semibold flex items-center cursor-pointer hover:text-[#3b28cc] transition-colors">
          Contact Us <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </div>
      </footer>

      {/* --- Floating Chat --- */}
      <div className="fixed bottom-10 right-10 bg-black text-white w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] cursor-pointer z-[100] transition-transform duration-300 hover:scale-110 hover:rotate-6">
        <MessageSquare className="w-6 h-6" />
      </div>

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
          min-height: 600px;
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
          overflow: hidden;
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
          margin-bottom: 40px;
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
          max-width: 600px;
          height: 750px;
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
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
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
          display: flex;
          gap: 30px;
          align-items: flex-start;
          transition: transform 0.3s;
        }
        .article-item:hover { transform: translateX(10px); }
        .article-item img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
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
          font-size: 1.8rem;
          font-weight: 400;
          color: #222;
          margin-bottom: 12px;
          line-height: 1.1;
        }
        .article-text p {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
          font-weight: 400;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-box { height: auto; min-height: 450px; padding: 60px 20px; }
          .article-item { flex-direction: column; gap: 15px; }
          .article-item img { width: 100%; height: 250px; }
          .featured-card { height: 500px; }
        }
      `}</style>
    </div>
  );
}