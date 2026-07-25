import type { Metadata } from "next";
import { ComparisonWorkspace } from "@/components/comparison-workspace";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = { title: "Compare paths" };

function join(items: string[]) {
  return items.join(" · ");
}

function pay(value: number | null) {
  return value === null
    ? "Not published"
    : `$${new Intl.NumberFormat("en-US").format(value)} national median`;
}

export default function ComparePage() {
  const content = loadContent();
  const offeringCount = new Map<string, number>();
  content.offerings.forEach((offering) =>
    offeringCount.set(
      offering.canonicalProgramId,
      (offeringCount.get(offering.canonicalProgramId) ?? 0) + 1,
    ),
  );

  const programs = content.programs.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    kind: "program" as const,
    rows: [
      { label: "Core questions", value: join(item.coreQuestions) },
      { label: "Typical work", value: join(item.typicalWork) },
      { label: "Representative courses", value: join(item.representativeCourses) },
      {
        label: "Work balance",
        value: `Math ${item.intensities.mathematics}/5 · Coding ${item.intensities.coding}/5 · Lab ${item.intensities.laboratory}/5 · Writing ${item.intensities.writing}/5`,
      },
      { label: "Coding reality", value: item.codingReality },
      {
        label: "Premed fit",
        value: item.premedCompatibility.note,
      },
      {
        label: "UC options verified",
        value: `${offeringCount.get(item.id) ?? 0} official campus major options in this catalog`,
      },
      { label: "Possible frustrations", value: join(item.frustrating) },
    ],
  }));

  const careers = content.careers.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    kind: "career" as const,
    rows: [
      { label: "Typical week", value: join(item.typicalWeek) },
      { label: "Education path", value: item.educationPath },
      {
        label: "Work balance",
        value: `Quantitative ${item.intensities.quantitative}/5 · Coding ${item.intensities.coding}/5 · People ${item.intensities.peopleInteraction}/5 · Emotional load ${item.intensities.emotionalLoad}/5`,
      },
      {
        label: `Median pay (${item.laborData.baseYear})`,
        value: pay(item.laborData.medianAnnualUsd),
      },
      {
        label: `Employment outlook (${item.laborData.baseYear}–${item.laborData.projectionEndYear})`,
        value:
          item.laborData.growthPercent === null
            ? "Not published for this occupation"
            : `${item.laborData.growthPercent}% projected national change`,
      },
      {
        label: "AI may augment",
        value: join(item.aiImpact.augmentedTasks),
      },
      {
        label: "Deeply human work",
        value: join(item.aiImpact.humanCenter),
      },
      {
        label: "Data caveat",
        value:
          item.laborData.limitation ??
          "Direct national occupation data; individual outcomes vary.",
      },
    ],
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell">
        <p className="eyebrow">Compare paths</p>
        <h1>Put the real tradeoffs side by side.</h1>
        <p>
          Compare programs with programs and careers with careers. The goal is
          not a winner—it is better questions for the next experiment.
        </p>
      </section>
      <section className="shell">
        <ComparisonWorkspace careers={careers} programs={programs} />
      </section>
    </main>
  );
}
