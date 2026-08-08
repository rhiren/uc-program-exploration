"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildPathFitSnapshot } from "@/lib/fit/path-fit.mjs";
import {
  createPrepareProgress,
  readPrepareProgress,
} from "@/lib/prepare/progress-store.mjs";

type Family = {
  id: string;
  name: string;
  summary: string;
};

type Campus = {
  id: string;
  name: string;
  shortName: string;
  admitRate?: number;
  topFamilyIds: string[];
};

type Program = {
  id: string;
  name: string;
  slug: string;
  familyIds: string[];
};

type CourseEntry = {
  id: string;
  name: string;
  gradeLevel: number;
  status: string;
  source: string;
  agCategory: string;
  level: string;
  grade: string;
  verificationStatus: string;
};

type PrepareProgress = {
  baseline: {
    courseEntries: CourseEntry[];
    seniorMathPlan: string;
    sustainableLoad: string;
  };
};

const statusLabels = {
  supported: "Supported",
  partial: "Partial",
  needs_context: "Needs context",
};

const needLabels: Record<string, string> = {
  math: "math",
  science: "science",
  cs: "CS/data",
  social: "social science",
  writing: "writing",
  language: "language",
  arts: "arts",
};

export function PathFitWorkspace({
  campuses,
  families,
  programs,
}: {
  campuses: Campus[];
  families: Family[];
  programs: Program[];
}) {
  const [progress, setProgress] = useState<PrepareProgress>(
    createPrepareProgress() as PrepareProgress,
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
      setProgress(readPrepareProgress(window.localStorage) as PrepareProgress);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleSelection(
    id: string,
    selectedIds: string[],
    setSelectedIds: (ids: string[]) => void,
    limit: number,
  ) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      return;
    }
    setSelectedIds([...selectedIds, id].slice(-limit));
  }

  const snapshot = useMemo(
    () =>
      buildPathFitSnapshot({
        selectedFamilyIds,
        selectedCampusIds,
        families,
        campuses,
        programs,
        courseEntries: progress.baseline.courseEntries,
      }),
    [campuses, families, programs, progress.baseline.courseEntries, selectedCampusIds, selectedFamilyIds],
  );

  const selectedFamilies = families.filter((family) =>
    selectedFamilyIds.includes(family.id),
  );
  return (
    <section className="path-fit-workspace shell content-section">
      <div className="path-fit-panel">
        <div className="path-fit-heading">
          <div>
            <p className="eyebrow">Path fit snapshot</p>
            <h2>Connect what she is exploring to what she should verify next.</h2>
            <p>{snapshot.disclaimer}</p>
          </div>
          <div className="path-fit-status">
            <strong>{snapshot.academic.totalCourses}</strong>
            <span>courses from Prepare</span>
            {!ready && <small>Loading saved baseline...</small>}
          </div>
        </div>

        <div className="path-fit-picker-grid">
          <section className="path-fit-picker" aria-label="Choose interest areas">
            <div>
              <p className="eyebrow">Interests</p>
              <h3>Pick up to three areas she wants to inspect.</h3>
            </div>
            <div className="filter-chips">
              {families.map((family) => (
                <button
                  aria-pressed={selectedFamilyIds.includes(family.id)}
                  key={family.id}
                  onClick={() =>
                    toggleSelection(
                      family.id,
                      selectedFamilyIds,
                      setSelectedFamilyIds,
                      3,
                    )
                  }
                  type="button"
                >
                  {family.name}
                </button>
              ))}
            </div>
          </section>

          <section className="path-fit-picker" aria-label="Choose UC campuses">
            <div>
              <p className="eyebrow">Campuses</p>
              <h3>Pick a few UCs to turn into concrete questions.</h3>
            </div>
            <div className="filter-chips compact-chips">
              {campuses.map((campus) => (
                <button
                  aria-pressed={selectedCampusIds.includes(campus.id)}
                  key={campus.id}
                  onClick={() =>
                    toggleSelection(
                      campus.id,
                      selectedCampusIds,
                      setSelectedCampusIds,
                      4,
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

        <div className="path-fit-summary-grid">
          <article>
            <span>{snapshot.academic.advancedCount}</span>
            <p>advanced courses entered</p>
          </article>
          <article>
            <span>{snapshot.academic.currentOrPlannedCount}</span>
            <p>current or planned courses</p>
          </article>
          <article>
            <span>{snapshot.academic.needsVerificationCount}</span>
            <p>courses needing verification</p>
          </article>
          <article>
            <span>{selectedFamilies.length}</span>
            <p>selected interest areas</p>
          </article>
        </div>

        <section className="path-fit-section" aria-labelledby="interest-fit-heading">
          <div className="catalog-results-heading">
            <div>
              <p className="eyebrow">Academic signals by interest</p>
              <h2 id="interest-fit-heading">What the course pattern suggests to check</h2>
            </div>
            <Link className="text-button" href="/prepare">
              Edit courses
            </Link>
            <Link className="text-button" href="/activities">
              Track activities
            </Link>
          </div>

          <div className="path-fit-card-grid">
            {snapshot.focusCards.map((card) => (
              <article className="path-fit-card" key={card.id}>
                <div className="path-fit-card-top">
                  <h3>{card.title}</h3>
                  <span>{statusLabels[card.status]}</span>
                </div>
                <p>{card.attention}</p>
                <div className="path-fit-need-grid">
                  <div>
                    <h4>Visible signals</h4>
                    {card.presentNeeds.length ? (
                      <ul>
                        {card.presentNeeds.map((need) => (
                          <li key={need}>{needLabels[need] ?? need}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Add or verify courses to make this clearer.</p>
                    )}
                  </div>
                  <div>
                    <h4>Check next</h4>
                    {card.missingNeeds.length ? (
                      <ul>
                        {card.missingNeeds.map((need) => (
                          <li key={need}>{needLabels[need] ?? need}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>The baseline has the main signals this lens expects.</p>
                    )}
                  </div>
                </div>
                <div className="path-fit-programs">
                  {card.matchingPrograms.map((program) => (
                    <Link href={`/programs/${program.slug}`} key={program.id}>
                      {program.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="path-fit-section" aria-labelledby="campus-fit-heading">
          <div className="catalog-results-heading">
            <div>
              <p className="eyebrow">Campus questions</p>
              <h2 id="campus-fit-heading">Turn selected UCs into research tasks</h2>
            </div>
            <Link className="text-button" href="/campuses">
              Compare campuses
            </Link>
          </div>

          <div className="path-fit-campus-grid">
            {snapshot.campusChecks.length ? (
              snapshot.campusChecks.map((campus) => (
                <article key={campus.id}>
                  <h3>{campus.name}</h3>
                  <p>{campus.note}</p>
                  <ul>
                    {campus.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </article>
              ))
            ) : (
              <article>
                <h3>Select campuses</h3>
                <p>
                  Choose a few campuses above so this area becomes a concrete
                  comparison instead of a generic UC list.
                </p>
              </article>
            )}
          </div>
        </section>

        <section className="path-fit-section path-fit-discussion" aria-labelledby="discussion-heading">
          <div>
            <p className="eyebrow">Discussion guide</p>
            <h2 id="discussion-heading">Use this for a parent-student-counselor conversation.</h2>
          </div>
          <div>
            <h3>Verify first</h3>
            <ul>
              {snapshot.verificationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {snapshot.verificationItems.length === 0 && (
                <li>The basic selections and course inventory are ready for a first discussion.</li>
              )}
            </ul>
            <h3>Ask together</h3>
            <ul>
              {snapshot.discussionGuide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
