'use client';

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
        {!walletAddress ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-sm">Connect your wallet to access.</p>
            <Button variant="outline" disabled>
              Restricted access
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <AuthorizedIssuersCard />
          </div>
        )}
      </section>
    </div>
  );
}
