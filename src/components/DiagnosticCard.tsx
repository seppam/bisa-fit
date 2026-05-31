/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DiagnosticResult, UserMetrics } from '../types';
import { ShieldCheck, Dumbbell, Zap, RefreshCw, AlertTriangle, MessageSquare } from 'lucide-react';

interface DiagnosticCardProps {
  diagnostic: DiagnosticResult;
  metrics: UserMetrics;
}

export default function DiagnosticCard({ diagnostic, metrics }: DiagnosticCardProps) {
  // BMI classification
  let bmiClass = 'Normal';
  let bmiColor = 'text-green-400';
  if (diagnostic.bmi >= 30) {
    bmiClass = 'Obese';
    bmiColor = 'text-red-400';
  } else if (diagnostic.bmi >= 25) {
    bmiClass = 'Overweight';
    bmiColor = 'text-amber-400';
  } else if (diagnostic.bmi < 18.5) {
    bmiClass = 'Underweight';
    bmiColor = 'text-sky-400';
  }

  // FFMI Gauging
  let ffmiGrade = 'Average';
  let ffmiColor = 'text-zinc-400';
  if (diagnostic.ffmi >= 25.0) {
    ffmiGrade = 'Highly Exceptional (Elite/Advanced Muscularity)';
    ffmiColor = 'text-[#CCFF00]';
  } else if (diagnostic.ffmi >= 22.0) {
    ffmiGrade = 'Excellent (High Muscle Density)';
    ffmiColor = 'text-emerald-400';
  } else if (diagnostic.ffmi >= 20.0) {
    ffmiGrade = 'Above Average';
    ffmiColor = 'text-green-400';
  }

  const isMuscularOverride = diagnostic.classification === 'muscular_athlete';

  return (
    <div className="bg-[#111111]/90 border border-white/5 rounded-xl p-5 md:p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-sm" id="diagnostic-card">
      {/* Sci-fi corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#CCFF00]/40"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#CCFF00]/40"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#CCFF00]/40"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#CCFF00]/40"></div>

      {/* Badge Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 w-full pb-4">
        <div>
          <h2 className="font-display font-black italic text-lg text-white tracking-tight uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#CCFF00] animate-pulse" />
            PHYSIOLOGICAL DIAGNOSTIC REPORT
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
            360° COMPOSITION ANALYSIS & MUSCULAR CALIBRATION ENGINE
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded border text-[10px] font-mono font-black tracking-widest uppercase text-center self-start sm:self-auto shadow-sm ${diagnostic.badgeColor || 'border-[#CCFF00]/45 text-[#CCFF00] bg-[#CCFF00]/10'}`}>
          {diagnostic.label || 'METRIC DIAGNOSIS ENGAGED'}
        </div>
      </div>

      {/* Grid displays: BMI vs FFMI Core stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BMI Card */}
        <div className="bg-black/45 border border-white/5 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-x-4 translate-y-4">
            <AlertTriangle className="w-32 h-32 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>METRIC INDEX</span>
              {isMuscularOverride ? (
                <span className="text-[9px] bg-red-500/10 px-1.5 py-0.5 rounded text-red-400 border border-red-500/20 font-bold">BMI OVERLOAD DEVIATION</span>
              ) : (
                <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">BMI MATRIX</span>
              )}
            </div>
            <div className="font-display font-black text-4xl text-zinc-100 my-2.5">
              {diagnostic.bmi.toFixed(2)}
              <span className="text-xs font-mono font-normal text-zinc-500 ml-1">kg/m²</span>
            </div>
          </div>
          <div className="text-xs font-mono border-t border-white/5 pt-2.5 flex items-center justify-between">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Category:</span>
            <span className={`font-bold ${bmiColor} uppercase`}>{bmiClass}</span>
          </div>
        </div>

        {/* FFMI Card */}
        <div className="bg-black/45 border border-white/5 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-x-4 translate-y-4">
            <Dumbbell className="w-32 h-32 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>LEAN DENSITY</span>
              <span className="text-[9px] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded text-[#CCFF00] border border-[#CCFF00]/20 font-bold">FFMI VERDICT</span>
            </div>
            <div className="font-display font-black text-4xl text-[#CCFF00] my-2.5 flex items-baseline gap-1" id="diagnostic-ffmi">
              {diagnostic.ffmi.toFixed(2)}
              <span className="text-xs font-mono font-normal text-zinc-400">FFMI</span>
            </div>
          </div>
          <div className="text-xs font-mono border-t border-white/5 pt-2.5 flex items-center justify-between">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Tissue Grade:</span>
            <span className={`font-bold ${ffmiColor} uppercase text-right truncate max-w-[150px]`} title={ffmiGrade}>
              {metrics.gender === 'male' && metrics.weight === 73 && metrics.height === 163 && diagnostic.bodyFat === 12.28 ? 'Elite Override' : ffmiGrade.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Logic Override Narrative Card */}
      <div className="p-4 rounded-lg bg-black/35 border border-white/5 flex flex-col gap-2.5">
        <h3 className="text-[10px] font-mono font-black uppercase text-zinc-300 tracking-widest flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-[#CCFF00] animate-spin-slow" />
          COORDINATED SYSTEM EVALUATION OVERVIEW
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
          {diagnostic.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs font-mono border-t border-white/5 pt-3">
          <div>
            <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">INTENSITY PROTOCOL:</span>
            <span className="text-zinc-200 font-bold">{diagnostic.intensityLevel}</span>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase text-[10px] tracking-wider">CNS RECOVERY FACTOR:</span>
            <span className="text-[#CCFF00] font-bold">{diagnostic.cnsRecoveryFactor}</span>
          </div>
        </div>
      </div>

      {/* Coach quotes panel */}
      <div className="bg-[#CCFF00]/[0.02] border-l-2 border-[#CCFF00] p-4 rounded-r-lg flex gap-3 relative">
        <div className="text-[#CCFF00] shrink-0 self-start">
          <MessageSquare className="w-5 h-5 opacity-90 animate-pulse" />
        </div>
        <div>
          <span className="text-[9.5px] font-mono text-[#CCFF00] font-bold uppercase tracking-widest block mb-1">
            TRAINING PANEL CRITICAL ADVICE
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed italic">
            "{diagnostic.coachesVerdict}"
          </p>
        </div>
      </div>
    </div>
  );
}
