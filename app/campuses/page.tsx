import type { Metadata } from "next";
import { CampusExplorer } from "@/components/campus-explorer";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "UC campus explorer",
  description:
    "Compare undergraduate UC campuses by programs, setting, fit signals, and campus-wide admissions context.",
};

const campusNotes: Record<
  string,
  {
    strengths: string[];
    fitSignals: string[];
    researchQuestions: string[];
  }
> = {
  "uc-berkeley": {
    strengths: ["Large research university", "Urban Bay Area", "Broad academic menu"],
    fitSignals: [
      "She wants a very broad course catalog and a high-energy academic environment.",
      "She is comfortable researching requirements and asking for advising early.",
      "She wants strong peer density in many competitive fields.",
    ],
    researchQuestions: [
      "Which majors are direct admit, high demand, or difficult to enter later?",
      "What advising and support exist for first-year students in her intended college?",
      "How would she use the surrounding Bay Area without overloading herself?",
    ],
  },
  "uc-davis": {
    strengths: ["College town", "Life sciences", "Agriculture and environment"],
    fitSignals: [
      "She likes a campus-centered setting with strong science and community feel.",
      "She is curious about biology, health, environment, agriculture, or data-rich science.",
      "She wants room to explore without only focusing on the most urban campuses.",
    ],
    researchQuestions: [
      "Which colleges house her likely majors and how flexible are switches?",
      "What first-year research, clinic, animal, or environmental opportunities are realistic?",
      "Would the quarter pace and college-town setting feel energizing or too contained?",
    ],
  },
  "uc-irvine": {
    strengths: ["Suburban Southern California", "Health and computing", "Large major menu"],
    fitSignals: [
      "She wants a planned suburban campus with access to Orange County opportunities.",
      "She is weighing health, psychology, public health, computing, or business-adjacent paths.",
      "She wants a large UC with a more contained campus feel than Los Angeles.",
    ],
    researchQuestions: [
      "How are her intended majors housed and are any capacity constrained?",
      "What clinical, research, or internship options are accessible to undergraduates?",
      "Does the campus culture match how much structure and independence she wants?",
    ],
  },
  ucla: {
    strengths: ["Urban Los Angeles", "Very broad academics", "Large applicant pool"],
    fitSignals: [
      "She wants a large, highly visible campus with many academic and extracurricular options.",
      "She is excited by Los Angeles access and comfortable with a busy environment.",
      "She can separate campus-wide selectivity from major fit and personal fit.",
    ],
    researchQuestions: [
      "Which major choices are in different colleges or schools, and what changes are hard?",
      "What does advising look like for her likely first-year pathway?",
      "Would the scale feel exciting, stressful, or both?",
    ],
  },
  "uc-merced": {
    strengths: ["Newest UC", "Smaller setting", "Growth and access"],
    fitSignals: [
      "She wants a smaller undergraduate UC environment with room to grow into opportunities.",
      "She is open to a newer campus and wants strong access context within the UC system.",
      "She values undergraduate visibility more than famous-name pressure.",
    ],
    researchQuestions: [
      "Which programs are mature enough for her interests and which are still growing?",
      "What research, honors, or leadership opportunities could she realistically pursue?",
      "How does the setting fit her daily-life preferences?",
    ],
  },
  "uc-riverside": {
    strengths: ["Suburban Inland Southern California", "Access context", "Health pathway options"],
    fitSignals: [
      "She wants a UC with broad options and a less extreme campus-wide admit context.",
      "She is interested in science, health, engineering, business, or social mobility work.",
      "She wants to explore strong programs without assuming prestige equals fit.",
    ],
    researchQuestions: [
      "What major-specific preparation is recommended before arrival?",
      "Which health, research, or community opportunities connect with her goals?",
      "Would the location and commute/travel pattern work for the family?",
    ],
  },
  "uc-san-diego": {
    strengths: ["Coastal research university", "STEM and health", "College system"],
    fitSignals: [
      "She likes science, data, engineering, psychology, or health-adjacent pathways.",
      "She wants a major research campus with a coastal Southern California setting.",
      "She is willing to understand the residential college system before applying.",
    ],
    researchQuestions: [
      "How does the college ranking process affect general education and daily life?",
      "Which majors are capped or selective, and what alternatives are sensible?",
      "What research or clinical exposure is realistic in the first two years?",
    ],
  },
  "uc-santa-barbara": {
    strengths: ["Coastal setting", "Research university", "Science and social science breadth"],
    fitSignals: [
      "She wants a coastal campus with serious academics and a distinctive residential feel.",
      "She is weighing sciences, social sciences, math, engineering, or humanities options.",
      "She wants to compare academic fit separately from the campus setting appeal.",
    ],
    researchQuestions: [
      "Which intended majors sit in Letters and Science versus Engineering or Creative Studies?",
      "How available are undergraduate research and honors pathways?",
      "Would the social environment support her study habits?",
    ],
  },
  "uc-santa-cruz": {
    strengths: ["Coastal small city", "Residential colleges", "Interdisciplinary feel"],
    fitSignals: [
      "She likes a less conventional campus structure and wants nature close by.",
      "She is interested in computing, arts, sciences, social justice, or interdisciplinary work.",
      "She wants a UC option where environment and learning style matter in the decision.",
    ],
    researchQuestions: [
      "How does the residential college system shape advising and community?",
      "Which majors are impacted or have extra declaration requirements?",
      "Would the campus layout and location fit her daily rhythm?",
    ],
  },
};

