export const activityProgressStorageKey =
  "uc-pathways-explorer:activity-progress";

export const activityProgressVersion = 1;

const categories = new Set([
  "award",
  "educational_preparation",
  "extracurricular",
  "other_coursework",
  "volunteering",
  "work",
]);
const gradeLevels = new Set([9, 10, 11, 12]);
const signalValues = new Set([
  "leadership",
  "service",
  "creative",
  "research",
  "career_exposure",
  "family_responsibility",
  "academic_interest",
]);

function text(value, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function boundedNumber(value, minimum, maximum) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(maximum, Math.max(minimum, number))
    : minimum;
}

function stringList(value, allowedValues, limit = 8) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => allowedValues.has(item))
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, limit);
}

function activityEntries(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: text(item.id, 80) || `activity-${index}`,
      title: text(item.title, 100),
      category: categories.has(item.category) ? item.category : "extracurricular",
      organization: text(item.organization, 100),
      role: text(item.role, 120),
      gradeLevels: stringList(item.gradeLevels, gradeLevels, 4),
      hoursPerWeek: boundedNumber(item.hoursPerWeek, 0, 80),
      weeksPerYear: boundedNumber(item.weeksPerYear, 0, 52),
      impact: text(item.impact, 600),
      reflection: text(item.reflection, 600),
      signals: stringList(item.signals, signalValues, 7),
    }))
    .filter((item) => item.title.length > 0)
    .slice(0, 20);
}

export function createActivityProgress() {
  return {
    version: activityProgressVersion,
    updatedAt: new Date().toISOString(),
    entries: [],
  };
}

export function parseActivityProgress(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.version !== activityProgressVersion
  ) {
    return null;
  }

  return {
    version: activityProgressVersion,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    entries: activityEntries(value.entries),
  };
}

export function readActivityProgress(storage) {
  try {
    const stored = storage.getItem(activityProgressStorageKey);
    if (!stored) return createActivityProgress();
    return parseActivityProgress(JSON.parse(stored)) ?? createActivityProgress();
  } catch {
    return createActivityProgress();
  }
}

export function writeActivityProgress(storage, progress) {
  const normalized =
    parseActivityProgress({
      ...progress,
      version: activityProgressVersion,
      updatedAt: new Date().toISOString(),
    }) ?? createActivityProgress();
  storage.setItem(activityProgressStorageKey, JSON.stringify(normalized, null, 2));
  return normalized;
}
