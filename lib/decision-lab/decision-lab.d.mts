import type { DecisionLabProgress, DecisionScoreKey } from "./progress-store.mjs";

export const decisionScoreWeights: Record<DecisionScoreKey, number>;
export const decisionScoreFields: Array<{
  id: DecisionScoreKey;
  label: string;
  prompt: string;
}>;
export const decisionExperiments: Array<{
  id: string;
  phase: string;
  title: string;
  detail: string;
}>;
export function buildDecisionLabReport(
  progress: DecisionLabProgress,
  majors?: Array<{
    id: string;
    deepGuideSlug?: string;
    campuses?: unknown[];
  }>,
): {
  finalists: Array<
    DecisionLabProgress["finalists"][number] & {
      campusCount: number;
      deepGuideSlug?: string;
      score: number;
      scoreLabel: string;
      evidenceItems: number;
      recommendation: string;
    }
  >;
  topFinalists: Array<
    DecisionLabProgress["finalists"][number] & {
      campusCount: number;
      deepGuideSlug?: string;
      score: number;
      scoreLabel: string;
      evidenceItems: number;
      recommendation: string;
    }
  >;
  completedExperiments: number;
  totalExperiments: number;
  readiness: string;
  gaps: string[];
};
