export type PremedMajorTrack = {
  id: string;
  name: string;
  examples: string;
  premedFit: string;
  durableValue: string;
  bestFor: string;
  watchouts: string[];
  coursePriorities: string[];
  advisorQuestions: string[];
};

export type PremedCourseEntry = {
  id?: string;
  name?: string;
  agCategory?: string;
  level?: string;
  source?: string;
  verificationStatus?: string;
};

export type PremedCatalogMajor = {
  id: string;
  name: string;
  categoryName: string;
  familyIds: string[];
  emphases?: string[];
  deepGuideSlug?: string;
  campuses: Array<{
    institutionId: string;
    name: string;
    officialCatalogUrl?: string;
  }>;
};

export function getPremedMajorTracks(): PremedMajorTrack[];
export function getPremedInterestProfiles(): Array<{
  id: string;
  label: string;
  familyIds: string[];
  keywords: string[];
}>;
export function getPremedFallbackProfiles(): Array<{
  id: string;
  label: string;
  keywords: string[];
  familyIds: string[];
  note: string;
}>;
export function summarizePremedCourseSignals(courseEntries?: PremedCourseEntry[]): {
  totalCourses: number;
  areas: Array<{
    id: string;
    label: string;
    count: number;
    status: "seen" | "not_seen";
  }>;
  advancedScienceCount: number;
  outsideCourseCount: number;
  needsVerificationCount: number;
  notes: string[];
};
export function buildPremedMajorStrategy(options?: {
  courseEntries?: PremedCourseEntry[];
  selectedTrackId?: string;
  workloadPreference?: string;
}): {
  selectedTrack: PremedMajorTrack;
  tracks: PremedMajorTrack[];
  courseSignals: ReturnType<typeof summarizePremedCourseSignals>;
  workloadNote: string;
  nextChecks: string[];
  parentExplanation: string;
  disclaimer: string;
};
export function buildPremedMajorShortlist(options?: {
  majors?: PremedCatalogMajor[];
  selectedInterestIds?: string[];
  fallbackPriorityId?: string;
  campusIds?: string[];
  limit?: number;
}): {
  fallbackProfile: {
    id: string;
    label: string;
    keywords: string[];
    familyIds: string[];
    note: string;
  };
  interests: Array<{
    id: string;
    label: string;
    familyIds: string[];
    keywords: string[];
  }>;
  fallbackProfiles: Array<{
    id: string;
    label: string;
    keywords: string[];
    familyIds: string[];
    note: string;
  }>;
  results: Array<{
    id: string;
    name: string;
    categoryName: string;
    deepGuideSlug?: string;
    campusCount: number;
    campuses: Array<{
      institutionId: string;
      name: string;
      officialCatalogUrl?: string;
    }>;
    premedFit: "direct" | "compatible" | "needs-planning";
    premedFitLabel: string;
    fallbackStrength: "strong" | "moderate" | "needs-builder";
    fallbackLabel: string;
    score: number;
    why: string;
    watchout: string;
  }>;
  summary: string;
};
