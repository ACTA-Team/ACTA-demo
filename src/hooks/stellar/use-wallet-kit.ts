'use client';

import { ISupportedWallet } from '@creit.tech/stellar-wallets-kit';
import { useWalletContext } from '@/providers/wallet.provider';

export const useWalletKit = () => {
  const { setWalletInfo, walletKit } = useWalletContext();

  const connectWithWalletKit = async () => {
    if (!walletKit) throw new Error('WalletKit not available');
    await walletKit.openModal({
      modalTitle: 'Connect your Stellar wallet',
      onWalletSelected: async (option: ISupportedWallet) => {
        walletKit.setWallet(option.id);
        const { address } = await walletKit.getAddress();
        const { name, id } = option;
        await setWalletInfo(address, name, id);
      },
    });
  };

  const disconnectWalletKit = async () => {
    await walletKit?.disconnect();
  };

  return { connectWithWalletKit, disconnectWalletKit };
};
