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
  const familyMajorCounts = new Map(
    content.families.map((family) => [
      family.id,
      content.ucMajorCatalog.majors.filter((major) =>
        major.familyIds.includes(family.id),
      ).length,
    ]),
  );

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell">
        <p className="eyebrow">Discover</p>
        <h1>Explore the work, not just the label.</h1>
        <p>
          Choose the starting point that matches what you know today. Broad
          interests lead to the complete UC directory; detailed guides explain
          what studying selected programs is actually like.
        </p>
      </section>

      <section className="shell exploration-lanes" aria-labelledby="choose-start">
        <div className="section-heading">
          <p className="eyebrow">Three clear ways in</p>
          <h2 id="choose-start">How would you like to explore?</h2>
        </div>
        <div>
          <article>
            <span>01</span>
            <h3>I’m not sure yet</h3>
            <p>Answer a few low-pressure prompts and try one real question.</p>
            <Link href="/discover/start">Begin guided discovery →</Link>
          </article>
          <article>
            <span>02</span>
            <h3>I know a broad interest</h3>
            <p>
              Choose a gateway such as computing, health, arts, or social
              sciences and see every related UC major name.
            </p>
            <a href="#family-map">Choose an interest gateway ↓</a>
          </article>
          <article>
            <span>03</span>
            <h3>I know a major name</h3>
            <p>
              Search {content.ucMajorCatalog.counts.namedMajors} official UC
              major names across all nine undergraduate campuses.
            </p>
            <Link href="/majors">Search all UC majors →</Link>
          </article>
        </div>
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
            <p className="eyebrow">Start broad</p>
            <h2 id="family-map">{content.families.length} interest gateways</h2>
            <p>
              These are navigation categories—not majors and not a limit on
              what she can discover.
            </p>
          </div>
          <Link href="/majors">Or search all UC majors →</Link>
        </div>
        <div className="family-grid">
          {content.families.map((family, index) => (
            <article className="family-card family-card-full" key={family.id}>
              <span className="family-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{family.name}</h3>
              <p>{family.summary}</p>
              <Link
                className="family-browse-link"
                href={`/majors?family=${family.slug}`}
              >
                Browse {familyMajorCounts.get(family.id) ?? 0} related UC major
                names →
              </Link>
              {family.featuredProgramIds.length > 0 && (
                <div className="family-guide-row" aria-label="Full guides available">
                  <span>Full guides:</span>
                  {family.featuredProgramIds.map((id) => (
                    <Link
                      className="tag"
                      href={`/programs/${content.programs.find((program) => program.id === id)?.slug ?? id}`}
                      key={id}
                    >
                      {programNames.get(id) ?? id} →
                    </Link>
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
            <h2 id="detailed-programs">
              {content.programs.length} detailed program guides
            </h2>
            <p>
              These guides go beyond a catalog name into coursework, real
              assignments, possible frustrations, careers, UC offerings, and
              high-school preparation. The complete directory remains
              available even when a full guide has not been written.
            </p>
            <Link className="card-deep-link" href="/majors">
              Search the complete UC major directory →
            </Link>
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
