const familySignals = {
  "computing-data-ai": {
    label: "Computing/data",
    courseNeeds: ["math", "cs"],
    attention:
      "Keep senior math intentional and look for real CS or data exposure if this stays interesting.",
  },
  "engineering-physical-systems": {
    label: "Engineering/physical systems",
    courseNeeds: ["math", "science"],
    attention:
      "Verify math progression and physics/chemistry depth before reading engineering options as interchangeable.",
  },
  "biology-life-sciences": {
    label: "Biology/life sciences",
    courseNeeds: ["science", "math"],
    attention:
      "Confirm lab science depth and keep quantitative confidence visible in the senior-year plan.",
  },
  "medicine-health-public-health": {
    label: "Health/pre-health",
    courseNeeds: ["science", "math"],
    attention:
      "Separate UC major choice from pre-health preparation, then verify chemistry, biology, and advising pathways.",
  },
  "psych-neuro-cognitive": {
    label: "Psychology/neuroscience",
    courseNeeds: ["science", "social"],
    attention:
      "Look for biology, statistics, research methods, and whether the campus has the flavor of psychology she wants.",
  },
  "math-stat-physical": {
    label: "Math/stat/physical sciences",
    courseNeeds: ["math"],
    attention:
      "Senior math matters here; compare calculus, statistics, and physics choices with her actual energy level.",
  },
  "economics-business-operations": {
    label: "Economics/business/operations",
    courseNeeds: ["math", "social"],
    attention:
      "Check calculus/statistics expectations and whether the campus offers the applied business-adjacent angle she wants.",
  },
  "environment-climate-agriculture": {
    label: "Environment/climate",
    courseNeeds: ["science", "social"],
    attention:
      "Look for environmental science plus policy, data, or fieldwork options depending on what draws her in.",
  },
  "social-government-policy": {
    label: "Social science/policy",
    courseNeeds: ["social", "writing"],
    attention:
      "Strong writing, history/social science, and quantitative literacy will make these options easier to inspect.",
  },
  "humanities-languages-philosophy": {
    label: "Humanities/languages",
    courseNeeds: ["writing", "language"],
    attention:
      "Course rigor can show through reading, writing, language continuity, and thoughtful projects.",
  },
  "design-media-arts": {
    label: "Design/media/arts",
    courseNeeds: ["arts", "writing"],
    attention:
      "Check whether portfolio, audition, or supplemental review exists before treating these like standard majors.",
  },
  "education-human-development": {
    label: "Education/human development",
    courseNeeds: ["social", "writing"],
    attention:
      "Look for child development, psychology, community work, and the path from undergraduate study to credentialing.",
  },
  "interdisciplinary-undecided": {
    label: "Undecided/interdisciplinary",
    courseNeeds: ["math", "science", "writing"],
    attention:
      "Keep the 12th-grade schedule broad enough to preserve options without making it performative.",
  },
};

const agLabels = {
  a: "history/social science",
  b: "English/writing",
  c: "math",
  d: "lab science",
  e: "language",
  f: "visual/performing arts",
  g: "college-prep elective",
  unknown: "uncertain A-G area",
};

function hasNameMatch(course, terms) {
  const name = course.name.toLowerCase();
  return terms.some((term) => name.includes(term));
}

export function summarizeAcademicSignals(courseEntries = []) {
  const confirmed = courseEntries.filter(
    (course) => course.verificationStatus === "confirmed",
  );
  const currentOrPlanned = courseEntries.filter((course) =>
    ["current", "planned"].includes(course.status),
  );
  const advanced = courseEntries.filter((course) =>
    ["honors", "ap", "ib", "college"].includes(course.level),
  );
  const needsVerification = courseEntries.filter(
    (course) => course.verificationStatus === "needs_verification",
  );

  const signals = {
    math: courseEntries.some(
      (course) =>
        course.agCategory === "c" ||
        hasNameMatch(course, ["math", "algebra", "geometry", "precal", "calculus", "statistics"]),
    ),
    science: courseEntries.some(
      (course) =>
        course.agCategory === "d" ||
        hasNameMatch(course, ["biology", "chemistry", "physics", "science", "anatomy"]),
    ),
    cs: courseEntries.some((course) =>
      hasNameMatch(course, ["computer", "programming", "coding", "data science"]),
    ),
    social: courseEntries.some(
      (course) =>
        course.agCategory === "a" ||
        hasNameMatch(course, ["history", "government", "economics", "psychology"]),
    ),
    writing: courseEntries.some(
      (course) =>
        course.agCategory === "b" || hasNameMatch(course, ["english", "literature", "writing"]),
    ),
    language: courseEntries.some((course) => course.agCategory === "e"),
    arts: courseEntries.some((course) => course.agCategory === "f"),
  };

  const agCounts = courseEntries.reduce((counts, course) => {
    counts[course.agCategory] = (counts[course.agCategory] ?? 0) + 1;
    return counts;
  }, {});

  return {
    totalCourses: courseEntries.length,
    confirmedCount: confirmed.length,
    currentOrPlannedCount: currentOrPlanned.length,
    advancedCount: advanced.length,
    needsVerificationCount: needsVerification.length,
    signals,
    agNotes: Object.entries(agCounts)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => `${count} ${agLabels[category] ?? category}`),
  };
}

