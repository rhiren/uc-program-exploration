import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPremedMajorStrategy,
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
