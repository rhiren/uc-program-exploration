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
            Explore eight programs, thirteen careers, verified UC offerings,
            and your own saved comparisons.
          </span>
        </div>
      </div>
    </header>
  );
}
