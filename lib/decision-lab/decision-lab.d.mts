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
export const premedRequirementAreas: Array<{
  id: string;
  label: string;
  direct: string[];
  partial: string[];
}>;
export function buildPremedRequirementMap(major?: {
  name?: string;
  categoryName?: string;
  emphases?: string[];
}): Array<{
  id: string;
  label: string;
  status: "likely-covered" | "partial-overlap" | "layer-separately";
  statusLabel: string;
  note: string;
}>;
export function buildCampusFitSummary(major?: {
  campuses?: Array<{
    institutionId: string;
    name: string;
    officialCatalogUrl?: string;
  }>;
}): {
  count: number;
  label: string;
  risk: string;
  campuses: Array<{
    institutionId: string;
    name: string;
    officialCatalogUrl?: string;
    checklist: string[];
  }>;
};
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
      campusFit: ReturnType<typeof buildCampusFitSummary>;
      deepGuideSlug?: string;
      premedRequirementMap: ReturnType<typeof buildPremedRequirementMap>;
      score: number;
      scoreLabel: string;
      evidenceItems: number;
      recommendation: string;
    }
  >;
  topFinalists: Array<
    DecisionLabProgress["finalists"][number] & {
      campusCount: number;
      campusFit: ReturnType<typeof buildCampusFitSummary>;
      deepGuideSlug?: string;
      premedRequirementMap: ReturnType<typeof buildPremedRequirementMap>;
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
