import Link from 'next/link';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function Home() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      {/* Dot background */}
      <DotPattern
        width={24}
        height={24}
        cx={2}
        cy={2}
        cr={1.6}
        glow
        className="text-muted-foreground/30"
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            ACTA Demo Flow
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            This demo separates the flow into four steps: create a vault, authorize issuers, compute
            the credential, and issue the credential.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center rounded border px-4 py-2 text-sm hover:bg-muted"
            >
              View Demo
            </Link>
            <a
              href="https://stellar.expert/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded px-4 py-2 text-sm text-muted-foreground hover:underline"
            >
              View Stellar Expert
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
