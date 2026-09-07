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
