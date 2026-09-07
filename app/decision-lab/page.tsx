import type { Metadata } from "next";
import { DecisionLabWorkspace } from "@/components/decision-lab-workspace";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Major Decision Lab",
  description:
    "A six-month decision workspace for comparing UC major finalists, pre-med fit, evidence, workload, and fallback career value.",
};

export default function DecisionLabPage() {
  const content = loadContent();
  const categoryNames = new Map(
    content.ucMajorCatalog.categories.map((category) => [
      category.id,
      category.name,
    ]),
  );
  const offeringAliases = new Map<string, string>();
  content.programs.forEach((program) => {
    offeringAliases.set(program.name.toLowerCase(), program.slug);
    program.ucOfferingIds.forEach((offeringId) => {
      const offering = content.offerings.find((item) => item.id === offeringId);
      if (offering) {
        offeringAliases.set(offering.officialMajorName.toLowerCase(), program.slug);
      }
    });
  });
  const majors = content.ucMajorCatalog.majors.map((major) => ({
    id: major.id,
    name: major.name,
    categoryName: major.categoryIds
      .map((categoryId) => categoryNames.get(categoryId) ?? "Other")
      .join(" · "),
    familyIds: major.familyIds,
    emphases: major.emphases,
    deepGuideSlug: offeringAliases.get(major.name.toLowerCase()),
    campuses: major.campuses.map((campus) => ({
      institutionId: campus.institutionId,
      name: campus.name,
      officialCatalogUrl: campus.officialCatalogUrl,
    })),
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell decision-hero">
        <p className="eyebrow">Major Decision Lab</p>
        <h1>Make the next six months produce a real undergraduate major decision.</h1>
        <p>
          Compare finalists with evidence: interest, grades, pre-med feasibility,
          fallback career value, workload, UC availability, and the experiments
          she still needs before choosing.
        </p>
      </section>
      <DecisionLabWorkspace majors={majors} />
    </main>
  );
}
