export type DecisionScoreKey =
  | "interest"
  | "academicConfidence"
  | "premedFit"
  | "careerFallback"
  | "workloadFit"
  | "ucAvailability";

export type DecisionFinalist = {
  id: string;
  majorId: string;
  majorName: string;
  status: "keep" | "maybe" | "drop";
  scores: Record<DecisionScoreKey, number>;
  evidence: {
    whyInterested: string;
    courseEvidence: string;
    careerFallback: string;
    concerns: string;
  };
};

export type DecisionLabProgress = {
  version: number;
  updatedAt: string;
  decisionTarget: string;
  finalists: DecisionFinalist[];
  experiments: Array<{
    id: string;
    completed: boolean;
    note: string;
  }>;
};

export const decisionLabStorageKey: string;
export const decisionLabProgressVersion: number;
export function createDecisionLabProgress(): DecisionLabProgress;
export function parseDecisionLabProgress(value: unknown): DecisionLabProgress | null;
export function readDecisionLabProgress(storage: Storage): DecisionLabProgress;
export function writeDecisionLabProgress(
  storage: Storage,
  progress: DecisionLabProgress,
): DecisionLabProgress;
