import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDecisionLabReport,
  decisionExperiments,
  decisionScoreFields,
} from "../lib/decision-lab/decision-lab.mjs";
import {
  createDecisionLabProgress,
  parseDecisionLabProgress,
} from "../lib/decision-lab/progress-store.mjs";

function scores(value) {
  return {
    interest: value,
    academicConfidence: value,
    premedFit: value,
    careerFallback: value,
    workloadFit: value,
    ucAvailability: value,
  };
}

test("decision lab weights finalists and keeps dropped majors below active choices", () => {
  const progress = {
    ...createDecisionLabProgress(),
    finalists: [
      {
        id: "biology",
        majorId: "biology",
        majorName: "Biology",
        status: "maybe",
        scores: scores(4),
        evidence: {
          whyInterested: "Likes biology.",
          courseEvidence: "Strong science grades.",
          careerFallback: "Research or biotech.",
          concerns: "",
        },
      },
      {
        id: "data",
        majorId: "data-science",
        majorName: "Data Science",
        status: "drop",
        scores: scores(5),
        evidence: {
          whyInterested: "Useful fallback.",
          courseEvidence: "Good math.",
          careerFallback: "Tech.",
          concerns: "Not excited.",
        },
      },
    ],
    experiments: decisionExperiments
      .slice(0, 3)
      .map((experiment) => ({ id: experiment.id, completed: true, note: "" })),
  };

  const report = buildDecisionLabReport(progress, [
    { id: "biology", campuses: [{ id: "uc-davis" }], deepGuideSlug: "biology" },
    { id: "data-science", campuses: [{ id: "uc-berkeley" }] },
  ]);

  assert.equal(report.finalists[0].majorId, "biology");
  assert.equal(report.finalists[1].majorId, "data-science");
  assert.equal(report.completedExperiments, 3);
  assert.match(report.finalists[0].recommendation, /Strong|Keep/i);
});

test("decision lab becomes ready only after enough finalists and experiments", () => {
  const progress = {
    ...createDecisionLabProgress(),
    finalists: ["biology", "data-science", "public-health"].map((id) => ({
      id,
      majorId: id,
      majorName: id,
      status: "keep",
      scores: scores(5),
      evidence: {
        whyInterested: "Clear interest.",
        courseEvidence: "Course evidence.",
        careerFallback: "Fallback evidence.",
        concerns: "",
      },
    })),
    experiments: decisionExperiments
      .slice(0, 5)
      .map((experiment) => ({ id: experiment.id, completed: true, note: "" })),
  };

  const report = buildDecisionLabReport(progress);

  assert.equal(report.readiness, "Ready for a family decision");
  assert.equal(report.topFinalists.length, 3);
  assert.ok(report.gaps.length <= 1);
});

test("decision progress parser sanitizes unknown status and out-of-range scores", () => {
  const parsed = parseDecisionLabProgress({
    version: 1,
    updatedAt: "now",
    decisionTarget: "x".repeat(300),
    finalists: [
      {
        id: "major",
        majorId: "biology",
        majorName: "Biology",
        status: "unknown",
        scores: { interest: 9, academicConfidence: 0 },
        evidence: { whyInterested: "ok" },
      },
    ],
    experiments: [
      { id: "course-sample-biology", completed: true, note: "done" },
      { id: "not-real", completed: true, note: "ignore" },
    ],
  });

  assert.equal(parsed.finalists[0].status, "maybe");
  assert.equal(parsed.finalists[0].scores.interest, 5);
  assert.equal(parsed.finalists[0].scores.academicConfidence, 1);
  assert.equal(parsed.experiments.length, 1);
  assert.ok(decisionScoreFields.length >= 6);
});
