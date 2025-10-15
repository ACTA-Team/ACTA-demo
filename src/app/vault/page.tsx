"use client";

import { VaultSetupCard } from "@/components/features/vault/VaultSetupCard";

export default function VaultPage() {
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