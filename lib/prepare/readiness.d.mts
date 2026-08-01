export const agCategoryIds: string[];
export const gradeLabels: Record<string, string>;

type UnknownRecord = Record<string, unknown>;

export function buildCoursesFromAgProgress(
  agProgress: Record<string, unknown>,
): UnknownRecord[];

export function calculateAgAudit(
  courses: UnknownRecord[],
  agRules: UnknownRecord,
): UnknownRecord;

export function calculateUcGpa(
  courses: UnknownRecord[],
  gpaRules: UnknownRecord,
  residency?: string,
): UnknownRecord;

export function buildCoursesFromGpaSummary(
  summary: UnknownRecord,
): UnknownRecord[];

export function buildReadinessSnapshot(options: {
  baseline: UnknownRecord;
  courses: UnknownRecord[];
  agRules: UnknownRecord;
  gpaRules: UnknownRecord;
  roadmapTemplates?: UnknownRecord[];
}): UnknownRecord;
