"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CampusFit = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  setting: string;
  calendarSystem: string;
  officialUrl: string;
  majorCount: number;
  guideCount: number;
  applicants?: number;
  admits?: number;
  admitRate?: number;
  gpaRange?: string;
  families: Array<{ id: string; name: string; count: number }>;
  guidePrograms: Array<{ name: string; slug: string }>;
  strengths: string[];
  fitSignals: string[];
  researchQuestions: string[];
};

type FamilyFilter = {
  id: string;
  name: string;
};

const settingLabels: Record<string, string> = {
  urban: "Urban",
  suburban: "Suburban",
  college_town: "College town",
  small_city: "Small city",
  suburban_coastal: "Coastal suburban",
  small_city_coastal: "Coastal small city",
};

const settingGroups = [
  { id: "all", label: "All settings" },
  { id: "urban", label: "Urban" },
  { id: "suburban", label: "Suburban" },
  { id: "coastal", label: "Coastal" },
  { id: "smaller", label: "Smaller setting" },
];

const fitLenses = [
  { id: "all", label: "All lenses" },
  { id: "breadth", label: "Broad major menu" },
  { id: "guided", label: "Has deep guides" },
  { id: "access", label: "Less selective context" },
  { id: "research", label: "Research questions" },
];

function formatCount(value?: number) {
  return typeof value === "number" ? value.toLocaleString("en-US") : "Verify";
}

function matchesSetting(campus: CampusFit, settingId: string) {
  if (settingId === "all") return true;
  if (settingId === "coastal") return campus.setting.includes("coastal");
  if (settingId === "smaller") {
    return campus.setting.includes("small") || campus.setting === "college_town";
  }
  return campus.setting === settingId || campus.setting.includes(settingId);
}

function matchesLens(campus: CampusFit, lensId: string) {
  if (lensId === "all") return true;
  if (lensId === "breadth") return campus.majorCount >= 140;
  if (lensId === "guided") return campus.guideCount >= 8;
  if (lensId === "access") return typeof campus.admitRate === "number" && campus.admitRate >= 40;
  return campus.researchQuestions.length >= 3;
}

export function CampusExplorer({
  campuses,
  families,
}: {
  campuses: CampusFit[];
  families: FamilyFilter[];
}) {
  const [familyId, setFamilyId] = useState("all");
  const [settingId, setSettingId] = useState("all");
  const [lensId, setLensId] = useState("all");

  const results = useMemo(
    () =>
      campuses.filter((campus) => {
        const hasFamily =
          familyId === "all" ||
          campus.families.some((family) => family.id === familyId);
        return (
          hasFamily &&
          matchesSetting(campus, settingId) &&
          matchesLens(campus, lensId)
        );
      }),
    [campuses, familyId, lensId, settingId],
  );

  function clearFilters() {
    setFamilyId("all");
    setSettingId("all");
    setLensId("all");
  }

  return (
    <div className="campus-explorer">
      <section className="campus-controls" aria-label="UC campus explorer filters">
        <div className="filter-block">
          <p>Interest area</p>
          <div className="filter-chips">
            <button
              aria-pressed={familyId === "all"}
              onClick={() => setFamilyId("all")}
              type="button"
            >
              All interests
            </button>
            {families.map((family) => (
              <button
                aria-pressed={familyId === family.id}
                key={family.id}
                onClick={() => setFamilyId(family.id)}
                type="button"
              >
                {family.name}
              </button>
            ))}
          </div>
        </div>

        <div className="campus-filter-row">
          <div className="filter-block">
            <p>Campus setting</p>
            <div className="filter-chips compact-chips">
              {settingGroups.map((setting) => (
                <button
                  aria-pressed={settingId === setting.id}
                  key={setting.id}
                  onClick={() => setSettingId(setting.id)}
                  type="button"
                >
                  {setting.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <p>Fit lens</p>
            <div className="filter-chips compact-chips">
              {fitLenses.map((lens) => (
                <button
                  aria-pressed={lensId === lens.id}
                  key={lens.id}
                  onClick={() => setLensId(lens.id)}
                  type="button"
                >
                  {lens.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="campus-results" aria-live="polite">
        <div className="catalog-results-heading">
          <div>
            <p className="eyebrow">Nine undergraduate UC campuses</p>
            <h2>
              {results.length} campus{results.length === 1 ? "" : "es"} to inspect
            </h2>
          </div>
          {(familyId !== "all" || settingId !== "all" || lensId !== "all") && (
            <button className="text-button" onClick={clearFilters} type="button">
              Clear filters
            </button>
          )}
        </div>

        {results.length ? (
          <div className="campus-card-grid">
            {results.map((campus) => (
              <article className="campus-card" key={campus.id}>
                <div className="campus-card-top">
                  <div>
                    <p className="card-label">
                      {campus.city} · {settingLabels[campus.setting] ?? campus.setting}
                    </p>
                    <h3>{campus.shortName}</h3>
                  </div>
                  <span>{campus.calendarSystem}</span>
                </div>

                <div className="campus-stat-grid" aria-label={`${campus.shortName} context`}>
                  <div>
                    <strong>{campus.majorCount}</strong>
                    <span>named majors</span>
                  </div>
                  <div>
                    <strong>{campus.guideCount}</strong>
                    <span>deep guides</span>
                  </div>
                  <div>
                    <strong>
                      {typeof campus.admitRate === "number"
                        ? `${campus.admitRate}%`
                        : "Verify"}
                    </strong>
                    <span>campus admit context</span>
                  </div>
                </div>

                <p className="campus-context">
                  Fall 2025 campus-wide context: {formatCount(campus.applicants)} applicants,
                  {" "}
                  {formatCount(campus.admits)} admits
                  {campus.gpaRange ? `, admitted UC GPA middle 50% ${campus.gpaRange}` : ""}.
                  This is not a major-level chance estimate.
                </p>

                <div className="campus-strengths">
                  {campus.strengths.map((strength) => (
                    <span key={strength}>{strength}</span>
                  ))}
                </div>

                <div className="campus-detail-grid">
                  <div>
                    <h4>Worth exploring if</h4>
                    <ul>
                      {campus.fitSignals.map((signal) => (
                        <li key={signal}>{signal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Questions to research</h4>
                    <ul>
                      {campus.researchQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <details className="campus-programs">
                  <summary>
                    Program signals from this snapshot
                  </summary>
                  <div className="campus-program-list">
                    {campus.guidePrograms.slice(0, 8).map((program) => (
                      <Link href={`/programs/${program.slug}`} key={program.slug}>
                        {program.name}
                      </Link>
                    ))}
                    {campus.guidePrograms.length === 0 && (
                      <p>No deep program guides are mapped yet.</p>
                    )}
                  </div>
                  <div className="campus-family-list">
                    {campus.families.slice(0, 6).map((family) => (
                      <span key={family.id}>
                        {family.name} · {family.count}
                      </span>
                    ))}
                  </div>
                </details>

                <div className="campus-actions">
                  <a href={campus.officialUrl} rel="noreferrer" target="_blank">
                    Official campus site ↗
                  </a>
                  <Link href={`/majors?campus=${campus.id}`}>
                    Search majors at {campus.shortName} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-comparison">
            <p className="eyebrow">No exact campus match</p>
            <h2>Try removing one lens and scan the tradeoffs again.</h2>
            <button className="button button-secondary" onClick={clearFilters} type="button">
              Show all campuses
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
