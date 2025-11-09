'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthorizedIssuersCard } from '@/components/features/issuer/AuthorizedIssuersCard';
import { useWalletContext } from '@/providers/wallet.provider';
import { Button } from '@/components/ui/button';
import { Hero } from '@/layouts/Hero';
import { GlowingCard } from '@/components/ui/glowing-card';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function AuthorizedIssuersPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Authorized Issuers"
        description="Authorize the connected wallet as an issuer in your vault. This allows the wallet to
              issue credentials managed by your vault."
        backHref="/demo/vault"
      />

      <div className="mt-8 space-y-6">
        <AnimatedSection>
          {walletAddress ? (
            <GlowingCard>
              <AuthorizedIssuersCard />
            </GlowingCard>
          ) : (
            <GlowingCard>
              <div className="min-h-[20vh] flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-sm">Connect your wallet to access.</p>
                <Button variant="outline" disabled>
                  Restricted access
                </Button>
              </div>
            </GlowingCard>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <GlowingCard>
            <h3 className="text-lg font-medium mb-3">Next Step</h3>
            <p className="text-sm text-muted-foreground mb-4">
              After authorizing your wallet as issuer, proceed to Issue Credential to create a
              verifiable credential in your vault.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/demo/credentials">
                  <ArrowRight className="h-4 w-4" />
                  Issue Credential
                </Link>
              </Button>
            </div>
          </GlowingCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
