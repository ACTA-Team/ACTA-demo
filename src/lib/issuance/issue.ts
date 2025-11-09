'use client';

import * as StellarSdk from '@stellar/stellar-sdk';
import { getClientConfig } from '@/lib/env';

type IssueParams = {
  owner: string;
  vcId: string;
  vcData: string;
  vaultContractId: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

type IssueResult = {
  txId: string;
};

async function waitForTx(server: StellarSdk.rpc.Server, hash: string): Promise<void> {
  for (let i = 0; i < 30; i++) {
    const res = await server.getTransaction(hash);
    const status = (res as { status: string }).status;
    if (status === 'SUCCESS') return;
    if (status === 'FAILED') throw new Error('Transaction failed');
    await new Promise((r) => setTimeout(r, 1000));
  }
}

export async function issueCredentialSingleCall({
  owner,
  vcId,
  vcData,
  vaultContractId,
  signTransaction,
}: IssueParams): Promise<IssueResult> {
  const { apiBaseUrl, rpcUrl, networkPassphrase, issuanceContractId, apiKey } =
    await getClientConfig();
  if (!issuanceContractId) throw new Error('Issuance contract ID is not configured');

  const server = new StellarSdk.rpc.Server(rpcUrl);
  const sourceAccount = await server.getAccount(owner);
  const account = new StellarSdk.Account(owner, sourceAccount.sequenceNumber());
  const contract = new StellarSdk.Contract(issuanceContractId);

  let tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE.toString(),
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        'issue',
        StellarSdk.Address.fromString(owner).toScVal(),
        StellarSdk.xdr.ScVal.scvString(vcId),
        StellarSdk.xdr.ScVal.scvString(vcData),
        StellarSdk.Address.fromString(vaultContractId).toScVal()
      )
    )
    .setTimeout(30)
    .build();

  // Prepare transaction to add resource fees & footprint
  tx = await server.prepareTransaction(tx);

  // Sign with connected wallet
  const signedXdr = await signTransaction(tx.toXDR(), { networkPassphrase });

  // Submit signed XDR via API (user-signed flow)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (apiKey) headers['X-ACTA-Key'] = apiKey;

  const resp = await fetch(`/api/proxy/credentials`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ signedXdr, vcId }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(async () => ({ message: await resp.text() }));
    throw new Error(err?.message || `API error: ${resp.status}`);
  }
  const json = (await resp.json()) as { tx_id: string };

  // Optionally wait until success on RPC
  await waitForTx(server, json.tx_id).catch(() => {});

  return { txId: json.tx_id };
}
