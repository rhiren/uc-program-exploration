import manifest from "@/content/manifest.json";
import programFamilies from "@/content/program-families.json";
import programs from "@/content/programs.json";
import careers from "@/content/careers.json";
import sources from "@/content/sources.json";
import dataContracts from "@/content/data-contracts.json";
import institutionCollections from "@/content/institutions/collections.json";
import institutions from "@/content/institutions/institutions.json";
import offerings from "@/content/institutions/offerings.json";
import admissions from "@/content/institutions/admissions.json";
import metrics from "@/content/institutions/metrics.json";
import ucProvider from "@/content/providers/uc/provider.json";
import outOfStateFixture from "@/content/providers/fixtures/out-of-state-institution.json";
import medicalPath from "@/content/medical/path.json";
import medicalProfessions from "@/content/medical/professions.json";
import premed from "@/content/medical/premed.json";
import bioGenetics from "@/content/medical/challenges/bio-genetics.json";
import chemBuffers from "@/content/medical/challenges/chem-buffers.json";
import integratedShortnessOfBreath from "@/content/medical/challenges/integrated-shortness-of-breath.json";
import onboarding from "@/content/journey/onboarding.json";
import journeyNodes from "@/content/journey/nodes.json";
import pathProfiles from "@/content/journey/path-profiles.json";
import agRules from "@/content/preparation/ag-rules.json";
import gpaRules from "@/content/preparation/gpa-rules.json";
import comprehensiveReview from "@/content/preparation/comprehensive-review.json";
import roadmapTemplates from "@/content/preparation/roadmap-templates.json";
import applicationMilestones from "@/content/preparation/application-milestones.json";
import piq from "@/content/preparation/piq.json";
import recordCollectionSchema from "@/content/schemas/record-collection.schema.json";
import sourceRegistrySchema from "@/content/schemas/source-registry.schema.json";

export const rawContentFiles = {
  "program-families.json": programFamilies,
  "programs.json": programs,
  "careers.json": careers,
  "sources.json": sources,
  "data-contracts.json": dataContracts,
  "institutions/collections.json": institutionCollections,
  "institutions/institutions.json": institutions,
  "institutions/offerings.json": offerings,
  "institutions/admissions.json": admissions,
  "institutions/metrics.json": metrics,
  "providers/uc/provider.json": ucProvider,
  "providers/fixtures/out-of-state-institution.json": outOfStateFixture,
  "medical/path.json": medicalPath,
  "medical/professions.json": medicalProfessions,
  "medical/premed.json": premed,
  "medical/challenges/bio-genetics.json": bioGenetics,
  "medical/challenges/chem-buffers.json": chemBuffers,
  "medical/challenges/integrated-shortness-of-breath.json":
    integratedShortnessOfBreath,
  "journey/onboarding.json": onboarding,
  "journey/nodes.json": journeyNodes,
  "journey/path-profiles.json": pathProfiles,
  "preparation/ag-rules.json": agRules,
  "preparation/gpa-rules.json": gpaRules,
  "preparation/comprehensive-review.json": comprehensiveReview,
  "preparation/roadmap-templates.json": roadmapTemplates,
  "preparation/application-milestones.json": applicationMilestones,
  "preparation/piq.json": piq,
  "schemas/record-collection.schema.json": recordCollectionSchema,
  "schemas/source-registry.schema.json": sourceRegistrySchema,
  "manifest.json": manifest,
} as const;

export const rawContent = {
  manifest,
  programFamilies,
  programs,
  careers,
  sources,
  dataContracts,
  institutionCollections,
  institutions,
  offerings,
  admissions,
  metrics,
  ucProvider,
  outOfStateFixture,
  medical: {
    path: medicalPath,
    professions: medicalProfessions,
    premed,
    challenges: [bioGenetics, chemBuffers, integratedShortnessOfBreath],
  },
  journey: {
    onboarding,
    nodes: journeyNodes,
    pathProfiles,
  },
  preparation: {
    agRules,
    gpaRules,
    comprehensiveReview,
    roadmapTemplates,
    applicationMilestones,
    piq,
  },
} as const;

