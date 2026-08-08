import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPathFitSnapshot,
  summarizeAcademicSignals,
} from "../lib/fit/path-fit.mjs";

const courseEntries = [
  {
    id: "ap-bio",
    name: "AP Biology",
    status: "completed",
    agCategory: "d",
    level: "ap",
    verificationStatus: "confirmed",
  },
  {
    id: "precalc",
    name: "Precalculus",
    status: "current",
    agCategory: "c",
    level: "honors",
    verificationStatus: "confirmed",
  },
  {
    id: "cs",
    name: "Intro to Computer Science",
    status: "planned",
    agCategory: "g",
    level: "regular",
    verificationStatus: "needs_verification",
  },
];

test("summarizes academic signals from entered coursework", () => {
  const summary = summarizeAcademicSignals(courseEntries);

  assert.equal(summary.totalCourses, 3);
  assert.equal(summary.advancedCount, 2);
  assert.equal(summary.needsVerificationCount, 1);
  assert.equal(summary.signals.math, true);
  assert.equal(summary.signals.science, true);
  assert.equal(summary.signals.cs, true);
});

test("builds a non-predictive path fit snapshot", () => {
  const snapshot = buildPathFitSnapshot({
    selectedFamilyIds: ["medicine-health-public-health", "computing-data-ai"],
    selectedCampusIds: ["uc-san-diego"],
    families: [
      { id: "medicine-health-public-health", name: "Medicine, health, and public health" },
      { id: "computing-data-ai", name: "Computing, data, and AI" },
    ],
    campuses: [{ id: "uc-san-diego", name: "University of California, San Diego", shortName: "UC San Diego", admitRate: 28.4 }],
    programs: [
      { id: "biology", name: "Biology", slug: "biology", familyIds: ["medicine-health-public-health"] },
      { id: "data-science", name: "Data Science", slug: "data-science", familyIds: ["computing-data-ai"] },
    ],
    courseEntries,
  });

  assert.equal(snapshot.focusCards.length, 2);
  assert.match(snapshot.disclaimer, /does not rank campuses/i);
  assert.match(snapshot.campusChecks[0].note, /not as a prediction/i);
  assert.ok(snapshot.verificationItems.some((item) => item.includes("Verify 1 course")));
});
