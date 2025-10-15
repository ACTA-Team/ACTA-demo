"use client";

import { DidCard } from "@/components/features/did/DidCard";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";

export default function DidPage() {
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return (
      <section className="container mx-auto max-w-2xl px-4 py-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-3">
          <h1 className="text-xl font-semibold">DID</h1>
          <p className="text-sm">Conecta tu wallet para acceder.</p>
          <Button variant="outline" disabled>Acceso restringido</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">DID</h1>
        <p className="text-sm text-muted-foreground">Compute and save your owner DID based on the connected wallet and network.</p>
        <DidCard />
      </div>
    </section>
  );
}