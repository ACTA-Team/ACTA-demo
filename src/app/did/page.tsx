"use client";

import { DidCard } from "@/components/features/did/DidCard";

export default function DidPage() {
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