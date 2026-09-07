import type { Metadata } from "next";
import { PremedMajorStrategy } from "@/components/premed-major-strategy";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Pre-med major strategy",
  description:
    "Concrete guidance for choosing an undergraduate major that can support pre-med while preserving strong non-medical options.",
};

export default function PremedPage() {
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
  const campuses = content.ucMajorCatalog.campuses.map((campus) => ({
    id: campus.institutionId,
    name: campus.name,
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell premed-hero">
        <p className="eyebrow">Pre-med, without tunnel vision</p>
        <h1>Choose a major that keeps medicine possible and the fallback strong.</h1>
        <p>
          This page turns pre-med into a planning conversation: what she enjoys,
          what she can perform well in, which requirements need mapping, and
          what remains valuable if she later chooses a different path.
        </p>
      </section>
      <PremedMajorStrategy campuses={campuses} majors={majors} />
    </main>
  );
}
