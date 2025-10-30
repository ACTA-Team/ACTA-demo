'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';
import { TextAnimate } from '@/components/ui/text-animate';

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
      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        {backHref && (
          <div className="mb-4">
            <RainbowButton asChild size="sm">
              <Link href={backHref} className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </RainbowButton>
          </div>
        )}
        <TextAnimate animation="blurIn" as="h1" className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </TextAnimate>
        {description && (
          <TextAnimate animation="slideLeft" as="p" className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            {description}
          </TextAnimate>
        )}
      </div>
    </section>
  );
}
