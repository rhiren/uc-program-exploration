export const decisionLabStorageKey =
  "uc-pathways-explorer:decision-lab-progress";

export const decisionLabProgressVersion = 1;

const statuses = new Set(["keep", "maybe", "drop"]);
const scoreKeys = [
  "interest",
  "academicConfidence",
  "premedFit",
  "careerFallback",
  "workloadFit",
  "ucAvailability",
];
const experimentIds = new Set([
  "course-sample-biology",
  "course-sample-data",
  "course-sample-health",
  "four-year-plan",
  "student-conversation",
  "career-conversation",
  "clinical-service",
  "family-review",
]);

function text(value, max = 700) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function boundedScore(value, fallback = 3) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(5, Math.max(1, number)) : fallback;
}

function cleanScores(value) {
  return Object.fromEntries(
    scoreKeys.map((key) => [key, boundedScore(value?.[key])]),
  );
}

function finalistEntries(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: text(item.id, 120) || `finalist-${index}`,
      majorId: text(item.majorId, 120),
      majorName: text(item.majorName, 120) || "Untitled major",
      status: statuses.has(item.status) ? item.status : "maybe",
      scores: cleanScores(item.scores),
      evidence: {
        whyInterested: text(item.evidence?.whyInterested),
        courseEvidence: text(item.evidence?.courseEvidence),
        careerFallback: text(item.evidence?.careerFallback),
        concerns: text(item.evidence?.concerns),
      },
    }))
    .filter((item) => item.majorName.length > 0)
    .slice(0, 12);
}

function experimentEntries(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      id: text(item.id, 80),
      completed: Boolean(item.completed),
      note: text(item.note, 300),
    }))
    .filter((item) => experimentIds.has(item.id));
}

export function createDecisionLabProgress() {
  return {
    version: decisionLabProgressVersion,
    updatedAt: new Date().toISOString(),
    decisionTarget: "Narrow to 3-5 application major directions by the end of 11th grade spring.",
    finalists: [],
    experiments: [],
  };
}

export function parseDecisionLabProgress(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.version !== decisionLabProgressVersion
  ) {
    return null;
  }

  return {
    version: decisionLabProgressVersion,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    decisionTarget:
      text(value.decisionTarget, 220) ||
      "Narrow to 3-5 application major directions by the end of 11th grade spring.",
    finalists: finalistEntries(value.finalists),
    experiments: experimentEntries(value.experiments),
  };
}

export function readDecisionLabProgress(storage) {
  try {
    const stored = storage.getItem(decisionLabStorageKey);
    if (!stored) return createDecisionLabProgress();
    return (
      parseDecisionLabProgress(JSON.parse(stored)) ??
      createDecisionLabProgress()
    );
  } catch {
    return createDecisionLabProgress();
  }
}

export function writeDecisionLabProgress(storage, progress) {
  const normalized =
    parseDecisionLabProgress({
      ...progress,
      version: decisionLabProgressVersion,
      updatedAt: new Date().toISOString(),
    }) ?? createDecisionLabProgress();
  storage.setItem(decisionLabStorageKey, JSON.stringify(normalized, null, 2));
  return normalized;
}
