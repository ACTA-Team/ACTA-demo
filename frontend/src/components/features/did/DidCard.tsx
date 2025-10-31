'use client';

import { useWalletContext } from '@/providers/wallet.provider';
import { useDid } from '@/hooks/did/use-did';
import { Button } from '@/components/ui/button';

export function DidCard() {
  const { walletAddress } = useWalletContext();
  const { ownerDid, computeDid, saveComputedDid } = useDid();

  const onSave = () => {
    const did = computeDid();
    if (!did) {
      return;
    }
    saveComputedDid();
  };

  return (
    <div className="rounded border p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || 'Not connected'}</p>
      </div>
      <div>
        <p className="text-sm">Computed DID</p>
        <p className="text-xs font-mono break-all">{ownerDid || '—'}</p>
      </div>
      <div className="pt-2 flex gap-2">
        <Button onClick={onSave} disabled={!walletAddress} variant="outline">
          Compute & Save DID
        </Button>
      </div>
    </div>
  );
}
