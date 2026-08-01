import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildCoursesFromAgProgress,
  buildReadinessSnapshot,
  calculateAgAudit,
  calculateUcGpa,
} from "../lib/prepare/readiness.mjs";
import {
  createPrepareProgress,
  parsePrepareProgress,
} from "../lib/prepare/progress-store.mjs";

const agRules = JSON.parse(
  readFileSync(new URL("../content/preparation/ag-rules.json", import.meta.url)),
);
const gpaRules = JSON.parse(
  readFileSync(
    new URL("../content/preparation/gpa-rules.json", import.meta.url),
  ),
);
const roadmap = JSON.parse(
  readFileSync(
    new URL("../content/preparation/roadmap-templates.json", import.meta.url),
  ),
);

test("A-G audit separates unresolved classification from missing coursework", () => {
  const courses = buildCoursesFromAgProgress({
    a: { completed: 2, current: 0, planned: 0, unresolved: 0 },
    b: { completed: 3, current: 1, planned: 0, unresolved: 0 },
    c: { completed: 3, current: 0, planned: 0, unresolved: 0 },
    d: { completed: 2, current: 0, planned: 0, unresolved: 0 },
    e: { completed: 1, current: 0, planned: 0, unresolved: 1 },
    f: { completed: 1, current: 0, planned: 0, unresolved: 0 },
    g: { completed: 0, current: 0, planned: 0, unresolved: 0 },
  });

  const audit = calculateAgAudit(courses, agRules);
  const language = audit.categories.find((category) => category.id === "e");
  const elective = audit.categories.find((category) => category.id === "g");

  assert.equal(language.status, "needs_classification");
  assert.equal(language.unresolvedYears, 1);
  assert.equal(elective.status, "possible_gap");
  assert.equal(audit.status, "possible_gap");
});

test("UC GPA estimate caps honors points and keeps resident rules explicit", () => {
  const courses = [
    ...Array.from({ length: 8 }, (_, index) => ({
      id: `a-${index}`,
      agCategory: "g",
      status: "completed",
      grade: "A",
      gradeLevel: index < 4 ? 10 : 11,
      units: 1,
      honorsType: "ap",
    })),
    ...Array.from({ length: 2 }, (_, index) => ({
      id: `b-${index}`,
      agCategory: "g",
      status: "completed",
      grade: "B",
      gradeLevel: 11,
      units: 1,
      honorsType: "none",
    })),
  ];

  const estimate = calculateUcGpa(courses, gpaRules, "california");

  assert.equal(estimate.includedCourseCount, 10);
  assert.equal(estimate.honorsPoints, 8);
  assert.equal(estimate.estimatedGpa, 4.6);
  assert.equal(estimate.minimum, 3);
  assert.equal(estimate.status, "meets_minimum_estimate");
});

test("nonresident GPA estimate excludes UC-certified honors-only courses", () => {
  const courses = [
    {
      id: "uc-honors",
      agCategory: "g",
      status: "completed",
      grade: "A",
      gradeLevel: 10,
      units: 1,
      honorsType: "uc_certified",
    },
  ];

  const estimate = calculateUcGpa(courses, gpaRules, "nonresident");

  assert.equal(estimate.honorsPoints, 0);
  assert.equal(estimate.minimum, 3.4);
  assert.equal(estimate.estimatedGpa, 4);
});

test("readiness snapshot returns at most three next actions", () => {
  const progress = createPrepareProgress();
  const courses = buildCoursesFromAgProgress(progress.baseline.agProgress);
  const snapshot = buildReadinessSnapshot({
    baseline: progress.baseline,
    courses,
    agRules,
    gpaRules,
    roadmapTemplates: roadmap.templates,
  });

  assert.ok(snapshot.findings.length >= 3);
  assert.ok(snapshot.nextActions.length <= 3);
  assert.match(snapshot.disclaimer, /does not predict admission/i);
});

test("prepare progress parser rejects unknown versions", () => {
  assert.equal(parsePrepareProgress({ version: 99 }), null);
});
