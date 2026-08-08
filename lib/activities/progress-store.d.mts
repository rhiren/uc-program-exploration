export const activityProgressStorageKey: string;
export const activityProgressVersion: number;

export function createActivityProgress(): {
  version: number;
  updatedAt: string;
  entries: unknown[];
};

export function parseActivityProgress(value: unknown):
  | {
      version: number;
      updatedAt: string;
      entries: Array<{
        id: string;
        title: string;
        category: string;
        organization: string;
        role: string;
        gradeLevels: number[];
        hoursPerWeek: number;
        weeksPerYear: number;
        impact: string;
        reflection: string;
        signals: string[];
      }>;
    }
  | null;

export function readActivityProgress(storage: Storage): NonNullable<
  ReturnType<typeof parseActivityProgress>
>;

export function writeActivityProgress(
  storage: Storage,
  progress: unknown,
): NonNullable<ReturnType<typeof parseActivityProgress>>;
