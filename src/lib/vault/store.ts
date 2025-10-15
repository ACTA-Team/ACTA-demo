"use client";

import * as StellarSdk from "@stellar/stellar-sdk";
import { getEnvDefaults } from "@/lib/env";

type StoreParams = {
  owner: string;
  vcId: string;
  didUri: string; // DID del issuer
  fields: Record<string, string>; // Campos normales del formulario
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
};

type StoreResult = { txId: string };

async function waitForTx(server: StellarSdk.rpc.Server, hash: string): Promise<void> {
  for (let i = 0; i < 30; i++) {
    const res = await server.getTransaction(hash);
    const status = (res as { status: string }).status;
    if (status === "SUCCESS") return;
    if (status === "FAILED") throw new Error("Transaction failed");
    await new Promise((r) => setTimeout(r, 1000));
  }
}

export async function storeVcSingleCall({ owner, vcId, didUri, fields, signTransaction }: StoreParams): Promise<StoreResult> {
  const { apiBaseUrl, rpcUrl, networkPassphrase } = getEnvDefaults();

  const server = new StellarSdk.rpc.Server(rpcUrl);

  // 1) Preparar XDR en la API a partir de campos normales
  const prepResp = await fetch(`${apiBaseUrl}/tx/prepare/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, vcId, didUri, fields }),
  });
  if (!prepResp.ok) {
    const err = await prepResp.json().catch(() => ({}));
    throw new Error(err?.message || `API error: ${prepResp.status}`);
  }
  const prepJson = (await prepResp.json()) as { unsignedXdr: string };

  // 2) Firmar con la wallet conectada
  const signedXdr = await signTransaction(prepJson.unsignedXdr, { networkPassphrase });

  // 3) Enviar a API en flujo user-signed
  const resp = await fetch(`${apiBaseUrl}/vault/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signedXdr, vcId }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.message || `API error: ${resp.status}`);
  }
  const json = (await resp.json()) as { tx_id: string };

  await waitForTx(server, json.tx_id).catch(() => {});

  return { txId: json.tx_id };
}