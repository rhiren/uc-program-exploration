import {
  buildCoursesFromCourseEntries,
  buildCoursesFromAgProgress,
  buildReadinessSnapshot,
} from "../prepare/readiness.mjs";
import {
  buildActivityNextSteps,
  buildActivitySummary,
  buildPiqStorySeeds,
} from "../activities/summary.mjs";
import { buildPathFitSnapshot } from "../fit/path-fit.mjs";

function firstItems(items, limit) {
  return Array.isArray(items) ? items.slice(0, limit) : [];
}

function action(id, title, detail, href, source) {
  return { id, title, detail, href, source };
}

export function buildUcPrepReport({
  prepareBaseline,
  activityEntries = [],
  selectedFamilyIds = [],
  selectedCampusIds = [],
  families = [],
  campuses = [],
  programs = [],
  agRules,
  gpaRules,
  roadmapTemplates = [],
} = {}) {
  const baseline = prepareBaseline ?? {};
  const hasCourseInventory = (baseline.courseEntries ?? []).length > 0;
  const courses = hasCourseInventory
    ? buildCoursesFromCourseEntries(baseline.courseEntries)
    : buildCoursesFromAgProgress(baseline.agProgress);
  const readiness = buildReadinessSnapshot({
    baseline,
    courses,
    agRules,
    gpaRules,
    roadmapTemplates,
  });
  const activities = buildActivitySummary(activityEntries);
  const storySeeds = buildPiqStorySeeds(activityEntries);
  const activitySteps = buildActivityNextSteps(activityEntries);
  const pathFit = buildPathFitSnapshot({
    selectedFamilyIds,
    selectedCampusIds,
    families,
    campuses,
    programs,
    courseEntries: baseline.courseEntries ?? [],
  });

  const nextActions = [];
  if (!hasCourseInventory) {
    nextActions.push(
      action(
        "add-courses",
        "Enter real coursework",
        "Add completed, current, planned, and outside-school courses so the academic review is course-based.",
        "/prepare",
        "Prepare",
      ),
    );
  }
  if (readiness.courseInventory.needsVerificationCount > 0) {
    nextActions.push(
      action(
        "verify-courses",
        "Verify uncertain courses",
        `${readiness.courseInventory.needsVerificationCount} course${readiness.courseInventory.needsVerificationCount === 1 ? "" : "s"} need A-G or source confirmation before relying on the report.`,
        "/prepare",
        "Prepare",
      ),
    );
  }
  if (activities.totalEntries === 0) {
    nextActions.push(
      action(
        "activity-brain-dump",
        "Do an activities brain dump",
        "List clubs, projects, work, service, awards, family responsibilities, and informal commitments from 9th grade onward.",
        "/activities",
        "Activities",
      ),
    );
  } else if (activities.entriesWithImpactCount < Math.min(activities.totalEntries, 5)) {
    nextActions.push(
      action(
        "activity-impact",
        "Add activity impact details",
        "Capture outcomes, scale, people helped, products made, or responsibilities handled for the most meaningful entries.",
        "/activities",
        "Activities",
      ),
    );
  }
  if (selectedFamilyIds.length === 0 || selectedCampusIds.length === 0) {
    nextActions.push(
      action(
        "choose-fit-focus",
        "Choose interests and campuses",
        "Select a few interests and UCs so the Path Fit questions become specific enough for a family or counselor discussion.",
        "/fit",
        "Path fit",
      ),
    );
  }

  for (const item of readiness.nextActions ?? []) {
    if (nextActions.length >= 3) break;
    nextActions.push(
      action(item.id, item.title, item.rationale, "/prepare", "Prepare"),
    );
  }
  for (const item of activitySteps) {
    if (nextActions.length >= 3) break;
    nextActions.push(
      action(item.id, item.title, item.detail, "/activities", "Activities"),
    );
  }

  return {
    academic: {
      status: readiness.agAudit.status,
      possibleCourseCount: readiness.agAudit.possibleCourseCount,
      unresolvedCourseCount: readiness.agAudit.unresolvedCourseCount,
      estimatedGpa: readiness.gpaEstimate.estimatedGpa,
      includedCourseCount: readiness.gpaEstimate.includedCourseCount,
      courseInventory: readiness.courseInventory,
      seniorCourseConsiderations: firstItems(
        readiness.seniorCourseConsiderations,
        3,
      ),
      findings: firstItems(readiness.findings, 3),
    },
    pathFit: {
      focusCards: firstItems(pathFit.focusCards, 3),
      campusChecks: firstItems(pathFit.campusChecks, 3),
      verificationItems: firstItems(pathFit.verificationItems, 4),
      discussionGuide: pathFit.discussionGuide,
    },
    activities: {
      summary: activities,
      storySeeds,
      notes: firstItems(activities.notes, 4),
    },
    nextActions: firstItems(nextActions, 3),
    counselorQuestions: [
      ...firstItems(pathFit.verificationItems, 2),
      ...firstItems(pathFit.campusChecks, 2).flatMap((campus) =>
        firstItems(campus.questions, 1),
      ),
      ...firstItems(activities.notes, 2),
    ].slice(0, 5),
    disclaimer:
      "This dashboard is a family planning summary. It does not estimate admission chances, rank campuses, or replace counselor and official UC verification.",
  };
}
