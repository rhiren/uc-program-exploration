import type { Metadata } from "next";
import { ExplorerWorkspace } from "@/components/explorer-workspace";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = { title: "My paths" };

export default function MyPathsPage() {
  const content = loadContent();
  const programs = content.programs.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    kind: "program" as const,
  }));
  const careers = content.careers.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    kind: "career" as const,
  }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell workspace-hero">
        <p className="eyebrow">My paths</p>
        <h1>A place to keep curiosity organized.</h1>
        <p>
          Return to saved programs and careers, reopen recent guides, and choose
          a few paths for honest side-by-side comparison.
        </p>
      </section>
      <section className="shell">
        <ExplorerWorkspace careers={careers} programs={programs} />
      </section>
    </main>
  );
}
