'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CredentialForm } from '@/components/features/credential/CredentialForm';
import { Hero } from '@/layouts/Hero';
import { Button } from '@/components/ui/button';

export default function CredentialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Issue Credential"
        description="Issue a verifiable credential with ACTA."
        backHref="/demo"
      />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Credential form */}
          <CredentialForm />

          {/* Right: Explanation + next step */}
          <div className="rounded border p-6 md:p-8">
            <h3 className="text-lg font-medium">Issue Credential Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill the form to prepare a verifiable credential and sign the transaction with your
              wallet. The credential will be stored in your vault.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              After issuing, you can view stored credentials in{' '}
              <span className="font-medium">Vault Records</span>.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/demo/vault/list">
                  <ArrowLeft className="h-4 w-4" />
                  View Vault Records
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
