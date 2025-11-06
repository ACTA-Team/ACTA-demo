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
  const prepForm = new URLSearchParams();
  prepForm.set('owner', owner);
  const prepResp = await fetch(`${apiBaseUrl}/tx/prepare/list_vc_ids`, {
    method: 'POST',
    body: prepForm,
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
  const readForm = new URLSearchParams();
  readForm.set('signedXdr', signedXdr);
  const resp = await fetch(`${apiBaseUrl}/vault/list_vc_ids`, {
    method: 'POST',
    body: readForm,
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

  const directForm = new URLSearchParams();
  directForm.set('owner', owner);
  const resp = await fetch(`${apiBaseUrl}/vault/list_vc_ids_direct`, {
    method: 'POST',
    body: directForm,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc_ids: string[] };
  return json.vc_ids || [];
}
