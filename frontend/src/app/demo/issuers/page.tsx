'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthorizedIssuersCard } from '@/components/features/issuer/AuthorizedIssuersCard';
import { useWalletContext } from '@/providers/wallet.provider';
import { Button } from '@/components/ui/button';
import { Hero } from '@/layouts/Hero';

export default function AuthorizedIssuersPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Authorized Issuers"
        description="Authorize the connected wallet as an issuer in your vault. This allows the wallet to
              issue credentials managed by your vault."
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
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/credentials">
                  <ArrowRight className="h-4 w-4" />
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
