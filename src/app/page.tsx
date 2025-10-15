"use client";

import { useState } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useWalletKit } from "@/hooks/stellar/use-wallet-kit";
import { storeVcSingleCall } from "@/lib/vault/store";
import { getEnvDefaults } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { connectWithWalletKit } = useWalletKit();
  const { issuanceContractId } = getEnvDefaults();

  const [vcId, setVcId] = useState("");
  const [didUri, setDidUri] = useState("");
  // Normal form fields (no JSON input)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [expires, setExpires] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const handleConnect = async () => {
    await connectWithWalletKit();
  };

  const handleStore = async () => {
    if (!walletAddress) {
      setStatus("Connect your wallet first");
      return;
    }
    if (!issuanceContractId) {
      setStatus("Set NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID in .env.local");
      return;
    }
    if (!vcId || !didUri) {
      setStatus("Fill vcId and DID");
      return;
    }
    // Basic form validation
    if (!firstName || !lastName) {
      setStatus("Fill first name and last name");
      return;
    }
    if (!signTransaction) {
      setStatus("Signer unavailable");
      return;
    }
    setStatus("Signing and submitting...");
    toast.info("Signing and submitting...");
    setTxId(null);
    try {
      const fields = { firstName, lastName, email, type, expires };
      const result = await storeVcSingleCall({
        owner: walletAddress,
        vcId,
        didUri,
        fields,
        signTransaction: (xdr, opts) => signTransaction(xdr, opts),
      });
      setTxId(result.txId);
      setStatus("Submitted. Waiting for confirmation...");
      toast.success("Transaction submitted");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      {!walletAddress ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
          <p className="text-base">Connect your wallet to begin.</p>
          <div className="mt-4">
            <Button className="px-6 py-3 text-base" onClick={handleConnect}>
              Connect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded border p-4 space-y-3">
          <div>
            <label className="text-sm">VC ID</label>
            <input
              className="w-full border rounded p-2"
              value={vcId}
              onChange={(e) => setVcId(e.target.value)}
              placeholder="vc-123"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">First name</label>
              <input
                className="w-full border rounded p-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <label className="text-sm">Last name</label>
              <input
                className="w-full border rounded p-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <div>
              <label className="text-sm">Email</label>
              <input
                className="w-full border rounded p-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-sm">Credential type</label>
              <input
                className="w-full border rounded p-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Attestation"
              />
            </div>
            <div>
              <label className="text-sm">Expires (YYYY-MM-DD)</label>
              <input
                className="w-full border rounded p-2"
                type="date"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm">Issuer DID</label>
            <input
              className="w-full border rounded p-2"
              value={didUri}
              onChange={(e) => setDidUri(e.target.value)}
              placeholder="did:pkh:stellar:testnet:G..."
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleStore}>Store in Vault (user-signed)</Button>
          </div>

          {status && <p className="mt-3 text-sm">{status}</p>}
          {txId && (
            <div className="mt-2">
              <p className="text-sm">Tx ID:</p>
              <p className="text-xs font-mono break-all">{txId}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
