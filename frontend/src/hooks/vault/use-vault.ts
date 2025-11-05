'use client';

import * as StellarSdk from '@stellar/stellar-sdk';
import { useCallback, useState } from 'react';
import { getEnvDefaults } from '@/lib/env';
import { useWalletContext } from '@/providers/wallet.provider';
import { mapContractErrorToMessage } from '@/lib/utils';

async function waitForTx(server: StellarSdk.rpc.Server, hash: string): Promise<void> {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await server.getTransaction(hash);
      const status = (res as { status: string }).status;
      if (status === 'SUCCESS') return;
      if (status === 'FAILED') throw new Error(mapContractErrorToMessage('FAILED'));
    } catch {
      // Ignore errors and continue polling
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
}

export function useVault() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { rpcUrl, networkPassphrase, vaultContractId } = getEnvDefaults();
  const [loading, setLoading] = useState(false);

  const createVault = useCallback(
    async (didUri: string) => {
      if (!walletAddress) throw new Error('Connect your wallet first');
      if (!vaultContractId) throw new Error('Missing NEXT_PUBLIC_VAULT_CONTRACT_ID in .env.local');
      if (!signTransaction) throw new Error('Signer unavailable');

      setLoading(true);
      try {
        const server = new StellarSdk.rpc.Server(rpcUrl);
        const sourceAccount = await server.getAccount(walletAddress);
        const account = new StellarSdk.Account(walletAddress, sourceAccount.sequenceNumber());
        const contract = new StellarSdk.Contract(vaultContractId);

        let tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE.toString(),
          networkPassphrase,
        })
          .addOperation(
            contract.call(
              'initialize',
              StellarSdk.Address.fromString(walletAddress).toScVal(),
              StellarSdk.xdr.ScVal.scvString(didUri)
            )
          )
          .setTimeout(60)
          .build();
        tx = await server.prepareTransaction(tx);
        const signedXdr = await signTransaction(tx.toXDR(), { networkPassphrase });
        const signed = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
        const send = await server.sendTransaction(signed);
        if (send.errorResult) {
          let errStr = 'unknown';
          try {
            errStr = (send.errorResult as { result(): { toString(): string } }).result().toString();
          } catch {
            try {
              errStr = (send.errorResult as { toXDR(): { toString(encoding: string): string } })
                .toXDR()
                .toString('base64');
            } catch {
              errStr = '[unavailable error details]';
            }
          }
          const friendly = mapContractErrorToMessage(errStr);
          throw new Error(friendly);
        }
        if (
          send.status === 'PENDING' ||
          send.status === 'DUPLICATE' ||
          send.status === 'TRY_AGAIN_LATER'
        ) {
          await waitForTx(server, send.hash!);
        } else if (send.status === 'ERROR') {
          throw new Error(mapContractErrorToMessage('ERROR'));
        }
        return { txId: send.hash! };
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === 'object' && e && 'message' in (e as any)
              ? String((e as any).message)
              : String(e);
        const friendly = mapContractErrorToMessage(msg);
        throw new Error(friendly);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, vaultContractId, signTransaction, rpcUrl, networkPassphrase]
  );

  const authorizeSelf = useCallback(async () => {
    if (!walletAddress) throw new Error('Connect your wallet first');
    if (!vaultContractId) throw new Error('Missing NEXT_PUBLIC_VAULT_CONTRACT_ID in .env.local');
    if (!signTransaction) throw new Error('Signer unavailable');
    setLoading(true);
    try {
      const server = new StellarSdk.rpc.Server(rpcUrl);
      const sourceAccount = await server.getAccount(walletAddress);
      const account = new StellarSdk.Account(walletAddress, sourceAccount.sequenceNumber());
      const contract = new StellarSdk.Contract(vaultContractId);

      let tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE.toString(),
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            'authorize_issuer',
            StellarSdk.Address.fromString(walletAddress).toScVal(),
            StellarSdk.Address.fromString(walletAddress).toScVal()
          )
        )
        .setTimeout(60)
        .build();

      tx = await server.prepareTransaction(tx);
      const signedXdr = await signTransaction(tx.toXDR(), { networkPassphrase });
      const signed = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
      const send = await server.sendTransaction(signed);
      if (send.errorResult) {
        let errStr = 'unknown';
        try {
          errStr = (send.errorResult as { result(): { toString(): string } }).result().toString();
        } catch {
          try {
            errStr = (send.errorResult as { toXDR(): { toString(encoding: string): string } })
              .toXDR()
              .toString('base64');
          } catch {
            errStr = '[unavailable error details]';
          }
        }
        const friendly = mapContractErrorToMessage(errStr);
        throw new Error(friendly);
      }
      if (
        send.status === 'PENDING' ||
        send.status === 'DUPLICATE' ||
        send.status === 'TRY_AGAIN_LATER'
      ) {
        await waitForTx(server, send.hash!);
      } else if (send.status === 'ERROR') {
        throw new Error(mapContractErrorToMessage('ERROR'));
      }
      return { txId: send.hash! };
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'object' && e && 'message' in (e as any)
            ? String((e as any).message)
            : String(e);
      const friendly = mapContractErrorToMessage(msg);
      throw new Error(friendly);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, vaultContractId, signTransaction, rpcUrl, networkPassphrase]);

  const authorizeAddress = useCallback(
    async (address: string) => {
      if (!walletAddress) throw new Error('Connect your wallet first');
      if (!vaultContractId) throw new Error('Missing NEXT_PUBLIC_VAULT_CONTRACT_ID in .env.local');
      if (!signTransaction) throw new Error('Signer unavailable');
      if (!address) throw new Error('Address required');
      setLoading(true);
      try {
        const server = new StellarSdk.rpc.Server(rpcUrl);
        const sourceAccount = await server.getAccount(walletAddress);
        const account = new StellarSdk.Account(walletAddress, sourceAccount.sequenceNumber());
        const contract = new StellarSdk.Contract(vaultContractId);

        let tx = new StellarSdk.TransactionBuilder(account, {
          fee: StellarSdk.BASE_FEE.toString(),
          networkPassphrase,
        })
          .addOperation(
            contract.call(
              'authorize_issuer',
              StellarSdk.Address.fromString(walletAddress).toScVal(),
              StellarSdk.Address.fromString(address).toScVal()
            )
          )
          .setTimeout(60)
          .build();

        tx = await server.prepareTransaction(tx);
        const signedXdr = await signTransaction(tx.toXDR(), { networkPassphrase });
        const signed = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
        const send = await server.sendTransaction(signed);
        if (send.errorResult) {
          let errStr = 'unknown';
          try {
            errStr = (send.errorResult as { result(): { toString(): string } }).result().toString();
          } catch {
            try {
              errStr = (send.errorResult as { toXDR(): { toString(encoding: string): string } })
                .toXDR()
                .toString('base64');
            } catch {
              errStr = '[unavailable error details]';
            }
          }
          const friendly = mapContractErrorToMessage(errStr);
          throw new Error(friendly);
        }
        if (
          send.status === 'PENDING' ||
          send.status === 'DUPLICATE' ||
          send.status === 'TRY_AGAIN_LATER'
        ) {
          await waitForTx(server, send.hash!);
        } else if (send.status === 'ERROR') {
          throw new Error(mapContractErrorToMessage('ERROR'));
        }
        return { txId: send.hash! };
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === 'object' && e && 'message' in (e as any)
              ? String((e as any).message)
              : String(e);
        const friendly = mapContractErrorToMessage(msg);
        throw new Error(friendly);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, vaultContractId, signTransaction, rpcUrl, networkPassphrase]
  );

  return {
    loading,
    createVault,
    authorizeAddress,
    authorizeSelf,
  };
}
