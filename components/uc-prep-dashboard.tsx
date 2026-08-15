"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createActivityProgress,
  readActivityProgress,
} from "@/lib/activities/progress-store.mjs";
import { buildUcPrepReport } from "@/lib/report/uc-prep-report.mjs";
import {
  createPrepareProgress,
  readPrepareProgress,
} from "@/lib/prepare/progress-store.mjs";

type Family = { id: string; name: string };
type Campus = { id: string; name: string; shortName: string; admitRate?: number };
type Program = { id: string; name: string; slug: string; familyIds: string[] };
type ReportFinding = { id: string; title: string };
type ReportFocusCard = { id: string; title: string; attention: string };
type ReportStorySeed = { id: string; title: string; reasons: string[] };

type PrepareProgress = ReturnType<typeof createPrepareProgress>;
type ActivityProgress = ReturnType<typeof createActivityProgress>;

function toggleLimited(values: string[], id: string, limit: number) {
  if (values.includes(id)) return values.filter((item) => item !== id);
  return [...values, id].slice(-limit);
}

function formatGpa(value: number | null) {
  return typeof value === "number" ? value.toFixed(2) : "Needs grades";
}

export function UcPrepDashboard({
  agRules,
  campuses,
  families,
  gpaRules,
  programs,
  roadmapTemplates,
}: {
  agRules: unknown;
  campuses: Campus[];
  families: Family[];
  gpaRules: unknown;
  programs: Program[];
  roadmapTemplates: unknown[];
}) {
  const [prepare, setPrepare] = useState<PrepareProgress>(
    createPrepareProgress(),
  );
  const [activities, setActivities] = useState<ActivityProgress>(
    createActivityProgress(),
  );
  const [ready, setReady] = useState(false);
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<string[]>([
    "biology-life-sciences",
    "medicine-health-public-health",
  ]);
  const [selectedCampusIds, setSelectedCampusIds] = useState<string[]>([
    "uc-davis",
    "uc-irvine",
    "uc-san-diego",
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPrepare(readPrepareProgress(window.localStorage) as PrepareProgress);
      setActivities(readActivityProgress(window.localStorage) as ActivityProgress);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const report = useMemo(
    () =>
      buildUcPrepReport({
        prepareBaseline: prepare.baseline,
        activityEntries: activities.entries,
        selectedFamilyIds,
        selectedCampusIds,
        families,
        campuses,
        programs,
        agRules,
        gpaRules,
        roadmapTemplates,
      }),
    [
      activities.entries,
      agRules,
      campuses,
      families,
      gpaRules,
      prepare.baseline,
      programs,
      roadmapTemplates,
      selectedCampusIds,
      selectedFamilyIds,
    ],
  );
  const academicFindings = report.academic.findings as ReportFinding[];
  const focusCards = report.pathFit.focusCards as ReportFocusCard[];
  const storySeeds = report.activities.storySeeds as ReportStorySeed[];

  return (
    <section className="prep-dashboard shell content-section">
      <div className="prep-dashboard-panel">
        <div className="prep-dashboard-heading">
          <div>
            <p className="eyebrow">UC prep dashboard</p>
            <h2>One family review page for academics, fit, and activities.</h2>
            <p>{report.disclaimer}</p>
          </div>
          <div className="dashboard-readiness-card">
            <strong>{report.nextActions.length}</strong>
            <span>priority actions</span>
            {!ready && <small>Loading saved progress...</small>}
          </div>
        </div>

        <div className="dashboard-focus-grid">
          <section aria-label="Choose report interest focus">
            <p className="eyebrow">Interest focus</p>
            <div className="filter-chips">
              {families.map((family) => (
                <button
                  aria-pressed={selectedFamilyIds.includes(family.id)}
                  key={family.id}
                  onClick={() =>
                    setSelectedFamilyIds((values) =>
                      toggleLimited(values, family.id, 3),
                    )
                  }
                  type="button"
                >
                  {family.name}
                </button>
              ))}
            </div>
          </section>
          <section aria-label="Choose report campus focus">
            <p className="eyebrow">Campus focus</p>
            <div className="filter-chips compact-chips">
              {campuses.map((campus) => (
                <button
                  aria-pressed={selectedCampusIds.includes(campus.id)}
                  key={campus.id}
                  onClick={() =>
                    setSelectedCampusIds((values) =>
                      toggleLimited(values, campus.id, 4),
                    )
                  }
                  type="button"
                >
                  {campus.shortName}
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="dashboard-summary-grid" aria-label="UC prep summary">
          <article>
            <span>{report.academic.courseInventory.totalCourses as number}</span>
            <p>courses entered</p>
          </article>
          <article>
            <span>{formatGpa(report.academic.estimatedGpa)}</span>
            <p>first-pass UC GPA</p>
          </article>
          <article>
            <span>{report.activities.summary.totalEntries as number}</span>
            <p>activities entered</p>
          </article>
          <article>
            <span>{report.activities.storySeeds.length}</span>
            <p>PIQ story seeds</p>
          </article>
        </section>

        <section className="dashboard-action-band" aria-labelledby="dashboard-actions-heading">
          <div>
            <p className="eyebrow">Next 3 actions</p>
            <h2 id="dashboard-actions-heading">What to do next this month</h2>
          </div>
          <div className="dashboard-action-list">
            {report.nextActions.map((item) => (
              <article key={item.id}>
                <span>{item.source}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <Link href={item.href}>Open {item.source} →</Link>
              </article>
            ))}
          </div>
        </section>

        <div className="dashboard-section-grid">
          <section className="dashboard-review-card">
            <div className="dashboard-card-heading">
              <p className="eyebrow">Academic baseline</p>
              <Link className="text-button" href="/prepare">
                Edit courses
              </Link>
            </div>
            <h3>
              {report.academic.status === "on_track"
                ? "A-G pattern looks broadly on track"
                : report.academic.status === "needs_classification"
                  ? "Some courses need classification"
                  : "Possible A-G gap to review"}
            </h3>
            <p>
              {report.academic.possibleCourseCount} possible A-G coursework ·{" "}
              {report.academic.unresolvedCourseCount} unresolved.
            </p>
            <ul>
              {academicFindings.map((finding) => (
                <li key={finding.id}>{finding.title}</li>
              ))}
            </ul>
          </section>

          <section className="dashboard-review-card">
            <div className="dashboard-card-heading">
              <p className="eyebrow">Activities</p>
              <Link className="text-button" href="/activities">
                Edit activities
              </Link>
            </div>
            <h3>Depth and detail review</h3>
            <p>
              {report.activities.summary.entriesWithImpactCount as number} with
              impact detail · {report.activities.summary.sustainedCount as number}{" "}
              sustained across grades.
            </p>
            <ul>
              {(report.activities.notes.length
                ? report.activities.notes
                : ["Activity inventory has enough detail for a first review."]).map(
                (note) => (
                  <li key={note}>{note}</li>
                ),
              )}
            </ul>
          </section>

          <section className="dashboard-review-card">
            <div className="dashboard-card-heading">
              <p className="eyebrow">Path fit</p>
              <Link className="text-button" href="/fit">
                Open Path Fit
              </Link>
            </div>
            <h3>Interest and campus questions</h3>
            <div className="dashboard-mini-list">
              {focusCards.map((card) => (
                <article key={card.id}>
                  <strong>{card.title}</strong>
                  <p>{card.attention}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-review-card">
            <div className="dashboard-card-heading">
              <p className="eyebrow">PIQ seeds</p>
              <Link className="text-button" href="/activities">
                Add details
              </Link>
            </div>
            <h3>Possible story material</h3>
            <div className="dashboard-mini-list">
              {storySeeds.length ? (
                storySeeds.map((seed) => (
                  <article key={seed.id}>
                    <strong>{seed.title}</strong>
                    <p>{seed.reasons.join(", ")}</p>
                  </article>
                ))
              ) : (
                <article>
                  <strong>Add activities first</strong>
                  <p>Impact and reflection details will surface PIQ seeds here.</p>
                </article>
              )}
            </div>
          </section>
        </div>

        <section className="dashboard-counselor-card">
          <div>
            <p className="eyebrow">Counselor or family discussion</p>
            <h2>Questions worth bringing to the next conversation</h2>
          </div>
          <ol>
            {report.counselorQuestions.length ? (
              report.counselorQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))
            ) : (
              <li>
                Enter courses, activities, interests, and campuses to generate
                more specific discussion questions.
              </li>
            )}
          </ol>
        </section>
      </div>
    </section>
  );
}
