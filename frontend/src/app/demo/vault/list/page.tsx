'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { listVcIdsSingleCall } from '@/lib/vault/list';
import { Hero } from '@/layouts/Hero';
import { ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { GlowingCard } from '@/components/ui/glowing-card';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function VaultListPage() {
  const { walletAddress, signTransaction } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ids, setIds] = useState<string[]>([]);

  const handleList = async () => {
    if (!walletAddress || !signTransaction) return;
    setLoading(true);
    setError(null);
    setIds([]);
    try {
      const res = await listVcIdsSingleCall({ owner: walletAddress, signTransaction });
      setIds(res);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyId = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="List VC IDs"
        description="List the IDs of your credentials (owner signature required)."
        backHref="/demo"
      />

      <div className="mt-8 space-y-6">
        {walletAddress ? (
          <AnimatedSection>
            <GlowingCard className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Vault Records</h3>
                  <p className="text-xs text-muted-foreground">IDs of stored credentials</p>
                </div>
                <Button onClick={handleList} variant="outline" size="sm" className="shrink-0">
                  {loading ? 'Listing…' : 'List IDs'}
                </Button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="mt-2">
                {ids.length === 0 && !loading ? (
                  <p className="text-sm text-muted-foreground">No records found yet.</p>
                ) : (
                  <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                    {ids.map((id) => (
                      <li
                        key={id}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 bg-muted/30"
                      >
                        <span className="text-xs font-mono break-all">{id}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2"
                            onClick={() => copyId(id)}
                            title="Copy ID"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {id.startsWith('http') && (
                            <a
                              href={id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs underline"
                              title="Open"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Open
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </GlowingCard>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <GlowingCard>
              <div className="min-h-[20vh] flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-sm">Connect your wallet to access.</p>
                <Button variant="outline" disabled>
                  Restricted access
                </Button>
              </div>
            </GlowingCard>
          </AnimatedSection>
        )}

        <AnimatedSection delay={0.25}>
          <GlowingCard>
            <h3 className="text-lg font-medium mb-3">Next Step</h3>
            <p className="text-sm text-muted-foreground mb-4">
              After creating your vault, configure authorized issuers to manage credentials.
            </p>
            <div className="pt-2">
              <Button asChild className="bg-white text-black hover:bg-neutral-200">
                <Link href="/demo/vault/get">
                  Get Credential
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </GlowingCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
