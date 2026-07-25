"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createExplorerLibrary,
  readExplorerLibrary,
  recordRecentItem,
  toggleComparedItem,
  toggleSavedItem,
  writeExplorerLibrary,
} from "@/lib/explorer/library-store.mjs";

type ExplorerItemActionsProps = {
  id: string;
  type: "program" | "career";
};

export function ExplorerItemActions({ id, type }: ExplorerItemActionsProps) {
  const [library, setLibrary] = useState(() => createExplorerLibrary());
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const savedField =
    type === "program" ? "savedProgramIds" : "savedCareerIds";
  const comparedField =
    type === "program" ? "comparedProgramIds" : "comparedCareerIds";
  const isSaved = library[savedField].includes(id);
  const isCompared = library[comparedField].includes(id);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const restored = recordRecentItem(
        readExplorerLibrary(window.localStorage),
        type,
        id,
      );
      setLibrary(writeExplorerLibrary(window.localStorage, restored));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id, type]);

  function save() {
    const next = writeExplorerLibrary(
      window.localStorage,
      toggleSavedItem(library, type, id),
    );
    setLibrary(next);
    setMessage(
      next[savedField].includes(id)
        ? "Saved to My paths."
        : "Removed from My paths.",
    );
  }

  function compare() {
    const result = toggleComparedItem(library, type, id);
    if (result.limitReached) {
      setMessage(`You can compare up to three ${type}s at a time.`);
      return;
    }
    const next = writeExplorerLibrary(window.localStorage, result.library);
    setLibrary(next);
    setMessage(
      next[comparedField].includes(id)
        ? "Added to comparison."
        : "Removed from comparison.",
    );
  }

  return (
    <div className="explorer-actions">
      <button
        aria-pressed={isSaved}
        className="button button-primary"
        disabled={!ready}
        onClick={save}
        type="button"
      >
        {isSaved ? "Saved ✓" : "Save to My paths"}
      </button>
      <button
        aria-pressed={isCompared}
        className="button button-secondary"
        disabled={!ready}
        onClick={compare}
        type="button"
      >
        {isCompared ? "Remove from compare" : "Add to compare"}
      </button>
      <Link href={`/compare?type=${type}`}>Open comparison →</Link>
      {message && <span aria-live="polite">{message}</span>}
    </div>
  );
}
