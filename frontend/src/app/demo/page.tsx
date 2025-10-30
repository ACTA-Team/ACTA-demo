import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function DemoPage() {
  const routes = [
    { href: '/demo/vault', title: 'Vault', desc: 'Initialize and manage the demo Vault.' },
    {
      href: '/demo/issuers',
      title: 'Authorized Issuers',
      desc: 'Manage the list of allowed issuers.',
    },
    {
      href: '/demo/credentials',
      title: 'Issue Credential',
      desc: 'Issue a verifiable credential with ACTA.',
    },
    { href: '/demo/vault/list', title: 'List Vault Records', desc: 'Browse stored credentials.' },
    {
      href: '/demo/vault/get',
      title: 'Get Vault Record',
      desc: 'Retrieve a specific record by ID.',
    },
    {
      href: '/demo/did',
      title: 'Compute DID',
      desc: 'Generate the DID associated with your account.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <section className="relative overflow-hidden rounded-xl border bg-neutral-900/40">
        <DotPattern className="opacity-60" cx={2} cy={2} cr={1} glow={false} />
        <div className="relative z-10 p-6 sm:p-8 md:p-10">
          <div className="mb-4">
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">ACTA Demo</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            This page lists ACTA demo. Follow the suggested flow: set up the Vault, manage
            authorized Issuers, compute your DID, and finally issue a verifiable Credential. Use the
            cards below to navigate.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-lg border bg-card p-4 transition hover:border-primary/50 hover:bg-card/60"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{r.title}</h3>
                {r.title === 'Vault' && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium transition group-hover:scale-110">1</span>
                )}
                {r.title === 'Authorized Issuers' && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium transition group-hover:scale-110">2</span>
                )}
                {r.title === 'Issue Credential' && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium transition group-hover:scale-110">3</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
