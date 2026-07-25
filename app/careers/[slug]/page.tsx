import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExplorerItemActions } from "@/components/explorer-item-actions";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

const intensityLabels: Record<string, string> = {
  quantitative: "Quantitative work",
  coding: "Coding",
  writing: "Writing",
  laboratory: "Laboratory",
  peopleInteraction: "People interaction",
  emotionalLoad: "Emotional load",
};

function currency(value: number | null) {
  return value === null
    ? "Not published"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
}

export function generateStaticParams() {
  return loadContent().careers.map((career) => ({ slug: career.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const career = loadContent().careers.find((item) => item.slug === slug);
  return { title: career ? `${career.name} career guide` : "Career not found" };
}

export default async function CareerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = loadContent();
  const career = content.careers.find((item) => item.slug === slug);
  if (!career) notFound();

  const programs = new Map(content.programs.map((item) => [item.id, item]));
  const careers = new Map(content.careers.map((item) => [item.id, item]));
  const sources = new Map(content.sources.map((item) => [item.id, item]));
  const labor = career.laborData;

  return (
    <main>
      <SiteHeader />
      <section className="detail-hero shell">
        <div>
          <Link className="breadcrumb" href="/discover#careers">
            ← All careers
          </Link>
          <p className="eyebrow">Career reality guide</p>
          <h1>{career.name}</h1>
          <p className="detail-lede">{career.summary}</p>
        </div>
        <aside className="detail-action-card">
          <p className="card-label">Keep exploring</p>
          <p>
            Save careers that spark questions, then compare the actual work,
            training, outlook, and human role.
          </p>
          <ExplorerItemActions id={career.id} type="career" />
        </aside>
      </section>

      <section className="career-snapshot">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">A more concrete picture</p>
            <h2>What the work can look like</h2>
          </div>
          <div className="three-panel-grid">
            <article className="plain-panel">
              <h3>A typical week may include</h3>
              <ul>{career.typicalWeek.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="plain-panel">
              <h3>Work environments</h3>
              <ul>{career.workEnvironment.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="plain-panel education-panel">
              <h3>Education and training</h3>
              <p>{career.educationPath}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="shell detail-section intensity-layout">
        <article>
          <p className="eyebrow">Relative emphasis · 1–5</p>
          <h2>What the role asks from you</h2>
          <p>
            These are broad orientation clues. A role can feel very different
            across employers, specialties, and stages of a career.
          </p>
        </article>
        <div className="intensity-list">
          {Object.entries(career.intensities).map(([key, value]) => (
            <div className="intensity-row" key={key}>
              <span>{intensityLabels[key] ?? key}</span>
              <div aria-label={`${value} out of 5`} className="intensity-track">
                <span style={{ width: `${value * 20}%` }} />
              </div>
              <strong>{value}/5</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="outlook-band">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">U.S. labor outlook</p>
            <h2>A dated baseline—not a promise</h2>
            <p>
              These national figures help with orientation. They do not predict
              a student’s salary, local market, or outcome years from now.
            </p>
          </div>
          <div className="outlook-grid">
            <article>
              <span>Median annual pay · {labor.baseYear}</span>
              <strong>
                {labor.medianQualifier === "at_least" && labor.medianAnnualUsd
                  ? "At least "
                  : ""}
                {currency(labor.medianAnnualUsd)}
              </strong>
            </article>
            <article>
              <span>
                Projected employment change · {labor.baseYear}–
                {labor.projectionEndYear}
              </span>
              <strong>
                {labor.growthPercent === null
                  ? "Not published"
                  : `${labor.growthPercent}%`}
              </strong>
            </article>
            <article>
              <span>Typical entry education</span>
              <strong>{labor.typicalEntryEducation}</strong>
            </article>
          </div>
          {(labor.isProxy || labor.limitation) && (
            <div className="data-caveat">
              <strong>{labor.isProxy ? "Proxy occupation used." : "Data limitation."}</strong>{" "}
              {labor.limitation}
            </div>
          )}
        </div>
      </section>

      <section className="shell detail-section">
        <div className="section-heading">
          <p className="eyebrow">AI and the next 5–6 years</p>
          <h2>Look at tasks, not “job replaced” headlines.</h2>
          <p>
            This is a directional interpretation with {career.aiImpact.confidence}{" "}
            confidence, not a forecast of exact job counts.
          </p>
        </div>
        <div className="ai-grid">
          <article>
            <span className="ai-number">01</span>
            <h3>Routine tasks AI may absorb</h3>
            <ul>{career.aiImpact.routineTasks.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <span className="ai-number">02</span>
            <h3>Work AI may augment</h3>
            <ul>{career.aiImpact.augmentedTasks.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="human-panel">
            <span className="ai-number">03</span>
            <h3>What remains deeply human</h3>
            <ul>{career.aiImpact.humanCenter.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
        <article className="try-card">
          <div>
            <p className="eyebrow">Try the work before choosing the label</p>
            <h2>A low-pressure career experiment</h2>
            <p>{career.tryNow}</p>
          </div>
          <Link className="button button-secondary" href="/explore">
            Save an exploration note →
          </Link>
        </article>
      </section>

      <section className="related-band">
        <div className="shell detail-section">
          <div className="section-heading">
            <p className="eyebrow">Multiple ways in</p>
            <h2>Related undergraduate programs</h2>
            <p>
              Careers rarely map to exactly one major. Open several routes and
              compare the undergraduate experience, not just the destination.
            </p>
          </div>
          <div className="related-link-grid wide-links">
            {career.relatedProgramIds.map((id) => {
              const program = programs.get(id);
              return program ? (
                <Link href={`/programs/${program.slug}`} key={id}>
                  <strong>{program.name}</strong>
                  <span>{program.summary}</span>
                </Link>
              ) : null;
            })}
          </div>
          <div className="adjacent-careers">
            <h3>Nearby careers worth opening</h3>
            <div className="tag-row">
              {career.adjacentCareerIds.map((id) => {
                const adjacent = careers.get(id);
                return adjacent ? (
                  <Link className="tag" href={`/careers/${adjacent.slug}`} key={id}>
                    {adjacent.name} →
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="shell source-footer">
        <details>
          <summary>Sources, proxies, and freshness</summary>
          <p>
            Career guide verified {career.lastVerified}; scheduled for review{" "}
            {career.nextReviewDue}. Labor baseline covers {labor.geography}.
          </p>
          <ul>
            {[...new Set([...career.sourceIds, ...labor.sourceIds])].map((id) => {
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
