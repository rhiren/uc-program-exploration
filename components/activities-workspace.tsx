"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createActivityProgress,
  readActivityProgress,
  writeActivityProgress,
} from "@/lib/activities/progress-store.mjs";
import {
  buildActivityNextSteps,
  buildActivitySummary,
  buildPiqStorySeeds,
} from "@/lib/activities/summary.mjs";

type ActivityCategory =
  | "award"
  | "educational_preparation"
  | "extracurricular"
  | "other_coursework"
  | "volunteering"
  | "work";

type ActivitySignal =
  | "leadership"
  | "service"
  | "creative"
  | "research"
  | "career_exposure"
  | "family_responsibility"
  | "academic_interest";

type ActivityEntry = {
  id: string;
  title: string;
  category: ActivityCategory;
  organization: string;
  role: string;
  gradeLevels: number[];
  hoursPerWeek: number;
  weeksPerYear: number;
  impact: string;
  reflection: string;
  signals: ActivitySignal[];
};

type ActivityProgress = {
  version: number;
  updatedAt: string;
  entries: ActivityEntry[];
};

const categoryOptions: Array<{ id: ActivityCategory; label: string }> = [
  { id: "award", label: "Award or honor" },
  { id: "educational_preparation", label: "Educational prep program" },
  { id: "extracurricular", label: "Extracurricular activity" },
  { id: "other_coursework", label: "Other coursework" },
  { id: "volunteering", label: "Volunteering/community service" },
  { id: "work", label: "Work experience" },
];

const signalOptions: Array<{ id: ActivitySignal; label: string }> = [
  { id: "leadership", label: "Leadership" },
  { id: "service", label: "Service" },
  { id: "creative", label: "Creative" },
  { id: "research", label: "Research/project" },
  { id: "career_exposure", label: "Career exposure" },
  { id: "family_responsibility", label: "Family responsibility" },
  { id: "academic_interest", label: "Academic interest" },
];

