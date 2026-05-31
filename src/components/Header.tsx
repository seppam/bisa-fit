/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Activity, Globe, Sun, Moon } from 'lucide-react';
import { TrainingTrack, ClassificationType } from '../types';
import { TRANSLATIONS } from '../utils/lang';

interface HeaderProps {
  classification: ClassificationType;
  track: TrainingTrack;
  bodyFat: number;
  ffmi: number;
  language: 'EN' | 'ID';
  onLanguageToggle: (lang: 'EN' | 'ID') => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export default function Header({ 
  classification, 
  track, 
  bodyFat, 
  ffmi, 
  language, 
  onLanguageToggle,
  theme,
  onThemeToggle
}: HeaderProps) {
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  const [activeTooltip, setActiveTooltip] = React.useState<'bfp' | 'ffmi' | 'status' | null>(null);

  // Close tooltip on click elsewhere
  React.useEffect(() => {
    const handleClose = () => setActiveTooltip(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // Adaptive style tokens based on active theme
  const accentColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const accentBg = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const borderCol = isDark ? 'border-white/5' : 'border-[#E2E8F0]';
  const bgCol = isDark ? 'bg-[#0a0a0a]/95' : 'bg-white/95';

  // Determine display status based on classification
  let statusText = 'ADVANCED';
  if (classification === 'muscular_athlete') {
    statusText = 'ELITE OVERRIDE';
  } else if (classification === 'metabolic_conditioning') {
    statusText = 'METABOLIC';
  } else {
    statusText = 'ATHLETIC';
  }

  // Segment A: Brand Logo & Title block
  const logoRow = (
    <div className="flex items-start gap-3.5" id="header-logo-row">
      <div className="shrink-0 mt-1">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className={`w-9 h-9 ${accentColor} transition-all duration-300 drop-shadow-sm`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`flex h-1.5 w-1.5 rounded-full ${accentBg} animate-pulse`}></span>
          <span className={`text-[8.5px] font-mono tracking-[0.25em] ${accentColor} uppercase font-bold`}>
            {t.brandLabel}
          </span>
        </div>
        <h1 className={`font-display font-black italic text-2xl sm:text-3xl tracking-tighter uppercase leading-none ${textPrimary}`}>
          BisaFit<span className={accentColor}>.AI</span>
        </h1>
      </div>
    </div>
  );

  // Segment B: Subtitle/Description block
  const subtitleBlock = (
    <p className={`${textMuted} text-[10px] md:text-[11px] font-semibold max-w-xl leading-normal uppercase font-sans mt-1 md:mt-1.5`} id="header-subtitle-text">
      {t.subtitle}
    </p>
  );

  // Segment C: Utility Selector row (Theme & Language switches)
  const utilityRow = (
    <div className="flex items-center gap-3" id="header-utilities">
      {/* Sun / Moon Theme Switcher */}
      <button
        onClick={onThemeToggle}
        type="button"
        className={`p-1.5 rounded-md border transition-all duration-150 cursor-pointer flex items-center justify-center ${
          isDark 
            ? 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:border-white/15' 
            : 'bg-zinc-100 border-zinc-250 text-slate-650 hover:text-slate-900 hover:bg-zinc-200'
        }`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun className="w-3.5 h-3.5 text-[#CCFF00]" /> : <Moon className="w-3.5 h-3.5 text-[#84CC16]" />}
      </button>

      {/* Compact Low-Profile Language Selector */}
      <div className={`flex items-center border p-0.5 rounded-md ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-100 border-zinc-250'}`}>
        <Globe className={`w-3 h-3 ${isDark ? 'text-zinc-550' : 'text-zinc-450'} mx-0.5`} />
        
        <button
          onClick={() => onLanguageToggle('EN')}
          type="button"
          className={`px-1.5 py-0.5 text-[8.5px] font-mono font-black rounded transition-all duration-150 cursor-pointer ${
            language === 'EN'
              ? (isDark ? 'bg-[#CCFF00] text-black shadow-sm' : 'bg-[#84CC16] text-white shadow-sm')
              : (isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-450 hover:text-zinc-800')
          }`}
        >
          EN
        </button>
        <div className={`w-[1px] h-2.5 mx-0.5 ${isDark ? 'bg-white/10' : 'bg-zinc-250'}`}></div>
        <button
          onClick={() => onLanguageToggle('ID')}
          type="button"
          className={`px-1.5 py-0.5 text-[8.5px] font-mono font-black rounded transition-all duration-150 cursor-pointer ${
            language === 'ID'
              ? (isDark ? 'bg-[#CCFF00] text-black shadow-sm' : 'bg-[#84CC16] text-white shadow-sm')
              : (isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-450 hover:text-zinc-800')
          }`}
        >
          ID
        </button>
      </div>
    </div>
  );

  // Segment D: Somatic diagnostic indexes & Biometrics label row
  const biometricRow = (
    <div className="flex flex-col items-start md:items-end w-full md:w-auto gap-2.5" id="biometrics-rack-container">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-start md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-250 dark:border-white/5" id="biometrics-rack">
        {/* Somatic indices overview */}
        <div className="flex items-center gap-5 sm:gap-6 shrink-0 flex-nowrap whitespace-nowrap">
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center gap-1">
              <p className={`text-[8.5px] uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-mono tracking-wider font-extrabold text-right whitespace-nowrap`}>{t.bfpIndex}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'bfp' ? null : 'bfp'); }}
                className={`w-3.5 h-3.5 rounded-full border text-[7.5px] flex items-center justify-center font-bold tracking-tight cursor-pointer transition-all ${
                  activeTooltip === 'bfp'
                    ? (isDark ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40' : 'bg-[#84CC16]/20 text-[#84CC16] border-[#84CC16]/40')
                    : 'text-zinc-400 border-zinc-500/20 hover:border-zinc-450 dark:border-white/10'
                }`}
                title="BFP Explainer"
              >
                ?
              </button>
            </div>
            <p className={`text-sm sm:text-base font-black font-mono text-right ${isDark ? 'text-zinc-100' : 'text-[#0F172A]'} whitespace-nowrap`}>{bodyFat > 0 ? `${bodyFat.toFixed(1)}%` : '---'}</p>
          </div>
          
          <div className={`border-x px-5 sm:px-6 ${isDark ? 'border-white/10' : 'border-zinc-200'} shrink-0 flex flex-col items-end`}>
            <div className="flex items-center gap-1">
              <p className={`text-[8.5px] uppercase ${isDark ? 'text-zinc-550' : 'text-zinc-400'} font-mono tracking-wider font-extrabold text-right whitespace-nowrap`}>{t.ffmiDensity}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'ffmi' ? null : 'ffmi'); }}
                className={`w-3.5 h-3.5 rounded-full border text-[7.5px] flex items-center justify-center font-bold tracking-tight cursor-pointer transition-all ${
                  activeTooltip === 'ffmi'
                    ? (isDark ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40' : 'bg-[#84CC16]/20 text-[#84CC16] border-[#84CC16]/40')
                    : 'text-zinc-400 border-zinc-500/20 hover:border-zinc-450 dark:border-white/10'
                }`}
                title="FFMI Explainer"
              >
                ?
              </button>
            </div>
            <p className={`text-sm sm:text-base font-black font-mono text-right ${accentColor} whitespace-nowrap`}>{ffmi > 0 ? ffmi.toFixed(2) : '---'}</p>
          </div>
          
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center gap-1">
              <p className={`text-[8.5px] uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-mono tracking-wider font-extrabold text-right whitespace-nowrap`}>{t.somaticStatus}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'status' ? null : 'status'); }}
                className={`w-3.5 h-3.5 rounded-full border text-[7.5px] flex items-center justify-center font-bold tracking-tight cursor-pointer transition-all ${
                  activeTooltip === 'status'
                    ? (isDark ? 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40' : 'bg-[#84CC16]/20 text-[#84CC16] border-[#84CC16]/40')
                    : 'text-zinc-400 border-zinc-500/20 hover:border-zinc-450 dark:border-white/10'
                }`}
                title="Somatic Profiling Explainer"
              >
                ?
              </button>
            </div>
            <p className={`text-sm sm:text-base font-black font-mono italic tracking-tight text-right uppercase ${isDark ? 'text-zinc-350' : 'text-slate-650'} whitespace-nowrap`}>{bodyFat > 0 ? statusText : '---'}</p>
          </div>
        </div>

        {/* Biometrics Override label */}
        {bodyFat > 0 && (
          <div className={`flex items-center gap-1 bg-white/5 border rounded px-2.5 py-1 text-[9.5px] font-mono shrink-0 uppercase tracking-wider font-black ${
            isDark ? 'border-white/10 text-zinc-350' : 'border-[#E2E8F0] text-zinc-600 bg-white shadow-sm'
          }`}>
            {classification === 'muscular_athlete' ? (
              <>
                <span className={`h-1.5 w-1.5 rounded-full ${accentBg} animate-pulse`}></span>
                <span className={`${accentColor}`}>BMI_OVERRIDE</span>
              </>
            ) : (
              <>
                <Activity className={`w-3 h-3 ${accentColor}`} />
                <span>{classification === 'metabolic_conditioning' ? 'COND_TARGET' : 'BAL_TARGET'}</span>
              </>
            )}
          </div>
        )}
      </div>

      {activeTooltip && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`text-left p-3.5 rounded-lg border text-xs leading-relaxed font-sans font-semibold uppercase tracking-wider backdrop-blur-md animate-fade-in z-50 ${
            isDark 
              ? 'bg-[#121212]/95 border-[#CCFF00]/25 text-zinc-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)]' 
              : 'bg-white/95 border-[#84CC16]/35 text-zinc-700 shadow-lg'
          }`}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          {activeTooltip === 'bfp' && (
            <div className="space-y-1">
              <p className={`font-mono text-[9px] font-black uppercase ${accentColor}`}>BFP (Body Fat Percentage) // Persentase Lemak</p>
              <p className="normal-case text-[11px] font-normal leading-normal text-zinc-400 dark:text-zinc-400">
                True body adiposity measured via U.S. Navy circumference math. We bypass misleading generic BMI scales by establishing empirical fat stores to ensure correct training track routing.
              </p>
            </div>
          )}
          {activeTooltip === 'ffmi' && (
            <div className="space-y-1">
              <p className={`font-mono text-[9px] font-black uppercase ${accentColor}`}>FFMI (Fat-Free-Mass Density) // Kepadatan Otot</p>
              <p className="normal-case text-[11px] font-normal leading-normal text-zinc-400 dark:text-zinc-400">
                Calculates total skeletal muscle mass scaled to height: <code className="font-mono bg-white/5 dark:bg-black/40 px-1 py-0.5 rounded text-amber-400">[Muscle Mass (kg) / Height (m)²]</code>. An index above 21.5 (men) / 17.5 (women) signals elite density and triggers advanced heavy HIT weight loads.
              </p>
            </div>
          )}
          {activeTooltip === 'status' && (
            <div className="space-y-1">
              <p className={`font-mono text-[9px] font-black uppercase ${accentColor}`}>Somatic Profiling // Penilaian Komposisi Fisiologis</p>
              <p className="normal-case text-[11px] font-normal leading-normal text-zinc-400 dark:text-zinc-400">
                Cross-references BMI, BFP, and FFMI as a singular matrix. Muscular lifters with high BMI are protected from hazardous calorie starvation and receive strength protocols, while high-fat somatic profiles receive conditioning programs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className={`relative border-b ${borderCol} ${bgCol} backdrop-blur-md sticky top-0 z-50 transition-colors duration-350`}>
      {/* High-tech striking neon-lime gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${isDark ? 'from-[#CCFF00] via-zinc-400 to-[#CCFF00]/40' : 'from-[#84CC16] via-zinc-450 to-[#84CC16]/40'}`}></div>

      <div className="max-w-7xl mx-auto p-6 relative animate-fade-in" id="global-header-container">
        
        {/* MOBILE STACK WITH PRISTINE VERTICAL FLOW */}
        <div className="flex md:hidden flex-col items-stretch w-full gap-4" id="header-mobile-view">
          
          <div className="flex items-center justify-between w-full gap-2" id="mobile-top-bar">
            <div className="flex-1">
              {logoRow}
            </div>
            <div className="shrink-0 flex items-center justify-end">
              {utilityRow}
            </div>
          </div>

          <div className="w-full mt-1">
            {subtitleBlock}
          </div>

          <div className="w-full mt-2">
            {biometricRow}
          </div>
        </div>

        {/* LOCKED DESKTOP TWO-COLUMN GRID */}
        <div className="hidden md:grid md:grid-cols-2 w-full gap-6 items-start" id="header-desktop-view">
          {/* LEFT COLUMN: BRANDING COMPONENT ONLY */}
          <div className="flex flex-col items-start max-w-xl" id="header-desktop-branding-column">
            {logoRow}
            {subtitleBlock}
          </div>

          {/* RIGHT COLUMN: UTILITIES & INDEXES */}
          <div className="flex flex-col items-end w-full gap-4" id="header-desktop-widgets-column">
            {utilityRow}
            {biometricRow}
          </div>
        </div>

      </div>
    </header>
  );
}
