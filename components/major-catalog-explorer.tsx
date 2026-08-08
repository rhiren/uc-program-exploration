"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type FamilyFilter = {
  id: string;
  name: string;
  count: number;
};

type CampusFilter = {
  id: string;
  name: string;
};

const pageSize = 30;

export function MajorCatalogExplorer({
  campuses,
  caveat,
  families,
  majors,
  sourcePageUrl,
  term,
}: {
  campuses: CampusFilter[];
  caveat: string;
  families: FamilyFilter[];
  majors: CatalogMajor[];
  sourcePageUrl: string;
  term: string;
}) {
  const [query, setQuery] = useState("");
  const [familyId, setFamilyId] = useState("all");
  const [campusId, setCampusId] = useState("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedFamily = params.get("family");
      const requestedCampus = params.get("campus");
      const requestedQuery = params.get("q");
      if (requestedFamily && families.some((item) => item.id === requestedFamily)) {
        setFamilyId(requestedFamily);
      }
      if (requestedCampus && campuses.some((item) => item.id === requestedCampus)) {
        setCampusId(requestedCampus);
      }
      if (requestedQuery) setQuery(requestedQuery);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [campuses, families]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return majors.filter((major) => {
      const matchesFamily =
        familyId === "all" || major.familyIds.includes(familyId);
      const matchesCampus =
        campusId === "all" ||
        major.campuses.some((campus) => campus.institutionId === campusId);
      const searchable = [
        major.name,
        major.categoryName,
        ...major.emphases,
        ...major.campuses.map((campus) => campus.name),
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesFamily &&
        matchesCampus &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [campusId, familyId, majors, query]);

  function resetPagination() {
    setVisibleCount(pageSize);
  }

  function clearFilters() {
    setQuery("");
    setFamilyId("all");
    setCampusId("all");
    resetPagination();
  }

  return (
    <div className="major-catalog">
      <section className="catalog-explainer">
        <article>
          <span>01</span>
          <h2>Start with an interest</h2>
          <p>
            The gateways translate a broad curiosity—such as computing or
            health—into many official UC major names.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Scan every UC option</h2>
          <p>
            Search the complete official directory snapshot and see which
            campuses use each name.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Open a deep guide</h2>
          <p>
            When available, a deep guide explains coursework, frustrations,
            careers, preparation, and UC offerings.
          </p>
        </article>
      </section>

      <section className="catalog-controls" aria-label="Major catalog filters">
        <div className="catalog-search">
          <label htmlFor="major-search">Search by major, emphasis, or subject</label>
          <input
            id="major-search"
            onChange={(event) => {
              setQuery(event.target.value);
              resetPagination();
            }}
            placeholder="Try “computer science,” “economics,” or “music”…"
            type="search"
            value={query}
          />
        </div>

        <div className="filter-block">
          <p>Explore by interest gateway</p>
          <div className="filter-chips">
            <button
              aria-pressed={familyId === "all"}
              onClick={() => {
                setFamilyId("all");
                resetPagination();
              }}
              type="button"
            >
              All interests
            </button>
            {families.map((family) => (
              <button
                aria-pressed={familyId === family.id}
                key={family.id}
                onClick={() => {
                  setFamilyId(family.id);
                  resetPagination();
                }}
                type="button"
              >
                {family.name} <span>{family.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <p>Filter by UC campus</p>
          <div className="filter-chips compact-chips">
            <button
              aria-pressed={campusId === "all"}
              onClick={() => {
                setCampusId("all");
                resetPagination();
              }}
              type="button"
            >
              All campuses
            </button>
            {campuses.map((campus) => (
              <button
                aria-pressed={campusId === campus.id}
                key={campus.id}
                onClick={() => {
                  setCampusId(campus.id);
                  resetPagination();
                }}
                type="button"
              >
                {campus.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-results" aria-live="polite">
        <div className="catalog-results-heading">
          <div>
            <p className="eyebrow">Official UC directory snapshot · {term}</p>
            <h2>
              {ready ? results.length : majors.length} named major
              {(ready ? results.length : majors.length) === 1 ? "" : "s"}
            </h2>
          </div>
          {(query || familyId !== "all" || campusId !== "all") && (
            <button className="text-button" onClick={clearFilters} type="button">
              Clear filters
            </button>
          )}
        </div>

        {results.length ? (
          <div className="catalog-major-grid">
            {results.slice(0, visibleCount).map((major) => (
              <article className="catalog-major-card" key={major.id}>
                <div>
                  <p className="card-label">{major.categoryName}</p>
                  {major.deepGuideSlug && (
                    <span className="guide-available">Full guide available</span>
                  )}
                </div>
                <h3>{major.name}</h3>
                {major.emphases.length > 0 && (
                  <details>
                    <summary>
                      {major.emphases.length} emphasis
                      {major.emphases.length === 1 ? "" : "es"}
                    </summary>
                    <ul>
                      {major.emphases.map((emphasis) => (
                        <li key={emphasis}>{emphasis}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <div className="catalog-campus-list">
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
                {major.deepGuideSlug ? (
                  <Link
                    className="catalog-guide-link"
                    href={`/programs/${major.deepGuideSlug}`}
                  >
                    Understand what studying this is like →
                  </Link>
                ) : (
                  <p className="catalog-coverage-note">
                    Directory listing available. A full study-and-career guide
                    has not been written yet.
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-comparison">
            <p className="eyebrow">No exact match</p>
            <h2>Try a broader word or remove one filter.</h2>
            <button className="button button-secondary" onClick={clearFilters} type="button">
              Show all majors
            </button>
          </div>
        )}

        {visibleCount < results.length && (
          <div className="catalog-load-more">
            <button
              className="button button-secondary"
              onClick={() => setVisibleCount((count) => count + pageSize)}
              type="button"
            >
              Show 30 more
            </button>
            <span>
              Showing {Math.min(visibleCount, results.length)} of {results.length}
            </span>
          </div>
        )}
      </section>

      <aside className="catalog-caveat">
        <div>
          <p className="eyebrow">Coverage and freshness</p>
          <h2>Complete for the snapshot—not for her future application cycle.</h2>
        </div>
        <div>
          <p>{caveat}</p>
          <a href={sourcePageUrl} rel="noreferrer" target="_blank">
            Verify with the official UC major finder ↗
          </a>
        </div>
      </aside>
    </div>
  );
}
