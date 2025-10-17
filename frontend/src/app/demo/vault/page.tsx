'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VaultSetupCard } from '@/components/features/vault/VaultSetupCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Vault Setup"
        description="Create a vault for your wallet and authorize your wallet as issuer."
        backHref="/demo"
      />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Wallet + actions */}
          <VaultSetupCard />

          {/* Right: Explanation + navigation */}
          <div className="rounded border p-6 md:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Vault Overview</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This page sets up your Vault using the connected wallet. After creating the vault,
              proceed to <span className="font-medium">Authorized Issuers</span> to allow your
              wallet to issue credentials for your vault.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Once configured, you can continue with computing your DID and issuing credentials in
              the demo flow.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/issuers">
                  <ArrowLeft className="h-4 w-4" />
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
