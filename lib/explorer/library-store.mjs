import {
  discoverProgressStorageKey,
  parseDiscoverProgress,
} from "../discover/progress-store.mjs";

export const explorerLibraryStorageKey = "uc-pathways-explorer:my-paths";
export const explorerLibraryVersion = 1;
export const comparisonLimit = 3;

function stringArray(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === "string"))]
    : [];
}

function recentArray(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  return value
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.type === "program" || item.type === "career") &&
        typeof item.id === "string",
    )
    .filter((item) => {
      const key = `${item.type}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12)
    .map(({ type, id }) => ({ type, id }));
}

export function createExplorerLibrary() {
  return {
    version: explorerLibraryVersion,
    updatedAt: new Date().toISOString(),
    savedProgramIds: [],
    savedCareerIds: [],
    comparedProgramIds: [],
    comparedCareerIds: [],
    recentItems: [],
  };
}

export function parseExplorerLibrary(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    value.version !== explorerLibraryVersion
  ) {
    return null;
  }

  return {
    version: explorerLibraryVersion,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : new Date().toISOString(),
    savedProgramIds: stringArray(value.savedProgramIds),
    savedCareerIds: stringArray(value.savedCareerIds),
    comparedProgramIds: stringArray(value.comparedProgramIds).slice(
      0,
      comparisonLimit,
    ),
    comparedCareerIds: stringArray(value.comparedCareerIds).slice(
      0,
      comparisonLimit,
    ),
    recentItems: recentArray(value.recentItems),
  };
}

export function readExplorerLibrary(storage) {
  let library = createExplorerLibrary();

  try {
    const stored = storage.getItem(explorerLibraryStorageKey);
    if (stored) {
      library =
        parseExplorerLibrary(JSON.parse(stored)) ?? createExplorerLibrary();
    }

    const discoverStored = storage.getItem(discoverProgressStorageKey);
    if (discoverStored) {
      const discover = parseDiscoverProgress(JSON.parse(discoverStored));
      if (discover) {
        library.savedProgramIds = [
          ...new Set([
            ...library.savedProgramIds,
            ...discover.savedProgramIds,
          ]),
        ];
      }
    }
  } catch {
    return library;
  }

  return library;
}

export function writeExplorerLibrary(storage, library) {
  const normalized =
    parseExplorerLibrary({
      ...library,
      version: explorerLibraryVersion,
      updatedAt: new Date().toISOString(),
    }) ?? createExplorerLibrary();
  storage.setItem(explorerLibraryStorageKey, JSON.stringify(normalized, null, 2));
  return normalized;
}

export function toggleSavedItem(library, type, id) {
  const field = type === "program" ? "savedProgramIds" : "savedCareerIds";
  const exists = library[field].includes(id);
  return {
    ...library,
    [field]: exists
      ? library[field].filter((item) => item !== id)
      : [...library[field], id],
  };
}

export function toggleComparedItem(library, type, id) {
  const field =
    type === "program" ? "comparedProgramIds" : "comparedCareerIds";
  const exists = library[field].includes(id);
  if (!exists && library[field].length >= comparisonLimit) {
    return { library, limitReached: true };
  }

  return {
    library: {
      ...library,
      [field]: exists
        ? library[field].filter((item) => item !== id)
        : [...library[field], id],
    },
    limitReached: false,
  };
}

export function recordRecentItem(library, type, id) {
  return {
    ...library,
    recentItems: [
      { type, id },
      ...library.recentItems.filter(
        (item) => item.type !== type || item.id !== id,
      ),
    ].slice(0, 12),
  };
}
