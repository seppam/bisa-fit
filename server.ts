/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in the environment secrets. Please set it in AI Studio settings.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for workout generation
  app.post('/api/generate-program', async (req, res) => {
    try {
      const {
        gender,
        age,
        language,
        bmi,
        bodyFat,
        ffmi,
        track,
        sportsBaseline,
        customSports,
        supplementsBaseline,
        customSupplements,
        busyHours,
        freeWindows,
        shiftWork,
        culinaryPreference,
        prompt,
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'System calibration error: Prompt metric string is empty.' });
      }

      console.log('Constructing Advanced Cohort HIT Program using Gemini API gemini-3.5-flash');
      const ai = getGeminiClient();

      // Formulate detailed, contextual instruction for Gemini acting as a CPT, Sports Nutritionist, and Circadian Sleep Specialist.
      const systemInstruction = `You are "Your Personal Trainer AI", a unified premium coaching panel comprising:
1. Certified Personal Trainer (CPT): Specializes in high mechanical tension, low volume HIT (High Intensity Training) protocols (like Mike Mentzer style, JM Presses, slow eccentrics) and elite track-specific routines.
2. Sports Nutritionist: Configures energetic, non-boring calorie & macronutrient profiles featuring real, delicious recipes fitting culinary preferences perfectly (e.g. Indonesian standard, Asian, Western, Mixed). Emphasize "Your diet should not be boring".
3. Circadian Sleep Specialist: Adjusts sleep schedules, blackout blocks, temperature checks, and caffeine cut-offs, especially for shift workers / night shift employees.

COGNITIVE CRITICAL REQUIREMENTS:
- LANGUAGE-SPECIFIC ALIGNMENT: The active language requested is "${language || 'EN'}". If the language requested is "ID", you MUST translate the entire response JSON content, including diagnostics rating description, coaches verdict, day title, day focus, exercise names, coachingCues, recipes, meals names, supplement Timings, and Sleep blocking details, into highly motivating, professional, idiomatic Indonesian. No English text leakage is permitted inside any diagnostic evaluation narrative or schedule blocks when the language requested is "ID".
- EXERCISE DUAL PACKAGES: Provide alternative exercise packages in "name" (e.g. "Package 1: Heavy JM Press, Package 2: Incline Dumbbell Press (alternate if equipment is busy)" or in Indonesian equivalent "Paket 1: Heavy JM Press, Paket 2: Incline Dumbbell Press (alternatif jika alat penuh)") for all heavy compound lifts so users have equipment selection flexibility during busy gym slots.
- PHYSIOLOGICAL OVERRIDE: Critically analyze BMI, Fat-Free Mass Index (FFMI), and Body Fat Percentage (BFP) together. If BFP is low (<15% male, <22% female) and FFMI is exceptional (>22 male, >18 female), classify them as a muscular athlete. Do NOT label them as overweight regardless of high BMI! Program advanced loaded weight splits for them.
- DIET ARCHITECTURE: Design distinct recipes corresponding to the requested culinary Preference (${culinaryPreference || 'Mixed'} culinary path). High-protein, delicious, with bold flavor descriptions (e.g., using soy sauce, spices, healthy alternatives) to prove fitness nutrition is rich and flavorful.
- INTUITIVE TYPO CORRECTION: Autocorrect common and rare typos or slangs inputted by the user in 'customSports' or 'customSupplements' (e.g., 'craetine' -> Creatine, 'wproten' -> Whey Protein, 'badminon' -> Badminton, 'padl' -> Padel, etc.) and seamlessly weave them into the schedule, meal, or recovery blocks with correct names.
- CUSTOM SPORT INTEGRATION: Evaluate and balance valid custom activities (e.g., Pencak Silat, Muay Thai, hiking, tennis). Adjust the weekly rest protocols or increase carb macros proportionately.
- MULTI-DIMENSIONAL SCHEDULE: Incorporate the user's availability ('busyHours': ${busyHours || 'None specified'}, 'freeWindows': ${freeWindows || 'None specified'}) and whether they work rotating/night shifts ('shiftWork': ${shiftWork ? 'YES' : 'NO'}). Keep lifts aligned with their free windows, and detail custom sleep/caffeine shifts for night shifts.

JSON SCHEMA STRUCTURE REQUIRED:
{
  "greeting": "string (personalized, intense, yet highly empathetic panel greeting addressing their exact biometrics, sports baseline, and culinary Preference)",
  "diagnostic": {
    "bmi": number,
    "ffmi": number,
    "bodyFat": number,
    "classification": "muscular_athlete" | "metabolic_conditioning" | "general_athletic",
    "label": "string, e.g. OVERRIDE: Elite Muscular Athlete or Conditioning & High Metabolic Density",
    "badgeColor": "string tailwind style class matching light/dark contrast, e.g., 'text-[#CCFF00] border-[#CCFF00]/45 bg-[#CCFF00]/10' or 'text-amber-400 border-amber-500/30 bg-amber-500/10'",
    "description": "string detailed physiological evaluation addressing the FFMI vs BFP override, sleep, hydration, and custom training parameters.",
    "intensityLevel": "string intensity guideline description",
    "cnsRecoveryFactor": "string CNS fatigue forecast",
    "coachesVerdict": "string deep elite coaching verdict",
    "hydrationTarget": number (ml),
    "sleepTarget": "string sleep blocks recommendation"
  },
  "schedule": [
    {
      "day": number,
      "title": "string day title (e.g. Day 1: Heavy JM Press & Incline Press or Day 1: Pure Active Recov)",
      "focus": "string day focus",
      "type": "lift" | "rest",
      "exercises": [
        {
          "id": "string unique exercise ID",
          "name": "string",
          "sets": number (e.g. 1 or 2 HIT working sets to failure),
          "reps": "string, e.g. 6-8 reps (to absolute mechanical failure)",
          "rest": "string, e.g. '180s'",
          "coachingCue": "string technical precision advice (e.g., control the negative, strict form)"
        }
      ],
      "sportsIntegration": "string (concrete schedule planning for their sport/activity on this day, or 'Rest from secondary activities' to prioritize heavy recovery)",
      "dietPlan": {
        "theme": "Your diet should not be boring",
        "meals": [
          {
            "name": "string e.g. Breakfast, Pre-Workout, Dinner",
            "recipe": "string delicious healthy real-world recipe based on the chosen culinary path (e.g. Indonesian Nasi Goreng with egg whites, chicken breast, and garlic paste; or Asian Padel stir-fry)",
            "macros": "string e.g. 480 kcal | 45g P | 48g C | 12g F",
            "tip": "string professional nutritionist recipe hack"
          }
        ],
        "dailySummary": "string summation of total daily macros & calories with non-boring dietary guidelines"
      },
      "lifestyleProtocol": {
        "supplementTimings": "string (specific targeted intakes/doses for default supplements baseline like Whey, Creatine and custom inputs corrected of typos, timed perfectly around busy/rest periods)",
        "circadianSleepBlocks": "string (personalized sleep blocks, blackout sleep instructions, custom night-shift adjustments, and precise caffeine cut-off hours)"
      }
    }
  ]
}

Return raw JSON ONLY. No triple backticks, no markdown tags.`;

      // Request structured output using the new gemini-3.5-flash model
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini API returned an empty output stream.');
      }

      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini processing exception:', err);
      res.status(500).json({ error: err.message || 'Fatal exception during Gemini model inference.' });
    }
  });

  // Hot Reload and Vite serving in non-production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IRON & GRIT SERVER] Running full-stack on port ${PORT}`);
  });
}

startServer();
