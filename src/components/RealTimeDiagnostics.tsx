/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DiagnosticResult, UserMetrics } from '../types';
import { ShieldCheck, Dumbbell, Zap, Activity } from 'lucide-react';

interface RealTimeDiagnosticsProps {
  diagnostic: DiagnosticResult;
  metrics: UserMetrics;
}

export default function RealTimeDiagnostics({ diagnostic, metrics }: RealTimeDiagnosticsProps) {
  const hasValues = !!metrics.height && !!metrics.weight;

  // Real-time BMI category
  let bmiLabel = '---';
  let bmiColor = 'text-zinc-500';
  let bmiBg = 'bg-zinc-800/20';
  let bmiProgress = 0; // min 15, max 40
  
  if (hasValues && diagnostic.bmi > 0) {
    bmiProgress = ((diagnostic.bmi - 15) / (40 - 15)) * 100;
    bmiProgress = Math.max(0, Math.min(100, bmiProgress));
    
    if (diagnostic.bmi >= 30) {
      bmiLabel = 'OBESE';
      bmiColor = 'text-red-400';
      bmiBg = 'bg-red-500/20';
    } else if (diagnostic.bmi >= 25) {
      bmiLabel = 'OVERWEIGHT (HEAVY ENGINE)';
      bmiColor = 'text-amber-400';
      bmiBg = 'bg-amber-500/10';
    } else if (diagnostic.bmi >= 18.5) {
      bmiLabel = 'NORMAL WEIGHT';
      bmiColor = 'text-[#CCFF00]';
      bmiBg = 'bg-[#CCFF00]/10';
    } else {
      bmiLabel = 'UNDERWEIGHT';
      bmiColor = 'text-sky-400';
      bmiBg = 'bg-sky-500/10';
    }
  }

  // Real-time BFP category
  let bfpLabel = '---';
  let bfpColor = 'text-zinc-500';
  let bfpBg = 'bg-zinc-800/20';
  let bfpProgress = 0; // min 4, max 40

  if (hasValues && diagnostic.bodyFat !== undefined && diagnostic.bodyFat > 0) {
    const bf = diagnostic.bodyFat;
    bfpProgress = ((bf - 4) / (40 - 4)) * 100;
    bfpProgress = Math.max(0, Math.min(100, bfpProgress));

    if (metrics.gender === 'male') {
      if (bf < 6) {
        bfpLabel = 'PEAK SHREDDED (CONTEST)';
        bfpColor = 'text-[#CCFF00]';
        bfpBg = 'bg-[#CCFF00]/20';
      } else if (bf <= 13) {
        bfpLabel = 'ATHLETIC elite DEF';
        bfpColor = 'text-green-400';
        bfpBg = 'bg-green-500/10';
      } else if (bf <= 17) {
        bfpLabel = 'HEALTHY ATHLETIC';
        bfpColor = 'text-[#CCFF00]';
        bfpBg = 'bg-[#CCFF00]/10';
      } else if (bf <= 24) {
        bfpLabel = 'MODERATE STORES';
        bfpColor = 'text-zinc-400';
        bfpBg = 'bg-zinc-800/20';
      } else {
        bfpLabel = 'ELEVATED ADIPOSE';
        bfpColor = 'text-red-400';
        bfpBg = 'bg-red-500/10';
      }
    } else {
      // Female
      if (bf < 14) {
        bfpLabel = 'EXTREMELY LEAN (PEAK)';
        bfpColor = 'text-pink-400';
        bfpBg = 'bg-pink-500/20';
      } else if (bf <= 20) {
        bfpLabel = 'ATHLETIC elite DEF';
        bfpColor = 'text-green-400';
        bfpBg = 'bg-green-500/10';
      } else if (bf <= 24) {
        bfpLabel = 'FITNESS / HEALTHY';
        bfpColor = 'text-[#CCFF00]';
        bfpBg = 'bg-[#CCFF00]/10';
      } else if (bf <= 31) {
        bfpLabel = 'MODERATE STORES';
        bfpColor = 'text-zinc-400';
        bfpBg = 'bg-zinc-800/20';
      } else {
        bfpLabel = 'ELEVATED ADIPOSE';
        bfpColor = 'text-red-400';
        bfpBg = 'bg-red-500/10';
      }
    }
  }

  // Real-time FFMI category
  let ffmiLabel = '---';
  let ffmiColor = 'text-zinc-500';
  let ffmiBg = 'bg-zinc-800/20';
  let ffmiProgress = 0; // min 15, max 28

  if (hasValues && diagnostic.ffmi > 0) {
    const ff = diagnostic.ffmi;
    ffmiProgress = ((ff - 15) / (28 - 15)) * 100;
    ffmiProgress = Math.max(0, Math.min(100, ffmiProgress));

    if (metrics.gender === 'male') {
      if (ff >= 25.0) {
        ffmiLabel = 'HIGHLY EXCEPTIONAL // ELITE';
        ffmiColor = 'text-[#CCFF00]';
        ffmiBg = 'bg-[#CCFF00]/20';
      } else if (ff >= 22.0) {
        ffmiLabel = 'EXCELLENT MUSCLE DENSITY';
        ffmiColor = 'text-emerald-400';
        ffmiBg = 'bg-emerald-500/10';
      } else if (ff >= 20.0) {
        ffmiLabel = 'ABOVE AVERAGE MUSCULARITY';
        ffmiColor = 'text-green-400';
        ffmiBg = 'bg-green-500/10';
      } else {
        ffmiLabel = 'STANDARD LEAN BULK ZONE';
        ffmiColor = 'text-zinc-400';
        ffmiBg = 'bg-zinc-805/20';
      }
    } else {
      // Female FFMI bounds are lower
      if (ff >= 21.0) {
        ffmiLabel = 'HIGHLY EXCEPTIONAL // ELITE';
        ffmiColor = 'text-[#CCFF00]';
        ffmiBg = 'bg-[#CCFF00]/20';
      } else if (ff >= 18.0) {
        ffmiLabel = 'EXCELLENT MUSCLE DENSITY';
        ffmiColor = 'text-emerald-400';
        ffmiBg = 'bg-emerald-500/10';
      } else if (ff >= 16.0) {
        ffmiLabel = 'ABOVE AVERAGE MUSCULARITY';
        ffmiColor = 'text-green-400';
        ffmiBg = 'bg-green-500/10';
      } else {
        ffmiLabel = 'STANDARD LEAN BULK ZONE';
        ffmiColor = 'text-zinc-400';
        ffmiBg = 'bg-zinc-805/20';
      }
    }
  }

  return (
    <div className="bg-[#111111]/80 border border-white/5 rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-sm" id="realtime-monitor-block">
      {/* Sci-fi layout decorations */}
      <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-[#CCFF00]/40"></div>
      
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="font-mono text-xs text-[#CCFF00] font-bold tracking-[0.2em] flex items-center gap-1.5 uppercase">
            <Zap className="w-3.5 h-3.5 animate-pulse text-[#CCFF00]" />
            REAL-TIME BIOMETRIC MONITOR (NAVY FORMULA)
          </h3>
          <p className="text-[9px] text-zinc-500 font-mono mt-0.5 tracking-wider uppercase">
            REAL-TIME PHYSIOLOGICAL COEFFICIENT METRICS ROTATOR
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${hasValues ? 'bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]' : 'bg-red-500'}`}></span>
          <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
            {hasValues ? 'MATRICES ENGAGED' : 'AWAITING METRICS'}
          </span>
        </div>
      </div>

      {hasValues ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Realtime BMI display */}
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg flex flex-col justify-between gap-3 transition-all">
            <div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">BMI (Body Mass Index)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-display text-white">{diagnostic.bmi.toFixed(1)}</span>
                <span className="text-[10px] font-mono text-zinc-500">kg/m²</span>
              </div>
            </div>
            
            {/* ProgressBar */}
            <div className="space-y-1.5">
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#CCFF00] h-full rounded-full transition-all duration-300"
                  style={{ width: `${bmiProgress}%` }}
                ></div>
              </div>
              <div className={`text-[8px] font-mono font-bold border border-white/5 inline-block px-1.5 py-0.5 rounded ${bmiColor} ${bmiBg}`}>
                {bmiLabel}
              </div>
            </div>
          </div>

          {/* Realtime BFP display */}
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg flex flex-col justify-between gap-3 transition-all">
            <div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">U.S. Navy Body Fat (BFP)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-display text-[#CCFF00]">{diagnostic.bodyFat?.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-zinc-500">Adipose Store</span>
              </div>
            </div>
            
            {/* ProgressBar */}
            <div className="space-y-1.5">
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#CCFF00] h-full rounded-full transition-all duration-300"
                  style={{ width: `${bfpProgress}%` }}
                ></div>
              </div>
              <div className={`text-[8px] font-mono font-bold border border-white/5 inline-block px-1.5 py-0.5 rounded ${bfpColor} ${bfpBg}`}>
                {bfpLabel}
              </div>
            </div>
          </div>

          {/* Realtime FFMI display */}
          <div className="bg-black/30 border border-white/5 p-4 rounded-lg flex flex-col justify-between gap-3 transition-all">
            <div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">FFMI (Fat-Free Mass Index)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-display text-emerald-400">{diagnostic.ffmi.toFixed(1)}</span>
                <span className="text-[10px] font-mono text-zinc-500">Lean Density</span>
              </div>
            </div>
            
            {/* ProgressBar */}
            <div className="space-y-1.5">
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#CCFF00] h-full rounded-full transition-all duration-300"
                  style={{ width: `${ffmiProgress}%` }}
                ></div>
              </div>
              <div className={`text-[8px] font-mono font-bold border border-white/5 inline-block px-1.5 py-0.5 rounded ${ffmiColor} ${ffmiBg}`}>
                {ffmiLabel}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-2.5 border border-dashed border-white/5 rounded-lg bg-black/10">
          <Activity className="w-7 h-7 text-zinc-700 animate-pulse" />
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wide font-semibold">
            Biometric calibration parameters not yet locked
          </p>
          <p className="text-[10px] text-zinc-500 max-w-sm px-6 leading-relaxed uppercase">
            Input or slide your real physical stats in the form above to activate live somatic tracking indices.
          </p>
        </div>
      )}
    </div>
  );
}
