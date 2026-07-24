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
        </nav>
        <span className="local-badge">Local &amp; private</span>
      </div>
    </header>
  );
}

