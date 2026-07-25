export type ExplorerItemType = "program" | "career";

export type ExplorerLibrary = {
  version: number;
  updatedAt: string;
  savedProgramIds: string[];
  savedCareerIds: string[];
  comparedProgramIds: string[];
  comparedCareerIds: string[];
  recentItems: Array<{ type: ExplorerItemType; id: string }>;
};

export const explorerLibraryStorageKey: string;
export const explorerLibraryVersion: number;
export const comparisonLimit: number;

export function createExplorerLibrary(): ExplorerLibrary;
export function parseExplorerLibrary(value: unknown): ExplorerLibrary | null;
export function readExplorerLibrary(storage: Storage): ExplorerLibrary;
export function writeExplorerLibrary(
  storage: Storage,
  library: ExplorerLibrary,
): ExplorerLibrary;
export function toggleSavedItem(
  library: ExplorerLibrary,
  type: ExplorerItemType,
  id: string,
): ExplorerLibrary;
export function toggleComparedItem(
  library: ExplorerLibrary,
  type: ExplorerItemType,
  id: string,
): { library: ExplorerLibrary; limitReached: boolean };
export function recordRecentItem(
  library: ExplorerLibrary,
  type: ExplorerItemType,
  id: string,
): ExplorerLibrary;
