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
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Required: your deployed contract IDs
NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID=
NEXT_PUBLIC_VAULT_CONTRACT_ID=
```

These variables are read in `src/lib/env.ts` and used by the issuance/store helpers.

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

  const { txId } = await issueCredentialSingleCall({
    owner: walletAddress,
    vcId: 'vc:example:123',
    vcData: JSON.stringify({ type: 'Attestation', subject: '...' }),
    vaultContractId: process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID!,
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
