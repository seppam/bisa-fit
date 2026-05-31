/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { UserMetrics } from '../types';
import { 
  Printer, 
  RotateCcw, 
  Dumbbell, 
  Apple, 
  Moon, 
  Activity, 
  Heart, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Clock, 
  Coffee, 
  CheckCircle,
  MessageSquare,
  Flame,
  ChevronRight,
  Utensils
} from 'lucide-react';

interface UltimateDashboardProps {
  program: {
    greeting: string;
    diagnostic: {
      bmi: number;
      ffmi: number;
      bodyFat: number;
      classification: string;
      label: string;
      badgeColor?: string;
      description: string;
      intensityLevel: string;
      cnsRecoveryFactor: string;
      coachesVerdict: string;
      hydrationTarget?: number;
      sleepTarget?: string;
    };
    schedule: Array<{
      day: number;
      title: string;
      focus: string;
      type: 'lift' | 'rest';
      exercises?: Array<{
        id: string;
        name: string;
        sets: number;
        reps: string;
        rest: string;
        coachingCue: string;
      }>;
      sportsIntegration?: string;
      dietPlan: {
        theme: string;
        meals: Array<{
          name: string;
          recipe: string;
          macros: string;
          tip?: string;
         }>;
         dailySummary: string;
       };
       lifestyleProtocol: {
         supplementTimings: string;
         circadianSleepBlocks: string;
       };
     }>;
   };
   metrics: UserMetrics;
   completedExercises: Record<string, boolean>;
   onToggleExercise: (id: string) => void;
   onReset: () => void;
   language: 'EN' | 'ID';
   theme?: 'dark' | 'light';
}

