/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { ShieldCheck, CalendarRange, Clock, Lock, ArrowRight } from 'lucide-react';

interface PortalTransitionProps {
  onProceed: () => void;
  language: 'EN' | 'ID';
  theme?: 'dark' | 'light';
}

export default function PortalTransition({ onProceed, language, theme = 'dark' }: PortalTransitionProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';

  // Styling Variables
  const accentColor = isDark ? '#CCFF00' : '#84CC16';
  const accentTextClass = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const accentBgClass = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  const accentBorderClass = isDark ? 'border-[#CCFF00]' : 'border-[#84CC16]';

  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMuted = isDark ? 'text-zinc-400' : 'text-slate-650';
  const textSubLabel = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardBgClass = isDark ? 'bg-[#0f0f0f]/90 border border-white/5 shadow-2xl' : 'bg-white border border-[#E2E8F0] shadow-md text-[#0F172A]';
  const badgeBgClass = isDark ? 'bg-[#CCFF00]/10 border-white/10' : 'bg-[#84CC16]/10 border-zinc-200';

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8 md:py-16 animate-fade-in relative max-w-xl mx-auto w-full z-10" 
      id="page-portal-transition"
    >
      <div className={`absolute w-[240px] h-[240px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse ${
        isDark ? 'bg-[#CCFF00]/5' : 'bg-[#84CC16]/5'
      }`}></div>

      {/* Futuristic Launcher Badge */}
      <div className={`mb-6 flex items-center gap-2 py-1.5 px-3.5 rounded-full shadow-inner animate-bounce-slow border ${badgeBgClass}`}>
        <Lock className={`w-3.5 h-3.5 ${accentTextClass}`} />
        <span className={`text-[9px] font-mono tracking-[0.25em] ${accentTextClass} uppercase font-bold`}>
          {isEn ? '360° WELLNESS ECOSYSTEM UNLOCKED' : 'EKOSISTEM KESEHATAN SELESAI'}
        </span>
      </div>

      <h1 className={`font-display font-black italic text-4xl sm:text-5xl tracking-tighter uppercase leading-none ${textPrimary}`}>
        {isEn ? 'CALIBRATION COMPLETE' : 'PROSES PENYUSUNAN SELESAI'}
      </h1>

      <p className={`${textMuted} mt-4 text-xs sm:text-sm font-medium tracking-wide uppercase leading-relaxed max-w-md`}>
        {isEn
          ? "Gemini AI has successfully compiled your somatic coordinates, physical bounds, circadian parameters, and nutritional profiles into a persistent high-performance ecosystem dashboard."
          : "Kecerdasan Buatan telah berhasil menyusun koordinat somatis, batasan fisik, variabel sirkadian harian, dan profil nutrisi Anda ke dalam dasbor ekosistem harian."}
      </p>

      {/* Grid of accomplishments */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 mt-8 mb-10 text-left">
        <div className={`${cardBgClass} p-4 rounded-xl flex items-center gap-4 w-full sm:w-1/2`}>
          <ShieldCheck className={`w-6 h-6 shrink-0 ${accentTextClass}`} />
          <div className="space-y-0.5">
            <span className={`text-[8px] font-mono uppercase block ${textSubLabel}`}>{isEn ? 'SAFETY SHIELD' : 'PERISAI SPINAL'}</span>
            <span className={`text-[11.5px] font-bold font-sans uppercase leading-tight ${textPrimary}`}>
              {isEn ? 'Biomechanical Guards Active' : 'Pelindung Sendi Aktif'}
            </span>
          </div>
        </div>

        <div className={`${cardBgClass} p-4 rounded-xl flex items-center gap-4 w-full sm:w-1/2`}>
          <CalendarRange className={`w-6 h-6 shrink-0 ${accentTextClass}`} />
          <div className="space-y-0.5">
            <span className={`text-[8px] font-mono uppercase block ${textSubLabel}`}>{isEn ? 'COORDINATOR' : 'KOORDINASI LATIHAN'}</span>
            <span className={`text-[11.5px] font-bold font-sans uppercase leading-tight ${textPrimary}`}>
              {isEn ? '7-Day Custom Splitting' : 'Jadwal Mingguan Terarah'}
            </span>
          </div>
        </div>
      </div>

      {/* Trigger Button to proceed to the Dashboard */}
      <button
        onClick={onProceed}
        type="button"
        id="btn-portal-dashboard-transition"
        className={`w-full sm:w-auto px-8 py-4 ${
          isDark 
            ? 'bg-[#CCFF00] hover:bg-[#D4FF33] text-black shadow-[0_0_20px_rgba(204,255,0,0.25)]' 
            : 'bg-[#84CC16] hover:bg-[#71B512] text-white shadow-md'
        } font-display font-black tracking-wider text-xs sm:text-sm uppercase rounded transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2`}
      >
        <span>{isEn ? 'ENTER ULTIMATE DASHBOARD' : 'MASUK KE EKOSISTEM UTAMA'}</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
}
