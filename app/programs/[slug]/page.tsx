import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExplorerItemActions } from "@/components/explorer-item-actions";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

const intensityLabels: Record<string, string> = {
  mathematics: "Mathematics",
  coding: "Coding",
  laboratory: "Laboratory",
  writing: "Writing",
  memorization: "Memorization",
  abstractTheory: "Abstract theory",
  teamwork: "Teamwork",
  peopleInteraction: "People interaction",
};

const preparationLabels: Record<string, string> = {
  uc_eligibility_requirement: "UC eligibility",
  recommended_academic_preparation: "Helpful academic preparation",
  optional_exploration: "Low-pressure exploration",
  verify_with_counselor_or_institution: "Verify before planning",
};

const premedLabels: Record<string, string> = {
  high: "High overlap",
  possible_with_planning: "Possible with planning",
  possible_but_demanding: "Possible, but demanding",
  possible_with_substantial_planning: "Possible with substantial planning",
};

export function generateStaticParams() {
  return loadContent().programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = loadContent().programs.find((item) => item.slug === slug);
  return { title: program ? `${program.name} guide` : "Program not found" };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = loadContent();
  const program = content.programs.find((item) => item.slug === slug);
  if (!program) notFound();

  const programs = new Map(content.programs.map((item) => [item.id, item]));
  const careers = new Map(content.careers.map((item) => [item.id, item]));
  const institutions = new Map(
    content.institutions.map((item) => [item.id, item]),
  );
  const sources = new Map(content.sources.map((item) => [item.id, item]));
  const offerings = program.ucOfferingIds
    .map((id) => content.offerings.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <main>
      <SiteHeader />
      <section className="detail-hero shell">
        <div>
          <Link className="breadcrumb" href="/discover">
            ← All programs
          </Link>
          <p className="eyebrow">Undergraduate program guide</p>
          <h1>{program.name}</h1>
          <p className="detail-lede">{program.summary}</p>
        </div>
        <aside className="detail-action-card">
          <p className="card-label">Keep exploring</p>
          <p>
            Saving means “worth another look.” Comparing places up to three
            programs side by side.
          </p>
          <ExplorerItemActions id={program.id} type="program" />
        </aside>
      </section>

      <section className="shell detail-section detail-grid">
        <article className="feature-panel">
          <p className="eyebrow">Questions you would investigate</p>
          <h2>What this field tries to understand</h2>
          <ul className="large-list">
            {program.coreQuestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="feature-panel panel-coral">
          <p className="eyebrow">The honest texture</p>
          <h2>What studying it can feel like</h2>
          <div className="two-column-lists">
            <div>
              <h3>Often rewarding</h3>
              <ul>{program.rewarding.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Can be frustrating</h3>
              <ul>{program.frustrating.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </article>
      </section>

      <section className="detail-band">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">Inside the major</p>
            <h2>The work behind the label</h2>
          </div>
          <div className="three-panel-grid">
            <article className="plain-panel">
              <h3>Typical work</h3>
              <ul>{program.typicalWork.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="plain-panel">
              <h3>Representative courses</h3>
              <ul>{program.representativeCourses.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="plain-panel">
              <h3>Common assignments</h3>
              <ul>{program.commonAssignments.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
          <div className="intensity-layout">
            <article>
              <p className="eyebrow">Relative emphasis · 1–5</p>
              <h2>How the work is balanced</h2>
              <p>
                These are orientation clues, not universal course requirements.
                The exact mix varies by campus and specialization.
              </p>
            </article>
            <div className="intensity-list">
              {Object.entries(program.intensities).map(([key, value]) => (
                <div className="intensity-row" key={key}>
                  <span>{intensityLabels[key] ?? key}</span>
                  <div aria-label={`${value} out of 5`} className="intensity-track">
                    <span style={{ width: `${value * 20}%` }} />
                  </div>
                  <strong>{value}/5</strong>
                </div>
              ))}
            </div>
          </div>
          <article className="coding-callout">
            <p className="eyebrow">How technology fits</p>
            <h2>Coding is one tool—not the whole identity.</h2>
            <p>{program.codingReality}</p>
          </article>
        </div>
      </section>

      <section className="shell detail-section">
        <div className="section-heading">
          <p className="eyebrow">Fit clues</p>
          <h2>You may enjoy this if…</h2>
        </div>
        <div className="clue-grid">
          {program.mayEnjoy.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
        {program.tryNow.map((activity) => (
          <article className="try-card" key={activity.id}>
            <div>
              <p className="eyebrow">Try the thinking · {activity.minutes} minutes</p>
              <h2>{activity.title}</h2>
              <p>
                Use this as a reflection sample: notice which parts make you
                curious, impatient, or eager to ask another question.
              </p>
            </div>
            <Link className="button button-primary" href="/discover/start">
              Try a guided sample →
            </Link>
          </article>
        ))}
      </section>

      <section className="preparation-band">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">Grades 11–12</p>
            <h2>Prepare without turning high school into a checklist.</h2>
          </div>
          <div className="preparation-grid">
            {program.highSchoolPreparation.map((item) => (
              <article key={item.label}>
                <p className="card-label">
                  {preparationLabels[item.label] ?? item.label}
                </p>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <article className="premed-note">
            <div>
              <p className="eyebrow">Premed compatibility</p>
              <h2>{premedLabels[program.premedCompatibility.level]}</h2>
            </div>
            <p>{program.premedCompatibility.note}</p>
            <Link href="/medical">Understand the full medical path →</Link>
          </article>
        </div>
      </section>

      <section className="shell detail-section" id="uc-offerings">
        <div className="section-heading">
          <p className="eyebrow">Verified UC connections</p>
          <h2>Where this appears across the UC system</h2>
          <p>
            Official names differ by campus. These links show the catalog
            options we verified; they are not rankings or admission odds.
          </p>
        </div>
        <div className="offering-grid">
          {offerings.map((offering) => {
            const institution = institutions.get(offering.institutionId);
            return (
              <article className="offering-card" key={offering.id}>
                <p className="card-label">
                  {institution?.name.replace("University of California, ", "UC ") ??
                    offering.institutionId}
                </p>
                <h3>
                  {offering.officialMajorName} ({offering.degreeType})
                </h3>
                <p>{offering.schoolOrCollege}</p>
                <dl>
                  <div>
                    <dt>First-year option</dt>
                    <dd>{offering.firstYearAvailable ? "Yes" : "Not listed"}</dd>
                  </div>
                  <div>
                    <dt>Capacity status</dt>
                    <dd>{offering.capacityStatus.replaceAll("_", " ")}</dd>
                  </div>
                </dl>
                <p className="offering-note">{offering.selectivityNote}</p>
                <a href={offering.officialUrl} rel="noreferrer" target="_blank">
                  Verify in official catalog ↗
                </a>
                <small>
                  {offering.effectiveTerm} · Next review {offering.nextReviewDue}
                </small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="related-band">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">Where it can lead</p>
            <h2>Explore careers and nearby programs</h2>
          </div>
          <div className="related-columns">
            <div>
              <h3>Related careers</h3>
              <div className="related-link-grid">
                {program.careerIds.map((id) => {
                  const career = careers.get(id);
                  return career ? (
                    <Link href={`/careers/${career.slug}`} key={id}>
                      <strong>{career.name}</strong>
                      <span>{career.summary}</span>
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
            <div>
              <h3>Adjacent programs</h3>
              <div className="related-link-grid">
                {program.adjacentProgramIds.map((id) => {
                  const adjacent = programs.get(id);
                  return adjacent ? (
                    <Link href={`/programs/${adjacent.slug}`} key={id}>
                      <strong>{adjacent.name}</strong>
                      <span>{adjacent.summary}</span>
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell source-footer">
        <details>
          <summary>Sources and freshness</summary>
          <p>
            Program guide verified {program.lastVerified}; scheduled for review{" "}
            {program.nextReviewDue}.
          </p>
          <ul>
            {program.sourceIds.map((id) => {
              const source = sources.get(id);
              return source ? (
                <li key={id}>
                  <a href={source.url} rel="noreferrer" target="_blank">
                    {source.title} — {source.publisher}
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </details>
      </section>
    </main>
  );
}
