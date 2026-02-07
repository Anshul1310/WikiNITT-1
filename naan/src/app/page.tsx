import Link from "next/link";
import Image from "next/image";
import { LandingSearch } from "@/components/LandingSearch";
import {
  TrendingUp,
  Star,
  ArrowRight,
  ArrowLeft,
  User,
  FilePen,
  Library,
  Calendar,
  Bus,
  Clock,
  ChevronRight,
  Utensils,
  Flame,
  UserPlus,
  MapPin,
  Sparkles
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f4f7fa] text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* === BACKGROUND MESH (Fixed) === */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-200/40 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/40 blur-[100px] animate-pulse-slow" style={{animationDelay: '2s'}} />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <LandingNavbar />
      
      {/* === ANNOUNCEMENT BANNER (Glass Pill) === */}
      <div className="w-full relative z-10 pt-24 pb-2 flex justify-center px-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-200/50 backdrop-blur-md text-xs md:text-sm font-medium text-indigo-900 shadow-sm hover:bg-indigo-600/15 transition-all cursor-pointer">
          <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <p className="truncate max-w-[250px] sm:max-w-md">
            NITTFest '26 Dates Announced — Registration opens tomorrow at 10:00 AM.
          </p>
          <ArrowRight className="w-3.5 h-3.5 opacity-60" />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        
        {/* === HERO SECTION === */}
        <section className="w-full max-w-[1280px] mx-auto px-4 py-12 lg:py-20 flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            The Open Knowledge Hub of NIT Trichy
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-6 tracking-tight drop-shadow-sm">
            Search{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-600">
              Wiki
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600">
              NITT
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-light leading-relaxed">
            Access curated information, academic resources, and campus
            insights contributed by students, for students.
          </p>
          
          {/* Search Component Wrapper */}
          <div className="w-full max-w-2xl relative z-20">
            <LandingSearch />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-400">Trending:</span>
            {['#Festember', '#CycleTests', '#HostelRules', '#Curfew'].map((tag) => (
              <Link
                key={tag}
                className="px-3 py-1 rounded-full bg-white/60 border border-white/50 hover:border-indigo-200 hover:text-indigo-600 hover:bg-white/80 transition-all shadow-sm backdrop-blur-sm"
                href="#"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        {/* === FEATURED HERO CARD === */}
        <section className="w-full max-w-[1280px] px-4 relative z-10 mb-16">
          <div className="group relative w-full overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-indigo-900/10 border border-white/20">
            {/* Background Image with Scale Effect */}
            <div className="absolute inset-0 z-0">
              <Image
                alt="Clock tower view"
                className="h-full w-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                src="/nitt.jpg" 
                width={1280}
                height={720}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between p-8 md:p-12 gap-8 min-h-[400px]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 self-start rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md mb-6 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-300" />
                  EDITOR'S PICK
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4 text-white drop-shadow-md">
                  The Clock Tower Chronicles: <br />
                  Examining Campus Heritage
                </h2>
                <p className="text-slate-200 text-lg font-light leading-relaxed max-w-xl drop-shadow-sm">
                  An in-depth look at the architectural evolution of NIT
                  Trichy's most iconic landmark and its significance in
                  student culture.
                </p>
              </div>
              <div className="shrink-0">
                <button className="flex items-center gap-2 h-12 px-8 rounded-full bg-white/90 text-slate-900 font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm">
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* === STATS GRID (Glass Cards) === */}
        <section className="w-full max-w-[1280px] px-4 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">
              Live Campus Pulse
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Online Now", icon: User, val: "1,204", sub: "Active users", subCol: "text-emerald-600", subIcon: true },
              { label: "Edits", icon: FilePen, val: "45", sub: "+12% today", subCol: "text-emerald-600", subIcon: false },
              { label: "Articles", icon: Library, val: "3.5k", sub: "Total contributions", subCol: "text-slate-500", subIcon: false },
              { label: "Events", icon: Calendar, val: "8", sub: "Scheduled this week", subCol: "text-amber-600", subIcon: false },
            ].map((stat, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <stat.icon className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-800">
                    {stat.val}
                  </span>
                </div>
                <span className={`text-xs font-medium ${stat.subCol} flex items-center gap-1 mt-2`}>
                  {stat.subIcon && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                  {!stat.subIcon && i === 1 && <TrendingUp className="w-3 h-3" />}
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* === FEATURED COLLECTION & UPDATES === */}
        <section className="w-full py-16 relative">
          {/* Subtle background separation for this section */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10 border-y border-white/50"></div>
          
          <div className="max-w-[1280px] mx-auto px-4">
            
            {/* CAROUSEL HEADER */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-2">
                  Featured Collection
                </h2>
                <p className="text-slate-500 font-light">
                  Handpicked guides for campus survival.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 border border-white/60 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 border border-white/60 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all hover:scale-105">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CAROUSEL ITEMS (Glass Cards) */}
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-1 mb-16">
              {[
                { title: "Placement Stats 2025", desc: "Detailed analysis of package trends across departments.", img: 1, tag: "Premium Guide" },
                { title: "Festember Survival Guide", desc: "The ultimate guide for the cultural fest: Pro shows & food.", img: 2, tag: null },
                { title: "Hostel Life 101", desc: "Everything freshers need to know: Mess hacks & laundry.", img: 3, tag: null },
                { title: "Campus Map 2.0", desc: "Never get lost again. Updated routes & shortcuts.", img: 4, tag: null },
              ].map((item, i) => (
                <div key={i} className="snap-start shrink-0 w-[300px] md:w-[360px] group cursor-pointer bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 overflow-hidden hover:-translate-y-1">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={`http://googleusercontent.com/profile/picture/${item.img}`} // Placeholder logic
                      width={380}
                      height={214}
                    />
                    {item.tag && (
                      <div className="absolute top-4 left-4 bg-white/90 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide backdrop-blur-md">
                        {item.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {item.desc}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* UPDATES & TRENDING GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LATEST UPDATES */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                    Latest Updates
                  </h2>
                  <div className="h-px bg-slate-200 grow"></div>
                  <Link
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    href="#"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Bus, col: "blue", title: "Bus Schedule - '26", msg: "Updated timings for routes to Trichy City.", time: "2 hrs ago", user: "admin" },
                    { icon: Utensils, col: "green", title: "Mega Mess Menu - October", msg: "Special dinner announced for Diwali.", time: "5 hrs ago", user: "mess_comm" },
                    { icon: Clock, col: "purple", title: "Library Extended Hours", msg: "Library open until 2 AM during exam week.", time: "1 day ago", user: "librarian" },
                  ].map((update, i) => (
                    <Link
                      key={i}
                      className="group flex items-start p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md hover:bg-white/80 hover:border-indigo-100 transition-all"
                      href="#"
                    >
                      <div className={`h-12 w-12 rounded-2xl bg-${update.col}-50 text-${update.col}-600 flex shrink-0 items-center justify-center mr-5 border border-${update.col}-100 shadow-sm`}>
                        <update.icon className="w-6 h-6" />
                      </div>
                      <div className="grow">
                        <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {update.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1 font-light">
                          {update.msg}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {update.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> @{update.user}
                          </span>
                        </div>
                      </div>
                      <div className="self-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-slate-300 group-hover:text-indigo-400">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* TRENDING SIDEBAR */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                    Trending Now
                  </h2>
                </div>
                <div className="flex flex-col gap-6 sticky top-28">
                  {/* Glass Gradient Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-md uppercase border border-white/10">
                        Hot Topic
                      </span>
                      <Flame className="text-amber-300 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">End Sem Schedule</h3>
                    <p className="text-sm text-indigo-50 mb-6 font-light leading-relaxed relative z-10">
                      Tentative dates released for B.Tech & M.Tech. Check your department slots.
                    </p>
                    <button className="w-full py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-bold hover:bg-white hover:text-indigo-600 transition-all shadow-sm">
                      Download PDF
                    </button>
                  </div>

                  {/* Glass Sidebar Card */}
                  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 mb-1 block uppercase tracking-wider">
                          Club Activity
                        </span>
                        <h3 className="text-lg font-bold text-slate-800">
                          Spider R&D Inductions
                        </h3>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                        <UserPlus className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-slate-100 mt-2">
                      {[
                         { icon: Calendar, txt: "Tomorrow" },
                         { icon: MapPin, txt: "Orion Building" },
                         { icon: Clock, txt: "5:00 PM" }
                      ].map((info, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-500 font-light">
                          <info.icon className="text-slate-400 w-4 h-4" />
                          {info.txt}
                        </div>
                      ))}
                    </div>
                    <button className="mt-5 w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/50 text-sm font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}