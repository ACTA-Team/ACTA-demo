"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">ACTA Demo Flow</h1>
        <p className="text-sm text-muted-foreground">
          This demo separates the flow into four steps: create a vault, authorize issuers, compute your DID, and create a credential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">Vault</h2>
            <p className="text-xs text-muted-foreground">Initialize a vault for your credentials.</p>
            <Link href="/vault" className="mt-2 block w-full"><Button className="w-full block" variant="secondary">Go to Vault</Button></Link>
          </div>
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">Authorized Issuers</h2>
            <p className="text-xs text-muted-foreground">Authorize the connected wallet as issuer.</p>
            <Link href="/issuers" className="mt-2 block w-full"><Button className="w-full block" variant="secondary">Go to Authorized Issuers</Button></Link>
          </div>
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">DID</h2>
            <p className="text-xs text-muted-foreground">Compute and save your owner DID.</p>
            <Link href="/did" className="mt-2 block w-full"><Button className="w-full block" variant="secondary">Go to DID</Button></Link>
          </div>
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">Credentials</h2>
            <p className="text-xs text-muted-foreground">Create a VC and store it in your vault.</p>
            <Link href="/credentials" className="mt-2 block w-full"><Button className="w-full block" variant="secondary">Go to Credentials</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
