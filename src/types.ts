/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'male' | 'female';
export type TrainingTrack = 'gym' | 'home' | 'hyrox';
export type CulinaryPreference = 'Indonesian' | 'Asian' | 'Western' | 'Mixed';

export interface UserMetrics {
  gender: Gender;
  age: number | '';
  height: number | ''; // in cm
  weight: number | ''; // in kg
  neck: number | ''; // in cm
  waist: number | ''; // in cm
  hip: number | ''; // in cm
  track: TrainingTrack;
  sportsBaseline: string[];
  customSports: string;
  supplementsBaseline: string[];
  customSupplements: string;
  busyHours: string;
  freeWindows: string;
  shiftWork: boolean;
  culinaryPreference: CulinaryPreference;
  gymFocus?: string;
  homeEquipment?: boolean;
  hyroxFocus?: string;
  physicalLimitations?: string;
}

export type ClassificationType = 'muscular_athlete' | 'metabolic_conditioning' | 'general_athletic';

export interface DiagnosticResult {
  bmi: number;
  ffmi: number;
  bodyFat?: number; // Body Fat Percentage
  classification: ClassificationType;
  label: string;
  badgeColor: string;
  description: string;
  intensityLevel: string;
  cnsRecoveryFactor: string;
  coachesVerdict: string;
  hydrationTarget: number; // in ml
  sleepTarget: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  coachingCue: string;
  isCompleted?: boolean;
}

export interface PassiveRecoveryGuidelines {
  sleep: string;
  hydration: string;
  activeRecovery: string;
  coachTip: string;
}

export interface Meal {
  name: string;
  recipe: string;
  macros: string;
  tip: string;
}

export interface DayDietPlan {
  theme: string;
  meals: Meal[];
  dailySummary: string;
}

export interface DayLifestyleProtocol {
  supplementTimings: string;
  circadianSleepBlocks: string;
}

export interface WorkoutDay {
  day: number;
  title: string;
  focus?: string;
  type: 'lift' | 'rest';
  exercises: Exercise[];
  passiveRecoveryGuidelines?: PassiveRecoveryGuidelines;
  sportsIntegration?: string;
  dietPlan?: DayDietPlan;
  lifestyleProtocol?: DayLifestyleProtocol;
}

/**
 * Perform Physiological Calibration Diagnostic mapping BMI, FFMI, and BFP (Body Fat Percentage) together.
 * Override general BMI category if the user is a muscular athlete.
 */
