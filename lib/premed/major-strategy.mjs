const requirementAreas = [
  {
    id: "biology",
    label: "Biology",
    pattern: /\b(bio|biology|anatomy|physiology|genetics|microbiology)\b/i,
  },
  {
    id: "chemistry",
    label: "Chemistry",
    pattern: /\b(chem|chemistry|organic|ochem|biochem|biochemistry)\b/i,
  },
  {
    id: "physics",
    label: "Physics",
    pattern: /\b(physics|mechanics|electricity|magnetism)\b/i,
  },
  {
    id: "math",
    label: "Math or statistics",
    pattern: /\b(calculus|statistics|stats|precalculus|math|data)\b/i,
  },
  {
    id: "writing",
    label: "English or writing",
    pattern: /\b(english|writing|composition|literature|rhetoric)\b/i,
  },
  {
    id: "behavior",
    label: "Psychology or sociology",
    pattern: /\b(psychology|psych|sociology|socio|behavior|behavioral)\b/i,
  },
];

const majorTracks = [
  {
    id: "life-sciences",
    name: "Life sciences",
    examples: "Biology, molecular biology, biochemistry, neuroscience",
    premedFit: "Most direct prerequisite overlap",
    durableValue:
      "Strong for research, biotech labs, clinical research, graduate science, health analytics, or teaching when paired with lab, data, or writing depth.",
    bestFor:
      "A student who genuinely likes biology and wants the cleanest academic overlap with medical-school preparation.",
    watchouts: [
      "Do not choose biology only because it sounds like the official pre-med major.",
      "The backup plan needs to be deliberate because many classmates will have similar science transcripts.",
      "Protect GPA and energy because lab-heavy schedules can become dense quickly.",
    ],
    coursePriorities: [
      "Keep chemistry and biology sequencing on time.",
      "Add statistics, data, research methods, or computing if she wants a stronger non-medical fallback.",
      "Use 12th grade to confirm whether advanced biology feels energizing or merely familiar.",
    ],
    advisorQuestions: [
      "Which biology or biochemistry sequence is best for pre-health students at this campus?",
      "How early should she start chemistry to avoid delaying organic chemistry or biochemistry?",
    ],
  },
  {
    id: "data-health",
    name: "Data, statistics, or CS with health focus",
    examples: "Data science, statistics, computer science, computational biology",
    premedFit: "Very strong if lab sciences are planned separately",
    durableValue:
      "Excellent fallback value across health tech, AI, analytics, biotech, research, operations, and graduate school.",
    bestFor:
      "A student who likes problem solving, patterns, technology, and wants a major that remains valuable even if medicine changes.",
    watchouts: [
      "Premed lab courses may sit outside the major and must be scheduled intentionally.",
      "Some UC CS/data majors can be selective or heavily structured.",
      "It can be hard to fit every lab, coding, and clinical commitment without a realistic load plan.",
    ],
    coursePriorities: [
      "Keep biology, chemistry, and physics visible in the plan rather than assuming the major covers them.",
      "Take statistics or calculus seriously because it supports both medicine and the fallback path.",
      "Look for health-data, bioinformatics, research, or public-health projects.",
    ],
    advisorQuestions: [
      "Can a data science or CS major fit the pre-health lab sequence in four years?",
      "Which introductory programming and statistics courses are open to first-year students?",
    ],
  },
  {
    id: "engineering",
    name: "Engineering or bioengineering",
    examples: "Bioengineering, biomedical engineering, chemical engineering",
    premedFit: "Possible, but workload-sensitive",
    durableValue:
      "High fallback value in engineering, medical devices, biotech, product, operations, and technical graduate programs.",
    bestFor:
      "A student who would still be happy doing engineering if medical school stopped being the goal.",
    watchouts: [
      "Engineering requirements can crowd the schedule and make GPA protection harder.",
      "Premed prerequisites may not align perfectly with engineering sequences.",
      "This is usually the wrong choice if she only tolerates engineering for pre-med branding.",
    ],
    coursePriorities: [
      "Check whether the first-year engineering sequence leaves room for biology and chemistry labs.",
      "Prefer this route only if design, physics, math, and building things are genuinely appealing.",
      "Use summer planning carefully because missed sequences can ripple.",
    ],
    advisorQuestions: [
      "How do bioengineering students at this campus complete pre-health requirements?",
      "Which courses are GPA pressure points in the first two years?",
    ],
  },
  {
    id: "public-health",
    name: "Public health, psychology, or social science",
    examples: "Public health, psychology, cognitive science, sociology, policy",
    premedFit: "Strong with a separate science sequence",
    durableValue:
      "Strong for health systems, policy, behavioral health, research coordination, nonprofits, consulting, education, and graduate public health.",
    bestFor:
      "A student drawn to people, systems, equity, communication, and the human side of health.",
    watchouts: [
      "She must still complete rigorous biology, chemistry, physics, and math preparation.",
      "The science plan needs enough depth to show readiness for medical training.",
      "Some campuses house public health in capped or selective programs.",
    ],
    coursePriorities: [
      "Pair science prerequisites with statistics, writing, and community-facing work.",
      "Use activities to test whether she likes clinical service, public health, or both.",
      "Keep advanced science options available for 12th grade and early college.",
    ],
    advisorQuestions: [
      "Which public health or psychology courses overlap with pre-health competencies?",
      "How do students balance clinical exposure with public-health or research work?",
    ],
  },
  {
    id: "humanities",
    name: "Humanities or communication",
    examples: "English, philosophy, history, languages, global studies",
    premedFit: "Possible with disciplined science planning",
    durableValue:
      "Strong for writing, communication, law, policy, education, ethics, global health, and patient-centered storytelling.",
    bestFor:
      "A student who loves reading, writing, ethics, language, culture, or advocacy and is willing to own the science plan.",
    watchouts: [
      "The major will not automatically cover most lab science prerequisites.",
      "She needs visible evidence that she can handle quantitative and scientific coursework.",
      "Families sometimes underestimate how intentional this path must be.",
    ],
    coursePriorities: [
      "Map every science prerequisite early and revisit the plan each term.",
      "Use writing and language strength as a distinctive asset, not an escape from science.",
      "Add statistics, biology, chemistry, and clinical exposure in a sustainable rhythm.",
    ],
    advisorQuestions: [
      "Can humanities majors access the same pre-health advising and lab sequences?",
      "Which writing, ethics, or language opportunities connect well with health care?",
    ],
  },
];

