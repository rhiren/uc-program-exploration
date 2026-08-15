import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="UC Pathways Explorer home">
          <span className="brand-mark" aria-hidden="true">
            UP
          </span>
          <span>
            UC Pathways
            <small>Explorer</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/discover">Discover</Link>
          <Link href="/majors">All majors</Link>
          <Link href="/campuses">Campuses</Link>
          <Link href="/fit">Path fit</Link>
          <Link href="/activities">Activities</Link>
          <Link href="/report">Report</Link>
          <Link href="/prepare">Prepare</Link>
          <Link href="/medical">Medicine</Link>
          <Link href="/explore">My paths</Link>
        </nav>
        <span
          className="local-badge"
          title="Guided-journey progress stays in this browser on this device"
        >
          Progress on this device
        </span>
      </div>
      <div className="preview-strip">
        <div className="shell">
          <strong>Early preview</strong>
          <span>
            Search the complete current UC major directory, then go deeper with
            selected study-and-career guides.
          </span>
        </div>
      </div>
    </header>
  );
}
