import type { Metadata } from "next";
import { PathFitWorkspace } from "@/components/path-fit-workspace";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Path fit snapshot",
  description:
    "Connect academic preparation, UC interests, and campus exploration into a short next-step guide.",
};

function numberValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export default function PathFitPage() {
  const content = loadContent();
  const metricsByCampus = new Map(
    content.metrics.map((metric) => [metric.institutionId, metric]),
  );
  const familyCountsByCampus = new Map<string, Map<string, number>>();

  for (const major of content.ucMajorCatalog.majors) {
    for (const campus of major.campuses) {
      const counts =
        familyCountsByCampus.get(campus.institutionId) ?? new Map<string, number>();
      for (const familyId of major.familyIds) {
        counts.set(familyId, (counts.get(familyId) ?? 0) + 1);
      }
      familyCountsByCampus.set(campus.institutionId, counts);
    }
  }

  const campuses = content.institutions
    .filter((campus) => campus.undergraduateCampus)
    .map((campus) => ({
      id: campus.id,
      name: campus.name,
      shortName:
        typeof campus.shortName === "string" ? campus.shortName : campus.name,
      admitRate: numberValue(
        metricsByCampus.get(campus.id)?.overallAdmitRatePercent,
      ),
      topFamilyIds: Array.from(
        familyCountsByCampus.get(campus.id)?.entries() ?? [],
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([familyId]) => familyId),
    }));

  const families = content.families.map((family) => ({
    id: family.id,
    name: family.name,
    summary: family.summary,
  }));

  const programs = content.programs.map((program) => ({
    id: program.id,
    name: program.name,
    slug: program.slug,
    familyIds: program.familyIds,
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell path-fit-hero">
        <p className="eyebrow">Preparation meets exploration</p>
        <h1>Build a path fit snapshot from courses, interests, and UC campuses.</h1>
        <p>
          Choose a few interest areas and campuses, then compare them with the
          course inventory from Prepare. The result is a short set of questions
          to research next, not a prediction.
        </p>
      </section>
      <PathFitWorkspace campuses={campuses} families={families} programs={programs} />
    </main>
  );
}
