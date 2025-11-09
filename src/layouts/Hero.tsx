'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';

interface HeroProps {
  title: string;
  description?: string;
  backHref?: string;
  className?: string;
}

export function Hero({ title, description, backHref = '/demo', className }: HeroProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border bg-neutral-900/40', className)}>
      <BorderBeam
        duration={6}
        size={400}
        className="from-transparent via-purple-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        borderWidth={2}
        className="from-transparent via-green-500 to-transparent"
      />
      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        {backHref && (
          <div className="mb-4">
            <Button className="bg-white text-black hover:bg-neutral-200 gap-1" asChild size="sm">
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
    </div>
  );
}
