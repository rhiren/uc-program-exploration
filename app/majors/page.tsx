import type { Metadata } from "next";
import { MajorCatalogExplorer } from "@/components/major-catalog-explorer";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "All UC majors",
  description:
    "Search the complete official UC major-finder directory snapshot, then open detailed program guides.",
};

export default function AllMajorsPage() {
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

  const majors = content.ucMajorCatalog.majors
    .map((major) => ({
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
    }))
    .sort(
      (a, b) =>
        Number(Boolean(b.deepGuideSlug)) - Number(Boolean(a.deepGuideSlug)) ||
        a.name.localeCompare(b.name),
    );
  const families = content.families.map((family) => ({
    id: family.id,
    name: family.name,
    count: majors.filter((major) => major.familyIds.includes(family.id)).length,
  }));
  const campuses = content.institutions.map((institution) => ({
    id: institution.id,
    name: institution.name.replace("University of California, ", "UC "),
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell major-catalog-hero">
        <p className="eyebrow">Every current UC option</p>
        <h1>Start broad. Search everything. Go deep where it matters.</h1>
        <p>
          The interest gateways organize the landscape; the official directory
          keeps options from disappearing; the detailed guides explain what a
          program actually involves.
        </p>
        <div className="coverage-stats" aria-label="Catalog coverage">
          <span>
            <strong>{content.families.length}</strong> interest gateways
          </span>
          <span>
            <strong>{content.ucMajorCatalog.counts.namedMajors}</strong> named UC majors
          </span>
          <span>
            <strong>{content.ucMajorCatalog.counts.campusMajorEntries}</strong>{" "}
            campus-major entries
          </span>
          <span>
            <strong>{content.programs.length}</strong> full guides
          </span>
        </div>
      </section>
      <section className="shell">
        <MajorCatalogExplorer
          campuses={campuses}
          caveat={content.ucMajorCatalog.caveat}
          families={families}
          majors={majors}
          sourcePageUrl={content.ucMajorCatalog.sourcePageUrl}
          term={content.ucMajorCatalog.term}
        />
      </section>
    </main>
  );
}
