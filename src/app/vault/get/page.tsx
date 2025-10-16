'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { getVcSingleCall } from '@/lib/vault/get';
import { VcCard } from '@/components/features/vault/VcCard';

export default function VaultGetPage() {
  const { walletAddress, signTransaction } = useWalletContext();
  const [vcId, setVcId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vc, setVc] = useState<any | null>(null);

  const handleGet = async () => {
    if (!walletAddress || !signTransaction) return;
    if (!vcId) {
      setError('VC ID required');
      return;
    }
    setLoading(true);
    setError(null);
    setVc(null);
    try {
      const res = await getVcSingleCall({ owner: walletAddress, vcId, signTransaction });
      setVc(res);
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
          <h1 className="text-xl font-semibold">Get VC</h1>
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
        <h1 className="text-xl font-semibold">Get credential (VC)</h1>
        <p className="text-sm text-muted-foreground">Fetch a credential from your Vault by ID (owner signature required).</p>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded border px-2 py-1 text-sm"
            placeholder="vc:example:acta"
            value={vcId}
            onChange={(e) => setVcId(e.target.value)}
          />
          <Button onClick={handleGet} disabled={loading} variant="outline">
            {loading ? 'Fetching…' : 'Get VC'}
          </Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {vc && <VcCard record={vc as any} />}
      </div>
    </section>
  );
}