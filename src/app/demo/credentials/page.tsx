'use client';

import { CredentialForm } from '@/components/features/credential/CredentialForm';
import { useWalletContext } from '@/providers/wallet.provider';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/layout/Hero';

export default function CredentialsPage() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Issue Credential"
        description="Issue a verifiable credential with ACTA."
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
            <CredentialForm />
          </div>
        )}
      </section>
    </div>
  );
}
