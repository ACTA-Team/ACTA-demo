'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CredentialForm } from '@/components/features/credential/CredentialForm';
import { Hero } from '@/layouts/Hero';
import { Button } from '@/components/ui/button';
import { GlowingCard } from '@/components/ui/glowing-card';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function CredentialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Issue Credential"
        description="Issue a verifiable credential with ACTA."
        backHref="/demo/issuers"
      />
      <div className="mt-8 space-y-6">
        <AnimatedSection>
          <GlowingCard>
            <CredentialForm />
          </GlowingCard>
        </AnimatedSection>
        <AnimatedSection delay={0.25}>
          <GlowingCard>
            <h3 className="text-lg font-medium mb-3">Next Step</h3>
            <p className="text-sm text-muted-foreground mb-4">
              After creating your vault, configure authorized issuers to manage credentials.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/demo/vault/list">
                  <ArrowRight className="h-4 w-4" />
                  View Vault Records
                </Link>
              </Button>
            </div>
          </GlowingCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
