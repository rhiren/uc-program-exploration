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

export function getPremedMajorTracks(): PremedMajorTrack[];
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
