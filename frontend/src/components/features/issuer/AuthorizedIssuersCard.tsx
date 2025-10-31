'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useVault } from '@/hooks/vault/use-vault';
import { toast } from 'sonner';

export function AuthorizedIssuersCard() {
  const { walletAddress } = useWalletContext();
  const { loading, authorizeSelf } = useVault();
  const [txAuth, setTxAuth] = useState<string | null>(null);

  const doAuthorize = async () => {
    try {
      toast.info('Authorizing connected wallet as issuer...');
      const res = await authorizeSelf();
      setTxAuth(res.txId);
      toast.success('Wallet authorized', { description: `Tx: ${res.txId}` });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || 'Failed to authorize issuer');
    }
  };

  return (
    <div className="rounded border p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || 'Not connected'}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={doAuthorize} disabled={!walletAddress || loading} variant="outline">
          Authorize Wallet
        </Button>
      </div>
      {txAuth && (
        <div className="mt-2">
          <p className="text-sm">Authorize Issuer Tx</p>
          <p className="text-xs font-mono break-all">{txAuth}</p>
        </div>
      )}
    </div>
  );
}
