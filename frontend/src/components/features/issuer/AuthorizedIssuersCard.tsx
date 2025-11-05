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

  const friendlyError = (e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  };

  const doAuthorize = async () => {
    try {
      const res = await authorizeSelf();
      setTxAuth(res.txId);
      toast.success('Wallet authorized');
    } catch (e: unknown) {
      toast.error('Could not authorize wallet', {
        description: friendlyError(e, 'Something went wrong. Please try again.'),
      });
    }
  };

  return (
    <div className="rounded border p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || 'Not connected'}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          className="!bg-white text-black hover:text-gray-95  0 hover:bg-gray-200 font-medium w-full"
          onClick={doAuthorize}
          disabled={!walletAddress || loading}
          variant="outline"
        >
          Authorize Wallet
        </Button>
      </div>
      {/* Old UI restored: only wallet authorization button */}
      {/* Transaction details hidden per requirement */}
    </div>
  );
}
