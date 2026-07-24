export const discoverProgressStorageKey =
  "uc-pathways-explorer:discover-progress";

export const discoverProgressVersion = 1;

const stages = new Set([
  "onboarding",
  "challenge",
  "reflection",
  "results",
]);

function stringRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, item]) => typeof key === "string" && typeof item === "string",
    ),
  );
}

function stringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}

function boundedInteger(value, minimum, maximum) {
  return Number.isInteger(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : minimum;
}

export function createDiscoverProgress() {
  return {
    version: discoverProgressVersion,
    updatedAt: new Date().toISOString(),
    stage: "onboarding",
    onboardingIndex: 0,
    answers: {},
    challengeIndex: 0,
    challengeAnswers: {},
    evidenceOrder: [],
    reflectionStep: 0,
    reflection: {},
    savedProgramIds: [],
  };
}

export function parseDiscoverProgress(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  if (value.version !== discoverProgressVersion) {
    return null;
  }

  return {
    version: discoverProgressVersion,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    stage: stages.has(value.stage) ? value.stage : "onboarding",
    onboardingIndex: boundedInteger(value.onboardingIndex, 0, 3),
    answers: stringRecord(value.answers),
    challengeIndex: boundedInteger(value.challengeIndex, 0, 2),
    challengeAnswers: stringRecord(value.challengeAnswers),
    evidenceOrder: stringArray(value.evidenceOrder),
    reflectionStep: boundedInteger(value.reflectionStep, 0, 1),
    reflection: stringRecord(value.reflection),
    savedProgramIds: [...new Set(stringArray(value.savedProgramIds))],
  };
}

export function readDiscoverProgress(storage) {
  try {
    const stored = storage.getItem(discoverProgressStorageKey);
    if (!stored) return createDiscoverProgress();

    return parseDiscoverProgress(JSON.parse(stored)) ?? createDiscoverProgress();
  } catch {
    return createDiscoverProgress();
  }
}

export function serializeDiscoverProgress(progress) {
  return JSON.stringify(
    {
      ...progress,
      version: discoverProgressVersion,
    },
    null,
    2,
  );
}