function formatGpaRange(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const range = value as { low?: unknown; high?: unknown };
  if (typeof range.low !== "number" || typeof range.high !== "number") {
    return undefined;
  }
  return `${range.low}-${range.high}`;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

export default function CampusesPage() {
  const content = loadContent();
  const undergraduateCampuses = content.institutions.filter(
    (campus) => campus.undergraduateCampus,
  );
  const metricsByCampus = new Map(
    content.metrics.map((metric) => [metric.institutionId, metric]),
  );
  const familyNames = new Map(
    content.families.map((family) => [family.id, family.name]),
  );
  const catalogMajorCounts = new Map<string, number>();
  const catalogFamilyCounts = new Map<string, Map<string, number>>();

  for (const major of content.ucMajorCatalog.majors) {
    for (const campus of major.campuses) {
      catalogMajorCounts.set(
        campus.institutionId,
        (catalogMajorCounts.get(campus.institutionId) ?? 0) + 1,
      );
      const counts =
        catalogFamilyCounts.get(campus.institutionId) ?? new Map<string, number>();
      for (const familyId of major.familyIds) {
        counts.set(familyId, (counts.get(familyId) ?? 0) + 1);
      }
      catalogFamilyCounts.set(campus.institutionId, counts);
    }
  }

  const campuses = undergraduateCampuses.map((campus) => {
    const metric = metricsByCampus.get(campus.id);
    const guidePrograms = content.programs
      .filter((program) =>
        program.ucOfferingIds.some((offeringId) =>
          content.offerings.some(
            (offering) =>
              offering.id === offeringId && offering.institutionId === campus.id,
          ),
        ),
      )
      .map((program) => ({ name: program.name, slug: program.slug }));
    const familyCounts = catalogFamilyCounts.get(campus.id) ?? new Map<string, number>();
    const notes = campusNotes[campus.id];

    return {
      id: campus.id,
      name: campus.name,
      shortName: stringValue(campus.shortName, campus.name),
      city: campus.location.city,
      setting: stringValue(campus.setting, "unknown"),
      calendarSystem: stringValue(campus.calendarSystem, "verify"),
      officialUrl: campus.officialUrl,
      majorCount: catalogMajorCounts.get(campus.id) ?? 0,
      guideCount: guidePrograms.length,
      applicants: numberValue(metric?.applicants),
      admits: numberValue(metric?.admits),
      admitRate: numberValue(metric?.overallAdmitRatePercent),
      gpaRange: formatGpaRange(metric?.admittedUcGpaMiddle50),
      guidePrograms,
      families: Array.from(familyCounts.entries())
        .map(([id, count]) => ({ id, name: familyNames.get(id) ?? id, count }))
        .sort((a, b) => b.count - a.count),
      strengths: notes.strengths,
      fitSignals: notes.fitSignals,
      researchQuestions: notes.researchQuestions,
    };
  });

  const families = content.families.map((family) => ({
    id: family.id,
    name: family.name,
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell campus-hero">
        <p className="eyebrow">UC campus and program fit</p>
        <h1>Compare the nine undergraduate UCs without turning them into a ranking.</h1>
        <p>
          Filter campuses by academic interests, setting, and exploration lens,
          then collect better questions about majors, advising, research,
          location, and daily life.
        </p>
        <div className="coverage-stats" aria-label="UC campus explorer coverage">
          <span>
            <strong>{campuses.length}</strong> undergraduate UCs
          </span>
          <span>
            <strong>{content.ucMajorCatalog.counts.namedMajors}</strong> named majors
          </span>
          <span>
            <strong>{content.ucMajorCatalog.counts.campusMajorEntries}</strong>{" "}
            campus-major entries
          </span>
        </div>
      </section>

      <section className="shell campus-principles" aria-labelledby="campus-principles-heading">
        <div className="section-heading">
          <p className="eyebrow">How to use this with her</p>
          <h2 id="campus-principles-heading">Look for fit signals, not a verdict.</h2>
        </div>
        <div className="campus-principle-grid">
          <article>
            <span>01</span>
            <h3>Start with interests</h3>
            <p>
              Pick a subject area and see which campuses repeatedly show up,
              then ask what those programs are actually like.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Separate campus from major</h3>
            <p>
              A campus can be appealing while a specific major is constrained,
              housed in another school, or hard to enter later.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Use admit data carefully</h3>
            <p>
              Campus-wide historical rates are context, not prediction, and not
              a substitute for major-specific policy checks.
            </p>
          </article>
        </div>
      </section>

      <section className="shell">
        <CampusExplorer campuses={campuses} families={families} />
      </section>
    </main>
  );
}
