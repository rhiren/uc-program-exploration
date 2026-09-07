export const decisionScoreWeights = {
  interest: 0.22,
  academicConfidence: 0.18,
  premedFit: 0.18,
  careerFallback: 0.18,
  workloadFit: 0.14,
  ucAvailability: 0.1,
};

export const decisionScoreFields = [
  {
    id: "interest",
    label: "Interest",
    prompt: "Would she want to study the real coursework for four years?",
  },
  {
    id: "academicConfidence",
    label: "Academic confidence",
    prompt: "Can she do well without burning out?",
  },
  {
    id: "premedFit",
    label: "Pre-med fit",
    prompt: "Can the required labs and competencies be layered in?",
  },
  {
    id: "careerFallback",
    label: "Career fallback",
    prompt: "Would this degree still lead somewhere valuable without med school?",
  },
  {
    id: "workloadFit",
    label: "Workload fit",
    prompt: "Is the major/pre-med combination sustainable?",
  },
  {
    id: "ucAvailability",
    label: "UC availability",
    prompt: "Is it available at enough campuses she would seriously consider?",
  },
];

export const decisionExperiments = [
  {
    id: "course-sample-biology",
    phase: "Month 1",
    title: "Try one real biology or medicine learning sample",
    detail: "Use a lecture, problem set, lab-style reading, or the existing medicine challenge.",
  },
  {
    id: "course-sample-data",
    phase: "Month 1-2",
    title: "Try one data/statistics/CS sample",
    detail: "Complete a small analysis or coding task connected to health, biology, or people.",
  },
  {
    id: "course-sample-health",
    phase: "Month 2",
    title: "Try one public-health or behavior sample",
    detail: "Read a short case, compare interventions, or study a health-systems problem.",
  },
  {
    id: "four-year-plan",
    phase: "Month 2-3",
    title: "Check four-year plans for 3-5 finalists",
    detail: "Look for chemistry, biology, physics, math, writing, GE, and major sequence conflicts.",
  },
  {
    id: "student-conversation",
    phase: "Month 3",
    title: "Talk to one current student",
    detail: "Ask what the workload actually feels like and what they wish they knew earlier.",
  },
  {
    id: "career-conversation",
    phase: "Month 3-4",
    title: "Talk to one professional or older student",
    detail: "Compare physician, health tech, research, public health, and adjacent paths.",
  },
  {
    id: "clinical-service",
    phase: "Month 4-5",
    title: "Test a service or clinical-adjacent activity",
    detail: "Notice whether patient-facing or community-facing work gives her energy.",
  },
  {
    id: "family-review",
    phase: "Month 6",
    title: "Hold a final family review",
    detail: "Choose 2-3 primary directions, backups, and campus-specific questions.",
  },
];

function weightedScore(scores) {
  return Object.entries(decisionScoreWeights).reduce(
    (total, [key, weight]) => total + (Number(scores?.[key]) || 0) * weight,
    0,
  );
}

function evidenceCount(finalist) {
  return Object.values(finalist.evidence ?? {}).filter(Boolean).length;
}

function recommendationFor(score, evidenceItems, status) {
  if (status === "drop") return "Drop unless new evidence changes the picture";
  if (score >= 4.2 && evidenceItems >= 3) return "Strong finalist";
  if (score >= 3.6) return "Keep testing";
  if (score >= 3) return "Needs evidence";
  return "Weak for now";
}

export function buildDecisionLabReport(progress, majors = []) {
  const majorMap = new Map(majors.map((major) => [major.id, major]));
  const finalists = (progress.finalists ?? [])
    .map((finalist) => {
      const major = majorMap.get(finalist.majorId);
      const score = weightedScore(finalist.scores);
      const evidenceItems = evidenceCount(finalist);
      return {
        ...finalist,
        campusCount: major?.campuses?.length ?? 0,
        deepGuideSlug: major?.deepGuideSlug,
        score,
        scoreLabel: score.toFixed(1),
        evidenceItems,
        recommendation: recommendationFor(score, evidenceItems, finalist.status),
      };
    })
    .sort(
      (a, b) =>
        Number(a.status === "drop") - Number(b.status === "drop") ||
        b.score - a.score,
    );
  const completedExperimentIds = new Set(
    (progress.experiments ?? [])
      .filter((experiment) => experiment.completed)
      .map((experiment) => experiment.id),
  );
  const completedExperiments = decisionExperiments.filter((experiment) =>
    completedExperimentIds.has(experiment.id),
  ).length;
  const activeFinalists = finalists.filter((item) => item.status !== "drop");
  const strongFinalists = activeFinalists.filter(
    (item) => item.score >= 3.8 && item.evidenceItems >= 2,
  );
  const averageScore =
    activeFinalists.length === 0
      ? 0
      : activeFinalists.reduce((sum, item) => sum + item.score, 0) /
        activeFinalists.length;

  let readiness = "Building the shortlist";
  if (strongFinalists.length >= 2 && completedExperiments >= 5) {
    readiness = "Ready for a family decision";
  } else if (activeFinalists.length >= 3 && completedExperiments >= 3 && averageScore >= 3.4) {
    readiness = "Evidence is getting useful";
  }

  const gaps = [];
  if (activeFinalists.length < 3) {
    gaps.push("Keep at least three active finalists until the evidence is stronger.");
  }
  if (completedExperiments < 3) {
    gaps.push("Complete a few small experiments before treating preferences as final.");
  }
  if (activeFinalists.some((item) => item.evidenceItems < 2)) {
    gaps.push("Add evidence notes for interest, coursework, fallback career, and concerns.");
  }
  if (!activeFinalists.some((item) => item.scores.careerFallback >= 4)) {
    gaps.push("Make sure at least one path has a clearly strong non-medical career fallback.");
  }

  return {
    finalists,
    topFinalists: finalists.filter((item) => item.status !== "drop").slice(0, 3),
    completedExperiments,
    totalExperiments: decisionExperiments.length,
    readiness,
    gaps: gaps.slice(0, 4),
  };
}
