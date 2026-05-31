# ⚡ BisaFit.AI

> **Premium 360° Full-Screen Fitness, Localized Nutrition, and Shift-Work Circadian Alignment Assistant.**

---

BisaFit.AI is an elite-tier, interactive physical conditioning assistant designed to bypass the limitations of generic fitness calculators. It leverages high-dimensional biometric inputs, localized culinary databases, and real-time circadian mapping to construct optimal lifestyle routines for athletes, busy professionals, and night-shift workers alike.

---

## 🌌 The Problem

Achieving elite somatic wellness in the modern world is burdened by persistent friction:
- **Flawed Metrics:** Standard health checkers rely on generic body mass index (BMI) calculators, failing to differentiate between a highly muscular, low-body-fat athlete and an untrained individual.
- **Generic Nutrition:** Most meal plan engines restrict suggestions to standard Western ingredients (e.g., plain chicken breast and asparagus), creating food fatigue and cultural misalignment for Southeast Asian palates.
- **Circadian Mismatch:** Night shifts, irregular work slots, and poor caffeine timing windows wreck melatonin cycles, resulting in poor central nervous system (CNS) muscular recovery and stagnant health progress.

---

## ⚡ The Solution & Key Features

BisaFit.AI offers a structured, interactive, and clinically sound alternative featuring:

### 1. 📋 6-Page Chronological UI Wizard
A unified, single-screen-focused setup wizard that guides you smoothly from initial physical parameters through lifestyle calibration, up to the comprehensive diagnostic dashboard and active workout scheduler.

### 2. 🧮 Live Somatic Computer & Gauge Profiling
- **U.S. Navy Body Fat Method:** Calculates realistic body fat percentages (BFP) based on neck, waist, hip, and height circumference measurements rather than mere weight.
- **Fat-Free Mass Index (FFMI):** Computes precise skeletal muscle density scaled to height to detect elite athletic structures.
- **Biometric Tooltip Suite:** Seamlessly explains exactly how your physiological data is audited and cross-referenced under the hood.

### 3. 🏋️ Hybrid tracks & Exercise "Variety Packages"
- **Dynamic Training Paths:** Tailor schedules for *Gym Focus (Heavy HIT Overloads)*, *Home Workouts (Zero-Equipment Calisthenics)*, or *Hybrid (HYROX + Recreational activities)* to integrate evening runs, martial arts, or badminton.
- **Joint Pain Overrides:** Replaces high-compression lifts (e.g. heavy back squats or deadlifts) with spinal-safe, single-leg high-tension variations on physical limitations input.
- **Variety Substitutions:** Prescribes alternative exercises (e.g., Arnold Press secondary if Dumbbells are busy) to keep work flowing in crowded gyms.

### 4. 🍲 Anti-Boring Localized Nutrition
- Fully customizable culinary preference matching (*Clean Indonesian*, *Low-Carb Balinese*, *Vegetarian Fusion*, *Mixed Asian*).
- Formulates delicious, high-protein recipes containing rich, authentic ingredients such as tempeh, tofu, soy sauce, and aromatic local spices instead of bland western staples.

### 5. ⏰ Circadian Sleep & Caffeine Blackouts
- Maps optimal blackout sleeping blocks, melatonin-preserving evening protocols, and hard caffeine intake cut-off schedules.
- Dynamically shifts recommendations based on busy hours and night-shift work flags to synchronize muscle regeneration and metabolic health.

### 6. 🖨️ Native Browser PDF Export Engine
- Seamlessly compiles high-fidelity reports, daily calendars, workout grids, and diet guides into a clean print-ready format.

---

## 🛠️ Tech Stack

BisaFit.AI is powered by robust, high-performance web standards:
- **Framework:** [React 18+](https://react.dev/) inside [Vite](https://vitejs.dev/) for fast runtime hydration.
- **Language:** [TypeScript](https://www.typescriptlang.org/) for complete type safety across state variables.
- **Styles:** [Tailwind CSS](https://tailwindcss.com/) for high-contrast, beautiful layouts, glowing grid cells, and adaptive dark mode states.
- **Icons:** [Lucide React](https://lucide.dev/) for ultra-crisp SVG vector diagnostics.
- **AI Engine:** Google [Gemini Pro API](https://ai.google.dev/) proxy for highly specialized, bilingual training schedules.

---

## 🚀 How To Run Locally

Ensure you have [Node.js](https://nodejs.org/) installed, then spin up the environment with follow-up terminal commands:

1. **Clone & Navigate into directory:**
   ```bash
   cd ./
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example` and input your secrets:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch local development server:**
   ```bash
   npm run dev
   ```

5. **Examine Live Interface:**
   Open the browser server address, default is at `http://localhost:3000`.
