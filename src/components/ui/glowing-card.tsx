'use client';

import { cn } from '@/lib/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';

type GlowingCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function GlowingCard({ className, children }: GlowingCardProps) {
  return (
    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={false}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div
        className={cn(
          'border relative overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
