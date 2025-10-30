'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { VaultSetupCard } from '@/components/features/vault/VaultSetupCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DotPattern className="opacity-22" cx={2} cy={2} cr={1} glow={false} />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 md:py-8">
        <Hero
          title="Vault Setup"
          description="Create a vault for your wallet and authorize your wallet as issuer. This page sets up your Vault using the connected wallet. After creating the vault, proceed to Authorized Issuers to allow your wallet to issue credentials for your vault. Once configured, you can continue authorizing other wallets as issuers in the Authorized Issuers page."
          backHref="/demo"
          className="text-white"
        />

        <section className="mt-8 space-y-6">
          {/* Vault Setup Card */}
          <VaultSetupCard />

          {/* Next Step Section */}
          <div className="bg-neutral-900 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-3">Next Step</h3>
            <p className="text-sm text-neutral-400 mb-4">
              After creating your vault, configure authorized issuers to manage credentials.
            </p>
            <Button asChild className="bg-white text-black hover:bg-neutral-200">
              <Link href="/demo/issuers" className="inline-flex items-center gap-2">
                Authorized Issuers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
