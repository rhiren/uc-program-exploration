import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "A calm first-session guide for using UC Pathways Explorer to choose what to test next.",
};

const handoffSteps = [
  {
    label: "First 20 minutes",
    title: "Get oriented without choosing yet",
    body:
      "Start with the idea that this is a decision workbook. The goal is not to pick a career today; it is to decide what evidence she needs next.",
    href: "/discover",
    cta: "Explore interests",
  },
  {
    label: "Same session",
    title: "Check the academic baseline",
    body:
      "Enter current and planned courses, then use the preparation page to see what is strong, what needs counselor verification, and where 12th grade choices matter.",
    href: "/prepare",
    cta: "Review academics",
  },
  {
    label: "This week",
    title: "Build a short major list",
    body:
      "Add realistic UC majors that could support medicine, health, data, biology, public health, or another valuable direction she respects.",
    href: "/premed",
    cta: "Build pre-med shortlist",
  },
  {
    label: "Next 6 months",
    title: "Test finalists in the Decision Lab",
    body:
      "Score only what she has evidence for. Use the campus fit, pre-med requirement map, and evidence notes to decide what to investigate.",
    href: "/decision-lab",
    cta: "Open Decision Lab",
  },
  {
    label: "Every month",
    title: "Leave with three next actions",
    body:
      "Use the report and Decision Lab action plan to choose a small set of concrete experiments, conversations, and course-plan checks.",
    href: "/report",
    cta: "Open full report",
  },
];

export default function StartHerePage() {
  const content = loadContent();

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell start-hero">
        <p className="eyebrow">Start Here</p>
        <h1>You are not choosing your whole life today.</h1>
        <p>
          Use this as a calm decision lab for 11th grade: understand the UC
          baseline, compare majors that keep medicine possible, and test which
          paths still feel worthwhile when the real coursework and tradeoffs show
          up.
        </p>
        <div className="hero-actions" aria-label="Primary start actions">
          <Link className="button button-primary" href="/decision-lab">
            Open Decision Lab <span aria-hidden="true">→</span>
          </Link>
          <Link className="button button-secondary" href="/prepare">
            Review academics
          </Link>
        </div>
      </section>

      <section className="shell start-reassurance" aria-label="How to think about the tool">
        <article>
          <span>01</span>
          <h2>Evidence beats pressure.</h2>
          <p>
            A preference is allowed to be early. The useful question is: what
            would make this option more real?
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Pre-med is a layer, not a major.</h2>
          <p>
            She can choose a major that fits her strengths while separately
            planning the courses and experiences medical schools expect.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>The fallback matters.</h2>
          <p>
            A good major should still create a future she can respect if her
            interests move away from medicine.
          </p>
        </article>
      </section>

      <section className="shell content-section start-plan" aria-labelledby="start-plan-heading">
        <div className="section-heading">
          <p className="eyebrow">First handoff session</p>
          <h2 id="start-plan-heading">A practical order that will not overwhelm her</h2>
          <p>
            Start with the first two steps together. Then let the Decision Lab
            become the place where she records what she learns.
          </p>
        </div>
        <div className="start-step-list">
          {handoffSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="card-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <Link href={step.href}>{step.cta} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-band">
        <div className="shell trust-grid">
          <div>
            <p className="eyebrow">Parent note</p>
            <h2>How to explain it to her.</h2>
          </div>
          <p>
            This tool is here to help you make a thoughtful choice, not to trap
            you in one path. We are going to compare options, test the work, and
            make sure any pre-med plan still leaves you with a strong
            undergraduate major.
          </p>
          <div className="content-stamp">
            <strong>{content.ucMajorCatalog.majors.length} UC majors</strong>
            <span>{content.institutions.length} undergraduate UC campuses</span>
          </div>
        </div>
      </section>
    </main>
  );
}