const interestProfiles = [
  {
    id: "biology-lab",
    label: "Biology and lab work",
    familyIds: ["biology-life-sciences", "medicine-health-public-health"],
    keywords: [
      "biology",
      "biological",
      "biochemistry",
      "molecular",
      "cell",
      "neuroscience",
      "physiology",
      "genetics",
    ],
  },
  {
    id: "data-computing",
    label: "Data, statistics, and CS",
    familyIds: ["computing-data-ai", "math-stat-physical"],
    keywords: [
      "data",
      "statistics",
      "computer",
      "computational",
      "bioinformatics",
      "informatics",
      "applied mathematics",
      "analytics",
    ],
  },
  {
    id: "people-behavior",
    label: "People, behavior, and health systems",
    familyIds: [
      "medicine-health-public-health",
      "psych-neuro-cognitive",
      "social-government-policy",
    ],
    keywords: [
      "public health",
      "psychology",
      "cognitive",
      "sociology",
      "human development",
      "health",
      "policy",
    ],
  },
  {
    id: "engineering-devices",
    label: "Engineering and medical devices",
    familyIds: ["engineering-physical-systems"],
    keywords: [
      "bioengineering",
      "biomedical",
      "chemical engineering",
      "engineering",
      "biomolecular",
      "systems",
    ],
  },
  {
    id: "writing-policy",
    label: "Writing, ethics, and policy",
    familyIds: [
      "humanities-languages-philosophy",
      "social-government-policy",
      "medicine-health-public-health",
    ],
    keywords: [
      "ethics",
      "philosophy",
      "english",
      "writing",
      "global",
      "policy",
      "communication",
      "health",
    ],
  },
];

