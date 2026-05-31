/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { WorkoutDay, Exercise, UserMetrics } from '../types';
import { Play, Square, CheckCircle, Clock, Volume2, Moon, Sliders, Footprints, Flame, Trophy, BatteryCharging, Heart, Apple, Coffee, Sparkles, MessageSquare, AlertTriangle, ShieldCheck, Dumbbell } from 'lucide-react';

interface WorkoutScheduleViewProps {
  schedule: WorkoutDay[];
  metrics: UserMetrics;
  completedExercises: Record<string, boolean>;
  onToggleExercise: (id: string) => void;
  greeting?: string;
}

export default function WorkoutScheduleView({
  schedule,
  metrics,
  completedExercises,
  onToggleExercise,
  greeting
}: WorkoutScheduleViewProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Rest Timer State
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerInitial, setTimerInitial] = useState<number>(90);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerTargetExercise, setTimerTargetExercise] = useState<string | null>(null);

  const activeDay = schedule[activeDayIndex] || schedule[0];

  // Rest Timer ticking logic
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

  // Start rest timer
  const startRestTimer = (secondsStr: string, exerciseId: string) => {
    let secondsVal = 90;
    if (secondsStr.includes('180') || secondsStr.toLowerCase().includes('3 min')) {
      secondsVal = 180;
    } else if (secondsStr.includes('120') || secondsStr.toLowerCase().includes('2 min')) {
      secondsVal = 120;
    } else if (secondsStr.includes('60')) {
      secondsVal = 60;
    } else if (secondsStr.includes('75')) {
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

  // Calculate day completion percentage
  const getDayCompletion = (day: WorkoutDay) => {
    if (day.type === 'rest') return 100;
    const total = day.exercises?.length || 0;
    if (total === 0) return 100;
    const completed = day.exercises.filter(ex => completedExercises[ex.id]).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="flex flex-col gap-6" id="schedule-display-root">
      
      {/* 1. Expert AI Panel Greeting Cover Banner */}
      {greeting && (
        <div className="bg-zinc-950/40 border border-white/5 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm animate-fade-in-down">
          {/* Subtle lime mesh backdrop */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#CCFF00]/5 rounded-full blur-3xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-[#CCFF00]/10 text-[#CCFF00] rounded-lg shrink-0 border border-[#CCFF00]/25 mt-0.5 animate-pulse">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-[#CCFF00] tracking-widest uppercase block mb-1.5">
                AI Coaching Panel Welcoming Address
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed font-sans mt-1">
                {greeting}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Workout Matrix Hub Container */}
      <div className="bg-[#111111]/90 border border-white/5 rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden backdrop-blur-sm" id="schedule-block-panel">
        
        {/* Neon corner indicators */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#CCFF00]/40"></div>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#CCFF00]/40"></div>
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#CCFF00]/40"></div>
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#CCFF00]/40"></div>

        {/* Schedule Header area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 w-full pb-4 gap-4">
          <div>
            <h2 className="font-display font-black italic text-lg text-white tracking-tight uppercase flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#CCFF00] animate-pulse" />
              7-Day 360° Exercise & Lifestyle Matrix
            </h2>
            <p className="text-[9.5px] text-zinc-550 font-mono tracking-wider uppercase mt-1">
              PRO-ACTIVE INTERROGATION ROTATOR // CALCULATOR CALIBRATED VIA METRIC CONGRUENCE
            </p>
          </div>
          
          {/* Progress summary for overall 7 days */}
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 py-1.5 px-3 rounded-md text-xs font-mono self-start md:self-auto">
            <span className="text-zinc-500 text-[8.5px] uppercase tracking-wider font-bold">LIFTS STATUS:</span>
            <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden flex">
              {schedule.map((day, idx) => {
                if (day.type === 'rest') return null;
                const hasCompletedAll = getDayCompletion(day) === 100;
                return (
                  <div
                    key={idx}
                    className={`h-full flex-grow border-r border-black/80 transition-all duration-300 ${
                      hasCompletedAll ? 'bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]' : 'bg-zinc-800'
                    }`}
                    title={`Day ${day.day}: ${getDayCompletion(day)}% cleared`}
                  />
                );
              })}
            </div>
            <span className="text-[#CCFF00] font-black text-[11px] uppercase tracking-wider">
              {schedule.filter(day => day.type !== 'rest' && getDayCompletion(day) === 100).length} / {schedule.filter(day => day.type !== 'rest').length} CLEARED
            </span>
          </div>
        </div>

        {/* 7 Day Tabs Carousel Row */}
        <div className="grid grid-cols-7 border border-white/10 rounded-lg overflow-hidden bg-black/40 shadow-inner">
          {schedule.map((day, idx) => {
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
                className={`py-3 md:py-4 px-0.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer border-r last:border-r-0 border-white/5 relative ${
                  isActive
                    ? 'bg-[#CCFF00]/10 text-[#CCFF00] font-extrabold border-b-2 border-b-[#CCFF00] shadow-[inset_0_1px_3px_rgba(204,255,0,0.05)]'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span className="text-[10px] uppercase font-mono tracking-widest font-black">Day {day.day}</span>
                {isRest ? (
                  <span className="text-[7.5px] font-mono leading-none mt-1 opacity-70 text-zinc-500 font-bold uppercase">RECOV</span>
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full mt-1.5 ${completion === 100 ? 'bg-[#CCFF00] shadow-[0_0_6px_#CCFF00]' : completion > 0 ? 'bg-amber-400 animate-pulse' : 'bg-zinc-800'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Active Day Information display */}
        <div className="flex flex-col gap-6 mt-1.5 transition-all">
          
          {/* Day Header Summary Card */}
          <div className="bg-black/35 border border-white/5 rounded-xl p-4 md:p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#CCFF00]/5 rounded-full blur-2xl"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <h3 className="font-display font-black text-white text-base uppercase tracking-tight flex items-center gap-2">
                <span className="text-black text-[9.5px] font-mono px-2 py-0.5 bg-[#CCFF00] rounded font-black uppercase tracking-wider">
                  STAGE {activeDay.day}
                </span>
                {activeDay.title ? (activeDay.title.includes(':') ? activeDay.title.split(': ')[1] : activeDay.title) : 'Active Training Block'}
              </h3>
              {activeDay.type === 'rest' ? (
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                  <BatteryCharging className="w-3.5 h-3.5" /> REST HYGIENE MODE
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCFF00] font-extrabold flex items-center gap-1.5 bg-[#CCFF00]/5 border border-[#CCFF00]/10 px-2 py-0.5 rounded">
                  <Flame className="w-3.5 h-3.5 text-[#CCFF00]" /> METABOLIC DENSE FAILURE set
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-3 font-sans leading-relaxed border-t border-white/5 pt-3 font-medium">
              {activeDay.focus || 'Rest physical matrix and fully reconstruct nervous indices today.'}
            </p>
          </div>

          {/* Rest Timer Hud panel */}
          {timerSecondsLeft !== null && timerTargetExercise && (
            <div className="bg-gradient-to-r from-zinc-950 via-[#CCFF00]/5 to-zinc-950 border border-[#CCFF00]/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in relative overflow-hidden">
              <div className="relative flex items-center gap-3 z-10">
                <div className="p-2 bg-[#CCFF00]/10 rounded-lg animate-pulse text-[#CCFF00] border border-[#CCFF00]/20">
                  <Clock className="stroke-[2.5] w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9.5px] font-mono text-[#CCFF00] font-bold tracking-widest uppercase block">
                    NEURONAL CNS RECOVERY RESUME ACTIVE
                  </span>
                  <span className="text-xs text-zinc-400 font-sans line-clamp-1">
                    Calibrating rest set for: <span className="text-white font-bold font-mono text-[11px]">{activeDay.exercises?.find(e => e.id === timerTargetExercise)?.name || 'Next Set'}</span>
                  </span>
                </div>
              </div>

              {/* Count Display */}
              <div className="relative flex items-center gap-4.5 z-10">
                <div className="font-mono text-3xl font-black text-white px-3.5 py-1 bg-black/60 rounded border border-white/10 flex items-baseline gap-1 shadow-inner">
                  <span className={timerSecondsLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[#CCFF00]'}>
                    {timerSecondsLeft}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">SEC</span>
                </div>

                {timerSecondsLeft > 0 ? (
                  <button
                    onClick={stopTimer}
                    className="px-3 py-1.5 bg-white/5 hover:bg-[#CCFF00]/10 border border-white/5 hover:border-[#CCFF00]/20 rounded text-[9px] font-mono font-black tracking-widest uppercase transition-all text-zinc-400 hover:text-[#CCFF00] cursor-pointer flex items-center gap-1"
                  >
                    <Square className="w-3 h-3 fill-current" /> SKIP
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono text-emerald-400 font-black tracking-widest animate-bounce">
                      CNS FULLY RESTORED!
                    </span>
                    <button
                      onClick={stopTimer}
                      className="mt-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded text-[9px] font-mono font-black uppercase cursor-pointer"
                    >
                      READY TO LOAD SET
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE WORKOUT LIST SECTION */}
          {activeDay.type === 'lift' ? (
            <div className="flex flex-col gap-3.5">
              <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1 font-black">
                A. PRESCRIBED JM/MENTZER HIT WORKOUT STRATA
              </h4>
              
              {(!activeDay.exercises || activeDay.exercises.length === 0) ? (
                <p className="text-xs font-mono text-zinc-500 italic p-4 text-center border border-white/5 rounded-lg bg-black/40 uppercase">Awaiting target indices for workout schedule.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeDay.exercises.map((exercise) => {
                    const isCompleted = !!completedExercises[exercise.id];
                    const isTimerActiveForThis = timerTargetExercise === exercise.id && timerActive;

                    return (
                      <div
                        key={exercise.id}
                        className={`border rounded-xl p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                          isCompleted
                            ? 'bg-zinc-950/20 border-white/5 opacity-55'
                            : isTimerActiveForThis
                            ? 'bg-[#CCFF00]/[0.02] border-[#CCFF00]/40 shadow-[0_0_15px_rgba(204,255,0,0.08)]'
                            : 'bg-black/35 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {isTimerActiveForThis && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#CCFF00] animate-pulse"></div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => onToggleExercise(exercise.id)}
                              className="mt-0.5 shrink-0 hover:scale-110 text-zinc-650 hover:text-[#CCFF00] transition-transform cursor-pointer"
                              type="button"
                            >
                              <CheckCircle
                                className={`w-5 h-5 ${
                                  isCompleted ? 'text-[#CCFF00] fill-[#CCFF00]/10' : 'text-zinc-850'
                                }`}
                              />
                            </button>
                            <div>
                              <h5 className={`font-display font-bold text-sm tracking-tight text-white uppercase ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
                                {exercise.name}
                              </h5>
                              <p className="text-[11.5px] text-zinc-400 mt-1 font-sans leading-relaxed italic">
                                "{exercise.coachingCue}"
                              </p>
                            </div>
                          </div>

                          {/* Stat trackers */}
                          <div className="flex flex-wrap items-center sm:self-center gap-2 font-mono">
                            <div className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9.5px] text-zinc-350 flex flex-col items-center">
                              <span className="text-[7.5px] text-zinc-550 uppercase leading-none font-bold">Lifts Target</span>
                              <span className="font-black text-[11px] text-[#CCFF00] mt-0.5">{exercise.sets} WORKING SET</span>
                            </div>

                            <div className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9.5px] text-zinc-350 flex flex-col items-center">
                              <span className="text-[7.5px] text-zinc-550 uppercase leading-none font-bold">Reps Threshold</span>
                              <span className="font-extrabold text-[11px] text-white mt-0.5 uppercase">{exercise.reps}</span>
                            </div>

                            <button
                              onClick={() => startRestTimer(exercise.rest, exercise.id)}
                              className={`px-3 py-1.5 border rounded text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 leading-none ${
                                isCompleted
                                  ? 'bg-black/40 border-white/5 text-zinc-700 cursor-not-allowed'
                                  : isTimerActiveForThis
                                  ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00]'
                                  : 'bg-black/60 hover:bg-[#CCFF00]/10 border-white/15 text-zinc-400 hover:text-[#CCFF00] hover:border-[#CCFF00]/50'
                              }`}
                              disabled={isCompleted}
                              type="button"
                            >
                              <span className="text-[7px] text-zinc-550 uppercase leading-none font-black font-mono">Rest Trigger</span>
                              <span className="text-[10px] font-black mt-0.5 flex items-center gap-1 uppercase">
                                <Clock className="w-2.5 h-2.5 text-[#CCFF00]" /> {exercise.rest.replace(' Mandatory rest', '').replace(' seconds', 's')}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // PASSIVE RECOVERY INFO
            <div className="flex flex-col gap-4 animate-fade-in">
              <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1 font-black">
                A. MANDATORY CELLULAR DEEPMIND RECONSTITUTION LAB
              </h4>

              {activeDay.passiveRecoveryGuidelines && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sleep */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-y-3 translate-x-3">
                      <Moon className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#CCFF00]/10 text-[#CCFF00] rounded border border-[#CCFF00]/20">
                        <Moon className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <span className="font-display font-bold text-xs text-white uppercase tracking-wider">Circadian Reconstitution</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-zinc-550 uppercase block mb-1">Target Hours:</span>
                      <span className="text-[9.5px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/25 px-2 py-0.5 rounded uppercase">
                        {activeDay.passiveRecoveryGuidelines.sleep?.split(': ')[1]?.split('. ')[0] || 'Circadian Sleep Block'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-semibold">
                      {activeDay.passiveRecoveryGuidelines.sleep?.split('. ').slice(1).join('. ') || 'Prioritize dark room protocols to escalate somatic tissue recovery.'}
                    </p>
                  </div>

                  {/* Hydration */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-y-3 translate-x-3">
                      <Sliders className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#CCFF00]/10 text-[#CCFF00] rounded border border-[#CCFF00]/20">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-display font-bold text-xs text-white uppercase tracking-wider">Cellular Hydration</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-zinc-550 uppercase block mb-1">Hydration Baseline:</span>
                      <span className="text-[9.5px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/25 px-2 py-0.5 rounded uppercase">
                        {Math.round((typeof metrics.weight === 'number' ? metrics.weight : 73) * 35)} ML BASELINE
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-semibold">
                      {activeDay.passiveRecoveryGuidelines.hydration || 'Incorporate vital amino matrix and sodium buffers to offset heavy lifting byproducts.'}
                    </p>
                  </div>

                  {/* Active Walk */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-y-3 translate-x-3">
                      <Footprints className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#CCFF00]/10 text-[#CCFF00] rounded border border-[#CCFF00]/20">
                        <Footprints className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-display font-bold text-xs text-white uppercase tracking-wider">Lactic acid flushing</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-mono text-zinc-550 uppercase block mb-1">Mobility:</span>
                      <span className="text-[9.5px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/25 px-2 py-0.5 rounded uppercase">
                        ZONE 1 MOBILITY
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-semibold">
                      {activeDay.passiveRecoveryGuidelines.activeRecovery || 'Light active walking to elevate capillary circulation.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Coach Recovery tip */}
              {activeDay.passiveRecoveryGuidelines?.coachTip && (
                <div className="bg-[#CCFF00]/[0.02] border-l-2 border-[#CCFF00] p-4 rounded-r-lg flex gap-3 relative overflow-hidden bg-zinc-950/10">
                  <div className="shrink-0 text-[#CCFF00] mt-0.5">
                    <Trophy className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-black block mb-1">
                      CPT COCH RECOV DIRECTIVE
                    </span>
                    <p className="text-xs text-zinc-355 italic font-sans font-medium">
                      "{activeDay.passiveRecoveryGuidelines.coachTip}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECONDARY SPORTS INTEGRATION ADVISORY CARD */}
          {activeDay.sportsIntegration && (
            <div className="bg-black/35 border border-white/5 rounded-xl p-4 md:p-5 flex flex-col gap-2.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/2 rounded-full blur-2xl"></div>
              <h3 className="text-[10px] font-mono font-black uppercase text-[#CCFF00] tracking-widest flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                B. Sports Baseline & Custom Activity Calibrator (Autocorrected)
              </h3>
              <p className="text-xs text-zinc-300 font-sans font-medium leading-relaxed">
                {activeDay.sportsIntegration}
              </p>
            </div>
          )}

          {/* "YOUR DIET SHOULD NOT BE BORING" RECONSTRUCTION GRID */}
          {activeDay.dietPlan && (
            <div className="bg-black/35 border border-white/5 rounded-xl p-4 md:p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
              
              <div className="border-b border-white/10 pb-2.5 w-full flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] font-mono font-black uppercase text-[#CCFF00] tracking-widest flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5" />
                    C. "YOUR DIET SHOULD NOT BE BORING" - {metrics.culinaryPreference} DISH MATRIX
                  </h3>
                  <p className="text-[8px] text-zinc-550 font-mono tracking-wider uppercase mt-0.5">ELITE NUTRITION PANEL CALORIES & MACRO SPLITS</p>
                </div>
                <span className="text-[9.5px] font-mono font-black border border-emerald-500/25 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ANABOLIC THERMO GENESIS
                </span>
              </div>

              {/* Meals cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {activeDay.dietPlan.meals?.map((meal, mIdx) => (
                  <div key={mIdx} className="bg-zinc-950/75 border border-white/5 rounded-lg p-3.5 flex flex-col justify-between gap-3 shadow-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">{meal.name}</span>
                        <span className="text-[9px] font-mono font-black text-[#CCFF00] tracking-wide">{meal.macros}</span>
                      </div>
                      <h4 className="text-white text-xs font-display font-bold uppercase tracking-tight mt-2.5 leading-tight">{meal.recipe?.split(' - ')[0] || 'Delicious Dish'}</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal font-sans font-medium mt-1.5 leading-snug">
                        {meal.recipe?.includes(' - ') ? meal.recipe?.split(' - ').slice(1).join(' - ') : meal.recipe}
                      </p>
                    </div>
                    {meal.tip && (
                      <div className="border-t border-white/5 pt-2 text-[10px] text-zinc-500 font-mono italic leading-tight">
                        <span className="text-emerald-400 font-bold tracking-wider uppercase not-italic block text-[7.5px] mb-0.5">Chef Tip:</span>
                        "{meal.tip}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Diet Summary footer */}
              <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/15 p-3 rounded-lg text-xs leading-relaxed text-zinc-300 font-sans font-medium">
                <span className="text-[10px] font-mono uppercase text-[#CCFF00] font-black block mb-0.5">Panel Summary of Macro Budgets</span>
                {activeDay.dietPlan.dailySummary}
              </div>
            </div>
          )}

          {/* LIFESTYLE PROTOCOL: CIRCADIAN SLEEP & SUPPLEMENT TIMES */}
          {activeDay.lifestyleProtocol && (
            <div className="bg-black/35 border border-white/5 rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/2 rounded-full blur-2xl"></div>
              
              <div className="md:col-span-2 border-b border-white/10 pb-2.5">
                <h3 className="text-[10px] font-mono font-black uppercase text-[#CCFF00] tracking-widest flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 animate-pulse" />
                  D. Strategic Supplement timings & Circadian night-shift Sleep blocks
                </h3>
                <p className="text-[8px] text-zinc-550 font-mono tracking-wider uppercase mt-0.5">COORDINATED COHORT CIRCADIAN PROTOCOLS</p>
              </div>

              {/* Supplements scheduling column */}
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                <span className="text-[9.5px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                  SUPPLEMENT ADVISORY TIMING
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                  {activeDay.lifestyleProtocol.supplementTimings}
                </p>
              </div>

              {/* Circadian/Sleep Blocks and Caffeine hour blocks */}
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-white/5 flex flex-col gap-2">
                <span className="text-[9.5px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
                  CIRCADIAN SLEEP & CAFFEINE BLOCKOUT
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-medium">
                  {activeDay.lifestyleProtocol.circadianSleepBlocks}
                </p>
              </div>
            </div>
          )}

          {/* 3. Legally Compliant Mandated Fixed Warning Disclaimer Card */}
          <div className="border border-red-500/20 bg-red-500/[0.02] p-4 rounded-lg flex items-start gap-3 mt-4" id="medical-disclaimer-card">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-widest block mb-1">
                Clinical Health & Safety Advisory
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-normal font-sans font-medium uppercase tracking-wide">
                Disclaimer: This layout is generated by AI for optimization guidance. For deeper medical clearance and specific health conditions, please consult with your certified physician before initiating.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
