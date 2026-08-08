export function buildActivitySummary(entries?: unknown[]): {
  totalEntries: number;
  remainingSlots: number;
  entriesWithImpactCount: number;
  entriesWithReflectionCount: number;
  sustainedCount: number;
  highHourCount: number;
  categories: Array<{ id: string; label: string; count: number }>;
  signals: Array<{ id: string; label: string; count: number }>;
  notes: string[];
};

export function buildPiqStorySeeds(entries?: unknown[]): Array<{
  id: string;
  title: string;
  category: string;
  strength: number;
  reasons: string[];
  prompt: string;
}>;

export function buildActivityNextSteps(entries?: unknown[]): Array<{
  id: string;
  title: string;
  detail: string;
}>;
