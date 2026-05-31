/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeGate from './components/WelcomeGate';
import MetricsForm from './components/MetricsForm';
import CalibrationForm from './components/CalibrationForm';
import NutritionForm from './components/NutritionForm';
import PortalTransition from './components/PortalTransition';
import UltimateDashboard from './components/UltimateDashboard';
import { UserMetrics, calculateDiagnostic, WorkoutDay, DiagnosticResult } from './types';
import { TRANSLATIONS } from './utils/lang';

export default function App() {
  // 1. Language state: EN by default, persisted
  const [language, setLanguage] = useState<'EN' | 'ID'>(() => {
    const saved = localStorage.getItem('grit_app_language');
    return (saved === 'ID' ? 'ID' : 'EN') as 'EN' | 'ID';
  });

  useEffect(() => {
    localStorage.setItem('grit_app_language', language);
  }, [language]);

  const t = TRANSLATIONS[language];
  const isEn = language === 'EN';

  // 2. Theme State: Dark Mode is the premium default, switchable to Light Mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('grit_app_theme');
    return (saved === 'light' ? 'light' : 'dark') as 'dark' | 'light';
  });

  useEffect(() => {
    localStorage.setItem('grit_app_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 3. Chronological 6-page step index state
  // Page 1: Welcome Gate
  // Page 2: Biological Metrics Form
  // Page 3: Fitness & Schedule Calibration
  // Page 4: Flavorful Diet & Supplementation
  // Page 5: The Portal Transition (CTA Bridge)
  // Page 6: The Ultimate Ecosystem Dashboard
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const saved = localStorage.getItem('grit_wizard_step_chronological');
    const parsed = saved ? parseInt(saved, 10) : 1;
    return (parsed >= 1 && parsed <= 6) ? parsed : 1;
  });

  useEffect(() => {
    localStorage.setItem('grit_wizard_step_chronological', currentStep.toString());
  }, [currentStep]);

  // 4. Persistent Metrics state
  const [metrics, setMetrics] = useState<UserMetrics>(() => {
    const saved = localStorage.getItem('grit_user_metrics_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            gender: parsed.gender || 'male',
            track: parsed.track || 'gym',
            age: parsed.age !== undefined ? parsed.age : '',
            height: parsed.height !== undefined ? parsed.height : '',
            weight: parsed.weight !== undefined ? parsed.weight : '',
            neck: parsed.neck !== undefined ? parsed.neck : '',
            waist: parsed.waist !== undefined ? parsed.waist : '',
            hip: parsed.hip !== undefined ? parsed.hip : '',
            sportsBaseline: parsed.sportsBaseline || [],
            customSports: parsed.customSports || '',
            supplementsBaseline: parsed.supplementsBaseline || [],
            customSupplements: parsed.customSupplements || '',
            busyHours: parsed.busyHours || '',
            freeWindows: parsed.freeWindows || '',
            shiftWork: parsed.shiftWork !== undefined ? parsed.shiftWork : false,
            culinaryPreference: parsed.culinaryPreference || 'Mixed',
            gymFocus: parsed.gymFocus,
            homeEquipment: parsed.homeEquipment,
            hyroxFocus: parsed.hyroxFocus,
            physicalLimitations: parsed.physicalLimitations || '',
          };
        }
      } catch (e) {
        // Safe fallback
      }
    }
    // Default metrics structure
    return {
      gender: 'male',
      track: 'gym',
      age: 26,
      height: 172,
      weight: 68,
      neck: 36,
      waist: 79,
      hip: '',
      sportsBaseline: [],
      customSports: '',
      supplementsBaseline: ['Whey Protein', 'Creatine Monohydrate'],
      customSupplements: '',
      busyHours: '',
      freeWindows: '',
      shiftWork: false,
      culinaryPreference: 'Mixed',
      gymFocus: 'Hypertrophy',
      homeEquipment: false,
      hyroxFocus: undefined,
      physicalLimitations: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('grit_user_metrics_v2', JSON.stringify(metrics));
  }, [metrics]);

  // 5. Program state generated dynamically from backend
  const [program, setProgram] = useState<{
    greeting?: string;
    diagnostic: DiagnosticResult;
    schedule: WorkoutDay[];
  } | null>(() => {
    const saved = localStorage.getItem('grit_user_program_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Safe fallback
      }
    }
    return null;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // 6. Completed exercise tracking
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('grit_completed_exercises_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Safe fallback
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('grit_completed_exercises_v2', JSON.stringify(completedExercises));
  }, [completedExercises]);

  const realTimeDiag = calculateDiagnostic(metrics);

  const isValidMetrics =
    typeof metrics.age === 'number' && metrics.age > 0 &&
    typeof metrics.height === 'number' && metrics.height > 0 &&
    typeof metrics.weight === 'number' && metrics.weight > 0 &&
    typeof metrics.neck === 'number' && metrics.neck > 0 &&
    typeof metrics.waist === 'number' && metrics.waist > 0 &&
    (metrics.gender === 'male' || (typeof metrics.hip === 'number' && metrics.hip > 0));

  const handleToggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRecalibrateAndReset = () => {
    setProgram(null);
    setCompletedExercises({});
    localStorage.removeItem('grit_user_program_v2');
    setCurrentStep(2); // Jump straight back to Page 2
  };

  // Trigger Gemini dynamic cohort generation call
  const handleGenerateProgram = async () => {
    if (!isValidMetrics) return;

    setIsGenerating(true);
    setGenerationError(null);

    const dynamicPrompt = `Generate a 7-day HIT program for a ${metrics.gender} who is ${metrics.age} years old.
Somatic Calibration Indices: BMI ${realTimeDiag.bmi.toFixed(2)}, Body Fat ${realTimeDiag.bodyFat?.toFixed(2)}%, FFMI ${realTimeDiag.ffmi.toFixed(2)}.
Target Workout Track: ${metrics.track} ${metrics.gymFocus ? `(Gym Focus: ${metrics.gymFocus})` : ''} ${metrics.homeEquipment ? `(Home equipment: adjustable dumbbells/kettlebells available)` : ''} ${metrics.hyroxFocus ? `(Hyrox Focus: ${metrics.hyroxFocus})` : ''}.
Standard Sports: ${metrics.sportsBaseline.length > 0 ? metrics.sportsBaseline.join(', ') : 'None'}.
Custom Activities / Sports (autocorrect spelling defaults e.g., 'badminon' -> Badminton): ${metrics.customSports || 'None'}.
Supplements Checklist: ${metrics.supplementsBaseline.length > 0 ? metrics.supplementsBaseline.join(', ') : 'None'}.
Custom Supplements consumed (autocorrect typing typos e.g., 'craetine' -> Creatine): ${metrics.customSupplements || 'None'}.
Special Physical Limitations / Pain Points (blacklist movements matching these): ${metrics.physicalLimitations || 'None'}.
Busy Hours Schedule: ${metrics.busyHours || 'None'}.
Free Target Windows: ${metrics.freeWindows || 'None'}.
Rotating Night/Shift Work Status: ${metrics.shiftWork ? 'ACTIVE SHIFT WORKER' : 'STANDARD DIURNAL SCHEDULE'}.
Dietary Culinary Track Preference: ${metrics.culinaryPreference} style delicious dishes.

COGNITIVE CRITICAL REQUIREMENTS:
1. Act as unified Certified Personal Trainer, Sports Nutritionist, and Circadian Sleep Specialist.
2. Override high BMI and treat them as a Muscular Athlete if they have highly developed FFMI (>20.0 for women, >22.0 for men) with lower body fat percentage. Do not recommend fat loss if they are muscularly dense!
3. Automatically correct spelling typos/slang in custom entries (e.g. 'craetine' -> Creatine, 'sakit lutut' -> Knee safety focus).
4. Schedule specific workouts and recovery slots matching busy and night-shift windows. Provide non-boring Indonesian/Asian/Western culinary recipe suggestions with complete nutrition/macro approximations. Highlight "Your diet should not be boring". Include sleep, sleep hygiene blockouts, and target supplement timings perfectly mapped around busy schedules.`;

    try {
      const res = await fetch('/api/generate-program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gender: metrics.gender,
          age: metrics.age,
          language: language,
          bmi: realTimeDiag.bmi,
          bodyFat: realTimeDiag.bodyFat,
          ffmi: realTimeDiag.ffmi,
          track: metrics.track,
          sportsBaseline: metrics.sportsBaseline,
          customSports: metrics.customSports,
          supplementsBaseline: metrics.supplementsBaseline,
          customSupplements: metrics.customSupplements,
          busyHours: metrics.busyHours,
          freeWindows: metrics.freeWindows,
          shiftWork: metrics.shiftWork,
          culinaryPreference: metrics.culinaryPreference,
          gymFocus: metrics.gymFocus,
          homeEquipment: metrics.homeEquipment,
          hyroxFocus: metrics.hyroxFocus,
          physicalLimitations: metrics.physicalLimitations,
          prompt: dynamicPrompt
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server rejected program calibration proposal.');
      }

      const generatedData = await res.json();
      setProgram(generatedData);
      setCompletedExercises({}); // reset exercise checked progression lines
      localStorage.setItem('grit_user_program_v2', JSON.stringify(generatedData));
      
      // Generation succeeded! Jump smooth to transition page 5
      setCurrentStep(5);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Error occurred communicating with GenAI server. Check keys.');
    } finally {
      setIsGenerating(false);
    }
  };

  const finalDiagnostic = program ? program.diagnostic : realTimeDiag;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col w-full font-sans transition-colors duration-300 relative overflow-x-hidden ${
      isDark 
        ? 'bg-[#0A0A0A] text-white selection:bg-[#CCFF00] selection:text-black' 
        : 'bg-[#F8FAFC] text-[#0F172A] selection:bg-[#84CC16] selection:text-white'
    }`} id="main-grip-app">
      
      {/* Decorative pulse glow spotlight background */}
      <div className={`absolute top-0 left-0 w-full h-[700px] pointer-events-none opacity-20 z-0 transition-all duration-300 ${
        isDark
          ? 'bg-[radial-gradient(circle_at_50%_0%,#CCFF0015_0%,transparent_60%),radial-gradient(circle_at_80%_80%,#10b98108_0%,transparent_50%)]'
          : 'bg-[radial-gradient(circle_at_50%_0%,#84CC160c_0%,transparent_60%),radial-gradient(circle_at_80%_80%,#05966904_0%,transparent_50%)]'
      }`}></div>

      {/* Prominent Header displaying logo branding, localized EN / ID switcher, theme switcher, and current diagnostics readout */}
      <Header 
        classification={finalDiagnostic.classification} 
        track={metrics.track} 
        bodyFat={finalDiagnostic.bodyFat || realTimeDiag.bodyFat || 0}
        ffmi={finalDiagnostic.ffmi || realTimeDiag.ffmi || 0}
        language={language}
        onLanguageToggle={setLanguage}
        theme={theme}
        onThemeToggle={handleToggleTheme}
      />

      {/* Main Single-Focused view content block */}
      <main className="relative z-10 flex-grow w-full min-h-screen grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 md:px-8 py-6" id="main-content-grid">
        
        {/* Step Routing Page Selector */}
        <div className="col-span-1 md:col-span-12 w-full flex flex-col justify-start">
          
          {/* Global Back-to-Dashboard safety net if profile already exists */}
          {[2, 3, 4].includes(currentStep) && program && (
            <div className="mb-4 flex justify-start no-print">
              <button
                onClick={() => setCurrentStep(6)}
                type="button"
                className={`text-xs font-mono font-black py-2 px-4 rounded border transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? 'bg-zinc-900 border-white/5 hover:border-[#CCFF00] text-[#CCFF00] hover:bg-zinc-850'
                    : 'bg-zinc-100 border-[#E2E8F0] hover:border-[#84CC16] text-[#84CC16] hover:bg-zinc-200'
                }`}
                id="back-to-active-dashboard"
              >
                <span>⬅ {isEn ? 'Back to Active Dashboard' : 'Kembali ke Dasbor'}</span>
              </button>
            </div>
          )}

          {/* PAGE 1: THE WELCOME GATE */}
          {currentStep === 1 && (
            <WelcomeGate 
              onStart={() => setCurrentStep(2)}
              onEnterDashboard={() => setCurrentStep(6)}
              hasProgram={!!program}
              language={language}
              theme={theme}
            />
          )}

          {/* PAGE 2: BIOLOGICAL METRICS FORM */}
          {currentStep === 2 && (
            <MetricsForm 
              metrics={metrics}
              onChange={setMetrics}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              language={language}
              theme={theme}
            />
          )}

          {/* PAGE 3: FITNESS & SCHEDULE CALIBRATION */}
          {currentStep === 3 && (
            <CalibrationForm 
              metrics={metrics}
              onChange={setMetrics}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
              language={language}
              theme={theme}
            />
          )}

          {/* PAGE 4: FLAVORFUL DIET & SUPPLEMENTATION */}
          {currentStep === 4 && (
            <NutritionForm 
              metrics={metrics}
              onChange={setMetrics}
              onGenerate={handleGenerateProgram}
              onBack={() => setCurrentStep(3)}
              isGenerating={isGenerating}
              generationError={generationError}
              language={language}
              theme={theme}
            />
          )}

          {/* PAGE 5: THE PORTAL TRANSITION (CTA BRIDGE) */}
          {currentStep === 5 && (
            <PortalTransition 
              onProceed={() => setCurrentStep(6)}
              language={language}
              theme={theme}
            />
          )}

          {/* PAGE 6: THE ULTIMATE ECOSYSTEM DASHBOARD (THE FINAL HUB) */}
          {currentStep === 6 && program && (
            <UltimateDashboard 
              program={program}
              metrics={metrics}
              completedExercises={completedExercises}
              onToggleExercise={handleToggleExercise}
              onReset={handleRecalibrateAndReset}
              language={language}
              theme={theme}
            />
          )}

        </div>
      </main>

      {/* Premium Professional Humanized Footer */}
      <footer className={`border-t bg-black/5 dark:bg-black/40 backdrop-blur-sm py-6 px-4 mt-auto text-center relative overflow-hidden no-print z-10 transition-colors ${
        isDark ? 'border-white/5 text-zinc-500' : 'border-zinc-250 text-slate-550'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
          <p>© 2026 BisaFit.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
