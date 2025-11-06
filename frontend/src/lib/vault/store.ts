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

  // 1) Prepare unsigned XDR in the API from normal form fields
  // Use URL-encoded to avoid CORS preflight while keeping semantics
  const prepForm = new URLSearchParams();
  prepForm.set('owner', owner);
  prepForm.set('vcId', vcId);
  prepForm.set('didUri', didUri);
  // Flatten fields into form entries
  Object.entries(fields || {}).forEach(([k, v]) => {
    prepForm.set(k, String(v));
  });
  const prepResp = await fetch(`${apiBaseUrl}/tx/prepare/store`, {
    method: 'POST',
    body: prepForm,
  });
  if (!prepResp.ok) {
    const err = await prepResp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${prepResp.status}`);
    throw new Error(friendly);
  }
  const prepJson = (await prepResp.json()) as { unsignedXdr: string };

  // 2) Sign with the connected wallet
  const signedXdr = await signTransaction(prepJson.unsignedXdr, { networkPassphrase });

  // 3) Submit to API using the user-signed flow
  const storeForm = new URLSearchParams();
  storeForm.set('signedXdr', signedXdr);
  storeForm.set('vcId', vcId);
  const resp = await fetch(`${apiBaseUrl}/vault/store`, {
    method: 'POST',
    body: storeForm,
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
