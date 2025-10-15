"use client";

import { AuthorizedIssuersCard } from "@/components/features/issuer/AuthorizedIssuersCard";

export default function AuthorizedIssuersPage() {
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