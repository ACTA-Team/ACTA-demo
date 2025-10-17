'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  description?: string;
  backHref?: string;
  className?: string;
}

export function Hero({ title, description, backHref = '/demo', className }: HeroProps) {
  return (
    <section
      className={cn('relative overflow-hidden rounded-xl border bg-neutral-900/40', className)}
    >
      <DotPattern className="opacity-60" cx={2} cy={2} cr={1} glow={false} />
      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        {backHref && (
          <div className="mb-4">
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}
