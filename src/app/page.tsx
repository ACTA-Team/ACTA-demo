"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-10">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">ACTA Demo Flow</h1>
        <p className="text-sm text-muted-foreground">
          This demo separates the flow into three steps: create a vault, authorize the connected wallet, and create a DID, then use that DID in the credential form.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">Vault</h2>
            <p className="text-xs text-muted-foreground">Initialize a vault and authorize your wallet as issuer.</p>
            <Link href="/vault"><Button className="mt-2" variant="secondary">Go to Vault</Button></Link>
          </div>
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">DID</h2>
            <p className="text-xs text-muted-foreground">Compute and save your owner DID.</p>
            <Link href="/did"><Button className="mt-2" variant="secondary">Go to DID</Button></Link>
          </div>
          <div className="rounded border p-4 space-y-2">
            <h2 className="text-base font-medium">Credentials</h2>
            <p className="text-xs text-muted-foreground">Create a VC and store it in your vault.</p>
            <Link href="/credentials"><Button className="mt-2" variant="secondary">Go to Credentials</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
