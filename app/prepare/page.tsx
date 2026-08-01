import type { Metadata } from "next";
import { PrepareWorkspace } from "@/components/prepare-workspace";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Prepare for UC",
};

export default function PreparePage() {
  const content = loadContent();
  const agRules = content.preparation.agRules;
  const gpaRules = content.preparation.gpaRules;
  const review = content.preparation.comprehensiveReview;
  const roadmapTemplates = content.preparation.roadmapTemplates.templates;

  return (
    <main>
      <SiteHeader />
      <section className="page-hero prepare-hero shell">
        <p className="eyebrow">Prepare</p>
        <h1>Turn uncertainty into a few useful next steps.</h1>
        <p>
          Start with what is known, mark what needs counselor confirmation, and
          build a sustainable junior- and senior-year plan. This is not an
          admission predictor.
        </p>
      </section>

      <section className="shell content-section">
        <div className="readiness-grid">
          <article className="readiness-card readiness-primary">
            <span className="step-label">Step 1</span>
            <h2>Review the academic baseline</h2>
            <p>
              Courses, grades, available opportunities, responsibilities, and
              constraints all belong in the picture.
            </p>
            <a className="button button-primary" href="#prepare-workspace">
              Start the first pass
            </a>
          </article>
          <article className="readiness-card">
            <span className="step-label">Step 2</span>
            <h2>Separate facts from questions</h2>
            <p>
              Unknown course classifications stay unresolved and become clear
              counselor questions—not automatic failures.
            </p>
          </article>
          <article className="readiness-card">
            <span className="step-label">Step 3</span>
            <h2>Choose at most three actions</h2>
            <p>
              One academic check, one exploration experience, and one planning
              task are enough for a first session.
            </p>
          </article>
        </div>
      </section>

      <div id="prepare-workspace">
        <PrepareWorkspace
          agRules={agRules}
          gpaRules={gpaRules}
          roadmapTemplates={roadmapTemplates}
        />
      </div>

      <section className="ag-section">
        <div className="shell content-section">
          <div className="section-heading">
            <p className="eyebrow">UC foundation</p>
            <h2>A–G at a glance</h2>
            <p>
              UC requires at least {agRules.totalCoursesMinimum} courses, with{" "}
              {agRules.coursesBeforeSeniorYearMinimum} completed before senior
              year. Minimum eligibility does not guarantee admission.
            </p>
          </div>
          <div className="ag-grid">
            {agRules.categories.map((category) => (
              <article key={category.id}>
                <span>{category.id.toUpperCase()}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>
                    {category.yearsRequired} year
                    {category.yearsRequired === 1 ? "" : "s"} required
                    {category.yearsRecommended
                      ? ` · ${category.yearsRecommended} recommended`
                      : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="source-note">
            Last verified {agRules.meta.lastVerified}. Always confirm individual
            course certification with the official school A–G list and a
            counselor.
          </p>
        </div>
      </section>

      <section className="shell content-section">
        <div className="section-heading">
          <p className="eyebrow">Comprehensive review</p>
          <h2>UC considers more than a single number.</h2>
        </div>
        <div className="review-layout">
          <ol className="review-list">
            {review.factors.map((factor, index) => (
              <li key={factor}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{factor}</p>
              </li>
            ))}
          </ol>
          <aside className="principle-card">
            <p className="card-label">How this site will respond</p>
            <h3>Context before optimization</h3>
            <ul className="clean-list">
              {review.productRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
