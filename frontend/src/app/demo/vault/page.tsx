'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VaultSetupCard } from '@/components/features/vault/VaultSetupCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Vault Setup"
        description="Create a vault for your wallet and authorize your wallet as issuer. Vault Overview
This page sets up your Vault using the connected wallet. After creating the vault, proceed to Authorized Issuers to allow your wallet to issue credentials for your vault.
Once configured, you can continue authorizing other wallets as issuers in the Authorized Issuers page."
        backHref="/demo"
      />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Wallet + actions */}
          <VaultSetupCard />

          {/* Right: Explanation + navigation */}
          <div className="rounded border p-6 md:p-8">
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/issuers">
                  <ArrowRight className="h-4 w-4" />
                  Authorized Issuers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
