import type { Metadata } from "next";
import { DiscoverJourney } from "@/components/discover-journey";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Guided discovery",
};

export default function GuidedDiscoverPage() {
  const content = loadContent();
  const challenge = content.medical.challenges.find(
    (item) => item.id === "bio-genetics-protein",
  );

  if (!challenge) {
    throw new Error("The genetics discovery challenge is unavailable.");
  }

  const programs = content.programs.map((program) => ({
    id: program.id,
    name: program.name,
    summary: program.summary,
    codingUse: program.intensities.coding ?? "varies",
  }));

  return (
    <main className="journey-page">
      <SiteHeader />
      <div className="journey-shell shell">
        <DiscoverJourney
          challenge={challenge}
          onboarding={content.journey.onboarding}
          programs={programs}
        />
      </div>
    </main>
  );
}
