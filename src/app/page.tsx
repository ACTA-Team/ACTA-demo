"use client";

import { useState } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useWalletKit } from "@/hooks/stellar/use-wallet-kit";
import { storeVcSingleCall } from "@/lib/vault/store";
import { getEnvDefaults } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { toast } from "sonner";

export default function Home() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { connectWithWalletKit } = useWalletKit();
  const { issuanceContractId, rpcUrl, networkPassphrase } = getEnvDefaults();

  // Friendly VC fields
  const [vcId, setVcId] = useState(""); // Credential ID
  const [issuerDid, setIssuerDid] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [subjectDid, setSubjectDid] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [degreeName, setDegreeName] = useState("");
  const [validFrom, setValidFrom] = useState(""); // ISO date-time
  const [txId, setTxId] = useState<string | null>(null);

  const handleConnect = async () => {
    await connectWithWalletKit();
  };

  const handleCreate = async () => {
    if (!walletAddress) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!issuanceContractId) {
      toast.error("Set NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID in .env.local");
      return;
    }
    if (!vcId || !issuerDid || !issuerName || !subjectDid || !degreeType || !degreeName || !validFrom) {
      toast.error("Please complete all fields");
      return;
    }
    if (!signTransaction) {
      toast.error("Signer unavailable");
      return;
    }
    toast.info("Signing and submitting...");
    setTxId(null);
    try {
      const vc = {
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://www.w3.org/ns/credentials/examples/v2",
        ],
        id: vcId,
        type: ["VerifiableCredential", "ExampleDegreeCredential"],
        issuer: { id: issuerDid, name: issuerName },
        validFrom,
        credentialSubject: {
          id: subjectDid,
          degree: { type: degreeType, name: degreeName },
        },
        proof: {
          type: "DataIntegrityProof",
          created: new Date().toISOString(),
          verificationMethod:
            "did:key:zDnaebSRtPnW6YCpxAhR5JPxJqt9UunCsBPhLEtUokUvp87nQ",
          cryptosuite: "ecdsa-rdfc-2019",
          proofPurpose: "assertionMethod",
          proofValue:
            "z35CwmxThsUQ4t79JfacmMcw4y1kCqtD4rKqUooKM2NyKwdF5jmXMRo9oGnzHerf8hfQiWkEReycSXC2NtRrdMZN4",
        },
      };

      const vcData = JSON.stringify(vc);
      const fields = {
        issuerName,
        subjectDid,
        degreeType,
        degreeName,
        validFrom,
        vcData,
      } as Record<string, string>;

      const result = await storeVcSingleCall({
        owner: walletAddress,
        vcId,
        didUri: issuerDid,
        fields,
        signTransaction: (xdr, opts) => signTransaction(xdr, opts),
      });
      setTxId(result.txId);
      const isTestnet = /testnet/i.test(rpcUrl) || /Test SDF Network/i.test(networkPassphrase);
      const explorerBase = isTestnet ? "https://stellar.expert/explorer/testnet" : "https://stellar.expert/explorer/public";
      const explorerUrl = `${explorerBase}/tx/${result.txId}`;
      toast.success("Credencial creada", {
        description: `Tx: ${result.txId}`,
        action: {
          label: "Ver en Stellar Expert",
          onClick: () => {
            try {
              window.open(explorerUrl, "_blank", "noopener,noreferrer");
            } catch (_) {
              window.location.href = explorerUrl;
            }
          },
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    }
  };

  const fillExample = () => {
    setVcId("http://university.example/credentials/3732");
    setIssuerDid("did:example:76e12ec712ebc6f1c221ebfeb1f");
    setIssuerName("Example University");
    setSubjectDid("did:example:ebfeb1f712ebc6f1c276e12ec21");
    setDegreeType("ExampleBachelorDegree");
    setDegreeName("Bachelor of Science and Arts");
    setValidFrom("2010-01-01T19:23:24Z");
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
        <div className="relative overflow-hidden rounded border p-4 space-y-3">
          <div className="flex justify-end">
            <Button variant="secondary" onClick={fillExample}>Fill Example</Button>
          </div>
          <div>
            <label className="text-sm">Credential ID</label>
            <input
              className="w-full border rounded p-2"
              value={vcId}
              onChange={(e) => setVcId(e.target.value)}
              placeholder="http://university.example/credentials/3732"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Issuer name</label>
              <input
                className="w-full border rounded p-2"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                placeholder="Example University"
              />
            </div>
            <div>
              <label className="text-sm">Issuer DID</label>
              <input
                className="w-full border rounded p-2"
                value={issuerDid}
                onChange={(e) => setIssuerDid(e.target.value)}
                placeholder="did:example:76e12ec712ebc6f1c221ebfeb1f"
              />
            </div>
            <div>
              <label className="text-sm">Valid from</label>
              <input
                className="w-full border rounded p-2"
                type="text"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                placeholder="2010-01-01T19:23:24Z"
              />
            </div>
            <div>
              <label className="text-sm">Subject DID</label>
              <input
                className="w-full border rounded p-2"
                value={subjectDid}
                onChange={(e) => setSubjectDid(e.target.value)}
                placeholder="did:example:ebfeb1f712ebc6f1c276e12ec21"
              />
            </div>
            <div>
              <label className="text-sm">Degree type</label>
              <input
                className="w-full border rounded p-2"
                value={degreeType}
                onChange={(e) => setDegreeType(e.target.value)}
                placeholder="ExampleBachelorDegree"
              />
            </div>
            <div>
              <label className="text-sm">Degree name</label>
              <input
                className="w-full border rounded p-2"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                placeholder="Bachelor of Science and Arts"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleCreate}>Create Credential</Button>
          </div>

          {txId && (
            <div className="mt-2">
              <p className="text-sm">Tx ID:</p>
              <p className="text-xs font-mono break-all">{txId}</p>
            </div>
          )}

          {/* Border beams for visual accent */}
          <BorderBeam
            duration={6}
            size={400}
            className="from-transparent via-red-500 to-transparent"
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={2}
            className="from-transparent via-blue-500 to-transparent"
          />
        </div>
      )}
    </section>
  );
}
