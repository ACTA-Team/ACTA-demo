"use client";

import { VaultSetupCard } from "@/components/features/vault/VaultSetupCard";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";

export default function VaultPage() {
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return (
      <section className="container mx-auto max-w-2xl px-4 py-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-3">
          <h1 className="text-xl font-semibold">Vault Setup</h1>
          <p className="text-sm">Conecta tu wallet para acceder.</p>
          <Button variant="outline" disabled>Acceso restringido</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Vault Setup</h1>
        <p className="text-sm text-muted-foreground">Create a vault for your wallet and authorize your wallet as issuer.</p>
        <VaultSetupCard />
      </div>
    </section>
  );
}