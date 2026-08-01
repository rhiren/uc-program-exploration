"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildApplicationMilestonePreview,
  buildCounselorQuestions,
  buildCoursesFromAgProgress,
  buildFirstActionPlan,
  buildReadinessSnapshot,
} from "@/lib/prepare/readiness.mjs";
import {
  createPrepareProgress,
  readPrepareProgress,
  writePrepareProgress,
} from "@/lib/prepare/progress-store.mjs";

type AgCategory = {
  id: string;
  name: string;
  yearsRequired: number;
  yearsRecommended: number | null;
};

type AgRules = {
  meta: { ruleId: string; lastVerified: string };
  categories: AgCategory[];
  totalCoursesMinimum: number;
  coursesBeforeSeniorYearMinimum: number;
};

type GpaRules = {
  meta: { ruleId: string; lastVerified: string };
  includedWindow: string;
};

type RoadmapAction = {
  id: string;
  period: string;
  title: string;
  rationale: string;
  category: string;
  verificationNeeded?: boolean;
};

type RoadmapPeriod = {
  id: string;
  title: string;
  defaultMaxVisibleActions: number;
};

type ApplicationMilestones = {
  meta: {
    targetEnrollmentTerm: string;
    expectedApplicationPeriod: string;
    publicationStatus: string;
  };
  milestones: Array<{
    id: string;
    expectedTiming: string;
    officialDate: string | null;
    status: string;
    action: string;
  }>;
};

type PrepareStage = "baseline" | "ag" | "gpa" | "snapshot";

type AgProgress = Record<
  string,
  {
    completed: number;
    current: number;
    planned: number;
    unresolved: number;
  }
>;

type GpaSummary = {
  grades: Record<"A" | "B" | "C" | "D" | "F", number>;
  honors: Record<10 | 11, number>;
};

type PrepareBaseline = {
  residency: "california" | "nonresident";
  schoolCourseListStatus: string;
  currentMath: string;
  seniorMathPlan: string;
  sustainableLoad: string;
  explorationPriority: string;
  agProgress: AgProgress;
  gpaSummary: GpaSummary;
};

type PrepareProgress = {
  version: number;
  updatedAt: string;
  stage: PrepareStage;
  baseline: PrepareBaseline;
};

type AgAuditCategory = {
  id: string;
  name: string;
  requiredYears: number;
  recommendedYears: number | null;
  completedYears: number;
  futureYears: number;
  possibleYears: number;
  remainingYears: number;
  unresolvedYears: number;
  status: "on_track" | "needs_classification" | "possible_gap";
};

type ReadinessSnapshot = {
  agAudit: {
    status: "on_track" | "needs_classification" | "possible_gap";
    categories: AgAuditCategory[];
    possibleCourseCount: number;
    unresolvedCourseCount: number;
  };
  gpaEstimate: {
    estimatedGpa: number | null;
    includedCourseCount: number;
    honorsPoints: number;
    ruleId: string;
  };
  findings: Array<{
    id: string;
    severity: string;
    title: string;
    detail: string;
  }>;
  nextActions: RoadmapAction[];
  disclaimer: string;
};

type CounselorQuestion = {
  id: string;
  topic: string;
  question: string;
  reason: string;
};

type PlannedAction = RoadmapAction & {
  periodTitle: string;
  selected: boolean;
};

type MilestonePreview = {
  id: string;
  timing: string;
  status: string;
  action: string;
  officialDate: string | null;
};

const stages = [
  { id: "baseline", label: "Baseline" },
  { id: "ag", label: "A-G" },
  { id: "gpa", label: "GPA" },
  { id: "snapshot", label: "Snapshot" },
] as const;

const stageIndex = Object.fromEntries(
  stages.map((stage, index) => [stage.id, index]),
);

function optionClass(selected: boolean) {
  return selected ? "prepare-option is-selected" : "prepare-option";
}