const fallbackProfiles = [
  {
    id: "tech-data",
    label: "Tech/data career",
    keywords: [
      "data",
      "computer",
      "statistics",
      "analytics",
      "computational",
      "informatics",
      "applied mathematics",
    ],
    familyIds: ["computing-data-ai", "math-stat-physical"],
    note: "Best when she wants strong employability outside medicine in analytics, software, AI, or health tech.",
  },
  {
    id: "biotech-research",
    label: "Biotech/research",
    keywords: [
      "biochemistry",
      "molecular",
      "bioengineering",
      "biological",
      "biology",
      "genetics",
      "biomolecular",
    ],
    familyIds: ["biology-life-sciences", "engineering-physical-systems"],
    note: "Best when lab science still feels meaningful even without medical school.",
  },
  {
    id: "health-systems",
    label: "Health systems",
    keywords: ["public health", "health", "policy", "psychology", "sociology"],
    familyIds: [
      "medicine-health-public-health",
      "psych-neuro-cognitive",
      "social-government-policy",
    ],
    note: "Best when she may want public health, operations, research coordination, or patient-facing adjacent work.",
  },
  {
    id: "engineering-products",
    label: "Engineering/products",
    keywords: ["engineering", "bioengineering", "biomedical", "systems"],
    familyIds: ["engineering-physical-systems"],
    note: "Best when she would be happy building technical products, devices, or systems.",
  },
  {
    id: "policy-communication",
    label: "Policy/communication",
    keywords: [
      "policy",
      "communication",
      "english",
      "global",
      "sociology",
      "psychology",
    ],
    familyIds: ["social-government-policy", "humanities-languages-philosophy"],
    note: "Best when writing, advocacy, language, or human context is a real strength.",
  },
];

const premedAnchorKeywords = [
  "biology",
  "biological",
  "biochemistry",
  "molecular",
  "cell",
  "neuroscience",
  "physiology",
  "genetics",
  "bioengineering",
  "public health",
  "psychology",
  "cognitive",
  "chemistry",
  "bioinformatics",
];

const workloadNotes = {
  steady:
    "Favor a major where she can perform well, sleep enough, and sustain activities. Medical-school preparation is a long game.",
  stretch:
    "A stretch plan can work if the weekly load is honest and the first-year science sequence is not overloaded.",
  "too-much":
    "If the current load already feels too much, pick the major for genuine fit first and add pre-med requirements carefully.",
  "not-sure":
    "Treat workload as a hypothesis to test. The first college schedule should reveal whether the plan is sustainable.",
};

function countMatchingCourses(entries, area) {
  return entries.filter((entry) => area.pattern.test(entry.name ?? "")).length;
}

export function getPremedMajorTracks() {
  return majorTracks;
}

export function getPremedInterestProfiles() {
  return interestProfiles;
}

export function getPremedFallbackProfiles() {
  return fallbackProfiles;
}

export function summarizePremedCourseSignals(courseEntries = []) {
  const entries = Array.isArray(courseEntries) ? courseEntries : [];
  const areas = requirementAreas.map((area) => {
    const count = countMatchingCourses(entries, area);
    return {
      id: area.id,
      label: area.label,
      count,
      status: count > 0 ? "seen" : "not_seen",
    };
  });
  const advancedScienceCount = entries.filter(
    (entry) =>
      entry.agCategory === "d" &&
      ["honors", "ap", "ib", "college"].includes(entry.level),
  ).length;
  const needsVerificationCount = entries.filter(
    (entry) =>
      entry.verificationStatus === "needs_verification" ||
      entry.agCategory === "unknown",
  ).length;
  const outsideCourseCount = entries.filter(
    (entry) =>
      entry.source === "community_college" ||
      entry.source === "online_school" ||
      entry.source === "outside_enrichment",
  ).length;

  const notes = [];
  if (!areas.find((area) => area.id === "chemistry")?.count) {
    notes.push("Chemistry sequencing is the first concrete item to map.");
  }
  if (!areas.find((area) => area.id === "physics")?.count) {
    notes.push("Physics may need a 12th-grade or college timing decision.");
  }
  if (!areas.find((area) => area.id === "writing")?.count) {
    notes.push("Writing or English should stay visible, even for science majors.");
  }
  if (needsVerificationCount > 0) {
    notes.push("Some coursework still needs A-G or transcript verification.");
  }
  if (entries.length === 0) {
    notes.push("Enter courses in Prepare to make this guidance more personal.");
  }

  return {
    totalCourses: entries.length,
    areas,
    advancedScienceCount,
    outsideCourseCount,
    needsVerificationCount,
    notes,
  };
}

