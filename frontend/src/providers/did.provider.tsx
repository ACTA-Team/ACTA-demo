'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getEnvDefaults } from '@/lib/env';
import { useWalletContext } from '@/providers/wallet.provider';

type DidContextValue = {
  ownerDid: string | null;
  setOwnerDid: (did: string | null) => void;
};

const DidContext = createContext<DidContextValue | undefined>(undefined);

function detectNetworkTag(rpcUrl: string, networkPassphrase: string): 'testnet' | 'public' {
  const isTestnet = /testnet/i.test(rpcUrl) || /Test SDF Network/i.test(networkPassphrase);
  return isTestnet ? 'testnet' : 'public';
}

export function makeDidForAddress(address: string, networkTag: 'testnet' | 'public'): string {
  return `did:pkh:stellar:${networkTag}:${address}`;
}

export function DidProvider({ children }: { children: React.ReactNode }) {
  const { walletAddress } = useWalletContext();
  const { rpcUrl, networkPassphrase } = getEnvDefaults();
  const [ownerDid, setOwnerDidState] = useState<string | null>(null);

  const setOwnerDid = (did: string | null) => {
    setOwnerDidState(did);
    try {
      if (did) {
        localStorage.setItem('acta_owner_did', did);
      } else {
        localStorage.removeItem('acta_owner_did');
      }
    } catch (_) {}
  };

  // Initialize DID from wallet + env or from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('acta_owner_did') : null;
    if (stored) {
      setOwnerDidState(stored);
      return;
    }
    if (walletAddress) {
      const tag = detectNetworkTag(rpcUrl, networkPassphrase);
      const did = makeDidForAddress(walletAddress, tag);
      setOwnerDidState(did);
    } else {
      setOwnerDidState(null);
    }
  }, [walletAddress, rpcUrl, networkPassphrase]);

  const value = useMemo<DidContextValue>(() => ({ ownerDid, setOwnerDid }), [ownerDid]);
  return <DidContext.Provider value={value}>{children}</DidContext.Provider>;
}

export function useDidContext(): DidContextValue {
  const ctx = useContext(DidContext);
  if (!ctx) throw new Error('useDidContext must be used within DidProvider');
  return ctx;
}
