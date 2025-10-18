import Link from 'next/link';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function Home() {
  return (
    <section className="relative min-h-full w-full overflow-hidden">
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
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <div className="max-w-2xl ml-0 sm:ml-4 md:ml-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            ACTA Demo Flow
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            This demo separates the flow into four steps: create a vault, <br /> authorize issuers,
            compute the credential, and issue the credential.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center rounded border px-5 py-2.5 text-base hover:bg-muted w-full sm:w-auto justify-center"
            >
              View Demo
            </Link>
            <a
              href="https://stellar.expert/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded px-5 py-2.5 text-base text-muted-foreground hover:underline w-full sm:w-auto justify-center"
            >
              View Stellar Expert
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
