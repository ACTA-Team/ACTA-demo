'use client';

import { getEnvDefaults } from '@/lib/env';
import { mapContractErrorToMessage } from '@/lib/utils';

type GetParams = {
  owner: string;
  vcId: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

type GetDirectParams = {
  owner: string;
  vcId: string;
};

export async function getVcSingleCall({
  owner,
  vcId,
  signTransaction,
}: GetParams): Promise<unknown> {
  const { apiBaseUrl, networkPassphrase } = getEnvDefaults();

  // 1) Prepare unsigned XDR
  const prepForm = new URLSearchParams();
  prepForm.set('owner', owner);
  prepForm.set('vcId', vcId);
  const prepResp = await fetch(`${apiBaseUrl}/tx/prepare/get_vc`, {
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
  const resp = await fetch(`${apiBaseUrl}/vault/get_vc`, {
    method: 'POST',
    body: readForm,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc: unknown };
  return json.vc;
}

export async function getVcDirect({ owner, vcId }: GetDirectParams): Promise<unknown> {
  const { apiBaseUrl } = getEnvDefaults();

  const directForm = new URLSearchParams();
  directForm.set('owner', owner);
  directForm.set('vcId', vcId);
  const resp = await fetch(`${apiBaseUrl}/vault/get_vc_direct`, {
    method: 'POST',
    body: directForm,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc: unknown };
  return json.vc;
}
