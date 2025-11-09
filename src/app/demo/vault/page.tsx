'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VaultSetupCard } from '@/components/features/vault/VaultSetupCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/layouts/Hero';
import { GlowingCard } from '@/components/ui/glowing-card';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Vault Setup"
        description="Create a vault for your wallet and authorize your wallet as issuer. This page sets up your Vault using the connected wallet. After creating the vault, proceed to Authorized Issuers to allow your wallet to issue credentials for your vault. Once configured, you can continue authorizing other wallets as issuers in the Authorized Issuers page."
        backHref="/demo"
      />

      <div className="mt-8 space-y-6">
        <AnimatedSection>
          <GlowingCard>
            <VaultSetupCard />
          </GlowingCard>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <GlowingCard>
            <div>
              <h3 className="text-lg font-medium mb-3">Next Step</h3>
              <p className="text-sm text-muted-foreground mb-4">
                After creating your vault, configure authorized issuers to manage credentials.
              </p>
              <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/demo/issuers" className="inline-flex items-center gap-2">
                  Authorized Issuers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowingCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
