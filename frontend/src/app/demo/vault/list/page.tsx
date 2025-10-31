'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { listVcIdsSingleCall } from '@/lib/vault/list';
import { Hero } from '@/layouts/Hero';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

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

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: List action + results or restricted */}
          {walletAddress ? (
            <div className="rounded border p-6 md:p-8 space-y-4">
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
            </div>
          ) : (
            <div className="rounded border p-6 md:p-8 min-h-[20vh] flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-sm">Connect your wallet to access.</p>
              <Button variant="outline" disabled>
                Restricted access
              </Button>
            </div>
          )}

          {/* Right: Explanation */}
          <div className="rounded border p-6 md:p-8">
            <h2 className="text-lg font-medium mb-2">What is this?</h2>
            <p className="text-sm text-muted-foreground mb-3">
              This page queries your Vault smart contract for stored credentials using your
              connected wallet.
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Click the List IDs button to fetch credential IDs.</li>
              <li>Use those IDs on the Get page to retrieve details.</li>
              <li>If you have no credentials yet, go to Issue and create one.</li>
            </ul>
            <div className="mt-4">
              <Link
                href="/demo/vault/get"
                className="inline-flex items-center gap-1 text-sm underline"
              >
                Go to the Get page to fetch a credential →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
