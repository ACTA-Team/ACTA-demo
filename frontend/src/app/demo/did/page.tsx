'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { DidCard } from '@/components/features/did/DidCard';
import { Hero } from '@/layouts/Hero';

export default function DidPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="DID"
        description="Compute and save your owner DID based on the connected wallet and network."
        backHref="/demo"
      />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: DID compute/save */}
          {walletAddress ? (
            <DidCard />
          ) : (
            <div className="rounded border p-6 md:p-8 min-h-[20vh] flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-sm">Connect your wallet to access.</p>
              <Button variant="outline" disabled>
                Restricted access
              </Button>
            </div>
          )}

          {/* Right: Explanation + next step */}
          <div className="rounded border p-6 md:p-8">
            <h3 className="text-lg font-medium">DID Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your DID (Decentralized Identifier) is derived from your wallet and network. Save your
              DID to use it when issuing credentials.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              After saving your DID, continue to{' '}
              <span className="font-medium">Issue Credential</span>
              to create and store a verifiable credential in your vault.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/credentials">
                  <ArrowLeft className="h-4 w-4" />
                  Issue Credential
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
