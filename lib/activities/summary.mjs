const categoryLabels = {
  award: "Awards/honors",
  educational_preparation: "Educational preparation",
  extracurricular: "Extracurricular",
  other_coursework: "Other coursework",
  volunteering: "Volunteering/community service",
  work: "Work experience",
};

const signalLabels = {
  leadership: "leadership",
  service: "service",
  creative: "creative work",
  research: "research/project work",
  career_exposure: "career exposure",
  family_responsibility: "family responsibility",
  academic_interest: "academic interest",
};

function activityHours(activity) {
  return Math.round((activity.hoursPerWeek ?? 0) * (activity.weeksPerYear ?? 0));
}

function hasDetail(text) {
  return typeof text === "string" && text.trim().length >= 35;
}

function categoryCounts(entries) {
  return entries.reduce((counts, entry) => {
    counts[entry.category] = (counts[entry.category] ?? 0) + 1;
    return counts;
  }, {});
}

function signalCounts(entries) {
  return entries.reduce((counts, entry) => {
    for (const signal of entry.signals ?? []) {
      counts[signal] = (counts[signal] ?? 0) + 1;
    }
    return counts;
  }, {});
}

export function buildActivitySummary(entries = []) {
  const categories = categoryCounts(entries);
  const signals = signalCounts(entries);
  const entriesWithImpact = entries.filter((entry) => hasDetail(entry.impact));
  const entriesWithReflection = entries.filter((entry) =>
    hasDetail(entry.reflection),
  );
  const sustainedEntries = entries.filter(
    (entry) => (entry.gradeLevels ?? []).length >= 2,
  );
  const highHourEntries = entries
    .map((entry) => ({ ...entry, annualHours: activityHours(entry) }))
    .filter((entry) => entry.annualHours >= 80)
    .sort((a, b) => b.annualHours - a.annualHours);

  const notes = [];
  if (entries.length === 0) {
    notes.push("Start by entering anything meaningful from 9th grade onward, including family responsibilities and paid work.");
  }
  if (entries.length > 0 && entriesWithImpact.length < Math.min(entries.length, 3)) {
    notes.push("Add concrete impact details: who benefited, what changed, scale, or what she produced.");
  }
  if (entriesWithReflection.length < Math.min(entries.length, 3)) {
    notes.push("Capture what she learned or noticed now, while the memory is still fresh.");
  }
  if (!signals.leadership && entries.length > 0) {
    notes.push("Leadership can mean organizing, mentoring, improving a process, or taking responsibility; check if any entry shows that.");
  }
  if (!signals.service && !signals.family_responsibility && entries.length > 0) {
    notes.push("If service or family responsibility is part of her life, include it as real context, not as an afterthought.");
  }

  return {
    totalEntries: entries.length,
    remainingSlots: Math.max(0, 20 - entries.length),
    entriesWithImpactCount: entriesWithImpact.length,
    entriesWithReflectionCount: entriesWithReflection.length,
    sustainedCount: sustainedEntries.length,
    highHourCount: highHourEntries.length,
    categories: Object.entries(categories).map(([id, count]) => ({
      id,
      label: categoryLabels[id] ?? id,
      count,
    })),
    signals: Object.entries(signals).map(([id, count]) => ({
      id,
      label: signalLabels[id] ?? id,
      count,
    })),
    notes,
  };
}

export function buildPiqStorySeeds(entries = []) {
  return entries
    .map((entry) => {
      const reasons = [];
      if ((entry.signals ?? []).includes("leadership")) {
        reasons.push("leadership");
      }
      if ((entry.signals ?? []).includes("service")) {
        reasons.push("community contribution");
      }
      if ((entry.signals ?? []).includes("family_responsibility")) {
        reasons.push("context and responsibility");
      }
      if ((entry.signals ?? []).includes("research")) {
        reasons.push("academic curiosity");
      }
      if (hasDetail(entry.reflection)) {
        reasons.push("reflection");
      }
      if (hasDetail(entry.impact)) {
        reasons.push("specific impact");
      }

      return {
        id: entry.id,
        title: entry.title,
        category: categoryLabels[entry.category] ?? entry.category,
        strength: reasons.length,
        reasons,
        prompt:
          reasons.length >= 2
            ? `This could become a PIQ example if she explains what she did, why it mattered, and what changed in her thinking.`
            : "This needs more detail before it becomes a strong PIQ example.",
      };
    })
    .filter((seed) => seed.strength > 0)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);
}

export function buildActivityNextSteps(entries = []) {
  const summary = buildActivitySummary(entries);
  const steps = [];

  if (entries.length === 0) {
    steps.push({
      id: "brain-dump",
      title: "Do a 20-minute activity brain dump",
      detail:
        "List clubs, work, family responsibilities, volunteering, projects, awards, summer programs, and informal commitments from 9th grade onward.",
    });
  }
  if (summary.entriesWithImpactCount < Math.min(entries.length, 5)) {
    steps.push({
      id: "add-impact",
      title: "Add evidence of impact",
      detail:
        "For each meaningful entry, capture numbers, outcomes, people served, products built, or responsibilities handled.",
    });
  }
  if (summary.sustainedCount === 0 && entries.length >= 3) {
    steps.push({
      id: "choose-depth",
      title: "Choose one activity to deepen",
      detail:
        "A sustained role, project, or responsibility often says more than adding several short activities.",
    });
  }
  if (summary.entriesWithReflectionCount < Math.min(entries.length, 4)) {
    steps.push({
      id: "capture-reflection",
      title: "Write one honest reflection sentence",
      detail:
        "Record what she learned, what surprised her, or what she would do differently before application season blurs the details.",
    });
  }

  const connectStep = {
    id: "connect-to-fit",
    title: "Connect activities to Path Fit",
    detail:
      "Compare the strongest activity signals with her current UC interests and campus questions.",
  };

  return [...steps.slice(0, 3), connectStep];
}