const emptyDraft: Omit<ActivityEntry, "id"> = {
  title: "",
  category: "extracurricular",
  organization: "",
  role: "",
  gradeLevels: [11],
  hoursPerWeek: 1,
  weeksPerYear: 10,
  impact: "",
  reflection: "",
  signals: [],
};

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ActivitiesWorkspace() {
  const [progress, setProgress] = useState<ActivityProgress>(
    createActivityProgress() as ActivityProgress,
  );
  const [draft, setDraft] = useState<Omit<ActivityEntry, "id">>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(readActivityProgress(window.localStorage) as ActivityProgress);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(next: ActivityProgress) {
    if (!ready) {
      setProgress(next);
      return;
    }
    setProgress(
      writeActivityProgress(window.localStorage, next) as ActivityProgress,
    );
  }

  function addEntry() {
    const title = draft.title.trim();
    if (!title) {
      setMessage("Add a title first.");
      return;
    }
    if (progress.entries.length >= 20) {
      setMessage("UC allows up to 20 Activities & Awards entries.");
      return;
    }

    save({
      ...progress,
      entries: [
        ...progress.entries,
        {
          ...draft,
          id: `activity-${Date.now()}`,
          title,
          organization: draft.organization.trim(),
          role: draft.role.trim(),
          impact: draft.impact.trim(),
          reflection: draft.reflection.trim(),
        },
      ],
    });
    setDraft({ ...emptyDraft, category: draft.category });
    setMessage("Activity added. Add impact and reflection while details are fresh.");
  }

  function removeEntry(id: string) {
    save({
      ...progress,
      entries: progress.entries.filter((entry) => entry.id !== id),
    });
  }

  function reset() {
    save(createActivityProgress() as ActivityProgress);
    setMessage("Activities inventory reset.");
  }

  const summary = useMemo(
    () => buildActivitySummary(progress.entries),
    [progress.entries],
  );
  const storySeeds = useMemo(
    () => buildPiqStorySeeds(progress.entries),
    [progress.entries],
  );
  const nextSteps = useMemo(
    () => buildActivityNextSteps(progress.entries),
    [progress.entries],
  );

  return (
    <section className="activities-workspace shell content-section">
      <div className="activities-panel">
        <div className="activities-heading">
          <div>
            <p className="eyebrow">Activities & experiences</p>
            <h2>Capture what she actually did, not just what sounds impressive.</h2>
            <p>
              UC says this section is about quality, not quantity. Use this
              inventory to preserve specifics, notice depth, and find possible
              story material for Personal Insight Questions.
            </p>
          </div>
          <div className="activity-cap-card">
            <strong>{summary.totalEntries}</strong>
            <span>of 20 entries</span>
            <small>{summary.remainingSlots} open slots</small>
          </div>
        </div>

        <section className="activity-entry-form" aria-label="Add an activity">
          <label className="activity-title-field">
            <span>Activity, award, job, project, or responsibility</span>
            <input
              onChange={(event) =>
                setDraft((value) => ({ ...value, title: event.target.value }))
              }
              placeholder="Math tutoring, family translation, Science Olympiad..."
              value={draft.title}
            />
          </label>
          <label>
            <span>UC category</span>
            <select
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  category: event.target.value as ActivityCategory,
                }))
              }
              value={draft.category}
            >
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Organization</span>
            <input
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  organization: event.target.value,
                }))
              }
              placeholder="School, home, library..."
              value={draft.organization}
            />
          </label>
          <label>
            <span>Role</span>
            <input
              onChange={(event) =>
                setDraft((value) => ({ ...value, role: event.target.value }))
              }
              placeholder="Member, tutor, founder..."
              value={draft.role}
            />
          </label>
          <label>
            <span>Hours/week</span>
            <input
              min="0"
              max="80"
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  hoursPerWeek: Number(event.target.value),
                }))
              }
              type="number"
              value={draft.hoursPerWeek}
            />
          </label>
          <label>
            <span>Weeks/year</span>
            <input
              min="0"
              max="52"
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  weeksPerYear: Number(event.target.value),
                }))
              }
              type="number"
              value={draft.weeksPerYear}
            />
          </label>

          <fieldset>
            <legend>Grade levels</legend>
            <div className="activity-toggle-row">
              {[9, 10, 11, 12].map((grade) => (
                <button
                  aria-pressed={draft.gradeLevels.includes(grade)}
                  key={grade}
                  onClick={() =>
                    setDraft((value) => ({
                      ...value,
                      gradeLevels: toggleValue(value.gradeLevels, grade).sort(),
                    }))
                  }
                  type="button"
                >
                  {grade}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="activity-signals-field">
            <legend>Signals this may show</legend>
            <div className="activity-toggle-row">
              {signalOptions.map((signal) => (
                <button
                  aria-pressed={draft.signals.includes(signal.id)}
                  key={signal.id}
                  onClick={() =>
                    setDraft((value) => ({
                      ...value,
                      signals: toggleValue(value.signals, signal.id),
                    }))
                  }
                  type="button"
                >
                  {signal.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="activity-long-field">
            <span>What did she do or change?</span>
            <textarea
              onChange={(event) =>
                setDraft((value) => ({ ...value, impact: event.target.value }))
              }
              placeholder="Include concrete details: people helped, products made, responsibilities, outcomes, scale..."
              value={draft.impact}
            />
          </label>
          <label className="activity-long-field">
            <span>What did she learn or notice?</span>
            <textarea
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  reflection: event.target.value,
                }))
              }
              placeholder="One honest sentence is enough for now."
              value={draft.reflection}
            />
          </label>

          <div className="activity-form-actions">
            <button className="button button-primary" onClick={addEntry} type="button">
              Add activity
            </button>
            <button className="text-button" onClick={reset} type="button">
              Reset activities
            </button>
          </div>
        </section>

        {message && <p className="source-note">{message}</p>}

        <section className="activity-list" aria-label="Saved activities">
          {progress.entries.length ? (
            progress.entries.map((entry) => (
              <article key={entry.id}>
                <div>
                  <p className="card-label">
                    {categoryOptions.find((option) => option.id === entry.category)
                      ?.label ?? entry.category}
                  </p>
                  <h3>{entry.title}</h3>
                  <p>
                    {[entry.organization, entry.role].filter(Boolean).join(" · ") ||
                      "Add organization or role when known"}
                  </p>
                </div>
                <div className="activity-chip-row">
                  {entry.gradeLevels.map((grade) => (
                    <span key={grade}>Grade {grade}</span>
                  ))}
                  <span>
                    {entry.hoursPerWeek} hr/wk · {entry.weeksPerYear} wk/yr
                  </span>
                </div>
                <button
                  className="text-button"
                  onClick={() => removeEntry(entry.id)}
                  type="button"
                >
                  Remove
                </button>
              </article>
            ))
          ) : (
            <div className="course-empty-state">
              <h3>No activities entered yet.</h3>
              <p>
                Start broad. Family responsibilities, paid work, informal
                projects, and steady commitments all belong in the first pass.
              </p>
            </div>
          )}
        </section>

        <section className="activity-report-grid" aria-label="Activities summary">
          <article>
            <span>{summary.entriesWithImpactCount}</span>
            <p>with impact detail</p>
          </article>
          <article>
            <span>{summary.entriesWithReflectionCount}</span>
            <p>with reflection</p>
          </article>
          <article>
            <span>{summary.sustainedCount}</span>
            <p>sustained across grades</p>
          </article>
          <article>
            <span>{summary.highHourCount}</span>
            <p>high-time commitments</p>
          </article>
        </section>

        <section className="activity-insight-grid">
          <article>
            <p className="eyebrow">Pattern notes</p>
            <h3>What to improve before application season</h3>
            <ul>
              {summary.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
          <article>
            <p className="eyebrow">Story seeds</p>
            <h3>Possible PIQ material</h3>
            {storySeeds.length ? (
              <div className="story-seed-list">
                {storySeeds.map((seed) => (
                  <div key={seed.id}>
                    <strong>{seed.title}</strong>
                    <p>
                      {seed.category} · {seed.reasons.join(", ")}
                    </p>
                    <small>{seed.prompt}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                Add impact, reflection, or signal tags to surface possible PIQ
                examples.
              </p>
            )}
          </article>
        </section>

        <section className="activity-next-steps">
          <div>
            <p className="eyebrow">Next steps</p>
            <h2>Make the activities list more useful, not just longer.</h2>
          </div>
          <div>
            {nextSteps.map((step) => (
              <article key={step.id}>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
            <Link className="button button-secondary" href="/fit">
              Connect to Path Fit
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
