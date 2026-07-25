import { z } from "zod";

export const maintenanceMetaSchema = z.object({
  schemaVersion: z.string().min(1),
  contentVersion: z.string().min(1),
  lastVerified: z.iso.date(),
  nextReviewDue: z.iso.date(),
  maintenanceOwnerRole: z.string().min(1),
});

export const sourceRefSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    publisher: z.string().min(1),
    url: z.url(),
    sourceType: z.enum([
      "official_uc",
      "campus_catalog",
      "government",
      "professional_association",
      "research",
      "forecast",
    ]),
    lastVerified: z.iso.date(),
    nextReviewDue: z.iso.date(),
    maintenanceOwnerRole: z.string().min(1),
  })
  .passthrough();

const maintainedRecordSchema = maintenanceMetaSchema.extend({
  id: z.string().min(1),
});

export const programFamilySchema = maintainedRecordSchema
  .extend({
    slug: z.string().min(1),
    name: z.string().min(1),
    summary: z.string().min(1),
    featuredProgramIds: z.array(z.string().min(1)),
    order: z.number().int().positive(),
    sourceIds: z.array(z.string().min(1)),
  })
  .passthrough();

export const programSchema = maintainedRecordSchema
  .extend({
    slug: z.string().min(1),
    name: z.string().min(1),
    familyIds: z.array(z.string().min(1)).min(1),
    summary: z.string().min(1),
    coreQuestions: z.array(z.string().min(1)).min(1),
    typicalWork: z.array(z.string().min(1)).min(1),
    representativeCourses: z.array(z.string().min(1)).min(1),
    commonAssignments: z.array(z.string().min(1)).min(1),
    intensities: z.record(z.string(), z.number()),
    codingReality: z.string().min(1),
    rewarding: z.array(z.string().min(1)).min(1),
    frustrating: z.array(z.string().min(1)).min(1),
    mayEnjoy: z.array(z.string().min(1)).min(1),
    adjacentProgramIds: z.array(z.string().min(1)),
    careerIds: z.array(z.string().min(1)),
    premedCompatibility: z.object({
      level: z.enum([
        "high",
        "possible_with_planning",
        "possible_but_demanding",
        "possible_with_substantial_planning",
      ]),
      note: z.string().min(1),
    }),
    highSchoolPreparation: z.array(
      z.object({ label: z.string().min(1), text: z.string().min(1) }),
    ),
    tryNow: z.array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        minutes: z.number().int().positive(),
      }),
    ),
    sourceIds: z.array(z.string().min(1)).min(1),
    ucOfferingIds: z.array(z.string().min(1)),
  })
  .passthrough();

export const careerSchema = maintainedRecordSchema
  .extend({
    slug: z.string().min(1),
    name: z.string().min(1),
    summary: z.string().min(1),
    typicalWeek: z.array(z.string().min(1)).min(1),
    workEnvironment: z.array(z.string().min(1)).min(1),
    intensities: z.record(z.string(), z.number()),
    educationPath: z.string().min(1),
    relatedProgramIds: z.array(z.string().min(1)),
    adjacentCareerIds: z.array(z.string().min(1)),
    laborData: z.object({
      socCode: z.string().min(1),
      baseYear: z.number().int(),
      projectionEndYear: z.number().int(),
      medianAnnualUsd: z.number().nullable(),
      growthPercent: z.number().nullable(),
      typicalEntryEducation: z.string().min(1),
      geography: z.string().min(1),
      sourceIds: z.array(z.string().min(1)).min(1),
      medianQualifier: z.string().min(1).optional(),
      isProxy: z.boolean().optional(),
      limitation: z.string().min(1).optional(),
    }),
    aiImpact: z.object({
      routineTasks: z.array(z.string().min(1)),
      augmentedTasks: z.array(z.string().min(1)),
      humanCenter: z.array(z.string().min(1)),
      confidence: z.enum(["low", "medium", "high"]),
    }),
    tryNow: z.string().min(1),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export const institutionSchema = maintainedRecordSchema
  .extend({
    collectionId: z.string().min(1),
    providerId: z.string().min(1),
    name: z.string().min(1),
    location: z.object({
      city: z.string().min(1),
      state: z.string().min(1),
    }),
    officialUrl: z.url(),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export const offeringSchema = maintainedRecordSchema
  .extend({
    institutionId: z.string().min(1),
    canonicalProgramId: z.string().min(1),
    officialMajorName: z.string().min(1),
    degreeType: z.enum(["BA", "BS", "BFA", "other"]),
    schoolOrCollege: z.string().min(1),
    firstYearAvailable: z.boolean(),
    admissionContext: z.enum(["campus", "college", "direct_major", "unknown"]),
    capacityStatus: z.enum([
      "selective",
      "capacity_constrained",
      "not_identified",
      "unknown",
    ]),
    publishedMajorAdmitData: z.enum([
      "available",
      "not_published",
      "not_comparable",
      "unknown",
    ]),
    selectivityNote: z.string().min(1),
    alternateMajorNote: z.string().min(1),
    changeMajorNote: z.string().min(1),
    officialUrl: z.url(),
    effectiveTerm: z.string().min(1),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export const metricSchema = maintainedRecordSchema
  .extend({
    institutionId: z.string().min(1),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export const challengeSchema = maintenanceMetaSchema
  .extend({
    id: z.string().min(1),
    title: z.string().min(1),
    disclaimer: z.string().min(1),
    defaultMinutes: z.number().int().positive(),
    steps: z.array(z.object({ id: z.string(), type: z.string(), prompt: z.string() }).passthrough()).min(1),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .passthrough();

export const manifestSchema = z.object({
  meta: maintenanceMetaSchema.passthrough(),
  fileCount: z.number().int().positive(),
  files: z.array(
    z.object({
      path: z.string().min(1),
      kind: z.enum(["content", "json_schema", "manifest"]),
      recordCount: z.number().int().nonnegative(),
    }),
  ),
  scope: z.object({
    included: z.array(z.string()),
    excluded: z.array(z.string()),
  }),
  validation: z.object({
    generatedAt: z.iso.datetime(),
    checks: z.array(z.string()),
  }).passthrough(),
});

export const collectionOf = <T extends z.ZodType>(recordSchema: T) =>
  z.object({
    meta: maintenanceMetaSchema.passthrough(),
    records: z.array(recordSchema),
  }).passthrough();

export type ProgramFamily = z.infer<typeof programFamilySchema>;
export type Program = z.infer<typeof programSchema>;
export type Career = z.infer<typeof careerSchema>;
export type Institution = z.infer<typeof institutionSchema>;
export type Offering = z.infer<typeof offeringSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type SourceRef = z.infer<typeof sourceRefSchema>;
