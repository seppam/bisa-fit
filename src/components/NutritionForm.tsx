/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { UserMetrics } from '../types';
import { TRANSLATIONS } from '../utils/lang';
import { Flame, Sparkles, ChefHat, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';

interface NutritionFormProps {
  metrics: UserMetrics;
  onChange: (metrics: UserMetrics) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationError: string | null;
  language: 'EN' | 'ID';
  theme?: 'dark' | 'light';
}

export default function NutritionForm({
  metrics,
  onChange,
  onBack,
  onGenerate,
  isGenerating,
  generationError,
  language,
  theme = 'dark'
}: NutritionFormProps) {
  const isEn = language === 'EN';
  const isDark = theme === 'dark';

  const t = TRANSLATIONS[language];

  // Specific visual styles for light mode contrast and branding compliance
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

  const supplementsOptions = [
    { value: 'Whey Protein', label: isEn ? 'Whey Protein (Tissue Repair)' : 'Whey Protein (Sintesis Jaringan)' },
    { value: 'Creatine Monohydrate', label: isEn ? 'Creatine Monohydrate (ATP Power)' : 'Kreatin Monohidrat (Daya ATP)' },
    { value: 'Caffeine/Pre-Workout', label: isEn ? 'Caffeine/Pre-Workout (CNS Alert)' : 'Kafein / Pre-Workout (Stimulus Saraf)' },
    { value: 'Omega-3', label: isEn ? 'Omega-3 (Anti-Inflammatory)' : 'Omega-3 (Meredam Inflamasi)' },
    { value: 'Magnesium Glycinate', label: isEn ? 'Magnesium Glycinate (Deep Sleep)' : 'Magnesium Glisinat (Tidur Dalam)' }
  ];

  const toggleSupplement = (supp: string) => {
    const arr = [...(metrics.supplementsBaseline || [])];
    const idx = arr.indexOf(supp);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(supp);
    }
    onChange({ ...metrics, supplementsBaseline: arr });
  };

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch animate-fade-in relative z-10" id="page-nutrition-form">
      {/* LEFT COLUMN: Dietary and Supplementation selections (7/12) */}
      <div className={`${cardBgClass} rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-colors duration-300 md:col-span-7`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isDark ? 'border-[#CCFF00]/25' : 'border-[#84CC16]/25'}`}></div>

        <div className="space-y-4">
          <div className="border-b border-inherit pb-3 flex items-center justify-between">
            <div>
              <h2 className={`font-display font-black italic text-base uppercase tracking-tight flex items-center gap-2 ${textPrimary}`}>
                <Flame className={`w-5 h-5 ${accentTextClass}`} />
                {isEn ? 'FLAVORFUL DIET & SUPPLEMENT PREFERENCES' : 'PROFIL DIET NIKMAT & SUPLEMENTASI'}
              </h2>
              <p className={`text-[9.5px] ${textSubLabel} font-mono mt-0.5 uppercase tracking-wider`}>
                STEP 03 // TAILOR DIET PATHS AND NUTRITIONAL TARGETS
              </p>
            </div>
            <span className={`text-[10px] font-mono ${accentTextClass} ${isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/25' : 'bg-[#84CC16]/5 border-[#84CC16]/25'} px-2 py-0.5 rounded border font-bold`}>
              PAGE 4 / 6
            </span>
          </div>

          {/* Error notice if present */}
          {generationError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs font-mono uppercase tracking-wide leading-relaxed animate-pulse">
              ⚠️ {isEn 
                ? `System Generation Error: ${generationError}. Key verification failed. Retrying initialization.` 
                : `Kegagalan Pengolahan AI: ${generationError}. Periksa kembali isian dan koneksi.`}
            </div>
          )}

          <div className="space-y-4">
            
            {/* CULINARY PREFERENCE SELECTOR */}
            <div className="space-y-1.5">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                {isEn ? 'Diet Path Culinary Preference' : 'Preferensi Kuliner Jalur Diet'}
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2" id="input-diet-select">
                {['Indonesian', 'Asian', 'Western', 'Mixed'].map((dp) => {
                  const isS = metrics.culinaryPreference === dp;
                  let label = dp;
                  if (dp === 'Indonesian') label = isEn ? '🌶️ IDN Local' : '🌶️ Lokal Indonesia';
                  if (dp === 'Asian') label = isEn ? '🍱 Asian Fresh' : '🍱 Kuliner Asia';
                  if (dp === 'Western') label = isEn ? '🥩 Western Fuel' : '🥩 Barat / Western';
                  if (dp === 'Mixed') label = isEn ? '🥗 Mixed Style' : '🥗 Campuran / Bebas';

                  return (
                    <button
                      key={dp}
                      type="button"
                      onClick={() => onChange({ ...metrics, culinaryPreference: dp as any })}
                      className={`py-2 px-1 text-[9.5px] font-mono border rounded uppercase tracking-wider transition-all cursor-pointer ${
                        isS
                          ? (isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16] font-extrabold')
                          : (isDark ? 'bg-black/25 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800')
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <span className={`text-[9.5px] ${textSubLabel} italic tracking-wide font-mono block mt-1`}>
                ★ {isEn ? 'Your diet should not be boring. Recipes will inject flavorful Local Traditional Indonesian foods.' : 'Diet Anda tidak boleh membosankan. Resep akan memasukkan masakan tradisional Nusantara yang lezat.'}
              </span>
            </div>

            {/* SUPPLEMENTS BASELINE (SELECT MULTIPLE) */}
            <div className="space-y-1.5">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                {isEn ? 'Supplements & Micronutrition Baseline' : 'Dasar Suplemen & Nutrisi Mikro'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2" id="input-supplements">
                {supplementsOptions.map((opt) => {
                  const isS = (metrics.supplementsBaseline || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleSupplement(opt.value)}
                      className={`py-1.5 px-3 text-[10px] font-mono border rounded uppercase tracking-wide text-left transition-all flex items-center justify-between cursor-pointer ${
                        isS
                          ? (isDark ? 'bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]' : 'bg-[#84CC16]/20 border-[#84CC16] text-[#84CC16] font-bold')
                          : (isDark ? 'bg-black/20 border-white/5 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100')
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span>{isS ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM SUPPLEMENTS */}
            <div className="space-y-1">
              <label className={`text-[10.5px] font-mono font-black uppercase ${textMuted} tracking-wider`}>
                {isEn ? 'Other Supplements Consumed (Auto spellcheck active)' : 'Suplemen Lain yang Dikonsumsi (Koreksi typo aktif)'}
              </label>
              <input
                type="text"
                placeholder={isEn ? "e.g., craetine, glutamine, ashwaganda" : "contoh: craetine, bcaa, ashwaganda"}
                value={metrics.customSupplements || ''}
                onChange={(e) => onChange({ ...metrics, customSupplements: e.target.value })}
                className={`w-full py-2 px-3 border rounded font-mono text-[11px] focus:outline-none ${inputBgClass}`}
              />
            </div>

          </div>
        </div>

        {/* Back and Generate keys */}
        <div className="flex items-center justify-between pt-5 border-t border-inherit mt-6 gap-3">
          <button
            onClick={onBack}
            disabled={isGenerating}
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
            onClick={onGenerate}
            disabled={isGenerating}
            type="button"
            id="btn-trigger-ai-assembly"
            className={`px-6 py-3 font-mono font-black tracking-wider text-[11.5px] uppercase rounded transition-all flex items-center gap-2 cursor-pointer ${
              isGenerating
                ? 'bg-zinc-900 border border-white/5 text-zinc-500 cursor-wait'
                : (isDark 
                    ? 'bg-[#CCFF00] text-black hover:bg-[#D4FF33] shadow-[0_0_20px_rgba(204,255,0,0.25)]'
                    : 'bg-[#84CC16] text-white hover:bg-[#71B512] shadow-sm')
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />
                <span className={accentTextClass}>{isEn ? 'UNIFYING ECOSYSTEM DATA...' : 'MENYATUKAN MATRIKS...'}</span>
              </>
            ) : (
              <>
                <span>{isEn ? 'Analyze & Build My Ecosystem' : 'Analisis & Buat Ekosistem Saya'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Diet law & Coach text box (5/12) */}
      <div className="md:col-span-5 flex flex-col gap-5 justify-between">
        <div className={`${isDark ? 'bg-[#111111]/80 border border-white/5' : 'bg-white border border-[#E2E8F0] shadow-md'} rounded-xl p-5 md:p-6 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors duration-300`}>
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isDark ? 'border-[#CCFF00]/25' : 'border-[#84CC16]/25'}`}></div>

          <div className="space-y-4">
            <div className="border-b border-inherit pb-3">
              <h3 className={`font-mono text-xs ${accentTextClass} font-black tracking-[0.2em] flex items-center gap-1.5 uppercase`}>
                <ChefHat className={`w-4 h-4 ${accentTextClass}`} />
                {isEn ? 'NUTRITION ALIGNMENT LAW' : 'HUKUM PENYESUAIAN NUTRISI'}
              </h3>
              <p className={`text-[9px] ${textSubLabel} font-mono mt-0.5 tracking-wider uppercase`}>
                PRE-GEN METABOLIC BALANCING MATRICES
              </p>
            </div>

            <div className="space-y-4" id="nutrition-guides">
              
              {/* Highlight coach tip card */}
              <div className={`p-4 border-l-4 rounded-r-lg transition-all ${
                isDark 
                  ? 'bg-[#CCFF00]/5 border-l-[#CCFF00] text-zinc-300 hover:bg-[#CCFF00]/10' 
                  : 'bg-[#84CC16]/5 border-l-[#84CC16] text-[#0F172A] hover:bg-[#84CC16]/10'
              }`}>
                <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${accentTextClass} block mb-1`}>
                  💡 {isEn ? 'COACH TIP: LOW REPETITION POWER' : 'SUNTIKAN MOTIVASI: KONSENTRASI DOSIS TINGGI'}
                </span>
                <p className="text-[10.5px] font-sans leading-relaxed uppercase font-semibold">
                  {isEn
                    ? "Muscle growth is driven by heavy mechanical tension, not cardiovascular fatigue. Low repetition volume taken strictly to complete failure yields maximum myogenic stimulus with lower fatigue accrual."
                    : "Pembesaran jaringan otot dirangsang oleh ketegangan mekanis berat, bukan kelelahan organ kardio. Latihan dengan repetisi rendah hingga gagal otot menghasilkan stimulus miogenik maksimal."}
                </p>
              </div>

              {/* Box 2: Spellcheck and correction monitor */}
              <div className={`border p-4 rounded-lg flex flex-col justify-between gap-1 transition-all ${
                isDark ? 'bg-black/45 border-white/5' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className={`text-[8.5px] font-mono ${textSubLabel} uppercase tracking-widest block font-bold`}>
                  {isEn ? 'Intense Spelling Correction Guard' : 'Penjaga Koreksi Ejaan Otomatis'}
                </span>
                <span className={`text-sm font-black italic tracking-tight font-display ${accentTextClass}`}>
                  {isEn ? 'DICTIONARY SPELLCHECK ACTIVE' : 'SISTEM KOREKSI BAHASA AKTIF'}
                </span>
                <p className={`text-[9.5px] font-sans ${textMuted} leading-normal mt-1 uppercase font-semibold`}>
                  {isEn 
                    ? "Custom foods and supplements will be instantly audited (e.g. converting 'craetine' to 'Creatine Monohydrate', 'glutamine' to 'L-Glutamine') in the primary database compilation."
                    : "Isian masakan dan suplemen acak yang diketik pengguna akan langsung diaudit secara cerdas dan diselaraskan ke dalam istilah farmasi yang baku."}
                </p>
              </div>

            </div>
          </div>

          <div className={`p-3 rounded text-[9.5px] leading-normal font-semibold uppercase text-center mt-4 border ${
            isDark ? 'bg-[#CCFF00]/5 border-[#CCFF00]/15 text-zinc-550' : 'bg-[#84CC16]/5 border-[#84CC16]/15 text-zinc-500'
          }`}>
            <span>
              ⭐ {isEn ? 'UNIFYING CPT, LIFESTYLE AND DIET MATRICES...' : 'MENYATUKAN MATRIKS LATIHAN, DIET, DAN PEMULIHAN...'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
