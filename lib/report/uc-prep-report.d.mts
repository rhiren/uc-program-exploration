export function buildUcPrepReport(input?: {
  prepareBaseline?: Record<string, unknown>;
  activityEntries?: unknown[];
  selectedFamilyIds?: string[];
  selectedCampusIds?: string[];
  families?: Array<{ id: string; name: string }>;
  campuses?: Array<{ id: string; name: string; shortName?: string; admitRate?: number }>;
  programs?: Array<{ id: string; name: string; slug: string; familyIds: string[] }>;
  agRules?: unknown;
  gpaRules?: unknown;
  roadmapTemplates?: unknown[];
}): {
  academic: {
    status: string;
    possibleCourseCount: number;
    unresolvedCourseCount: number;
    estimatedGpa: number | null;
    includedCourseCount: number;
    courseInventory: Record<string, unknown>;
    seniorCourseConsiderations: unknown[];
    findings: unknown[];
  };
  pathFit: {
    focusCards: unknown[];
    campusChecks: unknown[];
    verificationItems: string[];
    discussionGuide: string[];
  };
  activities: {
    summary: Record<string, unknown>;
    storySeeds: unknown[];
    notes: string[];
  };
  nextActions: Array<{
    id: string;
    title: string;
    detail: string;
    href: string;
    source: string;
  }>;
  counselorQuestions: string[];
  disclaimer: string;
};