export function calculateDiagnostic(metrics: UserMetrics): DiagnosticResult {
  if (!metrics.height || !metrics.weight) {
    return {
      bmi: 0,
      ffmi: 0,
      bodyFat: 0,
      classification: 'general_athletic',
      label: 'NOT CALIBRATED',
      badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700/30',
      description: 'System awaiting dynamic biometric parameter registration.',
      intensityLevel: 'None',
      cnsRecoveryFactor: 'None',
      coachesVerdict: 'Awaiting biometric calibration inputs. Slide or type measurements above to initiate diagnostics.',
      hydrationTarget: 0,
      sleepTarget: 'None',
    };
  }

  const heightInMeters = metrics.height / 100;
  const bmi = metrics.weight / (heightInMeters * heightInMeters);

  // US Navy BFP Formula
  let bodyFat = 0;
  const h = metrics.height;
  const n = metrics.neck || 35; // reasonable defaults for base math bounds if empty
  const wa = metrics.waist || 85; 
  const hi = metrics.hip || 90;

  if (metrics.gender === 'male') {
    const logArg = wa - n;
    if (logArg > 0) {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(logArg) + 0.15456 * Math.log10(h)) - 450;
    }
  } else {
    // female
    const logArg = wa + hi - n;
    if (logArg > 0) {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(logArg) + 0.22100 * Math.log10(h)) - 450;
    }
  }

  if (bodyFat < 0 || isNaN(bodyFat) || !isFinite(bodyFat)) {
    bodyFat = 0;
  }
  bodyFat = parseFloat(bodyFat.toFixed(2));

  // FFMI Formula: Fat Free Mass (FFM) = Weight * (1 - (BodyFat/100))
  const ffm = metrics.weight * (1 - (bodyFat / 100));
  const nativeFfmi = ffm / (heightInMeters * heightInMeters);
  const normalizedFfmi = nativeFfmi + 6.1 * (1.8 - heightInMeters);

  // Use normalized FFMI as it's more accurate for vertical height variations
  const ffmiToUse = isNaN(normalizedFfmi) ? 19.0 : parseFloat(normalizedFfmi.toFixed(2));

  let classification: ClassificationType = 'general_athletic';
  let label = 'General Athletic Conditioning';
  let badgeColor = 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
  let description = 'Optimal for lifters seeking standard high-intensity conditioning, balanced recovery, and healthy body composition maintenance.';
  let intensityLevel = 'Moderate-High HIT (Standard Strength)';
  let cnsRecoveryFactor = 'Standard 72-Hour Rotation';
  let coachesVerdict = 'You are in a healthy, active baseline. We will stimulate lean tissue synthesis and maintain systemic health with standard HIT progression.';

  // Calculate targets based on weight
  const hydrationTarget = Math.round(metrics.weight * 35); // 35ml per kg of bodyweight
  const sleepTarget = '8.0 - 8.5 Hours';

  // MUSCULAR ATHLETE CLASSIFICATION OVERRIDE:
  // Male: BFP < 15%, FFMI >= 21.5
  // Female: BFP < 24%, FFMI >= 17.5
  const isHighFfmi = metrics.gender === 'male' ? ffmiToUse >= 21.5 : ffmiToUse >= 17.5;
  const isLowBfp = metrics.gender === 'male' ? bodyFat <= 15.0 : bodyFat <= 24.0;

  if (isHighFfmi && isLowBfp) {
    classification = 'muscular_athlete';
    label = 'OVERRIDE: Elite Muscular Athlete';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse';
    description = 'PHYSIOLOGICAL OVERRIDE ACTIVATED. Although BMI suggests an "overweight" status, your highly exceptional FFMI and elite single-digit/low-double-digit Body Fat Percentage indicate supreme dense muscle mass. Overriding standard BMI matrix rules.';
    intensityLevel = 'Advanced Loaded Hypertrophy & Strength HIT (Failure Guided)';
    cnsRecoveryFactor = 'Extended Central Nervous System Recovery (High Resistance Loads)';
    coachesVerdict = 'LISTEN UP, SOLDIER: Standard calorie-deficit rules are dead to us. Your engine is massive. You require heavy, low-rep mechanical tension to failure combined with extensive passive rest windows to allow your neural pathways to supercompensate. Do not touch volume; chase absolute load.';
  } else if (bmi >= 25 && bodyFat >= (metrics.gender === 'male' ? 20.0 : 28.0)) {
    // HIGH BMI, LOW FFMI (or typical), HIGH BFP -> Conditioning Focus
    classification = 'metabolic_conditioning';
    label = 'Conditioning & High Metabolic Density';
    badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    description = 'Focusing heavily on high-density loaded metabolic protocols. Your current physiological metrics indicate elevated fat stores requiring high metabolic rate stimulus while preserving active functional strength.';
    intensityLevel = 'High Metabolic Density HIT (Cardio-Resistance Fusion)';
    cnsRecoveryFactor = 'Active Metabolic Ventilation rotation';
    coachesVerdict = 'WE ARE GOING FOR HIGH DENSITY. Shorter recovery windows, strict explosive concentric movements, and heavy mechanical triggers. You will force systemic fat oxidation while securing your structural skeletal mass under load.';
  }

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    ffmi: ffmiToUse,
    bodyFat,
    classification,
    label,
    badgeColor,
    description,
    intensityLevel,
    cnsRecoveryFactor,
    coachesVerdict,
    hydrationTarget,
    sleepTarget,
  };
}

/**
 * Generate 7-day training schedule based on calibration diagnostic
 */
