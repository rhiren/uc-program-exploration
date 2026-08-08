import type { Metadata } from "next";
import { ActivitiesWorkspace } from "@/components/activities-workspace";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Activities & experiences",
  description:
    "Build a UC Activities & Awards inventory with impact notes, reflection, and PIQ story seeds.",
};

export default function ActivitiesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell activities-hero">
        <p className="eyebrow">UC Activities & Awards prep</p>
        <h1>Turn everyday commitments into a clear activities inventory.</h1>
        <p>
          Capture clubs, projects, volunteering, family responsibilities, jobs,
          awards, coursework, and programs while there is still time to deepen
          the most meaningful threads.
        </p>
      </section>
      <ActivitiesWorkspace />
    </main>
  );
}