export default function UltimateDashboard({
  program,
  metrics,
  completedExercises,
  onToggleExercise,
  onReset,
  language,
  theme = 'dark'
}: UltimateDashboardProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Auto-scatters list scroll to top on day click
  useEffect(() => {
    const scrollTarget = document.getElementById('grid-layout-hub');
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeDayIndex]);

  const activeDay = program.schedule[activeDayIndex] || program.schedule[0];

  // Rest Timer State for Active Workouts
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerInitial, setTimerInitial] = useState<number>(90);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerTargetExercise, setTimerTargetExercise] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (timerActive && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      intervalId = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(intervalId);
  }, [timerActive, timerSecondsLeft]);

  const startRestTimer = (secondsStr: string, exerciseId: string) => {
    let secondsVal = 90;
    const cleanStr = secondsStr.toLowerCase();
    if (cleanStr.includes('180') || cleanStr.includes('3 min') || cleanStr.includes('3m')) {
      secondsVal = 180;
    } else if (cleanStr.includes('120') || cleanStr.includes('2 min') || cleanStr.includes('2m')) {
      secondsVal = 120;
    } else if (cleanStr.includes('60') || cleanStr.includes('1 min') || cleanStr.includes('1m')) {
      secondsVal = 60;
    } else if (cleanStr.includes('75')) {
      secondsVal = 75;
    }
    setTimerInitial(secondsVal);
    setTimerSecondsLeft(secondsVal);
    setTimerTargetExercise(exerciseId);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerSecondsLeft(null);
    setTimerTargetExercise(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const getDayCompletion = (day: typeof activeDay) => {
    if (day.type === 'rest') return 100;
    const exercises = day.exercises || [];
    if (exercises.length === 0) return 100;
    const completed = exercises.filter(ex => completedExercises[ex.id]).length;
    return Math.round((completed / exercises.length) * 100);
  };

  const isCompletedAllExercises = (day: typeof activeDay) => {
    if (day.type === 'rest') return true;
    const exercises = day.exercises || [];
    return exercises.length > 0 && exercises.every(ex => completedExercises[ex.id]);
  };

  // Adaptive Theme Variables
  const primaryAccent = isDark ? '#CCFF00' : '#84CC16';
  const textAccentClass = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const textMutedAccentClass = isDark ? 'text-emerald-400' : 'text-emerald-600';
  const bgAccentClass = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  const borderAccentClass = isDark ? 'border-[#CCFF00]' : 'border-[#84CC16]';
  const bgAccentOpacityClass = isDark ? 'bg-[#CCFF00]/10' : 'bg-[#84CC16]/10';
  const bgAccentMutedOpacityClass = isDark ? 'bg-[#CCFF00]/5' : 'bg-[#84CC16]/5';
  const borderAccentMutedClass = isDark ? 'border-[#CCFF00]/25' : 'border-[#84CC16]/25';

  const textPrimaryClass = isDark ? 'text-white' : 'text-[#0F172A]';
  const textHeaderClass = isDark ? 'text-zinc-100' : 'text-[#0F172A]';
  const textSubLabelClass = isDark ? 'text-zinc-550' : 'text-zinc-400';
  const textMutedClass = isDark ? 'text-zinc-400' : 'text-slate-650';
  const textBoldMutedClass = isDark ? 'text-zinc-300' : 'text-slate-800';

  const cardBgClass = isDark ? 'bg-[#111111]/90 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-sm';
  const layoutBgClass = isDark ? 'bg-zinc-950/80 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-sm';
  const itemCardBgClass = isDark ? 'bg-black/45 border border-white/5' : 'bg-zinc-50 border border-[#E2E8F0]';
  const tabBgClass = isDark ? 'bg-[#111111]/80 border border-white/5' : 'bg-white border border-[#E2E8F0]';

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in pb-16 relative z-10" id="ultimate-dashboard-hub">
      
      {/* 1. TOP PRINT & PROFILE CALIBRATION UTILITY CONTROLS (print-hidden) */}
      <div className={`${layoutBgClass} py-3 px-4 rounded-xl shadow-lg no-print print-hidden backdrop-blur-md flex items-center justify-between transition-colors`}>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${bgAccentClass} animate-pulse shadow-[0_0_8px_${primaryAccent}]`}></span>
          <span className={`text-[10px] font-mono tracking-widest ${textMutedClass} uppercase font-black`}>
            {isEn ? '360° HYBRID COHORT OPERATIONAL' : 'MATRIKS PERSONAL 360° AKTIF'}
          </span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            type="button"
            className={`px-3.5 py-1.5 rounded text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDark 
                ? 'bg-zinc-900 hover:bg-zinc-800 border-white/5 hover:border-[#CCFF00] text-[#CCFF00]' 
                : 'bg-zinc-100 border-zinc-250 text-[#84CC16] hover:bg-zinc-200'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isEn ? 'Print (PDF)' : 'Unduh PDF'}</span>
          </button>
          
          <button
            onClick={onReset}
            type="button"
            className={`px-3.5 py-1.5 rounded text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDark 
                ? 'bg-zinc-950 hover:bg-red-500/10 border-white/5 hover:border-red-500/40 text-zinc-400 hover:text-red-400' 
                : 'bg-zinc-100 border-zinc-250 text-slate-500 hover:text-red-650 hover:bg-red-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Recalibrate Profile' : 'Mulai Ulang'}</span>
          </button>
        </div>
      </div>

      {/* 2. EMBOSSED DIAGNOSTIC OVERVIEW BLOCK (Always visible at top of dashboard) */}
      <div className={`${cardBgClass} rounded-xl p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm transition-colors`} id="dashboard-evaluation-block">
        <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#CCFF00]/5' : 'bg-[#84CC16]/5'
        }`}></div>

        {/* Diagonal elements */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDark ? 'border-[#CCFF00]/40' : 'border-[#84CC16]/30'}`}></div>
        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/40' : 'border-[#84CC16]/30'}`}></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-light-dark w-full pb-4 border-[#E2E8F0] dark:border-white/10">
          <div>
            <h2 className={`font-display font-black italic text-lg tracking-tight uppercase flex items-center gap-2 ${textPrimaryClass}`}>
              <ShieldCheck className={`w-5 h-5 ${textAccentClass} animate-pulse`} />
              {isEn ? 'PHYSIOLOGICAL DIAGNOSTIC VERDICT' : 'HASIL DIAGNOSIS FISIOLOGIS'}
            </h2>
            <p className={`text-[10px] font-mono mt-0.5 uppercase tracking-wider ${textSubLabelClass}`}>
              360° HYBRID COMPOSITION EVALUATION & COHORT OVERLOAD CLASSIFICATION
            </p>
          </div>
          <div className={`px-3.5 py-1.5 rounded border text-[10.5px] font-mono font-black tracking-widest uppercase text-center self-start sm:self-auto shadow-sm ${
            program.diagnostic.badgeColor || (isDark ? 'border-[#CCFF00]/45 text-[#CCFF00] bg-[#CCFF00]/10' : 'border-[#84CC16]/45 text-[#84CC16] bg-[#84CC16]/10')
          }`}>
            {program.diagnostic.label || 'METRIC OVERRIDE ENGAGED'}
          </div>
        </div>

        {/* Somatic indices cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className={`${itemCardBgClass} rounded-lg p-4 flex flex-col justify-between`}>
            <span className={`text-[8.5px] font-mono uppercase tracking-widest font-black block ${textSubLabelClass}`}>BMI Index</span>
            <div className={`font-display font-black text-3xl my-1 ${textPrimaryClass}`}>{program.diagnostic.bmi.toFixed(2)}</div>
            <span className={`text-[9px] font-mono ${textMutedClass} capitalize`}>{isEn ? 'Body Density ratio' : 'Rasio Massa Tubuh'}</span>
          </div>
          <div className={`${isDark ? 'bg-black/45 border border-[#CCFF00]/15' : 'bg-zinc-50 border border-[#84CC16]/25'} rounded-lg p-4 flex flex-col justify-between transition-colors`}>
            <span className={`text-[8.5px] font-mono uppercase tracking-widest font-black block ${textAccentClass}`}>Fat-Free Mass Index</span>
            <div className={`font-display font-black text-3xl my-1 ${textAccentClass}`}>{program.diagnostic.ffmi.toFixed(2)}</div>
            <span className={`text-[9px] font-mono ${textMutedAccentClass} capitalize`}>{isEn ? 'Myofibrillar Tissue' : 'Kepadatan Jaringan Otot'}</span>
          </div>
          <div className={`${itemCardBgClass} rounded-lg p-4 flex flex-col justify-between`}>
            <span className={`text-[8.5px] font-mono uppercase tracking-widest font-black block ${textSubLabelClass}`}>U.S. Navy Body Fat</span>
            <div className={`font-display font-black text-3xl my-1 ${textPrimaryClass}`}>{program.diagnostic.bodyFat?.toFixed(1)}%</div>
            <span className={`text-[9px] font-mono ${textMutedClass} capitalize`}>{isEn ? 'Adipose Storage' : 'Gugusan Cadangan Adiposa'}</span>
          </div>
        </div>

        {/* Narrative & Expert Advice Quote */}
        <div className={`p-4 rounded-lg flex flex-col gap-2.5 mt-4 border ${isDark ? 'bg-black/35 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
          <h3 className={`text-[9.5px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 leading-none ${textAccentClass}`}>
            <Zap className={`w-3.5 h-3.5 ${textAccentClass}`} />
            {isEn ? 'SYSTEM PHYSIOLOGICAL OVERIDDEN RATIO' : 'RASIO PENILAIAN MEKANISME COHORT'}
          </h3>
          <p className={`text-xs leading-relaxed font-sans font-semibold uppercase ${textBoldMutedClass}`}>
            {program.diagnostic.description}
          </p>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 text-xs font-mono border-t pt-3 ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
            <div>
              <span className={`block uppercase text-[8.5px] tracking-wider font-extrabold ${textSubLabelClass}`}>{isEn ? 'TRAINING PROTOCOL INTENSITY:' : 'INTENSITAS JALUR AMBANG:'}</span>
              <span className={`font-bold ${textPrimaryClass}`}>{program.diagnostic.intensityLevel}</span>
            </div>
            <div>
              <span className={`block uppercase text-[8.5px] tracking-wider font-extrabold ${textSubLabelClass}`}>{isEn ? 'CNS ADAPTATION SCORE:' : 'AMBANG CNS FATIGUE:'}</span>
              <span className={`font-bold ${textAccentClass}`}>{program.diagnostic.cnsRecoveryFactor}</span>
            </div>
          </div>
        </div>

        {/* Coach Voice Banner */}
        <div className={`p-4 rounded-r-lg flex gap-3 mt-4 border-l-2 ${
          isDark ? 'bg-[#CCFF00]/[0.01] border-l-[#CCFF00]' : 'bg-[#84CC16]/[0.01] border-l-[#84CC16]'
        }`}>
          <div className={`${textAccentClass} shrink-0 self-start`}>
            <MessageSquare className="w-4.5 h-4.5 opacity-90 animate-pulse" />
          </div>
          <div>
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mb-0.5 ${textAccentClass}`}>
              {isEn ? 'CPT & DIET MATRICES EXPERT VERDICT' : 'RANGKUMAN TIM KEAHLIAN LATIHAN'}
            </span>
            <p className={`text-xs leading-relaxed italic ${textBoldMutedClass}`}>
              "{program.diagnostic.coachesVerdict}"
            </p>
          </div>
        </div>
      </div>

      {/* 3. 7 DAY TAB CAROUSEL ROW */}
      <div className={`${tabBgClass} p-2 rounded-xl no-print print-hidden backdrop-blur-sm transition-colors`}>
        <div className="grid grid-cols-7 gap-1" id="day-tabs-navigation">
          {program.schedule.map((day, idx) => {
            const isActive = idx === activeDayIndex;
            const completion = getDayCompletion(day);
            const isRest = day.type === 'rest';

            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveDayIndex(idx);
                  if (!timerActive) stopTimer();
                }}
                className={`py-3 px-1 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer rounded-lg relative ${
                  isActive
                    ? (isDark 
                        ? 'bg-[#CCFF00] text-black font-extrabold shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                        : 'bg-[#84CC16] text-white font-extrabold shadow-sm')
                    : (isDark 
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                        : 'text-slate-650 hover:text-slate-900 hover:bg-zinc-100')
                }`}
              >
                <span className="text-[9px] uppercase font-mono tracking-widest font-black">
                  {isEn ? `Day ${day.day}` : `Hari ${day.day}`}
                </span>
                
                {isRest ? (
                  <span className={`text-[7.5px] font-mono leading-none mt-1 opacity-80 font-black uppercase ${
                    isActive ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-emerald-400' : 'text-emerald-600')
                  }`}>
                    {isEn ? 'RECOV' : 'RECOVERY'}
                  </span>
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full mt-1.5 ${
                    isActive 
                      ? (isDark ? 'bg-black' : 'bg-white') 
                      : (completion === 100 
                          ? (isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]') 
                          : completion > 0 ? 'bg-amber-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200'))
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. THE CORE 3-GRID COMPREHENSIVE HUB LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full max-w-7xl mx-auto" id="grid-layout-hub">
        
        {/* GRID UNIT 1: CPT WORKOUT TRACKER (lg:col-span-12 or 7 depending on balance) */}
        <div className={`${cardBgClass} lg:col-span-2 rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-sm transition-colors`} id="section-workout-panel">
          <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-t border-l ${isDark ? 'border-[#CCFF00]/40' : 'border-[#84CC16]/30'}`}></div>
          
          <div className="border-b border-light-dark pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-[#E2E8F0] dark:border-white/10">
            <div>
              <h3 className={`font-display font-black text-base uppercase tracking-tight flex items-center gap-2 ${textHeaderClass}`}>
                <Dumbbell className={`w-5 h-5 ${textAccentClass}`} />
                {isEn ? `DAY ${activeDay.day} WORKOUT SPLIT` : `HARI ${activeDay.day} WORKOUT SPLIT`}
              </h3>
              <p className={`text-[9.5px] font-mono uppercase tracking-wider mt-0.5 ${textSubLabelClass}`}>
                {activeDay.title}
              </p>
            </div>
            
            {/* Completion Badge */}
            {activeDay.type !== 'rest' && (
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider self-start sm:self-auto ${
                isCompletedAllExercises(activeDay)
                  ? (isDark ? 'bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00]' : 'bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16]')
                  : (isDark ? 'bg-zinc-950 border border-white/5 text-zinc-500' : 'bg-zinc-50 border border-zinc-200 text-zinc-400')
              }`}>
                {getDayCompletion(activeDay)}% {isEn ? 'CLEARED' : 'SELESAI'}
              </span>
            )}
          </div>

          {activeDay.type === 'rest' ? (
            <div className={`py-12 flex flex-col items-center justify-center text-center gap-4 border border-dashed rounded-lg ${
              isDark ? 'border-white/5 bg-black/10' : 'border-zinc-200 bg-zinc-50/50'
            }`}>
              <div className={`p-3 rounded-full border ${isDark ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-emerald-50 border-emerald-250 text-emerald-600'}`}>
                <Moon className={`w-8 h-8 animate-pulse ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className={`text-xs font-mono uppercase tracking-widest font-black leading-none ${textAccentClass}`}>
                  {isEn ? 'CNS ADAPTATION REST DAY' : 'FASA RECOVERY SISTEM SARAF PUSAT'}
                </p>
                <p className="text-[10px] max-w-xs leading-relaxed uppercase mt-1.5 font-bold text-zinc-500 dark:text-zinc-500">
                  {isEn 
                    ? "Target zero spinal load lifts today. Muscle development happens during sleep repair, not during active heavy concentric stress."
                    : "Hindari latihan angkat berat hari ini. Pemulihan serat otot terjadi selama fase delta-wave kalsium, bukan di bawah beban besi."}
                </p>
              </div>

              {activeDay.sportsIntegration && (
                <div className={`mt-4 max-w-sm p-3.5 rounded border ${isDark ? 'bg-black/35 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <span className={`text-[8.5px] font-mono uppercase tracking-widest font-extrabold block ${textSubLabelClass}`}>Sports Integration Note</span>
                  <p className={`text-xs font-semibold mt-1 uppercase font-mono ${textBoldMutedClass}`}>{activeDay.sportsIntegration}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Rest Timer display (print-hidden) */}
              {timerActive && timerSecondsLeft !== null && (
                <div className={`p-3 rounded-lg flex items-center justify-between no-print print-hidden animate-pulse border ${
                  isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/25 text-white' : 'bg-[#84CC16]/10 border-[#84CC16]/35 text-[#0F172A]'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 animate-spin-slow ${textAccentClass}`} />
                    <span className="text-[10px] font-mono tracking-wider font-extrabold">
                      {isEn ? 'HIT REST MATRIX COUNTDOWN:' : 'SISA WAKTU RECOVERY REST:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-sm font-black font-mono ${textAccentClass}`}>
                      {Math.floor(timerSecondsLeft / 60)}:{(timerSecondsLeft % 60).toString().padStart(2, '0')}
                    </span>
                    <button 
                      onClick={stopTimer} 
                      className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase rounded cursor-pointer border ${
                        isDark ? 'bg-black text-[#CCFF00] border-white/5' : 'bg-white text-[#84CC16] border-zinc-200'
                      }`}
                    >
                      {isEn ? 'SKIP' : 'LEWATI'}
                    </button>
                  </div>
                </div>
              )}

              {/* Exercises List Card matrix */}
              <div className="space-y-3.5" id="exercises-list-block">
                {(activeDay.exercises || []).map((ex) => {
                  const isDone = !!completedExercises[ex.id];
                  const isTiming = timerTargetExercise === ex.id;

                  return (
                    <div 
                      key={ex.id} 
                      className={`p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isDone 
                          ? (isDark ? 'border-[#CCFF00]/20 bg-[#CCFF00]/[0.01]' : 'border-[#84CC16]/25 bg-[#84CC16]/[0.02]') 
                          : (isDark ? 'bg-black/45 border-white/5 hover:border-white/10' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Checkmark custom trigger */}
                          <button
                            type="button"
                            onClick={() => onToggleExercise(ex.id)}
                            className={`h-5 w-5 rounded border tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                              isDone 
                                ? (isDark 
                                    ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_8px_rgba(204,255,0,0.3)]' 
                                    : 'bg-[#84CC16] border-[#84CC16] text-white') 
                                : (isDark ? 'bg-black border-white/15 text-transparent hover:border-[#CCFF00]' : 'bg-zinc-50 border-zinc-250 text-transparent hover:border-[#84CC16]')
                            }`}
                          >
                            <span className="text-2xs font-bold">✓</span>
                          </button>
                          
                          <div>
                            <span className={`text-[12.5px] font-display font-black leading-tight uppercase transition-all ${
                              isDone ? 'text-zinc-500 dark:text-zinc-650 line-through' : textPrimaryClass
                            }`}>
                              {ex.name}
                            </span>
                            
                            <div className={`flex items-center gap-2.5 mt-1 font-mono text-[9px] ${textSubLabelClass}`}>
                              <span className="font-extrabold uppercase">{ex.sets} {isEn ? 'HIT SETS' : 'SET KE GAGAL'}</span>
                              <span className="h-1 w-1 bg-zinc-400 dark:bg-zinc-700 rounded-full"></span>
                              <span className={`${textMutedAccentClass} font-extrabold uppercase`}>{ex.reps}</span>
                              <span className="h-1 w-1 bg-zinc-400 dark:bg-zinc-700 rounded-full"></span>
                              <span className="uppercase font-extrabold">{ex.rest} Rest</span>
                            </div>
                          </div>
                        </div>

                        {/* Rest Timer start trigger */}
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => startRestTimer(ex.rest, ex.id)}
                            className={`px-2 py-1 border rounded text-[8px] font-mono tracking-wider transition-all no-print print-hidden cursor-pointer ${
                              isTiming 
                                ? (isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16]') 
                                : (isDark ? 'bg-black/35 border-white/10 text-zinc-500 hover:text-[#CCFF00] hover:border-[#CCFF00]' : 'bg-zinc-100 border-zinc-250 text-slate-550 hover:text-[#84CC16] hover:border-[#84CC16]')
                            }`}
                          >
                            ⏱ {isEn ? 'TIMER' : 'METER'}
                          </button>
                        )}
                      </div>

                      {/* Coaching cue paragraph */}
                      {ex.coachingCue && (
                        <p className={`text-[11px] leading-relaxed pl-8 ${isDone ? 'text-zinc-500 dark:text-zinc-600 font-normal' : 'font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'}`}>
                          <span className={`text-[9.5px] font-mono mr-1.5 font-black uppercase tracking-wider ${textAccentClass}`}>CUE:</span>
                          {ex.coachingCue}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sports integration inline feedback */}
              {activeDay.sportsIntegration && (
                <div className={`p-3.5 rounded border ${isDark ? 'bg-black/35 border-[#CCFF00]/10' : 'bg-zinc-50 border-zinc-200'}`}>
                  <span className={`text-[8.5px] font-mono uppercase tracking-widest font-extrabold block ${textSubLabelClass}`}>Day Sports Co-Ordination</span>
                  <p className={`text-xs font-semibold mt-1 leading-normal uppercase font-mono ${textBoldMutedClass}`}>{activeDay.sportsIntegration}</p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR LAYOUTS (Flavorful nutrition and lifestyle matrix) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* GRID UNIT 2: FLAVORFUL NUTRITION PLAN */}
          <div className={`${cardBgClass} rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm transition-colors`} id="section-diet-panel">
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/40' : 'border-[#84CC16]/30'}`}></div>
            
            <div className="border-b border-light-dark pb-3 border-[#E2E8F0] dark:border-white/10">
              <h3 className={`font-display font-black text-base uppercase tracking-tight flex items-center gap-2 ${textHeaderClass}`}>
                <Utensils className={`w-5 h-5 ${textAccentClass}`} />
                {isEn ? 'NON-BORING DIET PLAN' : 'MATRIKS NUTRISI NIKMAT'}
              </h3>
              <p className={`text-[9.5px] font-mono uppercase tracking-wider mt-0.5 ${textSubLabelClass}`}>
                Theme: "{activeDay.dietPlan?.theme || 'Your diet should not be boring'}"
              </p>
            </div>

            <div className="space-y-4">
              {/* Daily Cal/Macros Summary panel */}
              <div className={`p-4 rounded-lg flex flex-col gap-1 text-center border ${borderAccentMutedClass} ${bgAccentMutedOpacityClass}`}>
                <span className={`text-[8.5px] font-mono uppercase tracking-widest font-black block ${textSubLabelClass}`}>DAILY TOTAL NUTRITION ENERGY TARGET</span>
                <span className={`font-mono font-black text-sm uppercase tracking-wide ${textAccentClass}`}>
                  {activeDay.dietPlan?.dailySummary || 'Calibrated calorie allocations'}
                </span>
              </div>

              {/* Meals cards */}
              <div className="space-y-3.5">
                {(activeDay.dietPlan?.meals || []).map((meal, mIdx) => (
                  <div key={mIdx} className={`${itemCardBgClass} p-4 rounded-lg space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase tracking-widest font-black block ${textSubLabelClass}`}>{meal.name}</span>
                      <span className={`font-mono text-[9px] px-2 py-0.5 border rounded font-black uppercase ${
                        isDark ? 'text-[#CCFF00] bg-[#CCFF00]/5 border-[#CCFF00]/10' : 'text-[#84CC16] bg-[#84CC16]/5 border-[#84CC16]/10'
                      }`}>
                        {meal.macros}
                      </span>
                    </div>
                    
                    <p className={`text-xs font-sans font-semibold uppercase leading-normal ${textPrimaryClass}`}>
                      {meal.recipe}
                    </p>

                    {meal.tip && (
                      <div className={`text-[10px] bg-white/[0.02] border-l-2 pl-2 py-0.5 leading-normal font-sans ${
                        isDark ? 'border-[#CCFF00] text-zinc-400' : 'border-[#84CC16] text-zinc-600 bg-[#84CC16]/5'
                      }`}>
                        <span className={`text-[9px] font-mono font-black uppercase block tracking-wider ${textAccentClass}`}>Chef Tip:</span>
                        {meal.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GRID UNIT 3: LIFESTYLE & SLEEP MATRIX */}
          <div className={`${cardBgClass} rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm transition-colors`} id="section-lifestyle-panel">
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${isDark ? 'border-[#CCFF00]/40' : 'border-[#84CC16]/30'}`}></div>

            <div className="border-b border-light-dark pb-3 border-[#E2E8F0] dark:border-white/10">
              <h3 className={`font-display font-black text-base uppercase tracking-tight flex items-center gap-1.5 ${textHeaderClass}`}>
                <Moon className={`w-5 h-5 ${textAccentClass}`} />
                {isEn ? 'SUPPLEMENT & SLEEP MATRIX' : 'MATRIKS SUPLEMEN & REM-TIDUR'}
              </h3>
              <p className={`text-[9.5px] font-mono uppercase tracking-wider mt-0.5 ${textSubLabelClass}`}>
                DAILY TIMINGS & CIRCADIAN CALIBRATIONS
              </p>
            </div>

            <div className="space-y-4">
              {/* Supplements Timings Card */}
              <div className={`p-4 rounded-lg space-y-2.5 transition-all border ${
                isDark ? 'bg-zinc-950 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
              }`}>
                <span className={`text-[9px] font-mono uppercase tracking-widest font-black flex items-center gap-1.5 ${textAccentClass}`}>
                  <Coffee className="w-3.5 h-3.5" />
                  {isEn ? 'SUPPLEMENT TIMINGS stack' : 'SINKRONISASI JADWAL SUPLEMEN'}
                </span>
                <p className={`text-xs leading-relaxed font-sans font-semibold uppercase ${textBoldMutedClass}`}>
                  {activeDay.lifestyleProtocol?.supplementTimings || 'Dosing scheduled.'}
                </p>
              </div>

              {/* Circadian/Sleep/Caffeine blackout Card */}
              <div className={`p-4 rounded-lg space-y-2.5 transition-all border ${
                  isDark ? 'bg-zinc-950 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
              }`}>
                <span className={`text-[9px] font-mono uppercase tracking-widest font-black flex items-center gap-1.5 ${textMutedAccentClass}`}>
                  <Moon className="w-3.5 h-3.5" />
                  {isEn ? 'CIRCADIAN CLOCK & SLEEP BLOCKING' : 'SIRKADIAN TIDUR GELAP GULITA'}
                </span>
                <p className={`text-xs leading-relaxed font-sans font-semibold uppercase ${textBoldMutedClass}`}>
                  {activeDay.lifestyleProtocol?.circadianSleepBlocks || 'Delta sleep schedule mapped.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Styled inline style injection specifically for clean printer outputs */}
      <style>{`
        @media print {
          /* Page sizes styling */
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          
          /* Hide interactive inputs/buttons completely */
          .no-print,
          button,
          #header-controls,
          .print-hidden,
          #page-navigation,
          #day-tabs-navigation,
          .floating-edit {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Theme adjustments for white background paper */
          body, html, #root, #ultimate-dashboard-hub {
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
          }

          /* Eliminate dark borders/shadows */
          div, section, p, span, h1, h2, h3 {
            color: #111111 !important;
            background: transparent !important;
            border-color: #dddddd !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }

          /* Keep specific colors to outline badges nicely on print */
          .bg-emerald-500\\/10,
          .bg-\\[\\#CCFF00\\]\\/10 {
            background-color: #f0f7f4 !important;
            border: 1px solid #cccccc !important;
          }

          /* Split sections cleanly on paper rules */
          #dashboard-evaluation-block {
            page-break-after: always;
            border: 2px solid #222222 !important;
            margin-bottom: 2cm;
          }

          #grid-layout-hub {
            display: block !important;
          }

          #section-workout-panel,
          #section-diet-panel,
          #section-lifestyle-panel {
            page-break-inside: avoid;
            page-break-after: auto;
            margin-bottom: 1.5cm;
            border: 1px solid #cccccc !important;
            padding: 1.5cm !important;
          }
        }
      `}</style>
    </div>
  );
}
