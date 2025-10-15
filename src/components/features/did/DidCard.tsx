"use client";

import { useWalletContext } from "@/providers/wallet.provider";
import { useDid } from "@/hooks/did/use-did";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DidCard() {
  const { walletAddress } = useWalletContext();
  const { ownerDid, computeDid, saveComputedDid } = useDid();

  const onSave = () => {
    const did = computeDid();
    if (!did) {
      toast.error("Connect your wallet to compute DID");
      return;
    }
    saveComputedDid();
    toast.success("DID saved", { description: did });
  };

  return (
    <div className="relative overflow-hidden rounded border p-4 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || "Not connected"}</p>
      </div>
      <div>
        <p className="text-sm">Computed DID</p>
        <p className="text-xs font-mono break-all">{ownerDid || "—"}</p>
      </div>
      <div className="pt-2 flex gap-2">
        <Button onClick={onSave} disabled={!walletAddress}>Compute & Save DID</Button>
      </div>
    </div>
  );
}