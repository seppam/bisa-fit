/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { UserMetrics, Gender, calculateDiagnostic } from '../types';
import { Ruler, Activity, ArrowRight, ArrowLeft } from 'lucide-react';

interface MetricsFormProps {
  metrics: UserMetrics;
  onChange: (metrics: UserMetrics) => void;
  onNext: () => void;
  onBack: () => void;
  language: 'EN' | 'ID';
  theme?: 'dark' | 'light';
}

export default function MetricsForm({ 
  metrics, 
  onChange, 
  onNext, 
  onBack, 
  language,
  theme = 'dark'
}: MetricsFormProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';

  // Local state for active tooltip helper
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Dynamic BFP / FFMI somatic calculations
  const diagnostic = calculateDiagnostic(metrics);
  const hasValues = !!metrics.height && !!metrics.weight;

  // Active theme style variables
  const accentColor = isDark ? '#CCFF00' : '#84CC16';
  const accentTextClass = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const accentBgClass = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  const accentBorderClass = isDark ? 'border-[#CCFF00]' : 'border-[#84CC16]';

  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMuted = isDark ? 'text-zinc-400' : 'text-slate-650';
  const textSubLabel = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardBgClass = isDark ? 'bg-[#0f0f0f]/90 border border-white/5 shadow-2xl' : 'bg-white border border-[#E2E8F0] shadow-md text-[#0F172A]';
  const inputBgClass = isDark ? 'bg-black border-white/10 text-[#CCFF00]' : 'bg-zinc-50 border-zinc-250 text-[#84CC16]';
  const sliderAccentClass = isDark ? 'accent-[#CCFF00]' : 'accent-[#84CC16]';

  const handleGenderChange = (gender: Gender) => {
    const updated = { ...metrics, gender };
    if (gender === 'male') {
      updated.hip = '';
    }
    onChange(updated);
  };

  const handleChangeScalar = (field: keyof UserMetrics, rawVal: string) => {
    const parsed = rawVal === '' ? '' : Math.max(0, parseFloat(rawVal));
    onChange({ ...metrics, [field]: parsed });
  };

  const handleSliderChange = (field: keyof UserMetrics, val: number) => {
    onChange({ ...metrics, [field]: val });
  };

  const isValid =
    typeof metrics.age === 'number' && metrics.age > 0 &&
    typeof metrics.height === 'number' && metrics.height > 0 &&
    typeof metrics.weight === 'number' && metrics.weight > 0 &&
    typeof metrics.neck === 'number' && metrics.neck > 0 &&
    typeof metrics.waist === 'number' && metrics.waist > 0 &&
    (metrics.gender === 'male' || (typeof metrics.hip === 'number' && metrics.hip > 0));

  // Tooltip helper texts
  const tooltips: Record<string, { en: string; id: string }> = {
    gender: {
      en: "Select your biological sex. Formulas (such as the Navy Body Fat Formula) employ specific mathematical baselines to calibrate body density estimations based on gender.",
      id: "Pilih jenis kelamin biologis Anda. Formula (seperti Formula Lemak Tubuh U.S. Navy) menggunakan konstanta matematika berbeda guna menduga kepadatan tubuh."
    },
    age: {
      en: "Age is integrated into core metabolism variables. Elite athletes utilize metabolic scaling to balance glycogen burn velocity.",
      id: "Umur diintegrasikan ke dalam variabel metabolisme inti. Atlet elit menggunakan penskalaan metabolisme untuk menyeimbangkan kecepatan pembakaran glikogen."
    },
    height: {
      en: "Measure exact standing height in centimeters without shoes. Key variable for BMI calculation and fat-free tissue profiling.",
      id: "Ukur tinggi badan berdiri tegak dalam centimeter tanpa alas kaki. Variabel kunci untuk penghitungan BMI dan profil jaringan bebas lemak (FFMI)."
    },
    weight: {
      en: "Acquire your current true weight in kilograms. Weigh yourself under resting conditions, ideally in the early morning after waking up.",
      id: "Gunakan berat badan aktual Anda saat ini dalam kologram. Timbang badan Anda pada kondisi istirahat, idealnya di pagi hari setelah bangun."
    },
    neck: {
      en: "Measure horizontally just below your larynx (Adam's apple). Keep the measuring tape relaxed. Do not tense your neck muscles.",
      id: "Ukur secara horizontal tepat di bawah jakun Anda. Pastikan pita ukur dalam keadaan santai. Jangan menegangkan otot leher Anda."
    },
    waist: {
      en: "For males: Measure horizontally at navel/belly button plane. For females: Measure at the narrowest section of the abdominal torso.",
      id: "Pria: Ukur mendatar sejajar pusar. Wanita: Ukur di bagian perut yang paling ramping/terkecil di antara rusuk bawah dan pinggul."
    },
    hip: {
      en: "For females only: Measure horizontally at the widest, maximum protrusion of your gluteal muscles.",
      id: "Hanya untuk wanita: Ukur secara horizontal pada tonjolan bokong atau pinggul yang paling lebar."
    }
  };

  const showTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  // Compact classifications with WCAG considerations
  let bmiLabel = '---';
  let bmiColor = isDark ? 'text-zinc-500' : 'text-zinc-500';
  let bmiBg = isDark ? 'bg-zinc-800/10 border-zinc-700/20' : 'bg-zinc-100 border-zinc-200';
  let bmiPercent = 0;
  if (hasValues) {
    bmiPercent = Math.max(0, Math.min(100, ((diagnostic.bmi - 15) / 25) * 100));
    if (diagnostic.bmi >= 30) {
      bmiLabel = isEn ? 'OBESE / LIMIT' : 'OBESITAS';
      bmiColor = 'text-red-500';
      bmiBg = isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200';
    } else if (diagnostic.bmi >= 25) {
      bmiLabel = isEn ? 'OVERWEIGHT' : 'BERAT BERLEBIH';
      bmiColor = isDark ? 'text-amber-400' : 'text-amber-600';
      bmiBg = isDark ? 'bg-amber-500/10 border-amber-500/35' : 'bg-amber-50 border-amber-200';
    } else if (diagnostic.bmi >= 18.5) {
      bmiLabel = isEn ? 'ATHLETIC NORMAL' : 'NORMAL / ATLETIS';
      bmiColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
      bmiBg = isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30' : 'bg-[#84CC16]/10 border-[#84CC16]/30';
    } else {
      bmiLabel = isEn ? 'UNDERWEIGHT' : 'BERAT KURANG';
      bmiColor = isDark ? 'text-sky-400' : 'text-sky-600';
      bmiBg = isDark ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-200';
    }
  }

  let bfpLabel = '---';
  let bfpColor = 'text-zinc-500';
  let bfpBg = 'bg-zinc-850/20';
  let bfpPercent = 0;
  if (hasValues && diagnostic.bodyFat !== undefined) {
    bfpPercent = Math.max(0, Math.min(100, ((diagnostic.bodyFat - 4) / 36) * 100));
    const bf = diagnostic.bodyFat;
    if (metrics.gender === 'male') {
      if (bf < 6) {
        bfpLabel = isEn ? 'RIP SHREDDED' : 'KADAR MINIMAL (SHREDDED)';
        bfpColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        bfpBg = isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30' : 'bg-[#84CC16]/10 border-[#84CC16]/25';
      } else if (bf <= 13) {
        bfpLabel = isEn ? 'ELITE LEAN' : 'SANGAT ATLETIS';
        bfpColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
        bfpBg = isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-250';
      } else if (bf <= 17) {
        bfpLabel = isEn ? 'FITNESS ZONE' : 'IDEAL / BUGAR';
        bfpColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        bfpBg = isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/25' : 'bg-[#84CC16]/10 border-[#84CC16]/25';
      } else if (bf <= 24) {
        bfpLabel = isEn ? 'MODERATE' : 'NORMAL / MODERAT';
        bfpColor = isDark ? 'text-zinc-400' : 'text-zinc-600';
        bfpBg = isDark ? 'bg-zinc-800/20 border-zinc-700/30' : 'bg-zinc-100 border-zinc-200';
      } else {
        bfpLabel = isEn ? 'HIGH ADIPOSE' : 'LEMAK TINGGI';
        bfpColor = 'text-red-500';
        bfpBg = isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200';
      }
    } else {
      if (bf < 14) {
        bfpLabel = isEn ? 'RIP SHREDDED' : 'SANGAT LEAN';
        bfpColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        bfpBg = isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30' : 'bg-[#84CC16]/10 border-[#84CC16]/25';
      } else if (bf <= 20) {
        bfpLabel = isEn ? 'ELITE COHORT' : 'SANGAT ATLETIS';
        bfpColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
        bfpBg = isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-250';
      } else if (bf <= 24) {
        bfpLabel = isEn ? 'FITNESS ZONE' : 'IDEAL / BUGAR';
        bfpColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        bfpBg = isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00]/25' : 'bg-[#84CC16]/10 border-[#84CC16]/25';
      } else if (bf <= 31) {
        bfpLabel = isEn ? 'MODERATE' : 'NORMAL / MODERAT';
        bfpColor = isDark ? 'text-zinc-400' : 'text-zinc-600';
        bfpBg = isDark ? 'bg-zinc-800/20 border-zinc-700/30' : 'bg-zinc-100 border-zinc-200';
      } else {
        bfpLabel = isEn ? 'HIGH ADIPOSE' : 'LEMAK TINGGI';
        bfpColor = 'text-red-500';
        bfpBg = isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200';
      }
    }
  }

  let ffmiLabel = '---';
  let ffmiColor = 'text-zinc-500';
  let ffmiBg = 'bg-zinc-850/20';
  let ffmiPercent = 0;
  if (hasValues && diagnostic.ffmi > 0) {
    ffmiPercent = Math.max(0, Math.min(100, ((diagnostic.ffmi - 15) / 13) * 100));
    const ff = diagnostic.ffmi;
    if (metrics.gender === 'male') {
      if (ff >= 23.5) {
        ffmiLabel = isEn ? 'ELITE MUSCULAR OVERRIDE' : 'MUSCULARY DENSE (ELITE)';
        ffmiColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        ffmiBg = isDark ? 'bg-[#CCFF00]/20 border-[#CCFF00]/45 animate-pulse' : 'bg-[#84CC16]/10 border-[#84CC16]/40';
      } else if (ff >= 21.5) {
        ffmiLabel = isEn ? 'EXCELLENT ATHLETE' : 'MASSA OTOT SANGAT BAIK';
        ffmiColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
        ffmiBg = isDark ? 'bg-emerald-500/10 border-emerald-500/35' : 'bg-emerald-50 border-emerald-250';
      } else if (ff >= 19.5) {
        ffmiLabel = isEn ? 'ABOVE AVERAGE' : 'DI ATAS RATA-RATA';
        ffmiColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        ffmiBg = isDark ? 'bg-[#CCFF00]/10' : 'bg-[#84CC16]/5';
      } else {
        ffmiLabel = isEn ? 'ATHLETIC BASAL' : 'MASSA OTOT STANDARD';
        ffmiColor = isDark ? 'text-zinc-400' : 'text-zinc-650';
        ffmiBg = isDark ? 'bg-zinc-800/10' : 'bg-zinc-100';
      }
    } else {
      if (ff >= 19.5) {
        ffmiLabel = isEn ? 'ELITE MUSCULAR OVERRIDE' : 'MUSCULARY DENSE (ELITE)';
        ffmiColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        ffmiBg = isDark ? 'bg-[#CCFF00]/20 border-[#CCFF00]/45 animate-pulse' : 'bg-[#84CC16]/10 border-[#84CC16]/40';
      } else if (ff >= 17.5) {
        ffmiLabel = isEn ? 'EXCELLENT ATHLETE' : 'MASSA OTOT SANGAT BAIK';
        ffmiColor = isDark ? 'text-emerald-400' : 'text-emerald-600';
        ffmiBg = isDark ? 'bg-emerald-500/10 border-emerald-500/35' : 'bg-emerald-50 border-emerald-250';
      } else if (ff >= 15.5) {
        ffmiLabel = isEn ? 'ABOVE AVERAGE' : 'DI ATAS RATA-RATA';
        ffmiColor = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
        ffmiBg = isDark ? 'bg-[#CCFF00]/10' : 'bg-[#84CC16]/5';
      } else {
        ffmiLabel = isEn ? 'ATHLETIC BASAL' : 'MASSA OTOT STANDARD';
        ffmiColor = isDark ? 'text-zinc-400' : 'text-zinc-650';
        ffmiBg = isDark ? 'bg-zinc-800/10' : 'bg-zinc-100';
      }
    }
  }

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch animate-fade-in relative z-10" id="page-metrics-form">
      {/* LEFT COLUMN: Input Matrix Form (6/12) */}
      <div className={`${cardBgClass} rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-colors duration-300 md:col-span-6`}>
        
        {/* Glow anchors */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDark ? 'border-[#CCFF00]/30' : 'border-[#84CC16]/30'}`}></div>
        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/30' : 'border-[#84CC16]/30'}`}></div>
        
        <div className="space-y-4">
          <div className="border-b border-inherit pb-3 flex items-center justify-between">
            <div>
              <h2 className={`font-display font-black italic text-base uppercase tracking-tight flex items-center gap-2 ${textPrimary}`}>
                <Ruler className={`w-5 h-5 ${accentTextClass}`} />
                {isEn ? 'BIOLOGICAL PROFILE CALIBRATION' : 'KALIBRASI PROFIL BIOLOGIS'}
              </h2>
              <p className={`text-[9.5px] ${textSubLabel} font-mono mt-0.5 uppercase tracking-wider`}>
                STEP 01 // REGISTER CORE PHYSICAL METRIC SCALARS
              </p>
            </div>
            <span className={`text-[10px] font-mono ${accentTextClass} ${isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/20' : 'bg-[#84CC16]/5 border-[#84CC16]/20'} px-2 py-0.5 rounded border font-bold`}>
              PAGE 2 / 6
            </span>
          </div>

          {/* Form fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GENDER SELECTOR */}
            <div className="sm:col-span-2 space-y-1.5 relative">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                {isEn ? 'Biological Gender' : 'Jenis Kelamin Biologis'}
                <button 
                  type="button" 
                  onClick={() => showTooltip('gender')}
                  className={`ml-1.5 w-4 h-4 rounded-full border text-[9px] font-mono flex items-center justify-center cursor-pointer transition-all focus:outline-none ${
                    isDark 
                      ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00] hover:border-[#CCFF00]' 
                      : 'border-zinc-250 text-zinc-400 hover:text-[#84CC16] hover:border-[#84CC16]'
                  }`}
                >
                  ?
                </button>
              </label>

              {activeTooltip === 'gender' && (
                <div className={`p-2.5 rounded text-[10px] leading-normal animate-fade-in mb-1 border ${
                  isDark ? 'bg-zinc-950 border-[#CCFF00]/30 text-zinc-300' : 'bg-zinc-50 border-[#84CC16]/30 text-slate-700'
                }`}>
                  {isEn ? tooltips.gender.en : tooltips.gender.id}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2" id="input-gender">
                <button
                  type="button"
                  onClick={() => handleGenderChange('male')}
                  className={`py-2 px-3 text-xs font-mono font-black border uppercase tracking-wider transition-all duration-200 cursor-pointer rounded ${
                    metrics.gender === 'male'
                      ? (isDark 
                          ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.1)]' 
                          : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] shadow-sm')
                      : (isDark ? 'bg-black/35 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800')
                  }`}
                >
                  {isEn ? '🏋️‍♂️ MALE // PRIA' : '🏋️‍♂️ PRIA / MALE'}
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('female')}
                  className={`py-2 px-3 text-xs font-mono font-black border uppercase tracking-wider transition-all duration-200 cursor-pointer rounded ${
                    metrics.gender === 'female'
                      ? (isDark 
                          ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.1)]' 
                          : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] shadow-sm')
                      : (isDark ? 'bg-black/35 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800')
                  }`}
                >
                  {isEn ? '🏋️‍♀️ FEMALE // WANITA' : '🏋️‍♀️ WANITA / FEMALE'}
                </button>
              </div>
            </div>

            {/* AGE FIELD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                  {isEn ? 'Age (Years)' : 'Umur (Tahun)'}
                  <button 
                    type="button" 
                    onClick={() => showTooltip('age')} 
                    className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                      isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                    }`}
                  >
                    ?
                  </button>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={metrics.age}
                  placeholder="29"
                  onChange={(e) => handleChangeScalar('age', e.target.value)}
                  className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                />
              </div>
              {activeTooltip === 'age' && (
                <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                }`}>{isEn ? tooltips.age.en : tooltips.age.id}</div>
              )}
              <input
                type="range"
                min="15"
                max="85"
                step="1"
                value={metrics.age || 25}
                onChange={(e) => handleSliderChange('age', parseInt(e.target.value, 10))}
                className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
              />
            </div>

            {/* HEIGHT FIELD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                  {isEn ? 'Height (cm)' : 'Tinggi Badan (cm)'}
                  <button 
                    type="button" 
                    onClick={() => showTooltip('height')} 
                    className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                      isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                    }`}
                  >
                    ?
                  </button>
                </label>
                <input
                  type="number"
                  min="80"
                  max="250"
                  value={metrics.height}
                  placeholder="170"
                  onChange={(e) => handleChangeScalar('height', e.target.value)}
                  className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                />
              </div>
              {activeTooltip === 'height' && (
                <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                }`}>{isEn ? tooltips.height.en : tooltips.height.id}</div>
              )}
              <input
                type="range"
                min="100"
                max="220"
                step="1"
                value={metrics.height || 165}
                onChange={(e) => handleSliderChange('height', parseInt(e.target.value, 10))}
                className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
              />
            </div>

            {/* WEIGHT FIELD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                  {isEn ? 'Weight (kg)' : 'Berat Badan (kg)'}
                  <button 
                    type="button" 
                    onClick={() => showTooltip('weight')} 
                    className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                      isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                    }`}
                  >
                    ?
                  </button>
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={metrics.weight}
                  placeholder="70"
                  onChange={(e) => handleChangeScalar('weight', e.target.value)}
                  className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                />
              </div>
              {activeTooltip === 'weight' && (
                <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                }`}>{isEn ? tooltips.weight.en : tooltips.weight.id}</div>
              )}
              <input
                type="range"
                min="40"
                max="140"
                step="1"
                value={metrics.weight || 70}
                onChange={(e) => handleSliderChange('weight', parseInt(e.target.value, 10))}
                className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
              />
            </div>

            {/* NECK MEASUREMENT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                  {isEn ? 'Neck Girth (cm)' : 'Lingkar Leher (cm)'}
                  <button 
                    type="button" 
                    onClick={() => showTooltip('neck')} 
                    className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                      isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                    }`}
                  >
                    ?
                  </button>
                </label>
                <input
                  type="number"
                  min="20"
                  max="70"
                  value={metrics.neck}
                  placeholder="38"
                  onChange={(e) => handleChangeScalar('neck', e.target.value)}
                  className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                />
              </div>
              {activeTooltip === 'neck' && (
                <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                }`}>{isEn ? tooltips.neck.en : tooltips.neck.id}</div>
              )}
              <input
                type="range"
                min="25"
                max="55"
                step="0.5"
                value={metrics.neck || 36}
                onChange={(e) => handleSliderChange('neck', parseFloat(e.target.value))}
                className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
              />
            </div>

            {/* WAIST MEASUREMENT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                  {isEn ? 'Waist Girth (cm)' : 'Lingkar Pinggang (cm)'}
                  <button 
                    type="button" 
                    onClick={() => showTooltip('waist')} 
                    className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                      isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                    }`}
                  >
                    ?
                  </button>
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={metrics.waist}
                  placeholder="80"
                  onChange={(e) => handleChangeScalar('waist', e.target.value)}
                  className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                />
              </div>
              {activeTooltip === 'waist' && (
                <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                }`}>{isEn ? tooltips.waist.en : tooltips.waist.id}</div>
              )}
              <input
                type="range"
                min="50"
                max="130"
                step="0.5"
                value={metrics.waist || 80}
                onChange={(e) => handleSliderChange('waist', parseFloat(e.target.value))}
                className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
              />
            </div>

            {/* DYNAMIC HIP MEASUREMENT (ONLY FEMALE) */}
            {metrics.gender === 'female' ? (
              <div className="space-y-1.5 animate-fade-in sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <label className={`text-[10.5px] font-mono font-black uppercase tracking-wider flex items-center ${accentTextClass}`}>
                    {isEn ? 'Hip Girth (cm) * Required' : 'Lingkar Pinggul (cm) * Wajib'}
                    <button 
                      type="button" 
                      onClick={() => showTooltip('hip')} 
                      className={`ml-1 w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center cursor-pointer ${
                        isDark ? 'border-white/15 text-zinc-400 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                      }`}
                    >
                      ?
                    </button>
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="200"
                    value={metrics.hip}
                    placeholder="90"
                    onChange={(e) => handleChangeScalar('hip', e.target.value)}
                    className={`w-16 px-1.5 py-0.5 border rounded font-mono text-[11px] font-bold text-center focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
                  />
                </div>
                {activeTooltip === 'hip' && (
                  <div className={`p-2 border rounded text-[9.5px] leading-normal animate-fade-in ${
                    isDark ? 'bg-zinc-950 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-slate-700'
                  }`}>{isEn ? tooltips.hip.en : tooltips.hip.id}</div>
                )}
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="0.5"
                  value={metrics.hip || 90}
                  onChange={(e) => handleSliderChange('hip', parseFloat(e.target.value))}
                  className={`w-full ${sliderAccentClass} h-1 bg-zinc-300 dark:bg-zinc-900 rounded-lg cursor-pointer`}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Somatic Gauges monitor (6/12) */}
      <div className="md:col-span-6 flex flex-col gap-5 justify-between">
        <div className={`${isDark ? 'bg-[#111111]/80 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-md'} rounded-xl p-5 md:p-6 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors duration-300`}>
          
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/30' : 'border-[#84CC16]/30'}`}></div>
          
          <div className="space-y-4">
            <div className="border-b border-inherit pb-3 flex items-center justify-between">
              <div>
                <h3 className={`font-mono text-xs ${accentTextClass} font-black tracking-[0.2em] flex items-center gap-1.5 uppercase`}>
                  <Activity className={`w-4 h-4 animate-pulse ${accentTextClass}`} />
                  {isEn ? 'LIVE SOMATIC COMPUTER' : 'KOMPUTASI INDEKS SOMATIS'}
                </h3>
                <p className={`text-[9px] ${textSubLabel} font-mono mt-0.5 tracking-wider uppercase`}>
                  DYNAMIC U.S. NAVY & FFMI REGISTRY
                </p>
              </div>
              <span className={`h-2 w-2 rounded-full ${hasValues ? `${accentBgClass} animate-pulse shadow-sm` : 'bg-red-500'}`}></span>
            </div>

            {hasValues ? (
              <div className="space-y-4">
                
                {/* Gauge 1: Body Mass Index (BMI) */}
                <div className={`border p-4 rounded-lg flex flex-col justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-black/45 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                }`}>
                  <div>
                    <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest font-bold block`}>BMI (Body Mass Index)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-3xl font-black font-display ${textPrimary}`}>{diagnostic.bmi.toFixed(1)}</span>
                      <span className={`text-[10px] font-mono ${textSubLabel}`}>kg/m²</span>
                    </div>
                  </div>
                  
                  {/* Visual linear track */}
                  <div className="space-y-1.5">
                    <div className={`w-full h-1.5 rounded-full overflow-hidden p-[1px] border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-200 border-zinc-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-emerald-500 to-[#CCFF00]' : 'bg-gradient-to-r from-emerald-600 to-[#84CC16]'}`}
                        style={{ width: `${bmiPercent}%` }}
                      ></div>
                    </div>
                    <div className={`text-[8.5px] font-mono font-black border inline-block px-2 py-0.5 rounded tracking-wide uppercase ${bmiColor} ${bmiBg}`}>
                      {bmiLabel}
                    </div>
                  </div>
                </div>

                {/* Gauge 2: US Navy Body Fat % */}
                <div className={`border p-4 rounded-lg flex flex-col justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-black/45 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                }`}>
                  <div>
                    <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest font-bold block`}>U.S. Navy Body Fat (BFP)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-3xl font-black font-display ${accentTextClass}`}>{diagnostic.bodyFat?.toFixed(1)}%</span>
                      <span className={`text-[10px] font-mono ${textSubLabel}`}>{isEn ? 'Adipose Storage' : 'Kadar Lemak'}</span>
                    </div>
                  </div>
                  
                  {/* Visual track */}
                  <div className="space-y-1.5">
                    <div className={`w-full h-1.5 rounded-full overflow-hidden p-[1px] border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-200 border-zinc-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-emerald-400 to-amber-500' : 'bg-gradient-to-r from-emerald-600 to-amber-600'}`}
                        style={{ width: `${bfpPercent}%` }}
                      ></div>
                    </div>
                    <div className={`text-[8.5px] font-mono font-black border inline-block px-2 py-0.5 rounded tracking-wide uppercase ${bfpColor} ${bfpBg}`}>
                      {bfpLabel}
                    </div>
                  </div>
                </div>

                {/* Gauge 3: Fat-Free Mass Index (FFMI) */}
                <div className={`border p-4 rounded-lg flex flex-col justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-black/45 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                }`}>
                  <div>
                    <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest font-bold block`}>FFMI (Fat-Free Mass Index)</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-3xl font-black font-display ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{diagnostic.ffmi.toFixed(2)}</span>
                      <span className={`text-[10px] font-mono ${textSubLabel}`}>{isEn ? 'Tissue Density Score' : 'Skor Massa Otot'}</span>
                    </div>
                  </div>
                  
                  {/* Visual track */}
                  <div className="space-y-1.5">
                    <div className={`w-full h-1.5 rounded-full overflow-hidden p-[1px] border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-zinc-200 border-zinc-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-emerald-600 to-[#CCFF00]' : 'bg-gradient-to-r from-emerald-700 to-[#84CC16]'}`}
                        style={{ width: `${ffmiPercent}%` }}
                      ></div>
                    </div>
                    <div className={`text-[8.5px] font-mono font-black border inline-block px-2 py-0.5 rounded tracking-wide uppercase ${ffmiColor} ${ffmiBg}`}>
                      {ffmiLabel}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className={`py-12 flex flex-col items-center justify-center text-center gap-3 border border-dashed rounded-lg ${
                isDark ? 'border-white/10 bg-black/10' : 'border-zinc-250 bg-zinc-50'
              }`}>
                <Activity className={`w-8 h-8 animate-pulse ${isDark ? 'text-zinc-750' : 'text-zinc-350'}`} />
                <p className={`text-xs font-mono uppercase tracking-wide font-black ${textMuted}`}>
                  {isEn ? 'CALIBRATION INDICES OFFLINE' : 'SISTEM MEMBUTUHKAN VARIABEL'}
                </p>
                <p className={`text-[10.5px] max-w-xs px-6 leading-relaxed uppercase font-semibold ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {isEn 
                    ? "Input height, weight, age, neck, waist, and hip parameters to activate live biological monitoring panels."
                    : "Lengkapi data tinggi badan, berat badan, umur, leher, pinggang, dan pinggul untuk mengaktifkan komputasi komputer biometrik."}
                </p>
              </div>
            )}
          </div>

          {/* Quick Informational Notice */}
          {hasValues && (
            <div className={`p-3 rounded text-[10px] leading-normal uppercase font-semibold text-center mt-4 border ${
              isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/15 text-zinc-400' : 'bg-[#84CC16]/5 border-[#84CC16]/15 text-slate-700'
            }`}>
              {diagnostic.classification === 'muscular_athlete' ? (
                <span className={accentTextClass}>
                  🔥 {isEn ? 'ATHLETE DETECTED: High FFMI override activated!' : 'ATLET TERDETEKSI: Override FFMI tinggi aktif!'}
                </span>
              ) : (
                <span>
                  ℹ️ {isEn ? 'Somatic coordinates successfully registered. Proceed when ready.' : 'Koordinat somatis terdaftar dengan sukses. Lanjutkan jika siap.'}
                </span>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom Page Navigation Controls - Unified bottom-footer responsive layout */}
      <div className="col-span-1 md:col-span-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-4 pt-5 border-t border-zinc-200 dark:border-white/10 w-full z-20">
        <button
          onClick={onBack}
          type="button"
          className={`w-full sm:w-auto px-5 py-3 border rounded font-mono text-[11px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isDark 
              ? 'bg-zinc-950 hover:bg-zinc-900 border-white/5 text-zinc-400 hover:text-white' 
              : 'bg-zinc-200 hover:bg-zinc-350 border-zinc-250 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back' : 'Kembali'}</span>
        </button>

        <button
          onClick={onNext}
          disabled={!isValid}
          type="button"
          id="btn-next-step-workout"
          className={`w-full sm:w-auto px-6 py-3 font-mono font-black tracking-wider text-[11px] uppercase rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isValid
              ? (isDark 
                  ? 'bg-[#CCFF00] text-black hover:bg-[#D4FF33] shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                  : 'bg-[#84CC16] text-white hover:bg-[#71B512] shadow-sm')
              : (isDark 
                  ? 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed')
          }`}
        >
          <span>{isEn ? 'Next: Setup Workout Track' : 'Lanjut: Atur Jalur Latihan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
