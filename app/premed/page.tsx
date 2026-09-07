import type { Metadata } from "next";
import { PremedMajorStrategy } from "@/components/premed-major-strategy";
import { SiteHeader } from "@/components/site-header";
import { loadContent } from "@/lib/content/load-content";

export const metadata: Metadata = {
  title: "Pre-med major strategy",
  description:
    "Concrete guidance for choosing an undergraduate major that can support pre-med while preserving strong non-medical options.",
};

export default function PremedPage() {
  loadContent();

  return (
    <main>
      <SiteHeader />
      <section className="page-hero shell premed-hero">
        <p className="eyebrow">Pre-med, without tunnel vision</p>
        <h1>Choose a major that keeps medicine possible and the fallback strong.</h1>
        <p>
          This page turns pre-med into a planning conversation: what she enjoys,
          what she can perform well in, which requirements need mapping, and
          what remains valuable if she later chooses a different path.
        </p>
      </section>
      <PremedMajorStrategy />
    </main>
  );
}
