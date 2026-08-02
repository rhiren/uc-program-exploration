export const agCategoryIds: string[];
export const gradeLabels: Record<string, string>;

type UnknownRecord = Record<string, unknown>;

export function buildCoursesFromAgProgress(
  agProgress: Record<string, unknown>,
): UnknownRecord[];

export function inferCourseFromName(name: string): UnknownRecord;

export function buildCoursesFromCourseEntries(
  entries: UnknownRecord[],
): UnknownRecord[];

export function summarizeCourseInventory(entries: UnknownRecord[]): UnknownRecord;

export function buildSeniorCourseConsiderations(
  entries: UnknownRecord[],
  baseline?: UnknownRecord,
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

export function buildCounselorQuestions(
  snapshot: UnknownRecord,
  baseline?: UnknownRecord,
): UnknownRecord[];

export function buildFirstActionPlan(
  snapshot: UnknownRecord,
  roadmapPeriods?: UnknownRecord[],
): UnknownRecord[];

export function buildApplicationMilestonePreview(
  applicationMilestones?: UnknownRecord,
): UnknownRecord[];
