'use client';

import * as StellarSdk from '@stellar/stellar-sdk';
import { getEnvDefaults } from '@/lib/env';
import { mapContractErrorToMessage } from '@/lib/utils';

type StoreParams = {
  owner: string;
  vcId: string;
  didUri: string; // Owner DID (vault-scoped DID)
  fields: Record<string, string>; // Normal form fields
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

type StoreResult = { txId: string };

async function waitForTx(server: StellarSdk.rpc.Server, hash: string): Promise<void> {
  for (let i = 0; i < 30; i++) {
    const res = await server.getTransaction(hash);
    const status = (res as { status: string }).status;
    if (status === 'SUCCESS') return;
    if (status === 'FAILED') throw new Error(mapContractErrorToMessage('FAILED'));
    await new Promise((r) => setTimeout(r, 1000));
  }
}

export async function storeVcSingleCall({
  owner,
  vcId,
  didUri,
  fields,
  signTransaction,
}: StoreParams): Promise<StoreResult> {
  const { apiBaseUrl, rpcUrl, networkPassphrase } = getEnvDefaults();

  const server = new StellarSdk.rpc.Server(rpcUrl);

  const prepResp = await fetch(`/api/proxy/tx/prepare/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, vcId, didUri, fields }),
  });
  if (!prepResp.ok) {
    const err = await prepResp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${prepResp.status}`);
    throw new Error(friendly);
  }
  const prepJson = (await prepResp.json()) as { unsignedXdr: string };

  const signedXdr = await signTransaction(prepJson.unsignedXdr, { networkPassphrase });

  const resp = await fetch(`/api/proxy/vault/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedXdr, vcId }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { tx_id: string };

  await waitForTx(server, json.tx_id).catch(() => {});

  return { txId: json.tx_id };
}
