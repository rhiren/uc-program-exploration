export function summarizeAcademicSignals(courseEntries?: unknown[]): {
  totalCourses: number;
  confirmedCount: number;
  currentOrPlannedCount: number;
  advancedCount: number;
  needsVerificationCount: number;
  signals: Record<string, boolean>;
  agNotes: string[];
};

export function buildPathFitSnapshot(input?: {
  selectedFamilyIds?: string[];
  selectedCampusIds?: string[];
  families?: Array<{ id: string; name: string }>;
  campuses?: Array<{
    id: string;
    name: string;
    shortName?: string;
    admitRate?: number;
  }>;
  programs?: Array<{
    id: string;
    name: string;
    slug: string;
    familyIds: string[];
  }>;
  courseEntries?: unknown[];
}): {
  academic: ReturnType<typeof summarizeAcademicSignals>;
  focusCards: Array<{
    id: string;
    title: string;
    attention: string;
    status: "supported" | "partial" | "needs_context";
    presentNeeds: string[];
    missingNeeds: string[];
    matchingPrograms: Array<{ id: string; name: string; slug: string }>;
  }>;
  campusChecks: Array<{
    id: string;
    name: string;
    note: string;
    questions: string[];
  }>;
  verificationItems: string[];
  discussionGuide: string[];
  disclaimer: string;
};
