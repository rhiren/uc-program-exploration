import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Discover programs",
};

export default function DiscoverPage() {
  const content = loadContent();
  const programNames = new Map(
    content.programs.map((program) => [program.id, program.name]),
  );

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell">
        <p className="eyebrow">Discover</p>
        <h1>Explore the work, not just the label.</h1>
        <p>
          Begin with a broad family or examine one of the detailed programs.
          Nothing here is a commitment, and you can browse without using your
          answers.
        </p>
      </section>

      <section className="shell journey-invitation" aria-labelledby="guided-discovery">
        <div>
          <p className="eyebrow">A gentle 6–8 minute start</p>
          <h2 id="guided-discovery">Try one real question before choosing a path.</h2>
          <p>
            Answer four lightweight prompts, trace a short genetics mechanism,
            and meet three different programs. It is an exploration—not a
            personality or aptitude test.
          </p>
        </div>
        <div>
          <Link className="button button-primary" href="/discover/start">
            Begin guided discovery →
          </Link>
          <span>No account · saves on this device</span>
        </div>
      </section>

      <section className="shell content-section" aria-labelledby="family-map">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">The full map</p>
            <h2 id="family-map">Twelve program families</h2>
          </div>
          <span className="section-note">Choose what feels curious today</span>
        </div>
        <div className="family-grid">
          {content.families.map((family, index) => (
            <article className="family-card family-card-full" key={family.id}>
              <span className="family-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{family.name}</h3>
              <p>{family.summary}</p>
              {family.featuredProgramIds.length > 0 && (
                <div className="tag-row" aria-label="Detailed programs available">
                  {family.featuredProgramIds.map((id) => (
                    <span className="tag" key={id}>
                      {programNames.get(id) ?? id}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="program-band">
        <div className="shell content-section" aria-labelledby="detailed-programs">
          <div className="section-heading">
            <p className="eyebrow">Look closer</p>
            <h2 id="detailed-programs">Eight detailed starting points</h2>
            <p>
              These are the first complete guides. More programs can be added
              without changing the site architecture.
            </p>
          </div>
          <div className="program-grid">
            {content.programs.map((program) => (
              <article className="program-card" key={program.id}>
                <div className="program-card-top">
                  <h3>
                    <Link href={`/programs/${program.slug}`}>{program.name}</Link>
                  </h3>
                  <span>
                    Coding use: {program.intensities.coding ?? "varies"}/5
                  </span>
                </div>
                <p>{program.summary}</p>
                <details>
                  <summary>What studying {program.name} is really like</summary>
                  <div className="program-details">
                    <h4>Typical work</h4>
                    <ul>
                      {program.typicalWork.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <h4>How coding fits</h4>
                    <p>{program.codingReality}</p>
                  </div>
                </details>
                <Link className="card-deep-link" href={`/programs/${program.slug}`}>
                  Open the full program guide →
                </Link>
              </article>
            ))}
          </div>
          <div className="next-invitation">
            <div>
              <p className="eyebrow">Considering medicine?</p>
              <h2>See what “premed” actually means.</h2>
            </div>
            <Link className="button button-primary" href="/medical">
              Explore the medical path →
            </Link>
          </div>
        </div>
      </section>

      <section className="shell content-section" id="careers" aria-labelledby="career-map">
        <div className="section-heading">
          <p className="eyebrow">Look beyond the major</p>
          <h2 id="career-map">Thirteen career realities</h2>
          <p>
            See a typical week, education path, national labor baseline, and
            which tasks AI may absorb, augment, or leave deeply human.
          </p>
        </div>
        <div className="career-card-grid">
          {content.careers.map((career) => (
            <Link className="career-card" href={`/careers/${career.slug}`} key={career.id}>
              <span>
                People {career.intensities.peopleInteraction}/5 · Coding{" "}
                {career.intensities.coding}/5
              </span>
              <h3>{career.name}</h3>
              <p>{career.summary}</p>
              <strong>Open career reality →</strong>
            </Link>
          ))}
        </div>
        <div className="next-invitation">
          <div>
            <p className="eyebrow">Ready to organize?</p>
            <h2>Save possibilities without choosing one yet.</h2>
          </div>
          <Link className="button button-primary" href="/explore">
            Open My paths →
          </Link>
        </div>
      </section>
    </main>
  );
}
