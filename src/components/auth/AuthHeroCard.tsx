import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import heroImg from '../../assets/hero.png';

export const AuthHeroCard: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[580px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-[28px] p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Dynamic background glow and subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Image Frame Container with Rounded Border */}
      <div className="relative z-10 w-full max-w-md mx-auto aspect-[4/3] rounded-[24px] overflow-hidden border border-white/20 shadow-2xl shadow-indigo-950/40 p-1.5 bg-white/10 backdrop-blur-md transition-transform duration-500 hover:scale-[1.01]">
        <div className="w-full h-full rounded-[18px] overflow-hidden relative group">
          {/* High-quality technology collaboration visual */}
          <img
            src={heroImg}
            alt="i11Sprint high performance team collaboration"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
          />
          
          {/* Interactive touch-screen table HUD simulation overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/70 via-transparent to-indigo-900/20 mix-blend-multiply pointer-events-none" />

          {/* Futuristic HUD overlay line on image */}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-indigo-950/80 backdrop-blur-md rounded-xl border border-indigo-400/30 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Sprint #84 • Live Sync</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>98.4% Velocity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section below image */}
      <div className="relative z-10 text-center text-white mt-6 max-w-lg mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-white">
          Unleash Velocity
        </h2>
        <p className="text-indigo-100/90 text-sm leading-relaxed mb-6 font-medium">
          The only sprint platform built for high-performance agencies. Track, execute, and deliver results with surgical precision.
        </p>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="bg-white/15 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>4.2k active sprints</span>
          </div>

          <div className="bg-white/15 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            <span>Top 1% Precision</span>
          </div>
        </div>
      </div>

      {/* Large Watermark Typography in Background */}
      <div className="absolute inset-x-0 bottom-0 h-24 text-center pointer-events-none select-none overflow-hidden opacity-[0.07]">
        <span className="text-6xl md:text-7xl font-black text-white tracking-widest block uppercase font-mono">
          EFFORTLESS
        </span>
      </div>
    </div>
  );
};