export function buildPremedMajorStrategy({
  courseEntries = [],
  selectedTrackId = "data-health",
  workloadPreference = "not-sure",
} = {}) {
  const selectedTrack =
    majorTracks.find((track) => track.id === selectedTrackId) ?? majorTracks[1];
  const courseSignals = summarizePremedCourseSignals(courseEntries);
  const missingAreas = courseSignals.areas
    .filter((area) => area.status === "not_seen")
    .map((area) => area.label);

  const nextChecks = [
    "Choose the major she would still respect if medical school left the plan.",
    "List medical-school prerequisite categories separately from major requirements.",
    "Compare four-year sample plans at each UC before assuming the schedule works.",
    "Protect grades, curiosity, and time for clinical/service/research exploration.",
  ];

  if (missingAreas.length > 0 && courseSignals.totalCourses > 0) {
    nextChecks.push(
      `Course inventory has not yet surfaced: ${missingAreas.slice(0, 3).join(", ")}.`,
    );
  }

  if (selectedTrack.id === "engineering" || selectedTrack.id === "data-health") {
    nextChecks.push("Check whether required labs fit without pushing key courses too late.");
  }

  if (selectedTrack.id === "life-sciences") {
    nextChecks.push("Add a distinct backup-strength builder: data, writing, research, or applied health work.");
  }

  return {
    selectedTrack,
    tracks: majorTracks,
    courseSignals,
    workloadNote:
      workloadNotes[workloadPreference] ?? workloadNotes["not-sure"],
    nextChecks: nextChecks.slice(0, 6),
    parentExplanation:
      "Explain it as two overlapping choices: the major is the durable undergraduate identity, and pre-med is a checklist plus evidence of readiness layered on top.",
    disclaimer:
      "This is planning guidance, not a medical-school admissions prediction. Medical-school prerequisites vary by institution and should be verified with official school resources and pre-health advising.",
  };
}

function normalizedText(major) {
  return [
    major.name,
    major.categoryName,
    ...(Array.isArray(major.emphases) ? major.emphases : []),
  ]
    .join(" ")
    .toLowerCase();
}

function keywordMatches(text, keywords) {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
}

function familyMatches(major, familyIds) {
  const majorFamilies = Array.isArray(major.familyIds) ? major.familyIds : [];
  return familyIds.filter((familyId) => majorFamilies.includes(familyId));
}

function scoreProfile(major, profile) {
  const text = normalizedText(major);
  return (
    keywordMatches(text, profile.keywords).length * 4 +
    familyMatches(major, profile.familyIds).length * 3
  );
}

function premedFitForMajor(major) {
  const nameText = [
    major.name,
    ...(Array.isArray(major.emphases) ? major.emphases : []),
  ]
    .join(" ")
    .toLowerCase();
  const anchors = keywordMatches(nameText, premedAnchorKeywords).length;
  const families = familyMatches(major, [
    "biology-life-sciences",
    "medicine-health-public-health",
    "psych-neuro-cognitive",
    "engineering-physical-systems",
    "math-stat-physical",
    "computing-data-ai",
  ]).length;
  const score = anchors * 2 + families;
  if (score >= 7) return "direct";
  if (score >= 3) return "compatible";
  return "needs-planning";
}

function fallbackStrengthForMajor(major, fallbackProfile) {
  const fallbackScore = scoreProfile(major, fallbackProfile);
  const text = normalizedText(major);
  if (
    fallbackScore >= 8 ||
    /(computer|data|statistics|engineering|bioengineering|analytics|public health)/i.test(
      text,
    )
  ) {
    return "strong";
  }
  if (fallbackScore >= 3) return "moderate";
  return "needs-builder";
}

function premedFitLabel(value) {
  if (value === "direct") return "Direct pre-med overlap";
  if (value === "compatible") return "Compatible with planning";
  return "Premed must be layered intentionally";
}

function fallbackLabel(value) {
  if (value === "strong") return "Strong fallback";
  if (value === "moderate") return "Moderate fallback";
  return "Needs a backup-strength builder";
}

function buildWhy(major, interestProfile, fallbackProfile, premedFit, fallbackStrength) {
  const reasons = [];
  const matchedFamilies = familyMatches(major, interestProfile.familyIds);
  const matchedKeywords = keywordMatches(
    normalizedText(major),
    interestProfile.keywords,
  );

  if (matchedFamilies.length > 0 || matchedKeywords.length > 0) {
    reasons.push(`matches ${interestProfile.label.toLowerCase()}`);
  }
  if (premedFit === "direct") {
    reasons.push("has visible pre-med science or health overlap");
  } else if (premedFit === "compatible") {
    reasons.push("can work for pre-med with a separate prerequisite plan");
  }
  if (fallbackStrength === "strong") {
    reasons.push(`keeps a strong ${fallbackProfile.label.toLowerCase()} option`);
  }

  return reasons.length
    ? reasons.join("; ")
    : "worth reviewing if the campus version looks appealing";
}

