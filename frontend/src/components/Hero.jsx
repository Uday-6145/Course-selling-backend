import React from 'react';
import { Search, Terminal, Zap, Shield, GitBranch, ArrowUpRight } from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  categories,
  onExploreClick 
}) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 border-b border-white/[0.06] bg-grid-pattern">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading and Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Engineered for Senior & Staff Engineers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Architect systems that <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">
                scale under load.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              No toy todo-apps or synthetic AI hello-worlds. Deep-dive into real distributed consensus, 
              high-throughput Go services, database query engines, and cloud microservices built directly on code.
            </p>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <p className="text-xl font-bold font-mono text-white">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Production Code</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <p className="text-xl font-bold font-mono text-white">4.92 / 5</p>
                <p className="text-xs text-slate-400 mt-0.5">Architect Rating</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <p className="text-xl font-bold font-mono text-white">&lt; 15ms</p>
                <p className="text-xs text-slate-400 mt-0.5">Real API Benchmarks</p>
              </div>
            </div>

            {/* Search Bar Input */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses by keyword (e.g. Raft, Go, Next.js, Kubernetes, Rust)..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-900 border border-white/[0.12] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-dark-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Code Terminal Window */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.12] bg-[#0c1017] shadow-2xl overflow-hidden font-mono text-xs">
              
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#131822] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="ml-2 text-slate-400 text-[11px]">curl -X POST /course/purchase</span>
                </div>
                <span className="text-[10px] text-slate-500">zsh</span>
              </div>

              {/* Terminal Content */}
              <div className="p-4 space-y-2.5 text-left text-slate-300 overflow-x-auto leading-relaxed">
                <div>
                  <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~/codex</span> git status
                </div>
                <div className="text-slate-400">
                  On branch main <br />
                  Ready to deploy high-throughput microservices.
                </div>

                <div className="pt-2">
                  <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~/codex</span> curl -s localhost:3000/course/preview | jq '.courses[0]'
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] text-[11px] text-indigo-300">
                  <pre className="text-slate-300">
{`{
  "id": "670c1a9f",
  "title": "Production Distributed Systems in Go",
  "status": "Verified Curriculum",
  "benchmarks": "40,000 req/sec",
  "modules": ["Raft Consensus", "gRPC", "WAL"]
}`}
                  </pre>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Verified Course Engine
                  </span>
                  <span className="text-slate-500">Latency: 12ms</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-glow border border-brand-400/40'
                  : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