export function generateWorkoutSchedule(metrics: UserMetrics, diagnostic: DiagnosticResult): WorkoutDay[] {
  const isGym = metrics.track === 'gym';
  const isMuscular = diagnostic.classification === 'muscular_athlete';
  const isConditioning = diagnostic.classification === 'metabolic_conditioning';

  // Base rest day configuration
  const restDayPassiveRecovery = (dayIndex: number): PassiveRecoveryGuidelines => {
    const hydrationString = `Hydration Threshold: ${Math.round(diagnostic.hydrationTarget * 1.1)} ml (Increase intake due to cell saturation). Supplement with 1000mg Sodium and 200mg Potassium split across active windows.`;
    const sleepString = `Optimized Sleep: ${diagnostic.classification === 'muscular_athlete' ? '8.5 - 9.0' : '8.0 - 8.5'} Hours. Complete dark environment, temperature under 19°C. Shut off blue screens 60 minutes before bed to allow immediate delta-wave CNS recovery.`;
    
    let activeRecString = 'Nervous System Recovery: 45-60 min Zone 1 recovery walk. Limit structural spinal loading to zero.';
    let tipString = 'GROWTH HAPPENS NOW: Muscles do not grow while you are tearing them apart in the clay. Rest is an active, aggressive process of structural repair. Respect it.';

    if (dayIndex === 3) {
      activeRecString = 'Mid-Block Passive Restoration: 45 min slow active walking. Optional mobility stretch emphasizing shoulder girdles and posterior hip-hinge release.';
      tipString = 'CNS FLUSH: Your central nervous system is a circuit board. Give it room to cool down. Heavy lifts load the spinal column; today is completely unloaded.';
    } else if (dayIndex === 6) {
      activeRecString = 'Deep Systemic Decompression: Low impact walking or gentle foam rolling. Focus on diaphragm breathing (4-second inhale, 8-second exhale) for 15 minutes.';
      tipString = 'SUPERCOMPENSATION TRIGGER: You will return on Day 1 stronger only if you let your myofibrils repair fully. Do not add supplementary cardio today.';
    }

    return {
      sleep: sleepString,
      hydration: hydrationString,
      activeRecovery: activeRecString,
      coachTip: tipString,
    };
  };

  if (isGym) {
    if (isMuscular) {
      // ADVANCED GYM TRACK - HIGH FFMI & LOW FAT BFP (Advanced Lifter)
      return [
        {
          day: 1,
          title: 'Day 1: Upper Clavicular Chest & Lats',
          focus: 'Target Muscle Group Focus: Upper Chest fibers (clavicular emphasis) & Latissimus Dorsi heavy width. Maximum mechanical tension.',
          type: 'lift',
          exercises: [
            {
              id: 'g_m_d1_1',
              name: 'Reverse Grip Incline Press (Barbell)',
              sets: 3,
              reps: '6-8 reps (to absolute concentric failure)',
              rest: '120 seconds (Mandatory rest)',
              coachingCue: 'Adopt an underhand shoulder-width grip. Keep elbows tucked forward at a 45-degree angle. Press explosively and control the negative for 3 full seconds to stimulate upper chest hypertrophy.'
            },
            {
              id: 'g_m_d1_2',
              name: 'Heavy Weighted Chin-ups OR Lat Pulldowns',
              sets: 3,
              reps: '6-8 reps (Failure localized)',
              rest: '120 seconds',
              coachingCue: 'Control the stretch at the bottom for 1 second. Drive your elbows directly toward your pockets; don\'t just pull with your forearms.'
            },
            {
              id: 'g_m_d1_3',
              name: 'Incline Dumbbell Fly-Press Hybrid',
              sets: 2,
              reps: '8 reps (Peak torque execution)',
              rest: '90 seconds',
              coachingCue: 'Flare out into a stretch, but press up with a close squeeze. Do not let dumbbells touch at the top as you sustain tension on the upper chest.'
            },
            {
              id: 'g_m_d1_4',
              name: 'Heavy Dumbbell Meadow Rows (Chest Supported Rows)',
              sets: 3,
              reps: '6-8 reps',
              rest: '90 seconds',
              coachingCue: 'Force strong spinal stabilization. Drive the elbow past the ribcage, squeezing the lower lat hard.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: Arm Devastation & Medial Shoulders',
          focus: 'Target Muscle Group Focus: Triceps (Triceps Long/Lateral emphasis), Biceps, and Medial Deltoid lateral fibers.',
          type: 'lift',
          exercises: [
            {
              id: 'g_m_d2_1',
              name: 'JM Press (with Barbell or EZ Bar)',
              sets: 3,
              reps: '6-8 reps (Heavy HIT load)',
              rest: '90-120 seconds',
              coachingCue: 'Lower the bar in an oblique path towards your throat/nose. Keep elbows tucked forward, allowing natural flexion of the elbow. Expel immense power upward.'
            },
            {
              id: 'g_m_d2_2',
              name: 'Heavy Incline Dummy Curl (Long Head Stretch)',
              sets: 3,
              reps: '6-8 reps',
              rest: '90 seconds',
              coachingCue: 'Adjust incline bench to 45°. Let arms lock completely straight at the bottom. Curl with zero swinging; squeeze biceps at prime peak torque.'
            },
            {
              id: 'g_m_d2_3',
              name: 'Heavy Dumbbell Lateral Raises (Control Negatives)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Lean slightly forward. Drive the weight out to the sides rather than upwards. Control the drift down. Avoid using momentum.'
            },
            {
              id: 'g_m_d2_4',
              name: 'Dumbbell Hammer Curls (Brachialis Accent)',
              sets: 2,
              reps: '8 reps',
              rest: '90 seconds',
              coachingCue: 'Hold weights with a neutral wrist. Squeeze the forearm and brachialis joint with immense structural control.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: Passive Supercompensation & Neural Recovery',
          focus: 'Zero Structural Load. CNS restoration, glycogen replenishment, and muscle protein synthesis saturation.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Posterior Chain & Heavy Quad Density',
          focus: 'Target Muscle Group Focus: Quads, Hamstrings (Sartorius / Biceps Femoris), and Lower Back structural stability.',
          type: 'lift',
          exercises: [
            {
              id: 'g_m_d4_1',
              name: 'Heavy Barbell Hack Squat OR Front Squats',
              sets: 3,
              reps: '6-8 reps (Heavy Loaded Tension)',
              rest: '120 seconds',
              coachingCue: 'Stand with feet shoulder-width. Drive hips straight down. Do not compromise depth. Explode through the heels and stop just short of lockout to preserve muscle load.'
            },
            {
              id: 'g_m_d4_2',
              name: 'Romanian Deadlifts (Hamstring Stretch Focus)',
              sets: 3,
              reps: '6-8 reps',
              rest: '120 seconds',
              coachingCue: 'Hinge back aggressively pushing hips toward the rear wall. Keep spine perfectly neutral. Lower until hamstrings scream, then drive hips forward.'
            },
            {
              id: 'g_m_d4_3',
              name: 'Deficit Calf Raises (Full Stretch Hold)',
              sets: 3,
              reps: '8-10 reps with 2-sec stretch pause',
              rest: '90 seconds',
              coachingCue: 'Lower calves into deep stretch, pause for 2 full seconds to completely neutralize Achilles tendon elastic recoil, then press explosively.'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Upper-Body Rotational Load (Chest & Back Width)',
          focus: 'Target Muscle Group Focus: Hypertrophy overload for Pecs, Lats, Posterior Deltoid, and upper shoulder girdle.',
          type: 'lift',
          exercises: [
            {
              id: 'g_m_d5_1',
              name: 'Reverse Grip Incline Dumbbell Press',
              sets: 3,
              reps: '6-8 reps',
              rest: '120 seconds',
              coachingCue: 'Hold dumbbells with reverse grip (palms facing back). Lower slowly with elbows close to ribs. Squeeze the inner collar / upper chest line with absolute mechanical force.'
            },
            {
              id: 'g_m_d5_2',
              name: 'Chest Supported T-Bar Rows (Upper Back Focus)',
              sets: 3,
              reps: '6-8 reps',
              rest: '90 seconds',
              coachingCue: 'Flared elbows at 70° to isolate the posterior deltoid, rhomboids, and lower trap fibers. Row up and hold for 1 second.'
            },
            {
              id: 'g_m_d5_3',
              name: 'Cable Overhead Triceps Extensions',
              sets: 2,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Extend cable straight over the skull, keeping elbows completely stationary to isolate the long head.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Deep Systemic Supercompensation',
          focus: 'Absolute passive recovery window. Reheating nervous system synapses. Glycogen synthesis accent.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Work Capacity Threshold & Core Stability',
          focus: 'Target Focus: Abs, Obliques, Forearm grip capacity, and low-impact cardiovascular conditioning.',
          type: 'lift',
          exercises: [
            {
              id: 'g_m_d7_1',
              name: 'Weighted Hanging Leg Raises',
              sets: 3,
              reps: '8-10 reps (Slow controlled)',
              rest: '60 seconds',
              coachingCue: 'Hang from pullup bar. Squeeze a light dumbbell in your feet. Keep legs straight and lift past 90 degrees to load rectus abdominis without hip-flexor swing.'
            },
            {
              id: 'g_m_d7_2',
              name: 'Heavy Farmer Walk Isometric Load',
              sets: 3,
              reps: '45 seconds under load (Heavy dumbbells)',
              rest: '90 seconds',
              coachingCue: 'Brace core with iron stiffness. Take short, heel-to-toe steps. Squeeze dumbbells aggressively to exhaust forearm grip strength.'
            },
            {
              id: 'g_m_d7_3',
              name: 'Low-Load Aerobic Recumbent Ride',
              sets: 1,
              reps: '30 min @ Zone 2 Active Recovery',
              rest: 'No Rest / Continuous',
              coachingCue: 'Keep breathing controlled. Keep heart rate strictly in active Zone 2 (aerobic recovery) to flush structural metabolites from lower extremities.'
            }
          ]
        }
      ];
    } else if (isConditioning) {
      // HIGH BODY FAT, LOW FFMI (Conditioning Focus)
      return [
        {
          day: 1,
          title: 'Day 1: High Metabolic Upper Pull & Push',
          focus: 'Target Focus: Hypertrophy & high density glycogen burn. Short rest intervals to maximize cardiac output and fat-oxidation.',
          type: 'lift',
          exercises: [
            {
              id: 'g_c_d1_1',
              name: 'Reverse Grip Incline Dumbbell Press',
              sets: 3,
              reps: '8-10 reps (Metabolic density)',
              rest: '90 seconds',
              coachingCue: 'Sustained tempo: 2s down, 1s up. Stay in highly structured tension.'
            },
            {
              id: 'g_c_d1_2',
              name: 'Dumbbell Rows (Single Arm)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Intense pulls. Drive blood into the lats with speed and strict eccentric.'
            },
            {
              id: 'g_c_d1_3',
              name: 'Standing Dumbbell Shoulder Thrusters',
              sets: 3,
              reps: '10-12 reps',
              rest: '75 seconds',
              coachingCue: 'Clean and press compound motion. Demands cardiac and core stability.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: High Metabolic Cardio-Resistance Leg Overload',
          focus: 'Target Focus: Complete leg recruitment and heart rate elevation.',
          type: 'lift',
          exercises: [
            {
              id: 'g_c_d2_1',
              name: 'Goblet Squats (Heavy Dumbbell)',
              sets: 3,
              reps: '10-12 reps',
              rest: '90 seconds',
              coachingCue: 'Hold dumbbell high at chest. Keep torso upright. Drive up aggressively.'
            },
            {
              id: 'g_c_d2_2',
              name: 'Dumbbell Romanian Deadlifts',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Maximum hamstring loading with tight back. Control the deep stretch.'
            },
            {
              id: 'g_c_d2_3',
              name: 'Kettlebell Swings (or Dumbbell Swings)',
              sets: 3,
              reps: '15 reps (Explosive Hips)',
              rest: '60 seconds',
              coachingCue: 'Hinge violently. Fire glutes and core. Utilize arms strictly as cables.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: CNS Rest & Core Metabolic Reset',
          focus: 'Active recovery. Low-intensity glycogen replenishment.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Arm Hypertrophy & Medial Delt Focus',
          focus: 'Target Focus: Dynamic localized arms pump with technical HIT sets.',
          type: 'lift',
          exercises: [
            {
              id: 'g_c_d4_1',
              name: 'JM Press with Smith Machine or Barbell',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Safety first. Maintain forearm angle of 60° to avoid wrist loading. Blow the elbows straight out.'
            },
            {
              id: 'g_c_d4_2',
              name: 'Standing Alternating Dumbbell Curls',
              sets: 3,
              reps: '8-10 reps',
              rest: '75 seconds',
              coachingCue: 'Supinate fully at the top. Hard contraction on biceps Peak.'
            },
            {
              id: 'g_c_d4_3',
              name: 'Dumbbell Lateral Raise to Front Raise Hybrid',
              sets: 3,
              reps: '10 reps (5 lateral, 5 front)',
              rest: '75 seconds',
              coachingCue: 'Keep shoulders depressed down. Isolate the medial and forward delt heads.'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Full Body Functional HIIT (Gym Edition)',
          focus: 'Target Focus: Maximum caloric expenditure through functional weights.',
          type: 'lift',
          exercises: [
            {
              id: 'g_c_d5_1',
              name: 'Barbell Push Press',
              sets: 3,
              reps: '8 reps (Explosive)',
              rest: '90 seconds',
              coachingCue: 'Dip hips slightly and brace core. Use triple extension of ankles, knees, and hips.'
            },
            {
              id: 'g_c_d5_2',
              name: 'Cable Woodchoppers (Metabolic Obliques)',
              sets: 3,
              reps: '12 reps per side',
              rest: '60 seconds',
              coachingCue: 'Rotate the hips and pivot rear foot. Keep chest up; slice down aggressively.'
            },
            {
              id: 'g_c_d5_3',
              name: 'Assault Bike or Rower Intervals',
              sets: 1,
              reps: '8 rounds of 20s sprint / 40s rest',
              rest: 'Continuous Interval',
              coachingCue: 'Go all-out. Saturate the oxygen system and ignite thermogenic burn.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Deep Systemic recovery',
          focus: 'Passive glycogen reset.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Functional Work Capacity',
          focus: 'Cardio endurance and core recovery.',
          type: 'lift',
          exercises: [
            {
              id: 'g_c_d7_1',
              name: 'Hanging Knee Raises (Slow Tempo)',
              sets: 3,
              reps: '12 reps',
              rest: '60 seconds',
              coachingCue: 'Concentrate on drawing the pelvis up. Keep movement slow on negative.'
            },
            {
              id: 'g_c_d7_2',
              name: 'Incline Treadmill Sled Rucking / Walk',
              sets: 1,
              reps: '40 minutes @ 12% incline, 4.5 km/h',
              rest: 'Continuous',
              coachingCue: 'Keep chest high. Do not grab the handrails; let your hamstrings work.'
            }
          ]
        }
      ];
    } else {
      // GENERAL GYM TRACK
      return [
        {
          day: 1,
          title: 'Day 1: Upper Chest & Back Hypertrophy',
          focus: 'Target: Standard structural muscle balance. Strong mechanical tension.',
          type: 'lift',
          exercises: [
            {
              id: 'g_g_d1_1',
              name: 'Reverse Grip Incline Press (Barbell)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Safely control weight down, target upper collar muscles.'
            },
            {
              id: 'g_g_d1_2',
              name: 'Lat Pulldowns (Medium Wide)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Squeeze the shoulder blades back first, pull to collarbone.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: Arm Devastation & Shoulders',
          focus: 'Target: Concentric joint loading for tris & bis.',
          type: 'lift',
          exercises: [
            {
              id: 'g_g_d2_1',
              name: 'JM Press with Barbell',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Keep elbows forward, lower down to chin, press upward.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: Supercompensation Restoration',
          focus: 'Passive glycogen reset.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Legs & Posterior Chain Stability',
          type: 'lift',
          focus: 'Target: Lower-body compound alignment.',
          exercises: [
            {
              id: 'g_g_d4_1',
              name: 'Front Squats or Hack Squats',
              sets: 3,
              reps: '8-10 reps',
              rest: '120s',
              coachingCue: 'Focus on full range. Do not rush the eccentric path.'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Secondary Push & Pull Workouts',
          type: 'lift',
          focus: 'Target: Upper body localized hypertrophy.',
          exercises: [
            {
              id: 'g_g_d5_1',
              name: 'Reverse Grip Incline Dumbbell Press',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Dumbbell reverse grip rotation at peak contraction.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Full Glycogen Restoration',
          type: 'rest',
          focus: 'Passive Recovery',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Functional Core Alignment',
          type: 'lift',
          focus: 'Target: core durability and active cardio.',
          exercises: [
            {
              id: 'g_g_d7_1',
              name: 'Hanging Leg Raises',
              sets: 3,
              reps: '10-12 reps',
              rest: '60s',
              coachingCue: 'Draw knees deep up into rectus muscle squeeze.'
            }
          ]
        }
      ];
    }
  } else {
    // HOME TRACK (ZERO EQUIPMENT)
    if (isMuscular) {
      // ADVANCED HOME DETAILED TRACK (Muscular Athlete)
      return [
        {
          day: 1,
          title: 'Day 1: Upper Chest & Lats Width (Home HIT)',
          focus: 'Target Muscle Group Focus: Upper Chest fibers using gravity incline mechanics & Lat dorsal width with body bracing. No heavy equipment.',
          type: 'lift',
          exercises: [
            {
              id: 'h_m_d1_1',
              name: 'Declined Pike Reverse Grip Push-ups (Feet Elevated)',
              sets: 3,
              reps: '8-10 reps (Ultra-Slow 4s negative)',
              rest: '90 seconds',
              coachingCue: 'Elevate your feet on a chair or bed. Place hands facing backward (or slightly flared out for comfort). Dip head down carefully, utilizing your bodyweight to overload the upper clavicular chest and forward delts.'
            },
            {
              id: 'h_m_d1_2',
              name: 'Under-Table Inverted Lat Pull-ups',
              sets: 3,
              reps: '8-10 reps (Sustained peak squeeze)',
              rest: '90 seconds',
              coachingCue: 'Lie under a heavy sturdy dining table. Grip the table edge, keep your body perfectly straight like a plank, and pull your sternum up to the table edge. Squeeze lats hard.'
            },
            {
              id: 'h_m_d1_3',
              name: 'Wall-Back Glide Lat Scapular Pulls',
              sets: 2,
              reps: '12 reps (High motor unit recruitment)',
              rest: '60 seconds',
              coachingCue: 'Place your back flat against a wall, elbows at 90°. Aggressively force elbows into the wall behind you, sliding your upper back forward using pure lat tension.'
            },
            {
              id: 'h_m_d1_4',
              name: 'Wide Grip Floor Push-ups (Deficit on Books)',
              sets: 3,
              reps: '10 reps (To concentric failure)',
              rest: '90 seconds',
              coachingCue: 'Elevate your hands slightly by placing them on sturdy stacks of books. Lower deep below standard chest rest to over-stretch the pectoral fibers, then explode up.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: Arm Overload & Shoulder Girdle HIT (Home)',
          focus: 'Target Muscle Group Focus: Triceps extension joints, Brachialis, and Lateral Shoulder fibers using bodyweight loading.',
          type: 'lift',
          exercises: [
            {
              id: 'h_m_d2_1',
              name: 'Tiger-Bend / Triceps Extension Plank Pushups',
              sets: 3,
              reps: '8-10 reps (Extremely intense)',
              rest: '90 seconds',
              coachingCue: 'Begin in a forearm plank. Keep your palms flat. Push through your triceps to extend your elbows and raise your entire body into a high pushup plank. Lower back to forearms with total control. Squeezes triceps enormously.'
            },
            {
              id: 'h_m_d2_2',
              name: 'Isometric Towel Biceps Curl Hold (Max Tension)',
              sets: 3,
              reps: '30 seconds under maximum contraction',
              rest: '75 seconds',
              coachingCue: 'Stand on a large towel. Grip ends, bend elbows at 90°. Attempt to pull up with 100% force. Do not let go; recruit maximum motor fibers for 30s.'
            },
            {
              id: 'h_m_d2_3',
              name: 'Bodyweight Pike Shoulder Press',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Enter a high downward-dog posture (piked hips). Push head diagonally down toward the ground, keeping elbows flared out slightly to load the lateral deltoids.'
            },
            {
              id: 'h_m_d2_4',
              name: 'Doorframe Single-Arm Pulls (Bicep/Brachialis emphasis)',
              sets: 2,
              reps: '10 reps each arm',
              rest: '60 seconds',
              coachingCue: 'Grip a solid doorframe with one hand, feet close to frame. Lean in, pull your body dynamically toward the frame using the single bicep under peak tension.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: Supercompensation Rest & CNS Reset',
          focus: 'Zero Joint Loading. Passive glycogen saturation and central nervous system decompression.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Lower Body Devastation (Home Loaded Splits)',
          focus: 'Target Muscle Group Focus: Quad mechanical tension, single-leg stabilization, and hamstrings posterior hinge without weights.',
          type: 'lift',
          exercises: [
            {
              id: 'h_m_d4_1',
              name: 'Single-Leg Pistol Squat (Chair Assisted)',
              sets: 3,
              reps: '6-8 reps (Each Leg)',
              rest: '90 seconds',
              coachingCue: 'Extend one leg. Lower slowly onto a low chair or bench, then drive straight up using only the active heel. Control the balance.'
            },
            {
              id: 'h_m_d4_2',
              name: 'Slick Hamstring Floor Slides (Sock/Towel Mode)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Lie on back, feet on a slippery surface (towel on wood floor). Lift hips into bridge, slide heels away slowly, then drag heels back aggressively while contracting hamstrings.'
            },
            {
              id: 'h_m_d4_3',
              name: 'Braced Isometric Wall squat (To Failure)',
              sets: 2,
              reps: 'Sustained hold to muscle block (Failure)',
              rest: '90 seconds',
              coachingCue: 'Slide back straight against wall. Bend knees at 90 degrees. Force quadriceps tension actively. Do not place hands on thighs!'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Upper Recovery & Core Stabilizing HIT',
          focus: 'Target Focus: Upper fibers chest, scapular retraction width, and abdominal core.',
          type: 'lift',
          exercises: [
            {
              id: 'h_m_d5_1',
              name: 'Reverse Grip Decline Push-ups (Hands on floor, feet on chair)',
              sets: 3,
              reps: '8-10 reps',
              rest: '90 seconds',
              coachingCue: 'Reverse hand placement. Lower head down with control, direct chest to push upward using upper pec recruitment.'
            },
            {
              id: 'h_m_d5_2',
              name: 'Towel Superman Row-Pulls',
              sets: 3,
              reps: '10 reps (Sustained back lock)',
              rest: '75 seconds',
              coachingCue: 'Lie on belly. Pull a tight towel to your chest, lifting legs and torso. Pull elbows back with immense back squeeze.'
            },
            {
              id: 'h_m_d5_3',
              name: 'Chair Dips (Heavy Bodyweight)',
              sets: 3,
              reps: '10 reps (Tempo 3-0-1)',
              rest: '90 seconds',
              coachingCue: 'Extend feet out straight to add load. Lower chest to stretch shoulders, squeeze triceps at top.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Deep Systemic Supercompensation',
          focus: 'Glycogen reset. Avoid metabolic activity to allow myofibrilar structural healing.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Work Capacity Threshold & Core Alignment (Home)',
          focus: 'Target: Abdominals, cardiovascular oxygenation focus, and deep stabilizer activation.',
          type: 'lift',
          exercises: [
            {
              id: 'h_m_d7_1',
              name: 'L-Sit Floor Progressions / Knee Tucks',
              sets: 3,
              reps: '15 seconds hold or 10 Knee raises',
              rest: '60 seconds',
              coachingCue: 'Sit on floor, hands by hips. Drive shoulders down, elevate butt and pull knees into chest, holding with raw core strength.'
            },
            {
              id: 'h_m_d7_2',
              name: 'Burpee Squat Jump Intervals (Oxidative)',
              sets: 3,
              reps: '45 seconds max explosive intensity',
              rest: '90 seconds',
              coachingCue: 'Commit to full chest-to-ground contact, spring up explosively, driving knees high into vertical leap.'
            },
            {
              id: 'h_m_d7_3',
              name: 'Dynamic Plank-To-Pushup transitions',
              sets: 2,
              reps: '12 alternating transitions',
              rest: '60 seconds',
              coachingCue: 'Switch from forearm plank to high pushup plank, keeping hips locked. Do not swing the pelvis.'
            }
          ]
        }
      ];
    } else if (isConditioning) {
      // HIGH BODY FAT CONDITIONING (Home)
      return [
        {
          day: 1,
          title: 'Day 1: Metabolic Bodyweight Burner',
          focus: 'Target Focus: high metabolic density and constant motion to induce rapid calorie burn.',
          type: 'lift',
          exercises: [
            {
              id: 'h_c_d1_1',
              name: 'Declined Push-ups (Tempo)',
              sets: 3,
              reps: '10-12 reps',
              rest: '75s',
              coachingCue: 'Keep elbows in. Control the negative drop, push up quickly.'
            },
            {
              id: 'h_c_d1_2',
              name: 'Bodyweight Towel Rows (Door Anchor)',
              sets: 3,
              reps: '12-15 reps',
              rest: '60s',
              coachingCue: 'Lean back with bodyweight, pull chest to door anchor.'
            },
            {
              id: 'h_c_d1_3',
              name: 'Plyometric Jump Squats',
              sets: 3,
              reps: '12-15 reps',
              rest: '60s',
              coachingCue: 'Dip into squat depth, explode into vertical jump.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: Lower Extremity Metabolic Push',
          focus: 'Target: Quads and glutes density.',
          type: 'lift',
          exercises: [
            {
              id: 'h_c_d2_1',
              name: 'Deep Bodyweight Air Squats',
              sets: 3,
              reps: '15-20 reps',
              rest: '60s',
              coachingCue: 'Sustained piston-like reps. Do not lock out at the top.'
            },
            {
              id: 'h_c_d2_2',
              name: 'Slick Hamstring towel curls',
              sets: 3,
              reps: '10-12 reps',
              rest: '75s',
              coachingCue: 'Keep hips raised high throughout the full slide length.'
            },
            {
              id: 'h_c_d2_3',
              name: 'Speed Skater Lunges',
              sets: 3,
              reps: '45 seconds continuous work',
              rest: '60s',
              coachingCue: 'Alternate lateral bounds with explosive side-to-side mechanics.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: Passive Reset & Metabolic Flow',
          focus: 'Mild mobility work.',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Upper Core & Arms Density',
          focus: 'Target: Upper torso arms pump.',
          type: 'lift',
          exercises: [
            {
              id: 'h_c_d4_1',
              name: 'Tiger-Bend plank Tricep presses',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Focus tension strictly on the elbow extensor lockouts.'
            },
            {
              id: 'h_c_d4_2',
              name: 'Pike push-ups',
              sets: 3,
              reps: '10 reps',
              rest: '75s',
              coachingCue: 'Drive the nose slightly forward of the hands; target shoulders.'
            },
            {
              id: 'h_c_d4_3',
              name: 'Plank Shoulder Taps',
              sets: 3,
              reps: '30 seconds fast taps',
              rest: '60s',
              coachingCue: 'Keep glutes locked, keep body completely still.'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Full Body Metabolic Firestorm',
          focus: 'Target Focus: Explosive full body calorie expenditure.',
          type: 'lift',
          exercises: [
            {
              id: 'h_c_d5_1',
              name: 'Chests-to-Ground Burpees',
              sets: 3,
              reps: '12 reps',
              rest: '75s',
              coachingCue: 'No slowing down. Smooth transitions down and vertical leap.'
            },
            {
              id: 'h_c_d5_2',
              name: 'Mountain Climbers (Rapid)',
              sets: 3,
              reps: '45 seconds work interval',
              rest: '60s',
              coachingCue: 'Piston knees rapidly into the torso. Squeeze abs.'
            },
            {
              id: 'h_c_d5_3',
              name: 'Shadow Boxing Squat-bobbing',
              sets: 3,
              reps: '60 seconds continuous punches and slips',
              rest: '60s',
              coachingCue: 'Stay light on feet. Throw crisp combinations with core twist.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Glycogen Supercompensation',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Cardiovascular Active flush',
          focus: 'Aerobic restoration.',
          type: 'lift',
          exercises: [
            {
              id: 'h_c_d7_1',
              name: 'Laying Leg Raise Flutters',
              sets: 3,
              reps: '45 seconds work',
              rest: '60s',
              coachingCue: 'Place hands under lower back. Swim feet low to the carpet.'
            },
            {
              id: 'h_c_d7_2',
              name: 'Low-Impact Walk or Jump Rope (Unloaded)',
              sets: 1,
              reps: '30 minutes zone 1 walking',
              rest: 'Continuous',
              coachingCue: 'Steady fluid stroll to refresh structural muscles.'
            }
          ]
        }
      ];
    } else {
      // GENERAL HOME TRACK
      return [
        {
          day: 1,
          title: 'Day 1: Upper Chest & Back (Home)',
          focus: 'Target: General bodyweight push and pull.',
          type: 'lift',
          exercises: [
            {
              id: 'h_g_d1_1',
              name: 'Reverse Hand Incline Pushups',
              sets: 3,
              reps: '10-12 reps',
              rest: '90s',
              coachingCue: 'Turn fingers outward/slightly back on elevated surface. Press.'
            },
            {
              id: 'h_g_d1_2',
              name: 'Doorframe Single-Arm Pulls',
              sets: 3,
              reps: '10-12 reps',
              rest: '90s',
              coachingCue: 'Grip solid wall corner/doorframe, pull chest tight.'
            }
          ]
        },
        {
          day: 2,
          title: 'Day 2: Arm & Shoulder Core',
          focus: 'Target: localize tricep and biceps density.',
          type: 'lift',
          exercises: [
            {
              id: 'h_g_d2_1',
              name: 'Tiger-Bend Planks triceps extension',
              sets: 3,
              reps: '8-10 reps',
              rest: '90s',
              coachingCue: 'Leverage triceps muscle pull to raise elbows off floor.'
            }
          ]
        },
        {
          day: 3,
          title: 'Day 3: Supercompensation Restoration',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(3)
        },
        {
          day: 4,
          title: 'Day 4: Legs and Hinge Alignment',
          type: 'lift',
          exercises: [
            {
              id: 'h_g_d4_1',
              name: 'Bodyweight Pistol Squats (Assisted)',
              sets: 3,
              reps: '8 reps per leg',
              rest: '90s',
              coachingCue: 'Keep weight on heel, lower onto sofa and press up.'
            }
          ]
        },
        {
          day: 5,
          title: 'Day 5: Secondary Push-Pull Overload',
          type: 'lift',
          exercises: [
            {
              id: 'h_g_d5_1',
              name: 'Standard Military Pushups',
              sets: 3,
              reps: '12-15 reps',
              rest: '90s',
              coachingCue: 'Perfecly straight line. Touch chest to floor.'
            }
          ]
        },
        {
          day: 6,
          title: 'Day 6: Full Glycogen Restoration',
          type: 'rest',
          exercises: [],
          passiveRecoveryGuidelines: restDayPassiveRecovery(6)
        },
        {
          day: 7,
          title: 'Day 7: Cardiovascular flush and Core Stability',
          type: 'lift',
          exercises: [
            {
              id: 'h_g_d7_1',
              name: 'Core Leg Tucks',
              sets: 3,
              reps: '12 reps',
              rest: '60s',
              coachingCue: 'Pull knees hard into chest, lock static contraction.'
            }
          ]
        }
      ];
    }
  }
}
