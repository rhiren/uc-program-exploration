"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildDecisionLabReport,
  decisionExperiments,
  decisionScoreFields,
} from "@/lib/decision-lab/decision-lab.mjs";
import {
  createDecisionLabProgress,
  readDecisionLabProgress,
  writeDecisionLabProgress,
} from "@/lib/decision-lab/progress-store.mjs";
import { buildPremedMajorShortlist } from "@/lib/premed/major-strategy.mjs";

type DecisionProgress = ReturnType<typeof createDecisionLabProgress>;
type Finalist = DecisionProgress["finalists"][number];
type ScoreKey = keyof Finalist["scores"];

type CatalogMajor = {
  id: string;
  name: string;
  categoryName: string;
  familyIds: string[];
  emphases: string[];
  deepGuideSlug?: string;
  campuses: Array<{
    institutionId: string;
    name: string;
    officialCatalogUrl: string;
  }>;
};

const statusLabels = {
  keep: "Keep",
  maybe: "Maybe",
  drop: "Drop",
};

const starterMajorIds = [
  "data-science",
  "biology",
  "public-health",
  "bioengineering",
];

function makeFinalist(major: CatalogMajor): Finalist {
  return {
    id: `${major.id}-${Date.now()}`,
    majorId: major.id,
    majorName: major.name,
    status: "maybe",
    scores: {
      interest: 3,
      academicConfidence: 3,
      premedFit: 3,
      careerFallback: 3,
      workloadFit: 3,
      ucAvailability: Math.min(5, Math.max(2, major.campuses.length)),
    },
    evidence: {
      whyInterested: "",
      courseEvidence: "",
      careerFallback: "",
      concerns: "",
    },
  };
}

function scoreClass(score: number) {
  if (score >= 4.1) return "is-strong";
  if (score >= 3.4) return "is-testing";
  return "is-early";
}

