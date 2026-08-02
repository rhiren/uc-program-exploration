export const prepareProgressStorageKey =
  "uc-pathways-explorer:prepare-progress";

export const prepareProgressVersion = 1;

const stages = new Set(["baseline", "courses", "ag", "gpa", "snapshot"]);
const residencyOptions = new Set(["california", "nonresident"]);
const seniorMathOptions = new Set([
  "calculus",
  "statistics",
  "precalculus",
  "not-sure",
]);
const loadOptions = new Set(["steady", "stretch", "too-much", "not-sure"]);
const courseStatuses = new Set(["completed", "current", "planned"]);
const courseSources = new Set([
  "high_school",
  "community_college",
  "online_school",
  "outside_enrichment",
]);
const courseLevels = new Set([
  "regular",
  "honors",
  "ap",
  "ib",
  "college",
  "other",
]);
const courseVerificationStatuses = new Set([
  "confirmed",
  "needs_verification",
  "not_ag_enrichment",
]);
const agCategories = new Set(["a", "b", "c", "d", "e", "f", "g", "unknown"]);
const grades = new Set(["", "A", "B", "C", "D", "F"]);

function boundedNumber(value, minimum, maximum) {
  return Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : minimum;
}

function boundedInteger(value, minimum, maximum) {
  return Number.isInteger(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : minimum;
}

function categoryProgress(value) {
  return {
    completed: boundedNumber(Number(value?.completed ?? 0), 0, 8),
    current: boundedNumber(Number(value?.current ?? 0), 0, 4),
    planned: boundedNumber(Number(value?.planned ?? 0), 0, 4),
    unresolved: boundedNumber(Number(value?.unresolved ?? 0), 0, 4),
  };
}

function agProgress(value) {
  return Object.fromEntries(
    ["a", "b", "c", "d", "e", "f", "g"].map((categoryId) => [
      categoryId,
      categoryProgress(value?.[categoryId]),
    ]),
  );
}

function gpaSummary(value) {
  return {
    grades: {
      A: boundedInteger(value?.grades?.A, 0, 20),
      B: boundedInteger(value?.grades?.B, 0, 20),
      C: boundedInteger(value?.grades?.C, 0, 20),
      D: boundedInteger(value?.grades?.D, 0, 20),
      F: boundedInteger(value?.grades?.F, 0, 20),
    },
    honors: {
      10: boundedInteger(value?.honors?.[10], 0, 10),
      11: boundedInteger(value?.honors?.[11], 0, 10),
    },
  };
}

function courseEntries(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `course-${index}`,
      name: typeof item.name === "string" ? item.name.trim().slice(0, 80) : "",
      gradeLevel: boundedInteger(item.gradeLevel, 9, 12),
      status: courseStatuses.has(item.status) ? item.status : "planned",
      source: courseSources.has(item.source) ? item.source : "high_school",
      agCategory: agCategories.has(item.agCategory)
        ? item.agCategory
        : "unknown",
      level: courseLevels.has(item.level) ? item.level : "regular",
      grade: grades.has(item.grade) ? item.grade : "",
      verificationStatus: courseVerificationStatuses.has(
        item.verificationStatus,
      )
        ? item.verificationStatus
        : "needs_verification",
    }))
    .filter((item) => item.name.length > 0)
    .slice(0, 40);
}

export function createPrepareProgress() {
  return {
    version: prepareProgressVersion,
    updatedAt: new Date().toISOString(),
    stage: "baseline",
    baseline: {
      residency: "california",
      schoolCourseListStatus: "need-help",
      currentMath: "precalculus",
      seniorMathPlan: "not-sure",
      sustainableLoad: "not-sure",
      explorationPriority: "medicine or health science",
      agProgress: {
        a: { completed: 1, current: 1, planned: 0, unresolved: 0 },
        b: { completed: 2, current: 1, planned: 1, unresolved: 0 },
        c: { completed: 3, current: 1, planned: 0, unresolved: 0 },
        d: { completed: 2, current: 1, planned: 0, unresolved: 0 },
        e: { completed: 2, current: 0, planned: 0, unresolved: 0 },
        f: { completed: 1, current: 0, planned: 0, unresolved: 0 },
        g: { completed: 0, current: 0, planned: 1, unresolved: 1 },
      },
      gpaSummary: {
        grades: { A: 7, B: 3, C: 0, D: 0, F: 0 },
        honors: { 10: 1, 11: 2 },
      },
      courseEntries: [],
    },
  };
}

export function parsePrepareProgress(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.version !== prepareProgressVersion
  ) {
    return null;
  }

  const baseline = value.baseline ?? {};

  return {
    version: prepareProgressVersion,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    stage: stages.has(value.stage) ? value.stage : "baseline",
    baseline: {
      residency: residencyOptions.has(baseline.residency)
        ? baseline.residency
        : "california",
      schoolCourseListStatus:
        typeof baseline.schoolCourseListStatus === "string"
          ? baseline.schoolCourseListStatus
          : "need-help",
      currentMath:
        typeof baseline.currentMath === "string"
          ? baseline.currentMath
          : "precalculus",
      seniorMathPlan: seniorMathOptions.has(baseline.seniorMathPlan)
        ? baseline.seniorMathPlan
        : "not-sure",
      sustainableLoad: loadOptions.has(baseline.sustainableLoad)
        ? baseline.sustainableLoad
        : "not-sure",
      explorationPriority:
        typeof baseline.explorationPriority === "string"
          ? baseline.explorationPriority
          : "",
      agProgress: agProgress(baseline.agProgress),
      gpaSummary: gpaSummary(baseline.gpaSummary),
      courseEntries: courseEntries(baseline.courseEntries),
    },
  };
}

export function readPrepareProgress(storage) {
  try {
    const stored = storage.getItem(prepareProgressStorageKey);
    if (!stored) return createPrepareProgress();

    return parsePrepareProgress(JSON.parse(stored)) ?? createPrepareProgress();
  } catch {
    return createPrepareProgress();
  }
}

export function writePrepareProgress(storage, progress) {
  const normalized =
    parsePrepareProgress({
      ...progress,
      version: prepareProgressVersion,
      updatedAt: new Date().toISOString(),
    }) ?? createPrepareProgress();
  storage.setItem(prepareProgressStorageKey, JSON.stringify(normalized, null, 2));
  return normalized;
}
