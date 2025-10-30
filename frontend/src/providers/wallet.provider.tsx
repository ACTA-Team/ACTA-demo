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
  authMethod: 'wallet' | null;
  setWalletInfo: (address: string, name: string) => Promise<void>;
  clearWalletInfo: () => void;
  signTransaction:
    | ((xdr: string, options: { networkPassphrase: string }) => Promise<string>)
    | null;
  walletKit: StellarWalletsKit | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'wallet' | null>(null);
  const [walletKit, setWalletKit] = useState<StellarWalletsKit | null>(null);

  useEffect(() => {
    // Restore session
    const storedAddress =
      typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
    const storedName = typeof window !== 'undefined' ? localStorage.getItem('walletName') : null;
    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
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
        } catch (err) {
          console.error('Failed to initialize WalletConnect', err);
        }
      })();
    }
  }, []);

  const setWalletInfo = async (address: string, name: string) => {
    setWalletAddress(address);
    setWalletName(name);
    setAuthMethod('wallet');
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletName', name);
    }
  };

  const clearWalletInfo = () => {
    setWalletAddress(null);
    setWalletName(null);
    setAuthMethod(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletName');
    }
  };

  const signTransaction = async (xdr: string, options: { networkPassphrase: string }) => {
    if (!walletKit) throw new Error('Wallet kit not initialized');
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
