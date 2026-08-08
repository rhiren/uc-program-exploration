import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export default function Home() {
  const content = loadContent();
  const featuredFamilies = content.families.slice(0, 6);

  return (
    <main>
      <SiteHeader />

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">A calm field guide for what comes next</p>
          <h1>Find paths worth exploring—and a thoughtful way to prepare.</h1>
          <p className="hero-lede">
            Learn what different majors and careers actually involve, try short
            activities, and shape an 11th–12th grade UC plan without turning
            your future into a test.
          </p>
          <div className="hero-actions" aria-label="Choose where to begin">
            <Link className="button button-primary" href="/discover/start">
              Start with Discover <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-secondary" href="/campuses">
              Compare UC campuses
            </Link>
            <Link className="button button-secondary" href="/prepare">
              Start with Prepare
            </Link>
          </div>
          <p className="privacy-note">
            No account required. Your progress stays on this device.
          </p>
        </div>

        <aside className="hero-guide" aria-label="How the explorer works">
          <div className="guide-orbit guide-orbit-one" />
          <div className="guide-orbit guide-orbit-two" />
          <p className="guide-kicker">Two paths, one picture</p>
          <ol className="guide-list">
            <li>
              <span>01</span>
              <div>
                <strong>Notice what holds your attention</strong>
                <p>Short questions and real examples—not a personality test.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Understand the work behind a title</strong>
                <p>Coursework, coding, training, tradeoffs, and future change.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Choose one useful next step</strong>
                <p>Explore, verify, or prepare—never an endless checklist.</p>
              </div>
            </li>
          </ol>
        </aside>
      </section>

      <section className="orientation shell" aria-labelledby="ways-heading">
        <div className="section-heading">
          <p className="eyebrow">Begin anywhere</p>
          <h2 id="ways-heading">Three equally useful ways in</h2>
          <p>You can switch between them whenever you want.</p>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card pillar-discover">
            <p className="card-label">Discover</p>
            <h3>What might fit the way I like to think?</h3>
            <p>
              Explore majors and careers through problems, evidence, and honest
              descriptions of the day-to-day work.
            </p>
            <ul className="clean-list">
              <li>Technology paths beyond full-time programming</li>
              <li>Math + biology combinations</li>
              <li>Medicine and adjacent health careers</li>
            </ul>
            <Link href="/discover">Explore possibilities →</Link>
          </article>
          <article className="pillar-card pillar-prepare">
            <p className="card-label">Prepare</p>
            <h3>What should I do during 11th and 12th grade?</h3>
            <p>
              Understand UC requirements, review your courses in context, and
              build a realistic plan to discuss with your counselor.
            </p>
            <ul className="clean-list">
              <li>A–G and UC GPA guidance</li>
              <li>Course and experience planning</li>
              <li>Campus-major portfolio</li>
            </ul>
            <Link href="/prepare">See the preparation path →</Link>
          </article>
          <article className="pillar-card pillar-campus">
            <p className="card-label">Campuses</p>
            <h3>Which UC environments and programs should I inspect?</h3>
            <p>
              Compare the nine undergraduate UCs by interests, setting, program
              signals, and questions worth researching before building a list.
            </p>
            <ul className="clean-list">
              <li>Campus setting and academic breadth</li>
              <li>Program signals from the UC major catalog</li>
              <li>Research questions instead of rankings</li>
            </ul>
            <Link href="/campuses">Compare UC campuses →</Link>
          </article>
        </div>
      </section>

      <section className="family-section shell" aria-labelledby="families-heading">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">A wider map</p>
            <h2 id="families-heading">Start with a family, not a final answer</h2>
          </div>
          <Link href="/discover">See all {content.families.length} families</Link>
        </div>
        <div className="family-strip">
          {featuredFamilies.map((family, index) => (
            <article className="family-card" key={family.id}>
              <span className="family-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{family.name}</h3>
              <p>{family.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-band">
        <div className="shell trust-grid">
          <div>
            <p className="eyebrow">Built to stay honest</p>
            <h2>Exploration, not prediction.</h2>
          </div>
          <p>
            The explorer uses sourced information and explains uncertainty. It
            will not calculate an admission probability or decide whether a
            student is “suited” to medicine—or any other path.
          </p>
          <div className="content-stamp">
            <strong>Content {content.contentVersion}</strong>
            <span>
              {content.sources.length} sources · {content.institutions.length} UC
              campuses
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
