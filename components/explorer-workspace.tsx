"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createExplorerLibrary,
  readExplorerLibrary,
  toggleComparedItem,
  toggleSavedItem,
  writeExplorerLibrary,
} from "@/lib/explorer/library-store.mjs";

type PathItem = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  kind: "program" | "career";
};

export function ExplorerWorkspace({
  programs,
  careers,
}: {
  programs: PathItem[];
  careers: PathItem[];
}) {
  const [library, setLibrary] = useState(() => createExplorerLibrary());
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const itemMap = useMemo(
    () =>
      new Map(
        [...programs, ...careers].map((item) => [
          `${item.kind}:${item.id}`,
          item,
        ]),
      ),
    [programs, careers],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLibrary(readExplorerLibrary(window.localStorage));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: ReturnType<typeof createExplorerLibrary>) {
    setLibrary(writeExplorerLibrary(window.localStorage, next));
  }

  function remove(item: PathItem) {
    persist(toggleSavedItem(library, item.kind, item.id));
    setMessage(`${item.name} removed from saved paths.`);
  }

  function compare(item: PathItem) {
    const result = toggleComparedItem(library, item.kind, item.id);
    if (result.limitReached) {
      setMessage(`You can compare up to three ${item.kind}s at a time.`);
      return;
    }
    persist(result.library);
    setMessage(`${item.name} comparison updated.`);
  }

  const savedPrograms = programs.filter((item) =>
    library.savedProgramIds.includes(item.id),
  );
  const savedCareers = careers.filter((item) =>
    library.savedCareerIds.includes(item.id),
  );
  const recents = library.recentItems
    .map((item) => itemMap.get(`${item.type}:${item.id}`))
    .filter((item): item is PathItem => item !== undefined);

  if (!ready) {
    return <p className="workspace-loading">Opening paths saved on this device…</p>;
  }

  return (
    <div className="workspace">
      <p className="workspace-note">
        This is a curiosity shelf, not a decision list. Everything stays in this
        browser on this device.
      </p>
      {message && <p aria-live="polite">{message}</p>}

      <section className="workspace-section">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Saved programs</p>
            <h2>{savedPrograms.length} paths to revisit</h2>
          </div>
          <Link href="/compare?type=program">Compare programs →</Link>
        </div>
        {savedPrograms.length ? (
          <div className="saved-grid">
            {savedPrograms.map((item) => (
              <SavedCard
                compared={library.comparedProgramIds.includes(item.id)}
                item={item}
                key={item.id}
                onCompare={() => compare(item)}
                onRemove={() => remove(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyShelf
            href="/discover#detailed-programs"
            label="Browse the eight program guides"
            text="Save a program when it raises a question you want to revisit."
          />
        )}
      </section>

      <section className="workspace-section">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Saved careers</p>
            <h2>{savedCareers.length} futures to investigate</h2>
          </div>
          <Link href="/compare?type=career">Compare careers →</Link>
        </div>
        {savedCareers.length ? (
          <div className="saved-grid">
            {savedCareers.map((item) => (
              <SavedCard
                compared={library.comparedCareerIds.includes(item.id)}
                item={item}
                key={item.id}
                onCompare={() => compare(item)}
                onRemove={() => remove(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyShelf
            href="/discover#careers"
            label="Explore thirteen career realities"
            text="Save careers based on the work itself—not just a familiar title."
          />
        )}
      </section>

      <section className="workspace-section">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Recently viewed</p>
            <h2>Pick up where you left off</h2>
          </div>
        </div>
        {recents.length ? (
          <div className="recent-list">
            {recents.map((item) => (
              <Link
                href={`/${item.kind === "program" ? "programs" : "careers"}/${item.slug}`}
                key={`${item.kind}:${item.id}`}
              >
                <span>{item.kind}</span>
                <strong>{item.name}</strong>
                <small>Open guide →</small>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted-copy">
            Program and career guides you open will appear here.
          </p>
        )}
      </section>
    </div>
  );
}

function SavedCard({
  compared,
  item,
  onCompare,
  onRemove,
}: {
  compared: boolean;
  item: PathItem;
  onCompare: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="saved-card">
      <p className="card-label">{item.kind}</p>
      <h3>{item.name}</h3>
      <p>{item.summary}</p>
      <Link
        href={`/${item.kind === "program" ? "programs" : "careers"}/${item.slug}`}
      >
        Open full guide →
      </Link>
      <div>
        <button aria-pressed={compared} onClick={onCompare} type="button">
          {compared ? "In comparison ✓" : "Add to compare"}
        </button>
        <button onClick={onRemove} type="button">
          Remove
        </button>
      </div>
    </article>
  );
}

function EmptyShelf({
  href,
  label,
  text,
}: {
  href: string;
  label: string;
  text: string;
}) {
  return (
    <div className="empty-shelf">
      <p>{text}</p>
      <Link className="button button-secondary" href={href}>
        {label} →
      </Link>
    </div>
  );
}
