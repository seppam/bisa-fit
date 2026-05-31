/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Flame, Sparkles, Dumbbell, ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeGateProps {
  onStart: () => void;
  onEnterDashboard?: () => void;
  hasProgram: boolean;
  language: 'EN' | 'ID';
  theme?: 'dark' | 'light';
}

export default function WelcomeGate({ onStart, onEnterDashboard, hasProgram, language, theme = 'dark' }: WelcomeGateProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';

  // Specific visual styles for light mode contrast and branding compliance
  const primaryAccent = isDark ? '#CCFF00' : '#84CC16';
  const accentTextClass = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const accentBgClass = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  
  const textTitleClass = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMutedClass = isDark ? 'text-zinc-400' : 'text-slate-650';
  const cardBgClass = isDark ? 'bg-zinc-950/40 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-sm';
  const badgeBgClass = isDark ? 'bg-zinc-900/80 border border-white/5' : 'bg-zinc-100 border border-[#E2E8F0]';

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8 md:py-16 animate-fade-in relative max-w-2xl mx-auto w-full z-10" 
      id="page-welcome-gate"
    >
      {/* Visual glowing ring backing */}
      <div className={`absolute w-[280px] h-[280px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse ${
        isDark ? 'bg-[#CCFF00]/5' : 'bg-[#84CC16]/5'
      }`}></div>

      {/* Futuristic Launcher Badge */}
      <div className={`mb-6 flex items-center gap-2 py-1.5 px-3.5 rounded-full shadow-inner animate-bounce-slow ${badgeBgClass}`}>
        <Sparkles className={`w-3.5 h-3.5 ${accentTextClass}`} />
        <span className={`text-[10px] font-mono tracking-[0.25em] ${accentTextClass} uppercase font-bold`}>
          {isEn ? '360° HYBRID METRIC ECOSYSTEM' : 'EKOSISTEM METRIK 360°'}
        </span>
      </div>

      {/* Hero Header Typography */}
      <h1 className={`font-display font-black italic text-4xl sm:text-5xl md:text-6xl tracking-tighter uppercase leading-[0.95] ${textTitleClass}`}>
        BisaFit<span className={`${accentTextClass} drop-shadow-[0_0_15px_rgba(204,255,0,0.15)]`}>.AI</span>
      </h1>

      <p className={`${textMutedClass} mt-6 text-xs sm:text-sm md:text-base font-medium max-w-xl leading-relaxed uppercase font-sans`}>
        {isEn 
          ? "Your ultimate AI companion for precision workouts, non-boring local nutrition, and shift-work recovery mapping. Driven by low-volume HIT concentric failure splits."
          : "Solusi pintar yang mengatur program latihan, diet lokal anti-bosen, dan jam tidur shift malammu—semuanya dipersonalisasi oleh Gemini AI. Digerakkan oleh prinsip latihan intensitas tinggi (HIT)."}
      </p>

      {/* Core Features list in subtle glassmorphic layout */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-8 mb-10 text-left">
        <div className={`${cardBgClass} p-3 rounded-lg flex flex-col gap-1.5 hover:border-slate-350 transition-all`}>
          <Dumbbell className={`w-4 h-4 ${accentTextClass}`} />
          <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isEn ? 'TRAINING' : 'LATIHAN'}
          </span>
          <span className={`text-[10px] font-sans font-bold leading-tight uppercase ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {isEn ? 'Low Volume Failure' : 'Intensitas Tinggi'}
          </span>
        </div>
        
        <div className={`${cardBgClass} p-3 rounded-lg flex flex-col gap-1.5 hover:border-slate-350 transition-all`}>
          <Flame className={`w-4 h-4 ${accentTextClass}`} />
          <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isEn ? 'NUTRITION' : 'NUTRISI'}
          </span>
          <span className={`text-[10px] font-sans font-bold leading-tight uppercase ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {isEn ? 'Flavorful Recipes' : 'Menu Nikmat'}
          </span>
        </div>

        <div className={`${cardBgClass} p-3 rounded-lg flex flex-col gap-1.5 hover:border-slate-350 transition-all`}>
          <ShieldCheck className={`w-4 h-4 ${accentTextClass}`} />
          <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {isEn ? 'CIRCADIAN' : 'TIDUR'}
          </span>
          <span className={`text-[10px] font-sans font-bold leading-tight uppercase ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {isEn ? 'Shift-Work Sleep' : 'Sirkadian Shift'}
          </span>
        </div>
      </div>

      {/* Primary Actions Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <button
          onClick={onStart}
          type="button"
          id="btn-start-calibration"
          className={`w-full sm:w-auto px-8 py-4 ${
            isDark 
              ? 'bg-[#CCFF00] hover:bg-[#D4FF33] text-black shadow-[0_0_25px_rgba(204,255,0,0.25)]' 
              : 'bg-[#84CC16] hover:bg-[#71B512] text-white shadow-sm'
          } font-display font-black tracking-wider text-xs sm:text-sm uppercase rounded transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2`}
        >
          <span>{isEn ? 'START YOUR CALIBRATION' : 'MULAI KALIBRASI SEKARANG'}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        {hasProgram && onEnterDashboard && (
          <button
            onClick={onEnterDashboard}
            type="button"
            id="btn-quick-dashboard"
            className={`w-full sm:w-auto px-8 py-4 ${
              isDark 
                ? 'bg-zinc-950/80 border border-white/10 hover:border-[#CCFF00] text-zinc-100 hover:text-white' 
                : 'bg-white hover:bg-zinc-50 border border-zinc-250 text-[#0F172A]'
            } font-display font-black tracking-wider text-xs sm:text-sm uppercase rounded transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5`}
          >
            <span>{isEn ? 'ENTER DASHBOARD' : 'MASUK KE DASHBOARD'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