export function DecisionLabWorkspace({ majors }: { majors: CatalogMajor[] }) {
  const [progress, setProgress] = useState<DecisionProgress>(
    createDecisionLabProgress(),
  );
  const [ready, setReady] = useState(false);
  const [selectedMajorId, setSelectedMajorId] = useState("");

  const majorMap = useMemo(
    () => new Map(majors.map((major) => [major.id, major])),
    [majors],
  );
  const shortlist = useMemo(
    () =>
      buildPremedMajorShortlist({
        majors,
        selectedInterestIds: ["biology-lab", "data-computing", "people-behavior"],
        fallbackPriorityId: "tech-data",
        limit: 12,
      }),
    [majors],
  );
  const suggestedMajors = useMemo(() => {
    const ids = new Set([
      ...starterMajorIds,
      ...shortlist.results.map((major) => major.id),
    ]);
    return Array.from(ids)
      .map((id) => majorMap.get(id))
      .filter(Boolean) as CatalogMajor[];
  }, [majorMap, shortlist.results]);
  const report = useMemo(
    () => buildDecisionLabReport(progress, majors),
    [majors, progress],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readDecisionLabProgress(window.localStorage) as DecisionProgress;
      if (saved.finalists.length > 0) {
        setProgress(saved);
      } else {
        const starters = starterMajorIds
          .map((id) => majorMap.get(id))
          .filter(Boolean)
          .slice(0, 4)
          .map((major) => makeFinalist(major as CatalogMajor));
        setProgress({ ...saved, finalists: starters });
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [majorMap]);

  useEffect(() => {
    if (ready) writeDecisionLabProgress(window.localStorage, progress);
  }, [progress, ready]);

  function updateFinalist(id: string, patch: Partial<Finalist>) {
    setProgress((current) => ({
      ...current,
      finalists: current.finalists.map((finalist) =>
        finalist.id === id ? { ...finalist, ...patch } : finalist,
      ),
    }));
  }

  function updateScore(id: string, key: ScoreKey, value: number) {
    setProgress((current) => ({
      ...current,
      finalists: current.finalists.map((finalist) =>
        finalist.id === id
          ? {
              ...finalist,
              scores: {
                ...finalist.scores,
                [key]: value,
              },
            }
          : finalist,
      ),
    }));
  }

  function updateEvidence(
    id: string,
    key: keyof Finalist["evidence"],
    value: string,
  ) {
    setProgress((current) => ({
      ...current,
      finalists: current.finalists.map((finalist) =>
        finalist.id === id
          ? {
              ...finalist,
              evidence: {
                ...finalist.evidence,
                [key]: value,
              },
            }
          : finalist,
      ),
    }));
  }

  function addMajor(majorId: string) {
    const major = majorMap.get(majorId);
    if (!major || progress.finalists.some((item) => item.majorId === majorId)) {
      return;
    }
    setProgress((current) => ({
      ...current,
      finalists: [...current.finalists, makeFinalist(major)],
    }));
    setSelectedMajorId("");
  }

  function removeFinalist(id: string) {
    setProgress((current) => ({
      ...current,
      finalists: current.finalists.filter((finalist) => finalist.id !== id),
    }));
  }

  function toggleExperiment(id: string) {
    setProgress((current) => {
      const existing = current.experiments.find((item) => item.id === id);
      const experiments = existing
        ? current.experiments.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item,
          )
        : [...current.experiments, { id, completed: true, note: "" }];
      return { ...current, experiments };
    });
  }

  function updateExperimentNote(id: string, note: string) {
    setProgress((current) => {
      const existing = current.experiments.find((item) => item.id === id);
      const experiments = existing
        ? current.experiments.map((item) =>
            item.id === id ? { ...item, note } : item,
          )
        : [...current.experiments, { id, completed: false, note }];
      return { ...current, experiments };
    });
  }

  function experimentProgress(id: string) {
    return progress.experiments.find((item) => item.id === id);
  }

  const availableMajors = suggestedMajors.filter(
    (major) => !progress.finalists.some((finalist) => finalist.majorId === major.id),
  );

  return (
    <section className="decision-lab shell content-section">
      <section className="decision-onboarding" aria-labelledby="decision-onboarding-heading">
        <div>
          <p className="eyebrow">How to use this with confidence</p>
          <h2 id="decision-onboarding-heading">
            Do not decide from a mood. Decide from evidence.
          </h2>
          <p>
            A score is useful only when she can point to something real: a class,
            assignment, conversation, reading, project, or four-year plan check.
            It is fine for a major to stay in “Maybe” while she gathers that
            evidence.
          </p>
        </div>
        <div className="decision-example-grid">
          <article>
            <p className="card-label">Good evidence</p>
            <strong>“I liked the genetics problem set and wanted to keep going.”</strong>
          </article>
          <article>
            <p className="card-label">Still too vague</p>
            <strong>“Medicine sounds stable and impressive.”</strong>
          </article>
          <article>
            <p className="card-label">Useful concern</p>
            <strong>“Organic chemistry plus this major may crowd 12th grade planning.”</strong>
          </article>
        </div>
      </section>

      <div className="decision-panel">
        <div className="decision-heading">
          <div>
            <p className="eyebrow">Six-month decision lab</p>
            <h2>Turn a possible medical path into a trusted major decision.</h2>
            <p>
              Keep the serious options visible, score them honestly, and let the
              next 30 days tell her what deserves more attention.
            </p>
          </div>
          <div className="decision-readiness-card">
            <strong>{report.readiness}</strong>
            <span>
              {report.completedExperiments} of {report.totalExperiments} evidence
              experiments complete
            </span>
            {!ready && <small>Loading saved lab...</small>}
          </div>
        </div>

        <section className="decision-summary-grid" aria-label="Decision summary">
          <article>
            <span>{report.finalists.length}</span>
            <p>major finalists</p>
          </article>
          <article>
            <span>{report.topFinalists.length}</span>
            <p>current top paths</p>
          </article>
          <article>
            <span>{report.gaps.length}</span>
            <p>open decision gaps</p>
          </article>
        </section>

        <section className="decision-target-card">
          <div>
            <p className="eyebrow">Decision target</p>
            <h3>What a good decision should mean.</h3>
          </div>
          <textarea
            aria-label="Decision target"
            onChange={(event) =>
              setProgress((current) => ({
                ...current,
                decisionTarget: event.target.value,
              }))
            }
            value={progress.decisionTarget}
          />
        </section>

        <div className="decision-section-heading">
          <div>
            <p className="eyebrow">Finalists</p>
            <h3>Compare majors with evidence, not pressure.</h3>
          </div>
          <div className="decision-add-major">
            <select
              aria-label="Add a suggested major"
              onChange={(event) => setSelectedMajorId(event.target.value)}
              value={selectedMajorId}
            >
              <option value="">Add a suggested UC major</option>
              {availableMajors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
            </select>
            <button
              className="button button-secondary"
              disabled={!selectedMajorId}
              onClick={() => addMajor(selectedMajorId)}
              type="button"
            >
              Add
            </button>
          </div>
        </div>

        <div className="decision-finalist-list">
          {report.finalists.map((finalist) => {
            const major = majorMap.get(finalist.majorId);
            return (
              <article key={finalist.id}>
                <div className="decision-finalist-header">
                  <div>
                    <p className="card-label">
                      {major?.categoryName ?? "Custom major"} ·{" "}
                      {finalist.campusCount} UC
                      {finalist.campusCount === 1 ? "" : "s"}
                    </p>
                    <h4>{finalist.majorName}</h4>
                  </div>
                  <div className={`decision-score ${scoreClass(finalist.score)}`}>
                    <strong>{finalist.scoreLabel}</strong>
                    <span>{finalist.recommendation}</span>
                  </div>
                </div>

                <div className="decision-status-row">
                  {(["keep", "maybe", "drop"] as const).map((status) => (
                    <button
                      aria-pressed={finalist.status === status}
                      key={status}
                      onClick={() => updateFinalist(finalist.id, { status })}
                      type="button"
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                  <button
                    className="text-button"
                    onClick={() => removeFinalist(finalist.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>

                <div className="decision-score-grid">
                  {decisionScoreFields.map((field) => (
                    <label key={field.id}>
                      <span>
                        {field.label}
                        <strong>{finalist.scores[field.id]}</strong>
                      </span>
                      <input
                        max="5"
                        min="1"
                        onChange={(event) =>
                          updateScore(
                            finalist.id,
                            field.id,
                            Number(event.target.value),
                          )
                        }
                        step="1"
                        type="range"
                        value={finalist.scores[field.id]}
                      />
                      <small>{field.prompt}</small>
                    </label>
                  ))}
                </div>

                <div className="decision-reality-grid">
                  <section>
                    <div className="decision-mini-heading">
                      <p className="card-label">Campus-specific fit</p>
                      <strong>{finalist.campusFit.label}</strong>
                    </div>
                    <p>{finalist.campusFit.risk}</p>
                    <div className="decision-campus-list">
                      {finalist.campusFit.campuses.slice(0, 6).map((campus) => (
                        <a
                          href={campus.officialCatalogUrl}
                          key={campus.institutionId}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {campus.name} ↗
                        </a>
                      ))}
                    </div>
                    <ul>
                      {(finalist.campusFit.campuses[0]?.checklist ?? [
                        "Find the campus catalog page for this major.",
                        "Confirm first-year availability and pre-health advising.",
                      ]).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <div className="decision-mini-heading">
                      <p className="card-label">Pre-med requirement map</p>
                      <strong>Likely covered vs. layered separately</strong>
                    </div>
                    <div className="decision-requirement-grid">
                      {finalist.premedRequirementMap.map((requirement) => (
                        <article
                          className={`coverage-${requirement.status}`}
                          key={requirement.id}
                          title={requirement.note}
                        >
                          <span>{requirement.label}</span>
                          <strong>{requirement.statusLabel}</strong>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="decision-evidence-grid">
                  <label>
                    Why interested?
                    <textarea
                      placeholder="Example: I liked the real coursework sample, not just the career title."
                      onChange={(event) =>
                        updateEvidence(
                          finalist.id,
                          "whyInterested",
                          event.target.value,
                        )
                      }
                      value={finalist.evidence.whyInterested}
                    />
                  </label>
                  <label>
                    Course/workload evidence
                    <textarea
                      placeholder="Example: AP Bio feels energizing; math is strong but long proofs drain me."
                      onChange={(event) =>
                        updateEvidence(
                          finalist.id,
                          "courseEvidence",
                          event.target.value,
                        )
                      }
                      value={finalist.evidence.courseEvidence}
                    />
                  </label>
                  <label>
                    Backup career value
                    <textarea
                      placeholder="Example: health data, biotech, public health, research, product, analytics."
                      onChange={(event) =>
                        updateEvidence(
                          finalist.id,
                          "careerFallback",
                          event.target.value,
                        )
                      }
                      value={finalist.evidence.careerFallback}
                    />
                  </label>
                  <label>
                    Concerns to verify
                    <textarea
                      placeholder="Example: Will this major leave room for chemistry, physics, writing, and activities?"
                      onChange={(event) =>
                        updateEvidence(finalist.id, "concerns", event.target.value)
                      }
                      value={finalist.evidence.concerns}
                    />
                  </label>
                </div>

                <div className="decision-finalist-actions">
                  {finalist.deepGuideSlug && (
                    <Link href={`/programs/${finalist.deepGuideSlug}`}>
                      Open deep guide →
                    </Link>
                  )}
                  <Link href={`/majors?q=${encodeURIComponent(finalist.majorName)}`}>
                    View in UC directory →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <section className="decision-top-paths">
          <div>
            <p className="eyebrow">Current readout</p>
            <h3>The top three are not the answer yet. They are the paths to test hardest.</h3>
          </div>
          <div className="decision-top-grid">
            {report.topFinalists.map((finalist, index) => (
              <article key={finalist.id}>
                <span>{index + 1}</span>
                <h4>{finalist.majorName}</h4>
                <p>
                  {finalist.scoreLabel} score · {finalist.evidenceItems} evidence
                  notes · {finalist.recommendation}
                </p>
              </article>
            ))}
          </div>
          {report.gaps.length > 0 && (
            <ul className="decision-gap-list">
              {report.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="decision-action-plan" aria-labelledby="decision-action-plan-heading">
          <div className="decision-section-heading">
            <div>
              <p className="eyebrow">Next 30 days</p>
              <h3 id="decision-action-plan-heading">Leave this page with three useful actions.</h3>
            </div>
            <Link className="text-button" href="/report">
              Open full report
            </Link>
          </div>
          <div className="decision-action-grid">
            {report.thirtyDayActions.map((action, index) => (
              <article key={`${action.id}-${index}`}>
                <span>{index + 1}</span>
                <h4>{action.title}</h4>
                <p>{action.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="decision-experiment-board">
          <div className="decision-section-heading">
            <div>
              <p className="eyebrow">Six-month evidence plan</p>
              <h3>Small tests that make the choice real.</h3>
            </div>
            <Link className="text-button" href="/premed">
              Back to pre-med strategy
            </Link>
          </div>
          <div className="decision-experiment-list">
            {decisionExperiments.map((experiment) => {
              const saved = experimentProgress(experiment.id);
              return (
                <article key={experiment.id}>
                  <label>
                    <input
                      checked={Boolean(saved?.completed)}
                      onChange={() => toggleExperiment(experiment.id)}
                      type="checkbox"
                    />
                    <span>{experiment.phase}</span>
                  </label>
                  <div>
                    <h4>{experiment.title}</h4>
                    <p>{experiment.detail}</p>
                    <textarea
                      aria-label={`${experiment.title} note`}
                      onChange={(event) =>
                        updateExperimentNote(experiment.id, event.target.value)
                      }
                      placeholder="What did she learn from this?"
                      value={saved?.note ?? ""}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
