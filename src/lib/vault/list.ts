'use client';

import { getEnvDefaults } from '@/lib/env';
import { mapContractErrorToMessage } from '@/lib/utils';

type ListParams = {
  owner: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

type ListDirectParams = {
  owner: string;
};

export async function listVcIdsSingleCall({
  owner,
  signTransaction,
}: ListParams): Promise<string[]> {
  const { apiBaseUrl, networkPassphrase } = getEnvDefaults();

  // 1) Prepare unsigned XDR
  const prepResp = await fetch(`/api/proxy/tx/prepare/list_vc_ids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner }),
  });
  if (!prepResp.ok) {
    const err = await prepResp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${prepResp.status}`);
    throw new Error(friendly);
  }
  const prepJson = (await prepResp.json()) as { unsignedXdr: string };

  // 2) Sign with wallet
  const signedXdr = await signTransaction(prepJson.unsignedXdr, { networkPassphrase });

  // 3) Execute read with signed XDR
  const resp = await fetch(`/api/proxy/vault/list_vc_ids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedXdr }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc_ids: string[] };
  return json.vc_ids || [];
}

export async function listVcIdsDirect({ owner }: ListDirectParams): Promise<string[]> {
  const { apiBaseUrl } = getEnvDefaults();

  const resp = await fetch(`/api/proxy/vault/list_vc_ids_direct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc_ids: string[] };
  return json.vc_ids || [];
}
