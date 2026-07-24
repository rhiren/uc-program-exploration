const answerScores = {
  "problem-style": {
    "Explain how a living system works": {
      biology: 5,
      biochemistry: 4,
      bioengineering: 2,
    },
    "Find a pattern in evidence": {
      statistics: 5,
      "data-science": 4,
      "public-health": 2,
    },
    "Improve a system with constraints": {
      "operations-research": 5,
      bioengineering: 4,
      "data-science": 2,
    },
    "Understand how people think": {
      "cognitive-science": 5,
      "public-health": 3,
      biology: 1,
    },
  },
  "activity-style": {
    "A biology mechanism": { biology: 5, biochemistry: 4 },
    "A chemistry puzzle": { biochemistry: 5, bioengineering: 2 },
    "A data question": { "data-science": 5, statistics: 5 },
    "A design or systems challenge": {
      bioengineering: 5,
      "operations-research": 4,
      "cognitive-science": 2,
    },
  },
  "people-systems": {
    "One person": {
      "cognitive-science": 4,
      biology: 3,
      "public-health": 2,
    },
    "A population": { "public-health": 5, statistics: 3 },
    "A device or process": {
      bioengineering: 5,
      "operations-research": 4,
    },
    "A dataset": { "data-science": 5, statistics: 5 },
  },
  training: {
    "Prefer a bachelor's-entry path": {
      "data-science": 2,
      statistics: 2,
      "operations-research": 2,
      bioengineering: 1,
    },
  },
};

const reflectionScores = {
  "More molecular biology": { biology: 5, biochemistry: 5 },
  "More patient-centered cases": {
    biology: 3,
    "public-health": 4,
    "cognitive-science": 2,
  },
  "More data or quantitative problems": {
    statistics: 5,
    "data-science": 5,
    "operations-research": 2,
  },
  "Something completely different": {
    "cognitive-science": 1,
    bioengineering: 1,
    "public-health": 1,
  },
};

const adjacentPath = {
  biology: "biochemistry",
  biochemistry: "biology",
  "data-science": "statistics",
  statistics: "data-science",
  "cognitive-science": "public-health",
  "public-health": "cognitive-science",
  bioengineering: "operations-research",
  "operations-research": "bioengineering",
};

const discoveryPath = {
  biology: "operations-research",
  biochemistry: "cognitive-science",
  "data-science": "public-health",
  statistics: "biology",
  "cognitive-science": "bioengineering",
  "public-health": "data-science",
  bioengineering: "public-health",
  "operations-research": "biology",
};

const defaultOrder = [
  "biology",
  "statistics",
  "cognitive-science",
  "bioengineering",
  "public-health",
  "data-science",
  "biochemistry",
  "operations-research",
];

function addScores(scoreMap, additions) {
  if (!additions) return;
  Object.entries(additions).forEach(([programId, score]) => {
    scoreMap.set(programId, (scoreMap.get(programId) ?? 0) + score);
  });
}

function usefulSignals(answers, reflection) {
  const ignored = new Set([
    "I'm not sure",
    "Surprise me",
    "It depends",
    "Unsure",
    "I want to understand the tradeoff first",
  ]);

  return [...Object.values(answers), reflection.more]
    .filter((value) => typeof value === "string" && !ignored.has(value))
    .slice(0, 2);
}

function findProgram(programs, programId) {
  return programs.find((program) => program.id === programId);
}

export function buildProgramRecommendations(answers, reflection, programs) {
  const scoreMap = new Map(programs.map((program) => [program.id, 0]));

  Object.entries(answers).forEach(([questionId, answer]) => {
    addScores(scoreMap, answerScores[questionId]?.[answer]);
  });
  addScores(scoreMap, reflectionScores[reflection.more]);

  const ranked = programs
    .map((program) => ({
      id: program.id,
      score: scoreMap.get(program.id) ?? 0,
      order: defaultOrder.indexOf(program.id),
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order);

  const evidenceId = ranked[0]?.id ?? defaultOrder[0];
  const adjacentId =
    adjacentPath[evidenceId] ??
    ranked.find((item) => item.id !== evidenceId)?.id ??
    defaultOrder[1];
  const discoveryId =
    discoveryPath[evidenceId] ??
    ranked.find(
      (item) => item.id !== evidenceId && item.id !== adjacentId,
    )?.id ??
    defaultOrder[2];

  const signals = usefulSignals(answers, reflection);
  const evidenceReason =
    signals.length > 0
      ? `This connects with ${signals
          .map((signal) => `“${signal}”`)
          .join(" and ")}. Treat it as a clue to investigate, not a verdict.`
      : "There is not much evidence yet, so this is simply a broad starting point for another short exploration.";

  const evidenceProgram = findProgram(programs, evidenceId);
  const adjacentProgram = findProgram(programs, adjacentId);
  const discoveryProgram = findProgram(programs, discoveryId);

  return [
    {
      slot: "evidence_supported",
      label: signals.length > 0 ? "Closest signals so far" : "Starting point",
      program: evidenceProgram,
      reason: evidenceReason,
    },
    {
      slot: "adjacent",
      label: "Nearby possibility",
      program: adjacentProgram,
      reason: `This shares some ways of thinking with ${
        evidenceProgram?.name ?? "the first path"
      }, but changes the subject matter or day-to-day work.`,
    },
    {
      slot: "discovery",
      label: "Wildcard worth meeting",
      program: discoveryProgram,
      reason:
        "This deliberately widens the map. A useful exploration should include one credible option you might not have chosen from its title alone.",
    },
  ].filter((recommendation) => recommendation.program);
}
