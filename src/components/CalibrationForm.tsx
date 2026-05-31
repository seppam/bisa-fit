/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { UserMetrics, TrainingTrack } from '../types';
import { Clock, ShieldCheck, Dumbbell, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface CalibrationFormProps {
  metrics: UserMetrics;
  onChange: (metrics: UserMetrics) => void;
  onNext: () => void;
  onBack: () => void;
  language: 'EN' | 'ID';
  theme?: 'dark' | 'light';
}

export default function CalibrationForm({ 
  metrics, 
  onChange, 
  onNext, 
  onBack, 
  language,
  theme = 'dark'
}: CalibrationFormProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';

  // Helper tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Styling Variables
  const accentColor = isDark ? '#CCFF00' : '#84CC16';
  const accentTextClass = isDark ? 'text-[#CCFF00]' : 'text-[#84CC16]';
  const accentBgClass = isDark ? 'bg-[#CCFF00]' : 'bg-[#84CC16]';
  const accentBorderClass = isDark ? 'border-[#CCFF00]' : 'border-[#84CC16]';

  const textPrimary = isDark ? 'text-white' : 'text-[#0F172A]';
  const textMuted = isDark ? 'text-zinc-400' : 'text-slate-650';
  const textSubLabel = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardBgClass = isDark ? 'bg-[#0f0f0f]/90 border border-white/5 shadow-2xl' : 'bg-white border border-[#E2E8F0] shadow-md text-[#0F172A]';
  const inputBgClass = isDark ? 'bg-black border-white/10 text-[#CCFF00]' : 'bg-zinc-50 border-zinc-250 text-[#84CC16]';
  const innerCardBgClass = isDark ? 'bg-black/40 border border-white/5' : 'bg-zinc-50 border border-zinc-200/80';

  const tooltips: Record<string, { en: string; id: string }> = {
    track: {
      en: "Select high-intensity track: Gym Focus (low repetition failure, compound lifting), Home Workout (zero heavy load resistance, progressive leverage density), or Hyrox / Padel Conditioning (high-density aerobic and anaerobic transitions).",
      id: "Pilih jalur latihan intensis tinggi: Fokus Gym (repetisi rendah dengan target kegagalan otot, latihan beban majemuk), Home Workout (latihan beban tubuh progresif tanpa peralatan berat), atau Hyrox / Padel Conditioning (transisi ketahanan aerobik)."
    },
    shift: {
      en: "Select 'Continuous Shift Work' to align workout windows and Sleep circadian protocols around shift constraints. Ideal for overnight/irregular shift-workers.",
      id: "Pilih 'Kerja Shift' jika Anda bekerja di waktu malam/tidak teratur. Komputer sirkadian akan mengoptimalkan jam makan, jendela kafein, dan tidur."
    },
    limit: {
      en: "Identify prior soft tissue injuries or joint limitations. The engine will instantly configure safety biomechanical guards (e.g. omitting heavy axial loading or extreme compression) to protect spinal columns.",
      id: "Tandai cedera atau kendala sendi Anda. Sistem kecerdasan akan otomatis mengaktifkan pelindung biomekanis (misalnya, meniadakan beban aksial spinal parah)."
    }
  };

  const showTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  const selectGymFocus = (focus: string) => {
    onChange({ ...metrics, gymFocus: focus });
  };

  const toggleHomeEquipment = (eq: boolean) => {
    onChange({ ...metrics, homeEquipment: eq });
  };

  const selectHyroxFocus = (hf: string) => {
    onChange({ ...metrics, hyroxFocus: hf });
  };

  const toggleLimitation = (lim: string) => {
    if (lim === 'none') {
      onChange({ ...metrics, physicalLimitations: 'none' });
      return;
    }
    let current = (metrics.physicalLimitations || '').split(',').map(s => s.trim()).filter(Boolean);
    current = current.filter(s => s !== 'none');
    
    if (current.includes(lim)) {
      current = current.filter(s => s !== lim);
    } else {
      current.push(lim);
    }
    
    onChange({ 
      ...metrics, 
      physicalLimitations: current.length > 0 ? current.join(', ') : 'none' 
    });
  };

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch animate-fade-in relative z-10" id="page-calibration-form">
      {/* LEFT COLUMN: Input form options (7/12) */}
      <div className={`${cardBgClass} rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-colors duration-300 md:col-span-12 lg:col-span-7`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDark ? 'border-[#CCFF00]/25' : 'border-[#84CC16]/25'}`}></div>

        <div className="space-y-4">
          <div className="border-b border-inherit pb-4 flex items-center justify-between">
            <div>
              <h2 className={`font-display font-black italic text-base uppercase tracking-tight flex items-center gap-2 ${textPrimary}`}>
                <Dumbbell className={`w-5 h-5 ${accentTextClass}`} />
                {isEn ? 'FITNESS TRACK & CIRCADIAN CONFIGURATION' : 'KALIBRASI LATIHAN & JAM SIRKADIAN'}
              </h2>
              <p className={`text-[9.5px] ${textSubLabel} font-mono mt-0.5 uppercase tracking-wider`}>
                STEP 02 // OUTLINE FOCUS TARGETS AND WORK HOURS
              </p>
            </div>
            <span className={`text-[10px] font-mono ${accentTextClass} ${isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/25' : 'bg-[#84CC16]/5 border-[#84CC16]/25'} px-2 py-0.5 rounded border font-bold`}>
              PAGE 3 / 6
            </span>
          </div>

          <div className="space-y-4">
            
            {/* WORKOUT TRACK SELECTOR */}
            <div className="space-y-1.5 relative">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                {isEn ? 'High Intensity Workout Track' : 'Jalur Latihan Kinerja Tinggi'}
                <button 
                  type="button" 
                  onClick={() => showTooltip('track')} 
                  className={`ml-1.5 w-4 h-4 rounded-full border text-[9px] flex items-center justify-center cursor-pointer transition-all ${
                    isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                  }`}
                >
                  ?
                </button>
              </label>

              {activeTooltip === 'track' && (
                <div className={`p-2.5 rounded text-[10px] border leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-[#CCFF00]/30 text-zinc-300' : 'bg-zinc-100 border-[#84CC16]/35 text-slate-705'
                }`}>{isEn ? tooltips.track.en : tooltips.track.id}</div>
              )}

              <div className="grid grid-cols-3 gap-2" id="input-track-select">
                {(['gym', 'home', 'hyrox'] as TrainingTrack[]).map((tVal) => {
                  let label = '';
                  if (tVal === 'gym') label = isEn ? '💪 GYM FOCUS' : '💪 GYM KONDISI';
                  if (tVal === 'home') label = isEn ? '🏠 HOME WORKOUT' : '🏠 RUMAHAN';
                  if (tVal === 'hyrox') label = isEn ? '⚡ HYBRID (HYROX + OTHERS)' : '⚡ HYBRID (HYROX + LAINNYA)';
                  
                  const isS = metrics.track === tVal;
                  return (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => onChange({ ...metrics, track: tVal })}
                      className={`py-2 px-1 text-[9.5px] font-mono font-black border uppercase tracking-wider transition-all duration-200 cursor-pointer rounded text-center ${
                        isS
                          ? (isDark 
                              ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.15)]' 
                              : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] shadow-sm')
                          : (isDark ? 'bg-black/35 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800')
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC METRIC TARGET SUBFIELDS ACCORDING TO SELECTION */}
            {metrics.track === 'gym' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className={`text-[9.5px] font-mono font-extrabold uppercase ${textSubLabel} tracking-widest`}>
                  {isEn ? 'GYM TARGETS (SELECT OPTION)' : 'TARGET LATIHAN GYM (PILIHAN)'}
                </label>
                <div className="grid grid-cols-2 gap-2" id="input-gym-focus">
                  {['Strength', 'Hypertrophy', 'Endurance', 'Powerlifting'].map((gf) => {
                    const isS = metrics.gymFocus === gf;
                    return (
                      <button
                        key={gf}
                        type="button"
                        onClick={() => selectGymFocus(gf)}
                        className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                          isS
                            ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                            : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                        }`}
                      >
                        {gf}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {metrics.track === 'home' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className={`text-[9.5px] font-mono font-extrabold uppercase ${textSubLabel} tracking-widest`}>
                  {isEn ? 'ADJUSTABLE DUMBBELLS OR KETTLEBELLS AVAILABLE?' : 'APAKAH ADA DUMBBELL / KETTLEBELL?'}
                </label>
                <div className="grid grid-cols-2 gap-2" id="input-home-equipment">
                  <button
                    type="button"
                    onClick={() => toggleHomeEquipment(true)}
                    className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                      metrics.homeEquipment
                        ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                        : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                    }`}
                  >
                    {isEn ? 'YES // DUMBBELLS AVAILABLE' : 'YA // DUMBBELL TERSEDIA'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHomeEquipment(false)}
                    className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                      !metrics.homeEquipment
                        ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                        : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                    }`}
                  >
                    {isEn ? 'NO // PURE BODYWEIGHT ONLY' : 'TIDAK // HANYA BERAT TUBUH'}
                  </button>
                </div>
              </div>
            )}

             {metrics.track === 'hyrox' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className={`text-[9.5px] font-mono font-extrabold uppercase ${textSubLabel} tracking-widest`}>
                  {isEn ? 'CONDITIONING EXERCISE TRACKS' : 'JALUR LATIHAN KONDISIONING'}
                </label>
                <div className="grid grid-cols-3 gap-2" id="input-hyrox-focus">
                  {['Hyrox Prep', 'Padel Synergy', 'Maximum Cardio'].map((hf) => {
                    const isS = metrics.hyroxFocus === hf;
                    return (
                      <button
                        key={hf}
                        type="button"
                        onClick={() => selectHyroxFocus(hf)}
                        className={`py-1.5 px-1.5 text-[9.5px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                          isS
                            ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                            : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                        }`}
                      >
                        {hf}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-1.5 w-full">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                {isEn ? 'Recreational Sports / Extracurricular Activities' : 'Olahraga Rekreasi / Kegiatan Ekstrakurikuler'}
              </label>
              <input
                type="text"
                placeholder={isEn ? "e.g., Pencak Silat, Muay Thai, hiking, tennis" : "contoh: Pencak Silat, Muay Thai, mendaki, tenis"}
                value={metrics.customSports || ''}
                onChange={(e) => onChange({ ...metrics, customSports: e.target.value })}
                className={`w-full py-1.5 px-3 border rounded font-mono text-[11px] focus:outline-none ${inputBgClass}`}
                id="input-custom-sports"
              />
              <p className={`text-[8.5px] font-mono uppercase ${textSubLabel} leading-tight`}>
                {isEn ? 'Our system will auto-calibrate daily caloric profiles and program recovery guidelines to compensate.' : 'Sistem kami akan mengurangi kecemasan sirkadian dengan mengatur gizi pemulihan sesuai energi yang habis.'}
              </p>
            </div>

            {/* BUSY HOURS INPUT */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                  {isEn ? 'Circadian Busy Hours' : 'Jam Kerja Sibuk'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g., 08:00 - 17:00" : "contoh: 08:00 - 17:00"}
                  value={metrics.busyHours || ''}
                  onChange={(e) => onChange({ ...metrics, busyHours: e.target.value })}
                  className={`w-full py-1.5 px-3 border rounded font-mono text-[11px] focus:outline-none ${inputBgClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                  {isEn ? 'Free Window' : 'Jendela Latihan Kosong'}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g., Early Morning, Bedtime" : "contoh: Pagi Hari, Sore Hari"}
                  value={metrics.freeWindows || ''}
                  onChange={(e) => onChange({ ...metrics, freeWindows: e.target.value })}
                  className={`w-full py-1.5 px-3 border rounded font-mono text-[11px] focus:outline-none ${inputBgClass}`}
                />
              </div>
            </div>

            {/* CIRCADIAN SHIFT WORK */}
            <div className="space-y-1.5 relative">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                {isEn ? 'Is Shift Work Active?' : 'Apakah Jam Kerja Shift Aktif?'}
                <button 
                  type="button" 
                  onClick={() => showTooltip('shift')} 
                  className={`ml-1.5 w-4 h-4 rounded-full border text-[9px] flex items-center justify-center cursor-pointer transition-all ${
                    isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                  }`}
                >
                  ?
                </button>
              </label>

              {activeTooltip === 'shift' && (
                <div className={`p-2.5 border rounded text-[10px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-[#CCFF00]/30 text-zinc-300' : 'bg-zinc-100 border-[#84CC16]/30 text-slate-705'
                }`}>{isEn ? tooltips.shift.en : tooltips.shift.id}</div>
              )}

              <div className="grid grid-cols-2 gap-2" id="input-shift-work">
                <button
                  type="button"
                  onClick={() => onChange({ ...metrics, shiftWork: true })}
                  className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                    metrics.shiftWork
                      ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                      : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                  }`}
                >
                  {isEn ? 'YES // CONTINUOUS SHIFT WORK' : 'YA // SHIFT KERJA TIDAK TERATUR'}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...metrics, shiftWork: false })}
                  className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide transition-all cursor-pointer ${
                    !metrics.shiftWork
                      ? (isDark ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-bold')
                      : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                  }`}
                >
                  {isEn ? 'NO // STABILIZED OFFICE CIRCADIAN' : 'TIDAK // JAM KERJA NORMAL'}
                </button>
              </div>
            </div>

            {/* PHYSICAL LIMITATIONS */}
            <div className="space-y-1.5 relative">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider flex items-center`}>
                {isEn ? 'Joint & Physical Limitations / Pain Points' : 'Keterbatasan Fisik, Cedera & Sendi (Pelindung Spinal)'}
                <button 
                  type="button" 
                  onClick={() => showTooltip('limit')} 
                  className={`ml-1.5 w-4 h-4 rounded-full border text-[9px] flex items-center justify-center cursor-pointer transition-all ${
                    isDark ? 'border-white/10 text-zinc-500 hover:text-[#CCFF00]' : 'border-zinc-200 text-zinc-400 hover:text-[#84CC16]'
                  }`}
                >
                  ?
                </button>
              </label>

              {activeTooltip === 'limit' && (
                <div className={`p-2.5 border rounded text-[10px] leading-normal animate-fade-in ${
                  isDark ? 'bg-zinc-950 border-[#CCFF00]/30 text-zinc-300' : 'bg-zinc-100 border-[#84CC16]/30 text-slate-700'
                }`}>{isEn ? tooltips.limit.en : tooltips.limit.id}</div>
              )}

              <textarea
                placeholder={isEn ? "e.g., herniated disc, left knee joint pain, lower back discomfort, severe tendonitis, or none" : "contoh: saraf terjepit lumbar, sakit lutut kiri, masalah bahu kanan, cedera tendon, atau tidak ada"}
                value={metrics.physicalLimitations || ''}
                onChange={(e) => onChange({ ...metrics, physicalLimitations: e.target.value })}
                rows={3}
                className={`w-full py-2 px-3 border rounded font-mono text-[11px] focus:outline-none leading-relaxed resize-none ${inputBgClass}`}
                id="input-physical-limitations"
              />
              <p className={`text-[8.5px] font-mono uppercase ${textSubLabel} leading-normal`}>
                {isEn ? 'Specify pain points precisely. The panel will adjust exercises and append safety cue biomechanics overrides.' : 'Tuliskan cedera Anda dengan detail. Panel pelatihan kami akan mengoptimalkan pilihan gerakan aman.'}
              </p>
            </div>

          </div>
        </div>

        {/* Back and Next keys */}
        <div className="flex items-center justify-between pt-5 border-t border-inherit mt-6 gap-3">
          <button
            onClick={onBack}
            type="button"
            className={`px-5 py-3 border rounded font-mono text-[11px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-zinc-950 hover:bg-zinc-900 border-white/5 text-zinc-400 hover:text-white' 
                : 'bg-zinc-200 hover:bg-zinc-300 border-zinc-250 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back' : 'Kembali'}</span>
          </button>

          <button
            onClick={onNext}
            type="button"
            id="btn-next-step-nutrition"
            className={`px-6 py-3 font-mono font-black tracking-wider text-[11px] uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-[#CCFF00] text-black hover:bg-[#D4FF33] shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                : 'bg-[#84CC16] text-white hover:bg-[#71B512] shadow-sm'
            }`}
          >
            <span>{isEn ? 'Next: Nutritional Preferences' : 'Lanjut: Preferensi Diet'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Chrono alignment and Biomechanics monitor panel (5/12) */}
      <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-5 justify-between">
        <div className={`${isDark ? 'bg-[#111111]/80 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-md'} rounded-xl p-5 md:p-6 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors duration-300`}>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/25' : 'border-[#84CC16]/25'}`}></div>

          <div className="space-y-4">
            <div className="border-b border-light-dark pb-3 border-inherit">
              <h3 className={`font-mono text-xs ${accentTextClass} font-black tracking-[0.2em] flex items-center gap-1.5 uppercase`}>
                <ShieldCheck className={`w-4 h-4 ${accentTextClass}`} />
                {isEn ? 'SAFETY GUARDS & CIRCADIAN RECOVERY' : 'PELINDUNG KEAMANAN & PENYELARAS SIRKADIAN'}
              </h3>
              <p className={`text-[9px] ${textSubLabel} font-mono mt-0.5 tracking-wider uppercase`}>
                SYSTEM PRE-WORKOUT ALIGNMENT VERDICT
              </p>
            </div>

            <div className="space-y-4" id="calibration-monitors">
              
              {/* Box 1: Spinal Compression Protection Monitor */}
              <div className={`border p-4 rounded-lg flex flex-col justify-between gap-1.5 transition-all ${
                isDark ? 'bg-black/45 border-white/5' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest block font-bold`}>
                  {isEn ? 'Spinal Loading & Joint Restriction Guard' : 'Pelindung Kompresi Sendi & Cedera Spinal'}
                </span>
                <span className={`text-base font-black italic tracking-tight font-display ${
                  (metrics.physicalLimitations && metrics.physicalLimitations.trim().toLowerCase() !== 'none' && metrics.physicalLimitations.trim() !== '') ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {(metrics.physicalLimitations && metrics.physicalLimitations.trim().toLowerCase() !== 'none' && metrics.physicalLimitations.trim() !== '') ? 'ACTIVE BIOMECHANICAL RESTRICTIONS' : 'FULL RANGE AXIAL LOAD LOADED'}
                </span>
                <p className={`text-[9.5px] font-sans ${textMuted} leading-normal mt-1 uppercase font-semibold`}>
                  {(metrics.physicalLimitations && metrics.physicalLimitations.trim().toLowerCase() !== 'none' && metrics.physicalLimitations.trim() !== '')
                    ? (isEn 
                        ? `Custom restriction logged: "${metrics.physicalLimitations}". Omit conflicting heavy axial loading. Auto replace lifts with Bulgarian Split Squats/Leg press failures and JM Presses.`
                        : `Kendala sendi aktif: "${metrics.physicalLimitations}". Mengeliminasi beban aksial langsung. Gerakan Squats/Lifts otomatis diganti dengan Bulgarians/Leg Press/JM Press aman.`)
                    : (isEn 
                        ? 'Active biomechanics cleared. Low volume progressive overload compound targets authorized.'
                        : 'Biomekanika aman diotorisasi. Pembakaran tension mekanikal compound volume rendah diizinkan.')}
                </p>
              </div>

              {/* Box 2: Chrono circadian clock alignment */}
              <div className={`border p-4 rounded-lg flex flex-col justify-between gap-1.5 transition-all ${
                isDark ? 'bg-black/45 border-white/5' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest block font-bold`}>
                  {isEn ? 'Chrono Circadian Alignment' : 'Grafik Penyelarasan Tidur Sirkadian'}
                </span>
                <span className={`text-base font-black italic tracking-tight font-display ${accentTextClass}`}>
                  {metrics.shiftWork ? 'SHIFT WORK ALIGNED STATUS' : 'STABLE HORMONAL HOMEOCLASS'}
                </span>
                <p className={`text-[9.5px] font-sans ${textMuted} leading-normal mt-1 uppercase font-semibold`}>
                  {metrics.shiftWork
                    ? (isEn
                        ? 'Circadian sleep windows are automatically computed around work hours. Caffeine blockers will be mapped at exact 8h gaps before midnight/bed sleep.'
                        : 'Jadwal tidur sirkadian dihitung otomatis mengikuti jam kerja shift. Konsumsi kafein diblokir pada jarak 8 jam sebelum jam tidur.')
                    : (isEn
                        ? 'Standard 8-hour sleep circadian mapping. Cortisol curve peaks are synced with standard morning sunlight exposure cues.'
                        : 'Sinkronisasi jam tidur standar 8 jam. Puncak hormon kortisol diselaraskan dengan paparan cahaya matahari pagi.')}
                </p>
              </div>

            </div>
          </div>

          <div className={`p-3 rounded text-[9.5px] leading-normal font-semibold uppercase text-center mt-4 border ${
            isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/15 text-zinc-500' : 'bg-[#84CC16]/5 border-[#84CC16]/15 text-zinc-650'
          }`}>
            <span>
              ⭐ {isEn ? 'BisaFit.AI ensures strict exercise substitution protocols for maximum joints integrity.' : 'BisaFit.AI senantiasa menjaga keamanan sendi dengan pengganti latihan terpilih.'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
