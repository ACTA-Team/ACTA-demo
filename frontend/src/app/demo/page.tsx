'use client';

import Link from 'next/link';
import { ArrowLeft, Vault, Users, Award, List, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { GlowingEffect } from '@/components/ui/glowing-effect';

export default function DemoPage() {
  const routes = [
    {
      href: '/demo/vault',
      title: 'Vault',
      desc: 'Initialize and manage the demo Vault.',
      icon: <Vault className="h-4 w-4 text-black dark:text-neutral-400" />,
      number: 1,
    },
    {
      href: '/demo/issuers',
      title: 'Authorized Issuers',
      desc: 'Manage the list of allowed issuers.',
      icon: <Users className="h-4 w-4 text-black dark:text-neutral-400" />,
      number: 2,
    },
    {
      href: '/demo/credentials',
      title: 'Issue Credential',
      desc: 'Issue a verifiable credential with ACTA.',
      icon: <Award className="h-4 w-4 text-black dark:text-neutral-400" />,
      number: 3,
    },
    {
      href: '/demo/vault/list',
      title: 'List Vault Records',
      desc: 'Browse stored credentials.',
      icon: <List className="h-4 w-4 text-black dark:text-neutral-400" />,
    },
    {
      href: '/demo/vault/get',
      title: 'Get Vault Record',
      desc: 'Retrieve a specific record by ID.',
      icon: <Search className="h-4 w-4 text-black dark:text-neutral-400" />,
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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <GridItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              title={route.title}
              description={route.desc}
              number={route.number}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

interface GridItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  number?: number;
}

const GridItem = ({ href, icon, title, description, number }: GridItemProps) => {
  return (
    <li className="min-h-[14rem] list-none">
      <Link href={href} className="block h-full">
        <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 transition-all duration-300 hover:scale-[1.02]">
          <GlowingEffect
            blur={0}
            borderWidth={3}
            spread={80}
            glow={false}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="w-fit rounded-lg border border-gray-600 p-2">{icon}</div>
                {number && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium transition group-hover:scale-110">
                    {number}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                  {title}
                </h3>
                <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                  {description}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
