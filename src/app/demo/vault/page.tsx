'use client';

import { VaultSetupCard } from '@/components/features/vault/VaultSetupCard';
import { useWalletContext } from '@/providers/wallet.provider';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';

export default function VaultPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Vault Setup"
        description="Create a vault for your wallet and authorize your wallet as issuer."
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
            <VaultSetupCard />
          </div>
        )}
      </section>
    </div>
  );
}
