'use client';

import { getEnvDefaults } from '@/lib/env';
import { mapContractErrorToMessage } from '@/lib/utils';

type GetParams = {
  owner: string;
  vcId: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

export async function getVcSingleCall({ owner, vcId, signTransaction }: GetParams): Promise<any> {
  const { apiBaseUrl, networkPassphrase } = getEnvDefaults();

  // 1) Prepare unsigned XDR
  const prepResp = await fetch(`${apiBaseUrl}/tx/prepare/get_vc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, vcId }),
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
  const resp = await fetch(`${apiBaseUrl}/vault/get_vc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedXdr }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const friendly = mapContractErrorToMessage(err?.message || `API error: ${resp.status}`);
    throw new Error(friendly);
  }
  const json = (await resp.json()) as { vc: any };
  return json.vc;
}