export function buildPathFitSnapshot({
  selectedFamilyIds = [],
  selectedCampusIds = [],
  families = [],
  campuses = [],
  programs = [],
  courseEntries = [],
} = {}) {
  const academic = summarizeAcademicSignals(courseEntries);
  const selectedFamilies = families.filter((family) =>
    selectedFamilyIds.includes(family.id),
  );
  const selectedCampuses = campuses.filter((campus) =>
    selectedCampusIds.includes(campus.id),
  );
  const focusFamilies = selectedFamilies.length
    ? selectedFamilies
    : families.slice(0, 3);

  const focusCards = focusFamilies.map((family) => {
    const signal = familySignals[family.id] ?? {
      label: family.name,
      courseNeeds: [],
      attention: "Use the official major list and campus pages to clarify the path.",
    };
    const presentNeeds = signal.courseNeeds.filter((need) => academic.signals[need]);
    const missingNeeds = signal.courseNeeds.filter((need) => !academic.signals[need]);
    const matchingPrograms = programs
      .filter((program) => program.familyIds.includes(family.id))
      .slice(0, 4);

    return {
      id: family.id,
      title: family.name,
      attention: signal.attention,
      status:
        missingNeeds.length === 0
          ? "supported"
          : presentNeeds.length > 0
            ? "partial"
            : "needs_context",
      presentNeeds,
      missingNeeds,
      matchingPrograms,
    };
  });

  const campusChecks = selectedCampuses.map((campus) => ({
    id: campus.id,
    name: campus.shortName ?? campus.name,
    note:
      campus.admitRate !== undefined && campus.admitRate < 30
        ? "Treat campus-wide selectivity as a reason to inspect major rules carefully, not as a prediction."
        : "Use this as a fit and program-policy check, not a safety label.",
    questions: [
      `Which of her selected interests have real major options at ${campus.shortName ?? campus.name}?`,
      "Are any likely majors direct admit, capped, or hard to switch into later?",
      "What advising, research, clinical, project, or community opportunities are realistic in the first two years?",
    ],
  }));

  const verificationItems = [];
  if (academic.totalCourses === 0) {
    verificationItems.push(
      "Enter her completed, current, and planned courses in Prepare so this snapshot can reflect her real baseline.",
    );
  }
  if (academic.needsVerificationCount > 0) {
    verificationItems.push(
      `Verify ${academic.needsVerificationCount} course${academic.needsVerificationCount === 1 ? "" : "s"} against the school or UC A-G course list.`,
    );
  }
  if (selectedFamilyIds.length === 0) {
    verificationItems.push("Choose two or three interest areas so the report is about her actual curiosity.");
  }
  if (selectedCampusIds.length === 0) {
    verificationItems.push("Pick a few campuses to compare so campus questions become concrete.");
  }

  const discussionGuide = [
    "Which interest area feels energizing after reading the coursework, not just the major name?",
    "Which senior-year courses keep useful doors open without making the year unhealthy?",
    "Which campus questions should she answer by visiting official pages or asking a counselor?",
  ];

  return {
    academic,
    focusCards,
    campusChecks,
    verificationItems,
    discussionGuide,
    disclaimer:
      "This snapshot connects exploration choices to preparation questions. It does not rank campuses, estimate admission chances, or decide whether a path fits her.",
  };
}
