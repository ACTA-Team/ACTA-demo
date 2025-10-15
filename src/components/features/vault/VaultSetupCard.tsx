"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/providers/wallet.provider";
import { useDid } from "@/hooks/did/use-did";
import { useVault } from "@/hooks/vault/use-vault";
import { toast } from "sonner";
import { BorderBeam } from "@/components/ui/border-beam";

export function VaultSetupCard() {
  const { walletAddress } = useWalletContext();
  const { ownerDid } = useDid();
  const { loading, createVault } = useVault();
  const [txInit, setTxInit] = useState<string | null>(null);

  const doCreateVault = async () => {
    if (!ownerDid) {
      toast.error("Create or save your DID first");
      return;
    }
    try {
      toast.info("Creating vault...");
      const res = await createVault(ownerDid);
      setTxInit(res.txId);
      toast.success("Vault created", { description: `Tx: ${res.txId}` });
    } catch (e: any) {
      toast.error(e?.message || "Failed to create vault");
    }
  };

  return (
    <div className="relative overflow-hidden rounded border p-4 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || "Not connected"}</p>
      </div>
      <div>
        <p className="text-sm">Owner DID</p>
        <p className="text-xs font-mono break-all">{ownerDid || "—"}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={doCreateVault} disabled={!walletAddress || loading} variant="secondary">Create Vault</Button>
      </div>
      {txInit && (
        <div className="mt-2">
          <p className="text-sm">Create Vault Tx</p>
          <p className="text-xs font-mono break-all">{txInit}</p>
        </div>
      )}

      <BorderBeam duration={6} size={400} className="from-transparent via-red-500 to-transparent" />
      <BorderBeam duration={6} delay={3} size={400} borderWidth={2} className="from-transparent via-blue-500 to-transparent" />
    </div>
  );
}