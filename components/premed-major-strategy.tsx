"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildPremedMajorShortlist,
  buildPremedMajorStrategy,
} from "@/lib/premed/major-strategy.mjs";
import {
  createPrepareProgress,
  readPrepareProgress,
} from "@/lib/prepare/progress-store.mjs";

type PrepareProgress = ReturnType<typeof createPrepareProgress>;

type CampusFilter = {
  id: string;
  name: string;
};

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

const workloadOptions = [
  { id: "steady", label: "Steady" },
  { id: "stretch", label: "Stretch" },
  { id: "too-much", label: "Too much now" },
  { id: "not-sure", label: "Not sure" },
];

function buttonClass(selected: boolean) {
  return selected ? "premed-choice is-selected" : "premed-choice";
}

export function PremedMajorStrategy({
  campuses,
  majors,
}: {
  campuses: CampusFilter[];
  majors: CatalogMajor[];
}) {
  const [prepare, setPrepare] = useState<PrepareProgress>(
    createPrepareProgress(),
  );
  const [ready, setReady] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState("data-health");
  const [workloadPreference, setWorkloadPreference] = useState("not-sure");
  const [selectedInterestIds, setSelectedInterestIds] = useState([
    "biology-lab",
    "data-computing",
    "people-behavior",
  ]);
  const [fallbackPriorityId, setFallbackPriorityId] = useState("tech-data");
  const [campusIds, setCampusIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readPrepareProgress(window.localStorage) as PrepareProgress;
      setPrepare(saved);
      setWorkloadPreference(saved.baseline.sustainableLoad);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const strategy = useMemo(
    () =>
      buildPremedMajorStrategy({
        courseEntries: prepare.baseline.courseEntries,
        selectedTrackId,
        workloadPreference,
      }),
    [prepare.baseline.courseEntries, selectedTrackId, workloadPreference],
  );
  const shortlist = useMemo(
    () =>
      buildPremedMajorShortlist({
        majors,
        selectedInterestIds,
        fallbackPriorityId,
        campusIds,
        limit: 9,
      }),
    [campusIds, fallbackPriorityId, majors, selectedInterestIds],
  );

  function toggleInterest(id: string) {
    setSelectedInterestIds((values) => {
      if (values.includes(id)) {
        const next = values.filter((value) => value !== id);
        return next.length ? next : values;
      }
      return [...values, id].slice(-3);
    });
  }

  function toggleCampus(id: string) {
    setCampusIds((values) => {
      if (values.includes(id)) return values.filter((value) => value !== id);
      return [...values, id].slice(-4);
    });
  }

  return (
    <section className="premed-strategy shell content-section">
      <div className="premed-strategy-panel">
        <div className="premed-strategy-heading">
          <div>
            <p className="eyebrow">Pre-med major strategy</p>
            <h2>Pick the major for durable value. Layer pre-med on top.</h2>
            <p>
              {strategy.parentExplanation} This helps the conversation stay
              practical instead of turning “pre-med” into one narrow major.
            </p>
          </div>
          <div className="premed-summary-card">
            <strong>{strategy.courseSignals.totalCourses}</strong>
            <span>saved courses</span>
            {!ready && <small>Loading Prepare progress...</small>}
          </div>
        </div>

        <div className="premed-workspace-grid">
          <section aria-labelledby="premed-track-heading">
            <p className="eyebrow">Major family</p>
            <h3 id="premed-track-heading">Which undergraduate bet feels real?</h3>
            <div className="premed-choice-list">
              {strategy.tracks.map((track) => (
                <button
                  aria-pressed={selectedTrackId === track.id}
                  className={buttonClass(selectedTrackId === track.id)}
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  type="button"
                >
                  <span>{track.name}</span>
                  <small>{track.premedFit}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="premed-track-card" aria-live="polite">
            <p className="card-label">{strategy.selectedTrack.examples}</p>
            <h3>{strategy.selectedTrack.name}</h3>
            <p>{strategy.selectedTrack.bestFor}</p>
            <div className="premed-value-band">
              <strong>Fallback value</strong>
              <span>{strategy.selectedTrack.durableValue}</span>
            </div>
          </section>
        </div>

        <div className="premed-detail-grid">
          <section>
            <p className="eyebrow">Watchouts</p>
            <ul>
              {strategy.selectedTrack.watchouts.map((watchout) => (
                <li key={watchout}>{watchout}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">Course priorities</p>
            <ul>
              {strategy.selectedTrack.coursePriorities.map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="premed-course-signal" aria-labelledby="premed-course-heading">
          <div className="premed-section-heading">
            <div>
              <p className="eyebrow">Academic baseline connection</p>
              <h3 id="premed-course-heading">What her saved courses already signal</h3>
            </div>
            <Link className="text-button" href="/prepare">
              Edit courses
            </Link>
          </div>
          <div className="premed-signal-grid">
            {strategy.courseSignals.areas.map((area) => (
              <article
                className={area.status === "seen" ? "is-seen" : ""}
                key={area.id}
              >
                <span>{area.count}</span>
                <p>{area.label}</p>
              </article>
            ))}
          </div>
          <div className="premed-signal-notes">
            <article>
              <strong>{strategy.courseSignals.advancedScienceCount}</strong>
              <span>advanced science courses entered</span>
            </article>
            <article>
              <strong>{strategy.courseSignals.outsideCourseCount}</strong>
              <span>outside or college courses entered</span>
            </article>
            <article>
              <strong>{strategy.courseSignals.needsVerificationCount}</strong>
              <span>courses needing verification</span>
            </article>
          </div>
          <ul className="premed-note-list">
            {strategy.courseSignals.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <div className="premed-detail-grid">
          <section>
            <p className="eyebrow">Load reality</p>
            <h3>How aggressive should the plan be?</h3>
            <div className="premed-pill-row">
              {workloadOptions.map((option) => (
                <button
                  aria-pressed={workloadPreference === option.id}
                  key={option.id}
                  onClick={() => setWorkloadPreference(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p>{strategy.workloadNote}</p>
          </section>
          <section>
            <p className="eyebrow">Advisor questions</p>
            <ol>
              {strategy.selectedTrack.advisorQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>
        </div>

        <section className="premed-next-card">
          <div>
            <p className="eyebrow">Family review checklist</p>
            <h3>Use this to explain the decision simply.</h3>
          </div>
          <ol>
            {strategy.nextChecks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ol>
        </section>

        <section className="premed-major-finder" aria-labelledby="premed-major-finder-heading">
          <div className="premed-section-heading">
            <div>
              <p className="eyebrow">Concrete UC major finder</p>
              <h3 id="premed-major-finder-heading">
                Build a shortlist where pre-med stays possible and the career path stays useful.
              </h3>
              <p>{shortlist.summary}</p>
            </div>
            <Link className="text-button" href="/majors">
              Search all majors
            </Link>
          </div>

          <div className="premed-finder-controls">
            <section>
              <p className="card-label">Interests to test</p>
              <div className="filter-chips">
                {shortlist.interests.map((interest) => (
                  <button
                    aria-pressed={selectedInterestIds.includes(interest.id)}
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    type="button"
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <p className="card-label">Fallback career priority</p>
              <div className="filter-chips">
                {shortlist.fallbackProfiles.map((profile) => (
                  <button
                    aria-pressed={fallbackPriorityId === profile.id}
                    key={profile.id}
                    onClick={() => setFallbackPriorityId(profile.id)}
                    type="button"
                  >
                    {profile.label}
                  </button>
                ))}
              </div>
              <p className="premed-control-note">{shortlist.fallbackProfile.note}</p>
            </section>

            <section>
              <p className="card-label">Campus focus</p>
              <div className="filter-chips compact-chips">
                <button
                  aria-pressed={campusIds.length === 0}
                  onClick={() => setCampusIds([])}
                  type="button"
                >
                  All UCs
                </button>
                {campuses.map((campus) => (
                  <button
                    aria-pressed={campusIds.includes(campus.id)}
                    key={campus.id}
                    onClick={() => toggleCampus(campus.id)}
                    type="button"
                  >
                    {campus.name}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="premed-shortlist-grid" aria-live="polite">
            {shortlist.results.map((major) => (
              <article key={major.id}>
                <div className="premed-major-card-heading">
                  <p className="card-label">{major.categoryName}</p>
                  <span>{major.campusCount} UC{major.campusCount === 1 ? "" : "s"}</span>
                </div>
                <h4>{major.name}</h4>
                <div className="premed-major-tags">
                  <span>{major.premedFitLabel}</span>
                  <span>{major.fallbackLabel}</span>
                </div>
                <p>{major.why}</p>
                <p className="premed-major-watchout">{major.watchout}</p>
                <div className="premed-major-campus-row">
                  {major.campuses.map((campus) => (
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
                <div className="premed-major-actions">
                  {major.deepGuideSlug ? (
                    <Link href={`/programs/${major.deepGuideSlug}`}>
                      Open deep guide →
                    </Link>
                  ) : (
                    <Link href={`/majors?q=${encodeURIComponent(major.name)}`}>
                      View in UC directory →
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="source-note">
          {strategy.disclaimer} Based on AAMC guidance that medical schools do
          not require one preferred undergraduate major and that prerequisites
          vary by school.
        </p>
      </div>
    </section>
  );
}
