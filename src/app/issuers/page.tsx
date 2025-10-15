"use client";

import { AuthorizedIssuersCard } from "@/components/features/issuer/AuthorizedIssuersCard";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";

export default function AuthorizedIssuersPage() {
  const { walletAddress } = useWalletContext();

  if (!walletAddress) {
    return (
      <section className="container mx-auto max-w-2xl px-4 py-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-3">
          <h1 className="text-xl font-semibold">Authorized Issuers</h1>
          <p className="text-sm">Conecta tu wallet para acceder.</p>
          <Button variant="outline" disabled>Acceso restringido</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <div className="relative overflow-hidden rounded border p-4 mb-4">
        <h1 className="text-xl font-semibold">Authorized Issuers</h1>
        <p className="text-sm text-muted-foreground">Authorize the connected wallet as an issuer in your vault.</p>
      </div>
      <AuthorizedIssuersCard />
    </section>
  );
}