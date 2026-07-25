"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createExplorerLibrary,
  readExplorerLibrary,
  toggleComparedItem,
  writeExplorerLibrary,
} from "@/lib/explorer/library-store.mjs";

type CompareItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  kind: "program" | "career";
  rows: Array<{ label: string; value: string }>;
};

export function ComparisonWorkspace({
  programs,
  careers,
}: {
  programs: CompareItem[];
  careers: CompareItem[];
}) {
  const [library, setLibrary] = useState(() => createExplorerLibrary());
  const [kind, setKind] = useState<"program" | "career">("program");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLibrary(readExplorerLibrary(window.localStorage));
      if (new URLSearchParams(window.location.search).get("type") === "career") {
        setKind("career");
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const items = kind === "program" ? programs : careers;
  const comparedIds =
    kind === "program"
      ? library.comparedProgramIds
      : library.comparedCareerIds;
  const selected = comparedIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is CompareItem => item !== undefined);

  function toggle(item: CompareItem) {
    const result = toggleComparedItem(library, item.kind, item.id);
    if (result.limitReached) {
      setMessage(`Remove one ${item.kind} before adding another.`);
      return;
    }
    setLibrary(writeExplorerLibrary(window.localStorage, result.library));
    setMessage("");
  }

  return (
    <div className="comparison-workspace">
      <div className="compare-tabs" role="tablist" aria-label="Comparison type">
        <button
          aria-selected={kind === "program"}
          onClick={() => setKind("program")}
          role="tab"
          type="button"
        >
          Programs
        </button>
        <button
          aria-selected={kind === "career"}
          onClick={() => setKind("career")}
          role="tab"
          type="button"
        >
          Careers
        </button>
      </div>

      <section className="compare-picker">
        <div>
          <p className="eyebrow">Choose up to three</p>
          <h2>
            {selected.length}/3 {kind}s selected
          </h2>
        </div>
        <div className="compare-choice-grid">
          {items.map((item) => {
            const checked = comparedIds.includes(item.id);
            return (
              <button
                aria-pressed={checked}
                disabled={!ready}
                key={item.id}
                onClick={() => toggle(item)}
                type="button"
              >
                <span aria-hidden="true">{checked ? "✓" : "+"}</span>
                {item.name}
              </button>
            );
          })}
        </div>
        {message && <p aria-live="polite">{message}</p>}
      </section>

      {selected.length ? (
        <section className="comparison-table-wrap">
          <div className={`comparison-grid comparison-count-${selected.length}`}>
            <div className="comparison-label comparison-top-label">
              What to compare
            </div>
            {selected.map((item) => (
              <article className="comparison-header" key={item.id}>
                <p className="card-label">{kind}</p>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                <Link
                  href={`/${kind === "program" ? "programs" : "careers"}/${item.slug}`}
                >
                  Open full guide →
                </Link>
              </article>
            ))}
            {selected[0].rows.map((row, index) => (
              <ComparisonRow
                items={selected}
                key={row.label}
                label={row.label}
                rowIndex={index}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-comparison">
          <p className="eyebrow">Start with contrast</p>
          <h2>Select two paths that seem different.</h2>
          <p>
            Comparing concrete work, coursework, training, and tradeoffs can
            reveal more than trying to find one perfect answer.
          </p>
        </section>
      )}
    </div>
  );
}

function ComparisonRow({
  items,
  label,
  rowIndex,
}: {
  items: CompareItem[];
  label: string;
  rowIndex: number;
}) {
  return (
    <>
      <div className="comparison-label">{label}</div>
      {items.map((item) => (
        <div className="comparison-value" key={`${item.id}:${label}`}>
          {item.rows[rowIndex]?.value ?? "Not available"}
        </div>
      ))}
    </>
  );
}
