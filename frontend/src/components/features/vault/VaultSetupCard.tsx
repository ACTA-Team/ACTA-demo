'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDid } from '@/hooks/did/use-did';
import { useVault } from '@/hooks/vault/use-vault';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';

export function VaultSetupCard() {
  const { walletAddress } = useWalletContext();
  const { ownerDid } = useDid();
  const { loading, createVault } = useVault();
  const [txInit, setTxInit] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedDID, setCopiedDID] = useState(false);

  const doCreateVault = async () => {
    if (!ownerDid) {
      toast.error('Create or save your DID first');
      return;
    }
    try {
      toast.info('Creating vault...');
      const res = await createVault(ownerDid);
      setTxInit(res.txId);
      toast.success('Vault created', { description: `Tx: ${res.txId}` });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create vault');
    }
  };

  const copyToClipboard = (text: string, type: 'wallet' | 'did') => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    
    if (type === 'wallet') {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    } else {
      setCopiedDID(true);
      setTimeout(() => setCopiedDID(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Wallet */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Wallet</label>
            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
              <code className="text-white font-mono text-sm flex-1 break-all">
                {walletAddress || 'Not connected'}
              </code>
              {walletAddress && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => copyToClipboard(walletAddress, "wallet")}
                >
                  {copiedWallet ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Owner DID */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Owner DID</label>
            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
              <code className="text-white font-mono text-sm flex-1 break-all">
                {ownerDid || '—'}
              </code>
              {ownerDid && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => copyToClipboard(ownerDid, "did")}
                >
                  {copiedDID ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button 
        size="lg" 
        className="bg-white text-black hover:bg-gray-200 font-medium w-full"
        onClick={doCreateVault} 
        disabled={!walletAddress || loading}
      >
        Create Vault
      </Button>

      {txInit && (
        <div className="mt-4 p-3 bg-neutral-800 rounded">
          <p className="text-sm text-neutral-400 mb-2">Create Vault Tx</p>
          <p className="text-xs font-mono text-white break-all">{txInit}</p>
        </div>
      )}
    </div>
  );
}
