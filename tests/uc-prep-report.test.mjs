import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildUcPrepReport } from "../lib/report/uc-prep-report.mjs";
import { createPrepareProgress } from "../lib/prepare/progress-store.mjs";

const agRules = JSON.parse(
  readFileSync(new URL("../content/preparation/ag-rules.json", import.meta.url)),
);
const gpaRules = JSON.parse(
  readFileSync(new URL("../content/preparation/gpa-rules.json", import.meta.url)),
);
const roadmap = JSON.parse(
  readFileSync(
    new URL("../content/preparation/roadmap-templates.json", import.meta.url),
  ),
);

test("UC prep report combines academic, activity, and path-fit actions", () => {
  const prepare = createPrepareProgress();
  prepare.baseline.courseEntries = [
    {
      id: "ap-bio",
      name: "AP Biology",
      gradeLevel: 11,
      status: "current",
      source: "high_school",
      agCategory: "d",
      level: "ap",
      grade: "",
      verificationStatus: "needs_verification",
    },
  ];
  const report = buildUcPrepReport({
    prepareBaseline: prepare.baseline,
    activityEntries: [],
    selectedFamilyIds: ["medicine-health-public-health"],
    selectedCampusIds: ["uc-davis"],
    families: [
      { id: "medicine-health-public-health", name: "Medicine, health, and public health" },
    ],
    campuses: [{ id: "uc-davis", name: "University of California, Davis", shortName: "UC Davis", admitRate: 44.6 }],
    programs: [
      { id: "biology", name: "Biology", slug: "biology", familyIds: ["medicine-health-public-health"] },
    ],
    agRules,
    gpaRules,
    roadmapTemplates: roadmap.templates,
  });

  assert.ok(report.nextActions.length <= 3);
  assert.ok(report.nextActions.some((item) => item.id === "verify-courses"));
  assert.ok(report.nextActions.some((item) => item.id === "activity-brain-dump"));
  assert.equal(report.pathFit.campusChecks[0].name, "UC Davis");
  assert.match(report.disclaimer, /does not estimate admission chances/i);
});
