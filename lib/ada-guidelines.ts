export interface GlucoseAnalysis {
  status: "normal" | "warning" | "danger"
  message: string
  level: number
  unit: "mg/dL" | "mmol/L"
}

export function convertMgDlToMmol(mgDl: number): number {
  return Number((mgDl / 18).toFixed(1))
}

export function convertMmolToMgDl(mmol: number): number {
  return Math.round(mmol * 18)
}

export function analyzeGlucoseLevel(glucoseLevel: number, unit: "mg/dL" | "mmol/L" = "mg/dL"): GlucoseAnalysis {
  // Convert to mg/dL for analysis if needed
  const mgDlValue = unit === "mmol/L" ? convertMmolToMgDl(glucoseLevel) : glucoseLevel

  // Based on American Diabetes Association guidelines
  // Fasting: 80-130 mg/dL (4.4-7.2 mmol/L) is target
  // After meals (1-2 hours): Less than 180 mg/dL (10.0 mmol/L)

  if (mgDlValue < 70) {
    // < 3.9 mmol/L
    return {
      status: "danger",
      level: glucoseLevel,
      unit,
      message:
        "⚠️ Low Blood Sugar (Hypoglycemia) - Your glucose level is too low. Please consume fast-acting carbohydrates immediately and consult your healthcare provider.",
    }
  } else if (mgDlValue >= 70 && mgDlValue <= 130) {
    // 3.9-7.2 mmol/L
    return {
      status: "normal",
      level: glucoseLevel,
      unit,
      message:
        "✓ Excellent! Your glucose level is within the target range. Keep up the good work with your diabetes management.",
    }
  } else if (mgDlValue > 130 && mgDlValue <= 180) {
    // 7.2-10.0 mmol/L
    return {
      status: "warning",
      level: glucoseLevel,
      unit,
      message:
        "⚡ Slightly Elevated - Your glucose level is a bit high. Monitor your diet and activity. Consider consulting your healthcare provider if this persists.",
    }
  } else {
    // > 10.0 mmol/L
    return {
      status: "danger",
      level: glucoseLevel,
      unit,
      message:
        "🚨 High Blood Sugar (Hyperglycemia) - Your glucose level is in the red zone. Please follow your diabetes action plan and contact your healthcare provider.",
    }
  }
}

export function getTargetRanges(unit: "mg/dL" | "mmol/L" = "mg/dL") {
  if (unit === "mmol/L") {
    return {
      low: 3.9,
      normalMin: 3.9,
      normalMax: 7.2,
      warningMax: 10.0,
      unit: "mmol/L",
    }
  }
  return {
    low: 70,
    normalMin: 70,
    normalMax: 130,
    warningMax: 180,
    unit: "mg/dL",
  }
}
