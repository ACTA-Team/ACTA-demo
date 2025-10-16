'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { listVcIdsSingleCall } from '@/lib/vault/list';
import { BorderBeam } from '@/components/ui/border-beam';

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
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <section className="container mx-auto max-w-2xl px-4 py-8">
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-3">
          <h1 className="text-xl font-semibold">List VC IDs</h1>
          <p className="text-sm">Connect your wallet to access.</p>
          <Button variant="outline" disabled>
            Restricted access
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">List VC IDs</h1>
        <p className="text-sm text-muted-foreground">
          List the IDs of your credentials (owner signature required).
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={handleList} disabled={loading} variant="outline">
            {loading ? 'Listing…' : 'List IDs'}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && ids.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">No VC IDs found for your wallet.</p>
        )}
        {ids.length > 0 && (
          <div className="relative overflow-hidden rounded border p-4 space-y-2">
            <h2 className="text-sm font-medium">Found IDs</h2>
            <ul className="space-y-2">
              {ids.map((id) => (
                <li key={id} className="text-xs font-mono break-all">
                  {id}
                </li>
              ))}
            </ul>

            {/* Animated border */}
            <BorderBeam duration={6} size={400} colorFrom="#EDEDD0" colorTo="#EDEDD0" />
            <BorderBeam
              duration={6}
              delay={3}
              size={400}
              borderWidth={2}
              colorFrom="#EDEDD0"
              colorTo="#EDEDD0"
            />
          </div>
        )}
      </div>
    </section>
  );
}
