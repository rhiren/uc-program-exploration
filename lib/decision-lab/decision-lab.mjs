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

export const decisionActionTemplates = [
  {
    id: "course-sample-biology",
    title: "Try a real biology or medicine sample",
    detail:
      "Spend 45-60 minutes with one lecture, problem set, case, or lab-style reading. Write down whether the work itself felt interesting, not just whether the career sounds good.",
  },
  {
    id: "course-sample-data",
    title: "Try one health data or statistics task",
    detail:
      "Use a tiny dataset, coding notebook, or statistics exercise connected to health or biology. Notice whether solving through data feels energizing.",
  },
  {
    id: "course-sample-health",
    title: "Compare one public-health problem",
    detail:
      "Pick a health issue and compare two interventions. Look for whether she enjoys systems, behavior, policy, and communication questions.",
  },
  {
    id: "four-year-plan",
    title: "Check four-year plans for the top finalists",
    detail:
      "For each serious major, sketch where chemistry, biology, physics, math/statistics, writing, GE, and major sequences would fit.",
  },
  {
    id: "fallback-career",
    title: "Name the strongest non-medical outcome",
    detail:
      "For the top two or three majors, write one concrete career path she could respect even if medical school stopped being the goal.",
  },
  {
    id: "student-conversation",
    title: "Ask one current student about workload",
    detail:
      "Use one real conversation or forum thread to learn how the major feels during a normal week, especially with pre-health requirements layered in.",
  },
];

