'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  AlbedoModule,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit';
import {
  WalletConnectModule,
  WalletConnectAllowedMethods,
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module';

type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  // Internal wallet module id used by StellarWalletsKit
  // Exposed for diagnostics only
  walletId?: string | null;
  authMethod: 'wallet' | null;
  setWalletInfo: (address: string, name: string, id: string) => Promise<void>;
  clearWalletInfo: () => void;
  signTransaction:
    | ((xdr: string, options: { networkPassphrase: string }) => Promise<string>)
    | null;
  walletKit: StellarWalletsKit | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function mapWalletNameToId(name?: string | null): string | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('freighter')) return 'freighter';
  if (n.includes('albedo')) return 'albedo';
  if (n.includes('xbull')) return 'xbull';
  if (n.includes('walletconnect')) return 'walletconnect';
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'wallet' | null>(null);
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);

  useEffect(() => {
    // Restore session
    const storedAddress =
      typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('walletName') : null;
    const storedId = typeof window !== 'undefined' ? localStorage.getItem('walletId') : null;
    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
    if (storedId) setWalletId(storedId);
    if (storedAddress) setAuthMethod('wallet');

    if (typeof window !== 'undefined') {
      (async () => {
        try {
          const res = await fetch('/api/walletconnect');
          const data = await res.json();
          const projectId = data.projectId as string | undefined;
          if (!projectId) throw new Error('Missing WalletConnect projectId');

          const kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            modules: [
              new FreighterModule(),
              new AlbedoModule(),
              new WalletConnectModule({
                url: 'https://nft.acta.build',
                projectId,
                method: WalletConnectAllowedMethods.SIGN,
                description: 'ACTA NFT Credential DApp',
                name: 'ACTA NFT',
                icons: ['https://nft.acta.build/white.png'],
                network: WalletNetwork.TESTNET,
              }),
              new xBullModule(),
            ],
          });
          setWalletKit(kit);
          // If we have a stored wallet id, restore the selected module
          if (storedId) {
            try {
              kit.setWallet(storedId);
            } catch (e) {}
          } else if (storedName) {
            const inferredId = mapWalletNameToId(storedName);
            if (inferredId) {
              try {
                kit.setWallet(inferredId);
                setWalletId(inferredId);
              } catch (e) {}
            }
          }
        } catch (err) {}
      })();
    }
  }, []);

  const setWalletInfo = async (address: string, name: string, id: string) => {
    setWalletAddress(address);
    setWalletName(name);
    setWalletId(id);
    setAuthMethod('wallet');
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletName', name);
      localStorage.setItem('walletId', id);
    }
  };

  const clearWalletInfo = () => {
    setWalletAddress(null);
    setWalletName(null);
    setWalletId(null);
    setAuthMethod(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletName');
      localStorage.removeItem('walletId');
    }
  };

  const signTransaction = async (xdr: string, options: { networkPassphrase: string }) => {
    if (!walletKit) throw new Error('Wallet kit not initialized');
    // Ensure wallet module is set; attempt restore from state/localStorage
    try {
      const id =
        walletId || (typeof window !== 'undefined' ? localStorage.getItem('walletId') : null);
      if (id) {
        walletKit.setWallet(id);
      } else {
        const inferredId = mapWalletNameToId(walletName);
        if (inferredId) {
          walletKit.setWallet(inferredId);
        }
      }
    } catch (e) {}
    const { signedTxXdr } = await walletKit.signTransaction(xdr, {
      address: walletAddress || undefined,
      networkPassphrase: options.networkPassphrase,
    });
    return signedTxXdr;
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletName,
        walletId,
        authMethod,
        setWalletInfo,
        clearWalletInfo,
        signTransaction: walletAddress ? signTransaction : null,
        walletKit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider');
  return ctx;
};
