'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import * as React from 'react';
import { OnboardingStepsModal } from '@/components/modals/onboarding-steps-modal';

export default function Home() {
  const { walletAddress } = useWalletContext();
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOnboardingOpen(true);
  }, []);
  return (
    <section className="container mx-auto max-w-3xl px-3 py-8 md:px-4 md:py-10">
      <OnboardingStepsModal open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">ACTA Demo Flow</h1>
        <p className="text-sm text-muted-foreground">
          This demo separates the flow into four steps: create a vault, authorize issuers, compute
          your DID, and create a credential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">Vault</h2>
            <p className="text-xs text-muted-foreground">
              Initialize a vault for your credentials.
            </p>
            {walletAddress ? (
              <Link href="/vault" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to Vault
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to Vault
              </Button>
            )}
          </div>
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">Authorized Issuers</h2>
            <p className="text-xs text-muted-foreground">
              Authorize the connected wallet as issuer.
            </p>
            {walletAddress ? (
              <Link href="/issuers" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to Authorized Issuers
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to Authorized Issuers
              </Button>
            )}
          </div>
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">DID</h2>
            <p className="text-xs text-muted-foreground">Compute and save your owner DID.</p>
            {walletAddress ? (
              <Link href="/did" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to DID
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to DID
              </Button>
            )}
          </div>
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">Credentials</h2>
            <p className="text-xs text-muted-foreground">Create a VC and store it in your vault.</p>
            {walletAddress ? (
              <Link href="/credentials" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to Credentials
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to Credentials
              </Button>
            )}
          </div>
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">Vault: List VC IDs</h2>
            <p className="text-xs text-muted-foreground">List your VC IDs stored in the vault.</p>
            {walletAddress ? (
              <Link href="/vault/list" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to List VC IDs
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to List VC IDs
              </Button>
            )}
          </div>
          <div className="rounded border p-3 md:p-4 space-y-2">
            <h2 className="text-base font-medium">Vault: Get VC</h2>
            <p className="text-xs text-muted-foreground">Fetch a VC from your vault by ID.</p>
            {walletAddress ? (
              <Link href="/vault/get" className="mt-2 block w-full">
                <Button className="w-full block" variant="outline">
                  Go to Get VC
                </Button>
              </Link>
            ) : (
              <Button className="mt-2 w-full block" variant="outline" disabled>
                Go to Get VC
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