export const premedRequirementAreas = [
  {
    id: "biology",
    label: "Biology with lab",
    direct: ["biology", "biological", "molecular", "cell", "genetics", "neuroscience"],
    partial: ["bioengineering", "public health", "physiology", "zoology"],
  },
  {
    id: "generalChemistry",
    label: "General chemistry",
    direct: ["chemistry", "biochemistry", "chemical", "biomolecular"],
    partial: ["biology", "bioengineering", "molecular"],
  },
  {
    id: "organicChemistry",
    label: "Organic chemistry",
    direct: ["chemistry", "biochemistry", "chemical", "biomolecular"],
    partial: ["biology", "bioengineering", "molecular"],
  },
  {
    id: "biochemistry",
    label: "Biochemistry",
    direct: ["biochemistry", "biomolecular", "molecular"],
    partial: ["biology", "bioengineering", "neuroscience"],
  },
  {
    id: "physics",
    label: "Physics",
    direct: ["physics", "engineering", "bioengineering"],
    partial: ["chemistry", "applied mathematics"],
  },
  {
    id: "mathStats",
    label: "Math or statistics",
    direct: ["data", "statistics", "mathematics", "engineering", "computer"],
    partial: ["biology", "biochemistry", "public health", "psychology"],
  },
  {
    id: "writing",
    label: "English or writing",
    direct: ["english", "writing", "communication", "literature"],
    partial: ["public health", "policy", "humanities", "global"],
  },
  {
    id: "behavior",
    label: "Psychology or sociology",
    direct: ["psychology", "sociology", "cognitive", "behavior"],
    partial: ["public health", "neuroscience", "human development"],
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

function missingEvidencePrompts(finalist) {
  const evidence = finalist.evidence ?? {};
  const prompts = [];
  if (!evidence.whyInterested) prompts.push("why the major is interesting");
  if (!evidence.courseEvidence) prompts.push("coursework or workload evidence");
  if (!evidence.careerFallback) prompts.push("a fallback career she would respect");
  if (!evidence.concerns) prompts.push("one concern to verify");
  return prompts;
}

export function buildThirtyDayActionPlan(report) {
  const actions = [];
  const completedExperimentIds = new Set(
    (report.progressExperiments ?? [])
      .filter((experiment) => experiment.completed)
      .map((experiment) => experiment.id),
  );
  const topFinalist = report.topFinalists?.[0];
  const evidenceGap = (report.finalists ?? []).find(
    (finalist) => finalist.status !== "drop" && missingEvidencePrompts(finalist).length > 0,
  );

  if (topFinalist) {
    actions.push({
      id: "top-finalist-evidence",
      title: `Add evidence for ${topFinalist.majorName}`,
      detail:
        missingEvidencePrompts(topFinalist).length > 0
          ? `Write one sentence about ${missingEvidencePrompts(topFinalist)
              .slice(0, 2)
              .join(" and ")}.`
          : "Pick one score that still feels uncertain and write what would make it more trustworthy.",
    });
  } else {
    actions.push({
      id: "choose-finalists",
      title: "Add three possible majors",
      detail:
        "Start with one science or health major, one data or quantitative major, and one option that simply sounds interesting enough to test.",
    });
  }

  const nextExperiment = decisionActionTemplates.find(
    (action) => !completedExperimentIds.has(action.id),
  );
  if (nextExperiment) actions.push(nextExperiment);

  if (evidenceGap && evidenceGap.id !== topFinalist?.id) {
    actions.push({
      id: "compare-evidence-gap",
      title: `Make ${evidenceGap.majorName} easier to compare`,
      detail: `Add one note about ${missingEvidencePrompts(evidenceGap)[0]}. A fair comparison needs the same kind of evidence for each finalist.`,
    });
  }

  if (!actions.some((action) => action.id === "fallback-career")) {
    actions.push(decisionActionTemplates.find((action) => action.id === "fallback-career"));
  }

  for (const action of decisionActionTemplates) {
    if (actions.length >= 3) break;
    if (!actions.some((item) => item?.id === action.id)) actions.push(action);
  }

  return actions.filter(Boolean).slice(0, 3);
}

function majorText(major) {
  return [
    major?.name,
    major?.categoryName,
    ...(Array.isArray(major?.emphases) ? major.emphases : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function coverageForRequirement(text, area) {
  if (containsAny(text, area.direct)) return "likely-covered";
  if (containsAny(text, area.partial)) return "partial-overlap";
  return "layer-separately";
}

function coverageLabel(status) {
  if (status === "likely-covered") return "Likely built in";
  if (status === "partial-overlap") return "Partial overlap";
  return "Plan separately";
}

function coverageNote(status) {
  if (status === "likely-covered") {
    return "Still verify the exact campus sequence and whether labs count for pre-health advising.";
  }
  if (status === "partial-overlap") {
    return "Some coursework may overlap, but she should confirm the full medical-school prerequisite sequence.";
  }
  return "Assume this needs to be added outside the major plan unless campus advising confirms otherwise.";
}

export function buildPremedRequirementMap(major) {
  const text = majorText(major);
  return premedRequirementAreas.map((area) => {
    const status = coverageForRequirement(text, area);
    return {
      id: area.id,
      label: area.label,
      status,
      statusLabel: coverageLabel(status),
      note: coverageNote(status),
    };
  });
}

function campusAvailabilityLabel(count) {
  if (count >= 6) return "Broad UC availability";
  if (count >= 3) return "Several UC options";
  if (count >= 1) return "Campus-specific option";
  return "Availability needs research";
}

function campusAvailabilityRisk(count) {
  if (count >= 6) {
    return "Good for keeping campus flexibility, but she still needs to compare each campus version.";
  }
  if (count >= 3) {
    return "Enough to compare, but campus choice may shape the major decision.";
  }
  if (count >= 1) {
    return "Narrow availability. Treat the campus-major combination as the real option.";
  }
  return "No campus listing found in the current catalog snapshot.";
}

export function buildCampusFitSummary(major) {
  const campuses = Array.isArray(major?.campuses) ? major.campuses : [];
  return {
    count: campuses.length,
    label: campusAvailabilityLabel(campuses.length),
    risk: campusAvailabilityRisk(campuses.length),
    campuses: campuses.map((campus) => ({
      institutionId: campus.institutionId,
      name: campus.name,
      officialCatalogUrl: campus.officialCatalogUrl,
      checklist: [
        "Confirm first-year availability for her application cycle.",
        "Check whether the major is capped, selective, or has a pre-major path.",
        "Compare the four-year plan against pre-health prerequisites.",
        "Ask how pre-health advising supports students in this major.",
      ],
    })),
  };
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
        campusFit: buildCampusFitSummary(major),
        deepGuideSlug: major?.deepGuideSlug,
        premedRequirementMap: buildPremedRequirementMap(major),
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

  const report = {
    finalists,
    topFinalists: finalists.filter((item) => item.status !== "drop").slice(0, 3),
    completedExperiments,
    totalExperiments: decisionExperiments.length,
    readiness,
    gaps: gaps.slice(0, 4),
    progressExperiments: progress.experiments ?? [],
  };
  return {
    ...report,
    thirtyDayActions: buildThirtyDayActionPlan(report),
  };
}
