'use client';

import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { DidCard } from '@/components/features/did/DidCard';
import { Hero } from '@/components/layout/Hero';

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
        {!walletAddress ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-sm">Conecta tu wallet para acceder.</p>
            <Button variant="outline" disabled>
              Acceso restringido
            </Button>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <DidCard />
          </div>
        )}
      </section>
    </div>
  );
}
