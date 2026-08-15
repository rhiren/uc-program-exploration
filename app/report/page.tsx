import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { UcPrepDashboard } from "@/components/uc-prep-dashboard";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "UC prep report",
  description:
    "A combined UC preparation dashboard for academics, path fit, activities, and next actions.",
};

function numberValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export default function ReportPage() {
  const content = loadContent();
  const metricsByCampus = new Map(
    content.metrics.map((metric) => [metric.institutionId, metric]),
  );
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
    }));
  const families = content.families.map((family) => ({
    id: family.id,
    name: family.name,
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
      <section className="page-hero shell report-hero">
        <p className="eyebrow">UC prep report</p>
        <h1>Review the whole picture before choosing the next step.</h1>
        <p>
          Pull together course readiness, activity depth, campus questions, and
          path-fit signals into one family planning dashboard. It is a review
          tool, not an admission prediction.
        </p>
      </section>
      <UcPrepDashboard
        agRules={content.preparation.agRules}
        campuses={campuses}
        families={families}
        gpaRules={content.preparation.gpaRules}
        programs={programs}
        roadmapTemplates={content.preparation.roadmapTemplates.templates}
      />
    </main>
  );
}
