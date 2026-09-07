import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPremedMajorStrategy,
  buildPremedMajorShortlist,
  getPremedMajorTracks,
  summarizePremedCourseSignals,
} from "../lib/premed/major-strategy.mjs";

test("pre-med tracks keep major choice separate from medical-school preparation", () => {
  const tracks = getPremedMajorTracks();

  assert.ok(tracks.length >= 5);
  assert.ok(tracks.some((track) => track.id === "data-health"));
  assert.ok(
    tracks.every((track) =>
      /fallback|value|graduate|research|engineering|writing|health/i.test(
        track.durableValue,
      ),
    ),
  );
});

test("course signals detect common pre-med preparation areas from typed courses", () => {
  const signals = summarizePremedCourseSignals([
    {
      name: "AP Biology",
      agCategory: "d",
      level: "ap",
      source: "high_school",
      verificationStatus: "confirmed",
    },
    {
      name: "Honors Chemistry",
      agCategory: "d",
      level: "honors",
      source: "high_school",
      verificationStatus: "needs_verification",
    },
    {
      name: "Community College Statistics",
      agCategory: "c",
      level: "college",
      source: "community_college",
      verificationStatus: "needs_verification",
    },
  ]);

  assert.equal(signals.totalCourses, 3);
  assert.equal(signals.advancedScienceCount, 2);
  assert.equal(signals.outsideCourseCount, 1);
  assert.equal(signals.needsVerificationCount, 2);
  assert.equal(
    signals.areas.find((area) => area.id === "biology").status,
    "seen",
  );
  assert.equal(
    signals.areas.find((area) => area.id === "chemistry").status,
    "seen",
  );
  assert.equal(signals.areas.find((area) => area.id === "math").status, "seen");
});

test("selected strategy returns concrete checks for demanding majors", () => {
  const strategy = buildPremedMajorStrategy({
    selectedTrackId: "engineering",
    workloadPreference: "stretch",
    courseEntries: [{ name: "AP Biology", agCategory: "d", level: "ap" }],
  });

  assert.equal(strategy.selectedTrack.id, "engineering");
  assert.match(strategy.workloadNote, /stretch plan/i);
  assert.ok(
    strategy.nextChecks.some((check) => /required labs fit/i.test(check)),
  );
  assert.match(strategy.disclaimer, /not a medical-school admissions prediction/i);
});

test("major shortlist changes with fallback priority while preserving pre-med fit", () => {
  const majors = [
    {
      id: "biology",
      name: "Biology",
      categoryName: "Biological and Life Sciences",
      familyIds: ["biology-life-sciences"],
      emphases: [],
      campuses: [{ institutionId: "uc-davis", name: "Davis" }],
    },
    {
      id: "data-science",
      name: "Data Science",
      categoryName: "Engineering and Computer Science",
      familyIds: ["computing-data-ai", "math-stat-physical"],
      emphases: [],
      campuses: [{ institutionId: "uc-san-diego", name: "San Diego" }],
    },
    {
      id: "public-health",
      name: "Public Health",
      categoryName: "Health Professions",
      familyIds: ["medicine-health-public-health"],
      emphases: [],
      campuses: [{ institutionId: "uc-irvine", name: "Irvine" }],
    },
  ];

  const tech = buildPremedMajorShortlist({
    majors,
    selectedInterestIds: ["biology-lab", "data-computing"],
    fallbackPriorityId: "tech-data",
  });
  const health = buildPremedMajorShortlist({
    majors,
    selectedInterestIds: ["biology-lab", "people-behavior"],
    fallbackPriorityId: "health-systems",
  });

  assert.equal(tech.results[0].id, "data-science");
  assert.equal(health.results[0].id, "public-health");
  assert.ok(tech.results.every((major) => major.premedFitLabel));
  assert.ok(health.results.every((major) => major.fallbackLabel));
});