function buildMajorWatchout(major, premedFit, fallbackStrength) {
  const text = normalizedText(major);
  if (premedFit === "needs-planning") {
    return "Map biology, chemistry, physics, math, and writing separately because this major may not cover them.";
  }
  if (/engineering|computer|data|statistics/.test(text)) {
    return "Check whether required technical courses leave room for pre-health labs and clinical/service time.";
  }
  if (/biology|biochemistry|neuroscience|molecular/.test(text)) {
    return "Add data, research, writing, or applied work so the fallback is not just another science transcript.";
  }
  if (fallbackStrength === "needs-builder") {
    return "Choose a concrete employability builder early: statistics, computing, research, writing, or operations.";
  }
  return "Verify the campus four-year plan and pre-health advising path before treating this as settled.";
}

export function buildPremedMajorShortlist({
  majors = [],
  selectedInterestIds = ["biology-lab", "data-computing", "people-behavior"],
  fallbackPriorityId = "tech-data",
  campusIds = [],
  limit = 9,
} = {}) {
  const selectedProfiles = interestProfiles.filter((profile) =>
    selectedInterestIds.includes(profile.id),
  );
  const interestSet = selectedProfiles.length
    ? selectedProfiles
    : interestProfiles.slice(0, 3);
  const fallbackProfile =
    fallbackProfiles.find((profile) => profile.id === fallbackPriorityId) ??
    fallbackProfiles[0];
  const allowedCampuses = Array.isArray(campusIds)
    ? campusIds.filter(Boolean)
    : [];
  const visibleMajors = Array.isArray(majors)
    ? majors.filter(
        (major) =>
          allowedCampuses.length === 0 ||
          major.campuses?.some((campus) =>
            allowedCampuses.includes(campus.institutionId),
          ),
      )
    : [];

  const ranked = visibleMajors
    .map((major) => {
      const interestScore = Math.max(
        ...interestSet.map((profile) => scoreProfile(major, profile)),
      );
      const fallbackScore = scoreProfile(major, fallbackProfile);
      const premedFit = premedFitForMajor(major);
      const fallbackStrength = fallbackStrengthForMajor(major, fallbackProfile);
      const premedScore =
        premedFit === "direct" ? 8 : premedFit === "compatible" ? 5 : 1;
      const fallbackBonus =
        fallbackStrength === "strong" ? 7 : fallbackStrength === "moderate" ? 4 : 1;
      const campusBreadth = Math.min(major.campuses?.length ?? 0, 6);
      const score =
        interestScore * 2 + fallbackScore * 1.5 + premedScore + fallbackBonus + campusBreadth;
      const bestInterest =
        interestSet
          .map((profile) => ({
            profile,
            score: scoreProfile(major, profile),
          }))
          .sort((a, b) => b.score - a.score)[0]?.profile ?? interestSet[0];

      return {
        id: major.id,
        name: major.name,
        categoryName: major.categoryName,
        deepGuideSlug: major.deepGuideSlug,
        campusCount: major.campuses?.length ?? 0,
        campuses: (major.campuses ?? []).slice(0, 5),
        premedFit,
        premedFitLabel: premedFitLabel(premedFit),
        fallbackStrength,
        fallbackLabel: fallbackLabel(fallbackStrength),
        score,
        why: buildWhy(
          major,
          bestInterest,
          fallbackProfile,
          premedFit,
          fallbackStrength,
        ),
        watchout: buildMajorWatchout(major, premedFit, fallbackStrength),
      };
    })
    .filter((item) => item.score >= 12)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(Boolean(b.deepGuideSlug)) - Number(Boolean(a.deepGuideSlug)) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);

  return {
    fallbackProfile,
    interests: interestProfiles,
    fallbackProfiles,
    results: ranked,
    summary:
      "Use this as a shortlist for family discussion, then verify each campus version with the official catalog and pre-health advising.",
  };
}
