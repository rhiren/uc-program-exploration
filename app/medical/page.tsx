import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Explore medicine",
};

export default function MedicalPage() {
  const content = loadContent();
  const { path, premed, challenges } = content.medical;

  return (
    <main>
      <SiteHeader />
      <section className="page-hero medical-hero shell">
        <p className="eyebrow">Medicine, explored honestly</p>
        <h1>Look beyond the white coat.</h1>
        <p>
          Understand the training years, the learning, the responsibility, and
          the many ways biology and health can become a career.
        </p>
      </section>

      <section className="premed-callout shell">
        <p className="card-label">First, one important distinction</p>
        <h2>{premed.coreMessage}</h2>
        <p>
          A student may choose a science or non-science major. Medical-school
          prerequisites vary, so undergraduate major choice and premedical
          preparation should be planned separately.
        </p>
      </section>

      <section className="shell content-section" aria-labelledby="training-path">
        <div className="section-heading">
          <p className="eyebrow">The full path</p>
          <h2 id="training-path">{path.title}</h2>
          <p>
            The familiar “four years of medical school” is only one stage in a
            longer path.
          </p>
        </div>
        <ol className="timeline">
          {path.stages.map((stage, index) => (
            <li key={stage.id}>
              <span className="timeline-marker">{index + 1}</span>
              <div>
                <div className="timeline-heading">
                  <h3>{stage.title}</h3>
                  {"typicalYears" in stage && stage.typicalYears ? (
                    <span>{stage.typicalYears} years</span>
                  ) : "typicalYearsRange" in stage &&
                    Array.isArray(stage.typicalYearsRange) ? (
                    <span>{stage.typicalYearsRange.join("–")} years</span>
                  ) : null}
                </div>
                <p>{stage.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="challenge-section">
        <div className="shell content-section">
          <div className="section-heading">
            <p className="eyebrow">Try the underlying thinking</p>
            <h2>Three short, low-pressure challenges</h2>
            <p>
              Correctness will eventually adjust difficulty. Your reflection—not
              a score—helps you notice what feels interesting.
            </p>
          </div>
          <div className="challenge-grid">
            {challenges.map((challenge, index) => (
              <article key={challenge.id}>
                <span className="challenge-time">
                  {challenge.defaultMinutes} min
                </span>
                <p className="card-label">Challenge {index + 1}</p>
                <h3>{challenge.title}</h3>
                <p>{challenge.learningGoals[0]}</p>
                <span className="status-chip">Interactive version coming next</span>
              </article>
            ))}
          </div>
          <p className="source-note">
            These are fictional educational activities—not diagnoses, aptitude
            tests, or medical recommendations.
          </p>
        </div>
      </section>

      <section className="shell next-invitation">
        <div>
          <p className="eyebrow">Keep the map open</p>
          <h2>Medicine is one path among many.</h2>
          <p>
            Compare clinical work with public health, bioengineering, data,
            research, policy, and other health professions.
          </p>
        </div>
        <Link className="button button-primary" href="/discover">
          Return to all programs →
        </Link>
      </section>
    </main>
  );
}