function formatYears(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} year${value === 1 ? "" : "s"}`;
}

function NumberStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="prepare-stepper">
      <span>{label}</span>
      <input
        min="0"
        max="8"
        onChange={(event) => onChange(Number(event.target.value))}
        step="0.5"
        type="number"
        value={value}
      />
    </label>
  );
}

export function PrepareWorkspace({
  agRules,
  applicationMilestones,
  gpaRules,
  roadmapPeriods,
  roadmapTemplates,
}: {
  agRules: AgRules;
  applicationMilestones: ApplicationMilestones;
  gpaRules: GpaRules;
  roadmapPeriods: RoadmapPeriod[];
  roadmapTemplates: RoadmapAction[];
}) {
  const [progress, setProgress] = useState<PrepareProgress>(() =>
    createPrepareProgress() as PrepareProgress,
  );
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(readPrepareProgress(window.localStorage) as PrepareProgress);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(next: PrepareProgress) {
    if (!ready) {
      setProgress(next);
      return;
    }
    setProgress(
      writePrepareProgress(window.localStorage, next) as PrepareProgress,
    );
  }

  function updateBaseline(
    updater: (baseline: PrepareProgress["baseline"]) => PrepareProgress["baseline"],
  ) {
    save({
      ...progress,
      baseline: updater(progress.baseline),
    });
  }

  function setStage(stage: PrepareProgress["stage"]) {
    save({ ...progress, stage });
  }

  function nextStage() {
    const next = stages[Math.min(stages.length - 1, stageIndex[progress.stage] + 1)];
    setStage(next.id);
  }

  function previousStage() {
    const previous =
      stages[Math.max(0, stageIndex[progress.stage] - 1)];
    setStage(previous.id);
  }

  const courses = useMemo(
    () => buildCoursesFromAgProgress(progress.baseline.agProgress),
    [progress.baseline.agProgress],
  );
  const snapshot = useMemo<ReadinessSnapshot>(
    () =>
      buildReadinessSnapshot({
        baseline: progress.baseline,
        courses,
        agRules,
        gpaRules,
        roadmapTemplates,
      }) as ReadinessSnapshot,
    [agRules, courses, gpaRules, progress.baseline, roadmapTemplates],
  );
  const counselorQuestions = useMemo<CounselorQuestion[]>(
    () =>
      buildCounselorQuestions(
        snapshot,
        progress.baseline,
      ) as CounselorQuestion[],
    [progress.baseline, snapshot],
  );
  const firstActionPlan = useMemo<PlannedAction[]>(
    () =>
      buildFirstActionPlan(snapshot, roadmapPeriods) as PlannedAction[],
    [roadmapPeriods, snapshot],
  );
  const milestonePreview = useMemo<MilestonePreview[]>(
    () =>
      buildApplicationMilestonePreview(
        applicationMilestones,
      ) as MilestonePreview[],
    [applicationMilestones],
  );
  const currentStageIndex = stageIndex[progress.stage];

  function updateAgValue(
    categoryId: string,
    field: "completed" | "current" | "planned" | "unresolved",
    value: number,
  ) {
    updateBaseline((baseline) => ({
      ...baseline,
      agProgress: {
        ...baseline.agProgress,
        [categoryId]: {
          ...baseline.agProgress[categoryId],
          [field]: value,
        },
      },
    }));
  }

  function updateGrade(grade: "A" | "B" | "C" | "D" | "F", value: number) {
    updateBaseline((baseline) => ({
      ...baseline,
      gpaSummary: {
        ...baseline.gpaSummary,
        grades: {
          ...baseline.gpaSummary.grades,
          [grade]: value,
        },
      },
    }));
  }

  function updateHonors(gradeLevel: 10 | 11, value: number) {
    updateBaseline((baseline) => ({
      ...baseline,
      gpaSummary: {
        ...baseline.gpaSummary,
        honors: {
          ...baseline.gpaSummary.honors,
          [gradeLevel]: value,
        },
      },
    }));
  }

  function resetProgress() {
    const next = createPrepareProgress() as PrepareProgress;
    save(next);
    setMessage("Prepare snapshot reset to the starting sample.");
  }

  return (
    <section className="prepare-workspace shell content-section">
      <div className="prepare-panel">
        <div className="prepare-progress-row">
          <button
            className="text-button"
            disabled={currentStageIndex === 0}
            onClick={previousStage}
            type="button"
          >
            Back
          </button>
          <span>
            Step {currentStageIndex + 1} of {stages.length}
          </span>
          <button className="text-button" onClick={resetProgress} type="button">
            Reset sample
          </button>
        </div>
        <div
          aria-hidden="true"
          className="journey-progress prepare-progress"
        >
          <span style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }} />
        </div>

        <div className="prepare-tabs" role="tablist" aria-label="Prepare steps">
          {stages.map((stage) => (
            <button
              aria-selected={progress.stage === stage.id}
              key={stage.id}
              onClick={() => setStage(stage.id)}
              role="tab"
              type="button"
            >
              {stage.label}
            </button>
          ))}
        </div>

        {progress.stage === "baseline" && (
          <div className="prepare-step">
            <p className="eyebrow">Academic baseline</p>
            <h2>Start with a rough picture, not a perfect transcript.</h2>
            <p className="journey-intro">
              This first pass keeps unknowns visible. It is designed to produce
              counselor questions and a few next actions.
            </p>

            <div className="prepare-question">
              <h3>Which GPA rule should this first estimate use?</h3>
              <div className="prepare-option-grid">
                <button
                  aria-pressed={progress.baseline.residency === "california"}
                  className={optionClass(progress.baseline.residency === "california")}
                  onClick={() =>
                    updateBaseline((baseline) => ({
                      ...baseline,
                      residency: "california",
                    }))
                  }
                  type="button"
                >
                  California resident
                </button>
                <button
                  aria-pressed={progress.baseline.residency === "nonresident"}
                  className={optionClass(progress.baseline.residency === "nonresident")}
                  onClick={() =>
                    updateBaseline((baseline) => ({
                      ...baseline,
                      residency: "nonresident",
                    }))
                  }
                  type="button"
                >
                  Nonresident
                </button>
              </div>
            </div>

            <div className="prepare-question">
              <h3>How does the current load feel?</h3>
              <div className="prepare-option-grid">
                {[
                  ["steady", "Sustainable"],
                  ["stretch", "A stretch, but manageable"],
                  ["too-much", "Too much right now"],
                  ["not-sure", "Not sure yet"],
                ].map(([id, label]) => (
                  <button
                    aria-pressed={progress.baseline.sustainableLoad === id}
                    className={optionClass(progress.baseline.sustainableLoad === id)}
                    key={id}
                    onClick={() =>
                      updateBaseline((baseline) => ({
                        ...baseline,
                        sustainableLoad: id,
                      }))
                    }
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="prepare-question">
              <h3>What senior-year math plan should we mark for review?</h3>
              <div className="prepare-option-grid">
                {[
                  ["calculus", "Calculus"],
                  ["statistics", "Statistics"],
                  ["precalculus", "Precalculus or equivalent"],
                  ["not-sure", "Not sure yet"],
                ].map(([id, label]) => (
                  <button
                    aria-pressed={progress.baseline.seniorMathPlan === id}
                    className={optionClass(progress.baseline.seniorMathPlan === id)}
                    key={id}
                    onClick={() =>
                      updateBaseline((baseline) => ({
                        ...baseline,
                        seniorMathPlan: id,
                      }))
                    }
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="journey-actions">
              <button className="button button-primary" onClick={nextStage} type="button">
                Continue to A-G
              </button>
            </div>
          </div>
        )}

        {progress.stage === "ag" && (
          <div className="prepare-step">
            <p className="eyebrow">A-G review</p>
            <h2>Mark completed, current, planned, and unresolved years.</h2>
            <p className="journey-intro">
              Unresolved means “verify,” not “missing.” Use half-years for
              semester courses when that is easier.
            </p>
            <div className="prepare-ag-table">
              {agRules.categories.map((category) => {
                const values = progress.baseline.agProgress[category.id];
                const audit = snapshot.agAudit.categories.find(
                  (item) => item.id === category.id,
                );
                return (
                  <article key={category.id}>
                    <div>
                      <span className="prepare-ag-letter">
                        {category.id.toUpperCase()}
                      </span>
                      <h3>{category.name}</h3>
                      <p>
                        Required: {formatYears(category.yearsRequired)}
                        {category.yearsRecommended
                          ? ` · Recommended: ${formatYears(category.yearsRecommended)}`
                          : ""}
                      </p>
                    </div>
                    <div className="prepare-stepper-row">
                      <NumberStepper
                        label="Done"
                        onChange={(value) =>
                          updateAgValue(category.id, "completed", value)
                        }
                        value={values.completed}
                      />
                      <NumberStepper
                        label="Now"
                        onChange={(value) =>
                          updateAgValue(category.id, "current", value)
                        }
                        value={values.current}
                      />
                      <NumberStepper
                        label="Planned"
                        onChange={(value) =>
                          updateAgValue(category.id, "planned", value)
                        }
                        value={values.planned}
                      />
                      <NumberStepper
                        label="Verify"
                        onChange={(value) =>
                          updateAgValue(category.id, "unresolved", value)
                        }
                        value={values.unresolved}
                      />
                    </div>
                    <p className={`prepare-status status-${audit?.status}`}>
                      {audit?.status === "on_track"
                        ? "Looks covered in this first pass"
                        : audit?.status === "needs_classification"
                          ? "Needs counselor classification"
                          : "Possible gap to plan around"}
                    </p>
                  </article>
                );
              })}
            </div>
            <div className="journey-actions">
              <button className="button button-primary" onClick={nextStage} type="button">
                Continue to GPA
              </button>
            </div>
          </div>
        )}

        {progress.stage === "gpa" && (
          <div className="prepare-step">
            <p className="eyebrow">UC GPA estimate</p>
            <h2>Use rough counts to understand the assumptions.</h2>
            <p className="journey-intro">
              Count completed A-G courses from the UC included window. This is
              not rounded and not used to rank campuses.
            </p>
            <div className="prepare-gpa-grid">
              <article>
                <h3>Grades in included A-G courses</h3>
                <div className="prepare-stepper-row">
                  {(["A", "B", "C", "D", "F"] as const).map((grade) => (
                    <NumberStepper
                      key={grade}
                      label={grade}
                      onChange={(value) => updateGrade(grade, value)}
                      value={progress.baseline.gpaSummary.grades[grade]}
                    />
                  ))}
                </div>
              </article>
              <article>
                <h3>Honors/AP/IB eligible counts</h3>
                <div className="prepare-stepper-row">
                  <NumberStepper
                    label="10th"
                    onChange={(value) => updateHonors(10, value)}
                    value={progress.baseline.gpaSummary.honors[10]}
                  />
                  <NumberStepper
                    label="11th"
                    onChange={(value) => updateHonors(11, value)}
                    value={progress.baseline.gpaSummary.honors[11]}
                  />
                </div>
                <p className="source-note">
                  Honors points are capped by the UC rule version shown below.
                </p>
              </article>
              <article className="prepare-gpa-result">
                <span className="card-label">Estimate</span>
                <strong>
                  {snapshot.gpaEstimate.estimatedGpa === null
                    ? "Need grades"
                    : snapshot.gpaEstimate.estimatedGpa.toFixed(2)}
                </strong>
                <p>
                  {snapshot.gpaEstimate.includedCourseCount} included courses ·{" "}
                  {snapshot.gpaEstimate.honorsPoints} capped honors points
                </p>
              </article>
            </div>
            <div className="journey-actions">
              <button className="button button-primary" onClick={nextStage} type="button">
                Build snapshot
              </button>
            </div>
          </div>
        )}

        {progress.stage === "snapshot" && (
          <div className="prepare-step">
            <p className="eyebrow">UC Readiness Snapshot</p>
            <h2>A partial snapshot with a short action list.</h2>
            <p className="journey-intro">{snapshot.disclaimer}</p>
            <div className="snapshot-grid">
              <article className="snapshot-summary">
                <span className="card-label">A-G status</span>
                <h3>
                  {snapshot.agAudit.status === "on_track"
                    ? "Looks covered in this first pass"
                    : snapshot.agAudit.status === "needs_classification"
                      ? "Mostly a verification question"
                      : "Some planning questions remain"}
                </h3>
                <p>
                  {formatYears(snapshot.agAudit.possibleCourseCount)} possible
                  A-G coursework · {formatYears(snapshot.agAudit.unresolvedCourseCount)}{" "}
                  unresolved
                </p>
              </article>
              <article className="snapshot-summary">
                <span className="card-label">UC GPA estimate</span>
                <h3>
                  {snapshot.gpaEstimate.estimatedGpa === null
                    ? "Not enough grade information"
                    : snapshot.gpaEstimate.estimatedGpa.toFixed(2)}
                </h3>
                <p>
                  Rule: {snapshot.gpaEstimate.ruleId}. Minimum shown only for
                  eligibility context.
                </p>
              </article>
            </div>

            <div className="finding-list">
              {snapshot.findings.map((finding) => (
                <article key={finding.id}>
                  <span>{finding.severity}</span>
                  <div>
                    <h3>{finding.title}</h3>
                    <p>{finding.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="next-action-list">
              <p className="eyebrow">Next actions</p>
              <h3>Keep it to three.</h3>
              {firstActionPlan.map((action) => (
                <article key={action.id}>
                  <div>
                    <span>{action.category}</span>
                    <h4>{action.title}</h4>
                    <p>{action.rationale}</p>
                    <small>{action.periodTitle}</small>
                  </div>
                  {action.verificationNeeded && <strong>Verify</strong>}
                </article>
              ))}
            </div>

            <div className="prepare-planning-grid">
              <section className="counselor-question-list">
                <p className="eyebrow">Counselor questions</p>
                <h3>Bring questions, not conclusions.</h3>
                {counselorQuestions.map((item) => (
                  <article key={item.id}>
                    <span>{item.topic}</span>
                    <h4>{item.question}</h4>
                    <p>{item.reason}</p>
                  </article>
                ))}
              </section>

              <section className="milestone-preview">
                <p className="eyebrow">Future milestones</p>
                <h3>
                  {applicationMilestones.meta.expectedApplicationPeriod} for{" "}
                  {applicationMilestones.meta.targetEnrollmentTerm}
                </h3>
                <div>
                  {milestonePreview.map((item) => (
                    <article key={item.id}>
                      <span>{item.timing}</span>
                      <p>{item.action}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        <footer className="prepare-storage-row">
          <p>
            Saved only in this browser. Content verified {agRules.meta.lastVerified}.
          </p>
          {message && <p aria-live="polite">{message}</p>}
        </footer>
      </div>
    </section>
  );
}
