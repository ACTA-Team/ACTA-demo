# ACTA Demo

This demo showcases how to integrate the ACTA API with a Next.js application using a Stellar wallet (Freighter). It is intended for developers who want to understand the code-level steps to issue and store Verifiable Credentials (VC) via ACTA.

## What this demo includes

- Wallet-gated UI with simple flows: Vault, Authorized Issuers, DID, and Credential creation.
- Client-signed transactions using `@creit.tech/stellar-wallets-kit`.
- Minimal helpers that call ACTA API endpoints at the code level.

## Prerequisites

- Install Freighter: https://www.freighter.app/
- Access to Soroban Testnet RPC.

## Environment

Create `.env.local` with:

```
NEXT_PUBLIC_ACTA_API_URL=http://localhost:8000
WALLETCONNECT_PROJECT_ID=
```

The demo now fetches RPC URL, network passphrase, and contract IDs from the ACTA API (`GET /config`). No need to set `NEXT_PUBLIC_*` for those values.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Code-level API integration

The demo integrates with the public ACTA API using two minimal helpers:

- Issuance: `src/lib/issuance/issue.ts`
  - Builds a Soroban transaction for `issue` with your issuance contract ID.
  - Signs the XDR with the connected wallet.
  - Submits user-signed XDR to `POST /credentials`.

  Example usage:

  ```ts
  import { issueCredentialSingleCall } from '@/lib/issuance/issue';

  const { vaultContractId } = await getClientConfig();
  const { txId } = await issueCredentialSingleCall({
    owner: walletAddress,
    vcId: 'vc:example:123',
    vcData: JSON.stringify({ type: 'Attestation', subject: '...' }),
    vaultContractId,
    signTransaction,
  });
  ```

- Vault store (client-signed flow): `src/lib/vault/store.ts`
  - Prepares an unsigned XDR from normal form fields via `POST /tx/prepare/store`.
  - Signs the XDR with the connected wallet.
  - Submits to `POST /vault/store`.

  Example usage:

  ```ts
  import { storeVcSingleCall } from '@/lib/vault/store';

  const { txId } = await storeVcSingleCall({
    owner: walletAddress,
    vcId,
    didUri: ownerDid,
    fields: {
      vcData,
      issuerName,
      subjectDid,
      degreeType,
      degreeName,
      validFrom,
    },
    signTransaction, // provided by WalletProvider
  });
  ```

Both helpers rely on `signTransaction` from `WalletProvider` (`src/providers/wallet.provider.tsx`), which wraps Freighter via `StellarWalletsKit`.

The credential form demonstrating these calls lives at `src/components/features/credential/CredentialForm.tsx`.

## Endpoints and docs

- Public API reference: https://docs.acta.build
- Base URL: `https://api.acta.build`
- Key endpoints:
  - `POST /credentials` — issue a VC and store it in the Vault
  - `POST /vault/store` — store a VC via a user-signed XDR
  - `POST /tx/prepare/store` — prepare unsigned XDR from normal form fields
  - `GET /verify/{vc_id}` — verify VC status

## Notes

- Use testnet settings while developing locally.
- Do not store PII in plaintext on chain; prefer hashes or ciphertext.
- Ensure your issuance and vault contract IDs are set and valid before issuing or storing.
