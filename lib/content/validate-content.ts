import { rawContent, rawContentFiles } from "./raw-content";
import {
  careerSchema,
  challengeSchema,
  collectionOf,
  institutionSchema,
  manifestSchema,
  metricSchema,
  offeringSchema,
  programFamilySchema,
  programSchema,
  sourceRefSchema,
  ucMajorCatalogSchema,
} from "./schemas";

const prohibitedOfferingFields = [
  "admitRate",
  "estimatedAdmitRate",
  "chanceOfAdmission",
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Content validation failed: ${message}`);
}

function ids(records: Array<{ id: string }>, label: string) {
  const values = records.map((record) => record.id);
  const unique = new Set(values);
  assert(unique.size === values.length, `${label} contains duplicate IDs`);
  return unique;
}

function validateSourceReferences(
  value: unknown,
  sourceIds: Set<string>,
  path = "content",
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      validateSourceReferences(item, sourceIds, `${path}[${index}]`),
    );
    return;
  }
  if (!value || typeof value !== "object") return;

  const object = value as Record<string, unknown>;
  if (Array.isArray(object.sourceIds)) {
    object.sourceIds.forEach((sourceId) => {
      assert(
        typeof sourceId === "string" && sourceIds.has(sourceId),
        `${path} references unknown source "${String(sourceId)}"`,
      );
    });
  }

  Object.entries(object).forEach(([key, child]) => {
    if (key !== "sourceIds") {
      validateSourceReferences(child, sourceIds, `${path}.${key}`);
    }
  });
}

export function validateContent() {
  const manifest = manifestSchema.parse(rawContent.manifest);
  const manifestPaths = new Set(manifest.files.map((file) => file.path));
  const importedPaths = new Set(Object.keys(rawContentFiles));

  assert(manifest.fileCount === manifest.files.length, "manifest count mismatch");
  assert(
    manifestPaths.size === manifest.files.length,
    "manifest contains duplicate paths",
  );
  assert(
    manifestPaths.size === importedPaths.size &&
      [...manifestPaths].every((path) => importedPaths.has(path)),
    "manifest paths and statically imported content paths differ",
  );

  const sources = collectionOf(sourceRefSchema).parse(rawContent.sources).records;
  const families = collectionOf(programFamilySchema).parse(
    rawContent.programFamilies,
  ).records;
  const programs = collectionOf(programSchema).parse(rawContent.programs).records;
  const careers = collectionOf(careerSchema).parse(rawContent.careers).records;
  const institutions = collectionOf(institutionSchema).parse(
    rawContent.institutions,
  ).records;
  const offerings = collectionOf(offeringSchema).parse(
    rawContent.offerings,
  ).records;
  const metrics = collectionOf(metricSchema).parse(rawContent.metrics).records;
  const ucMajorCatalog = ucMajorCatalogSchema.parse(rawContent.ucMajorCatalog);
  const challenges = rawContent.medical.challenges.map((challenge) =>
    challengeSchema.parse(challenge),
  );

  const sourceIds = ids(sources, "sources");
  const familyIds = ids(families, "program families");
  const programIds = ids(programs, "programs");
  const careerIds = ids(careers, "careers");
  const institutionIds = ids(institutions, "institutions");
  const offeringIds = ids(offerings, "offerings");
  ids(ucMajorCatalog.majors, "UC major catalog");
  ids(metrics, "metrics");
  ids(challenges, "challenges");

  programs.forEach((program) => {
    program.familyIds.forEach((familyId) =>
      assert(familyIds.has(familyId), `${program.id} references unknown family`),
    );
    program.careerIds.forEach((careerId) =>
      assert(careerIds.has(careerId), `${program.id} references unknown career`),
    );
    program.ucOfferingIds.forEach((offeringId) =>
      assert(
        offeringIds.has(offeringId),
        `${program.id} references unknown offering`,
      ),
    );
  });

  careers.forEach((career) =>
    career.relatedProgramIds.forEach((programId) =>
      assert(programIds.has(programId), `${career.id} references unknown program`),
    ),
  );

  offerings.forEach((offering) => {
    assert(
      institutionIds.has(offering.institutionId),
      `${offering.id} references unknown institution`,
    );
    assert(
      programIds.has(offering.canonicalProgramId),
      `${offering.id} references unknown program`,
    );
    prohibitedOfferingFields.forEach((field) =>
      assert(!(field in offering), `${offering.id} contains prohibited ${field}`),
    );
  });

  const catalogCategoryIds = new Set(
    ucMajorCatalog.categories.map((category) => category.id),
  );
  ucMajorCatalog.majors.forEach((major) => {
    major.categoryIds.forEach((categoryId) =>
      assert(
        catalogCategoryIds.has(categoryId),
        `${major.id} references unknown UC category`,
      ),
    );
    major.familyIds.forEach((familyId) =>
      assert(
        familyIds.has(familyId),
        `${major.id} references unknown program family`,
      ),
    );
    major.campuses.forEach((campus) =>
      assert(
        institutionIds.has(campus.institutionId),
        `${major.id} references unknown institution`,
      ),
    );
  });
  assert(
    ucMajorCatalog.counts.namedMajors === ucMajorCatalog.majors.length,
    "UC major catalog named-major count mismatch",
  );
  assert(
    ucMajorCatalog.counts.campusMajorEntries ===
      ucMajorCatalog.majors.reduce(
        (total, major) => total + major.campuses.length,
        0,
      ),
    "UC major catalog campus-major count mismatch",
  );

  metrics.forEach((metric) =>
    assert(
      institutionIds.has(metric.institutionId),
      `${metric.id} references unknown institution`,
    ),
  );

  validateSourceReferences(rawContentFiles, sourceIds);

  const futureMilestones = rawContent.preparation.applicationMilestones.milestones;
  futureMilestones.forEach((milestone) => {
    if (milestone.status === "awaiting_official_cycle") {
      assert(
        milestone.officialDate === null,
        `${milestone.id} has an unverified future date`,
      );
    }
  });

  return {
    contentVersion: manifest.meta.contentVersion,
    fileCount: manifest.fileCount,
    families,
    programs,
    careers,
    sources,
    institutions,
    offerings,
    metrics,
    challenges,
    ucMajorCatalog,
  };
}
