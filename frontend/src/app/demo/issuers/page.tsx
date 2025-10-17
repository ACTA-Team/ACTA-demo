'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthorizedIssuersCard } from '@/components/features/issuer/AuthorizedIssuersCard';
import { useWalletContext } from '@/providers/wallet.provider';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';

export default function AuthorizedIssuersPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Authorized Issuers"
        description="Authorize the connected wallet as an issuer in your vault."
        backHref="/demo"
      />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Issuer authorization */}
          {walletAddress ? (
            <AuthorizedIssuersCard />
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
            <h3 className="text-lg font-medium">Authorized Issuers Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Authorize the connected wallet as an issuer in your vault. This allows the wallet to
              issue credentials managed by your vault.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              After authorizing your wallet, continue to{' '}
              <span className="font-medium">Compute DID</span>
              to generate and save your DID.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/did">
                  <ArrowLeft className="h-4 w-4" />
                  Compute DID
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
