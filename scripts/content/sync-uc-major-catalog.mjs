import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const inputPath = resolve(
  process.argv[2] ?? "/private/tmp/uc-official-majors.json",
);
const outputPath = resolve(
  process.argv[3] ?? "content/institutions/major-catalog.json",
);
const source = JSON.parse(await readFile(inputPath, "utf8"));
const term = process.env.UC_MAJOR_TERM ?? "Fall 2026";

const institutionIds = {
  "01": "uc-berkeley",
  "03": "uc-davis",
  "04": "ucla",
  "05": "uc-riverside",
  "06": "uc-san-diego",
  "07": "uc-santa-cruz",
  "08": "uc-santa-barbara",
  "09": "uc-irvine",
  "10": "uc-merced",
};

const catalogUrls = {
  "01": "https://catalog.berkeley.edu/undergraduate/degree-programs/",
  "03": "https://www.ucdavis.edu/majors/",
  "04": "https://catalog.registrar.ucla.edu/",
  "05": "https://www.ucr.edu/academics/undergraduate-majors",
  "06": "https://students.ucsd.edu/academics/advising/majors-minors/undergraduate-majors.html",
  "07": "https://admissions.sa.ucsc.edu/majors/",
  "08": "https://www.ucsb.edu/academics/undergraduate",
  "09": "https://catalogue.uci.edu/undergraduatedegrees/",
  "10": "https://www.ucmerced.edu/academics-undergraduate-majors-minors",
};

const categoryFallback = {
  A: "environment-climate-agriculture",
  R: "design-media-arts",
  F: "design-media-arts",
  B: "biology-life-sciences",
  "3": "economics-business-operations",
  "2": "social-government-policy",
  E: "engineering-physical-systems",
  T: "social-government-policy",
  "4": "medicine-health-public-health",
  L: "humanities-languages-philosophy",
  "1": "medicine-health-public-health",
  H: "humanities-languages-philosophy",
  "5": "interdisciplinary-undecided",
  M: "math-stat-physical",
  P: "math-stat-physical",
  S: "social-government-policy",
  O: "interdisciplinary-undecided",
};

const keywordFamilies = [
  {
    familyId: "education-human-development",
    pattern: /\b(education|teaching|human development|child development)\b/i,
  },
  {
    familyId: "psych-neuro-cognitive",
    pattern: /\b(psych|cognitive|neuro|brain|behavior)\w*/i,
  },
  {
    familyId: "computing-data-ai",
    pattern:
      /\b(computer|computing|data science|informatics|information systems|artificial intelligence|software|cyber)\b/i,
  },
  {
    familyId: "medicine-health-public-health",
    pattern:
      /\b(health|medicine|medical|nursing|pharmaceutical|pharmacy|nutrition|epidemiology)\w*/i,
  },
  {
    familyId: "biology-life-sciences",
    pattern:
      /\b(bio|biology|biological|biochemistry|genetics|genomics|microbiology|ecology|physiology|molecular|cell)\w*/i,
  },
  {
    familyId: "engineering-physical-systems",
    pattern:
      /\b(engineering|aerospace|robotics|materials|mechanical|electrical|chemical engineering)\b/i,
  },
  {
    familyId: "environment-climate-agriculture",
    pattern:
      /\b(environment|climate|agricultur|forestry|marine|earth|geology|sustainab|resource)\w*/i,
  },
  {
    familyId: "economics-business-operations",
    pattern:
      /\b(econom|business|management|finance|accounting|operations|entrepreneur)\w*/i,
  },
  {
    familyId: "math-stat-physical",
    pattern:
      /\b(mathemat|statistics|physics|chemistry|astronomy|astrophysics|physical science)\w*/i,
  },
  {
    familyId: "design-media-arts",
    pattern:
      /\b(art|design|music|dance|theater|theatre|film|media|architecture|creative)\w*/i,
  },
  {
    familyId: "humanities-languages-philosophy",
    pattern:
      /\b(history|language|literature|philosophy|religion|classics|writing|linguistics|humanities)\w*/i,
  },
  {
    familyId: "social-government-policy",
    pattern:
      /\b(political|policy|government|sociology|anthropology|communication|social|ethnic|gender|international|legal|law)\w*/i,
  },
];

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function classify(name, categoryIds) {
  const families = keywordFamilies
    .filter(({ pattern }) => pattern.test(name))
    .map(({ familyId }) => familyId);
  for (const categoryId of categoryIds) {
    const fallback =
      categoryFallback[categoryId] ?? "interdisciplinary-undecided";
    if (!families.includes(fallback)) families.push(fallback);
  }
  return [...new Set(families)];
}

const campusNames = new Map(
  source.staticData.campuses.map((campus) => [campus.id, campus.name]),
);
const categories = source.staticData.categories.map((category) => ({
  id: category.id,
  name: category.name,
}));
const recordsForTerm = source.majorData.filter((record) => record.term === term);
const grouped = new Map();

for (const record of recordsForTerm) {
  const groupKey = record.major;
  const group = grouped.get(groupKey) ?? {
    name: record.major,
    categoryIds: new Set(),
    emphases: new Set(),
    campuses: new Map(),
  };
  group.categoryIds.add(record.categoryId);
  if (record.emphasis) group.emphases.add(record.emphasis);
  const campusEmphases = group.campuses.get(record.campusId) ?? new Set();
  if (record.emphasis) campusEmphases.add(record.emphasis);
  group.campuses.set(record.campusId, campusEmphases);
  grouped.set(groupKey, group);
}

const usedIds = new Set();
const majors = [...grouped.values()]
  .map((group) => {
    const baseId = slugify(group.name);
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    const emphases = [...group.emphases].sort();
    const classificationText = `${group.name} ${emphases.join(" ")}`;
    const categoryIds = [...group.categoryIds].sort();

    return {
      id,
      name: group.name,
      categoryIds,
      familyIds: classify(classificationText, categoryIds),
      emphases,
      campuses: [...group.campuses.entries()]
        .map(([campusSourceId, campusEmphases]) => ({
          institutionId: institutionIds[campusSourceId],
          name: campusNames.get(campusSourceId),
          emphases: [...campusEmphases].sort(),
          officialCatalogUrl: catalogUrls[campusSourceId],
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const catalog = {
  meta: {
    schemaVersion: "1.0.0",
    contentVersion: "1.1.0",
    lastVerified: "2026-07-24",
    nextReviewDue: "2026-12-01",
    maintenanceOwnerRole: "institution_content_editor",
  },
  term,
  sourceUrl: "https://web-cdn.ucop.edu/ugm/data.json",
  sourcePageUrl:
    "https://admission.universityofcalifornia.edu/campuses-majors/majors/",
  sourceIds: ["uc-major-checker"],
  caveat:
    "This is a complete snapshot of major names in the official UC major-finder dataset for the stated term. It may include transfer-only, closed, special, or other applicant-level options. It is not a promise of first-year availability for a future application cycle; verify in the official UC application and campus catalog.",
  categories,
  campuses: source.staticData.campuses.map((campus) => ({
    sourceId: campus.id,
    institutionId: institutionIds[campus.id],
    name: campus.name,
    officialCatalogUrl: catalogUrls[campus.id],
  })),
  majors,
  counts: {
    namedMajors: majors.length,
    campusMajorEntries: majors.reduce(
      (total, major) => total + major.campuses.length,
      0,
    ),
  },
};

await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Generated ${catalog.counts.namedMajors} named majors and ${catalog.counts.campusMajorEntries} campus-major entries for ${term}.`,
);
