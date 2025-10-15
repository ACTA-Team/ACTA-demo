"use client";

import { useCallback } from "react";
import { getEnvDefaults } from "@/lib/env";
import { useWalletContext } from "@/providers/wallet.provider";
import { useDidContext } from "@/providers/did.provider";

function detectNetworkTag(rpcUrl: string, networkPassphrase: string): "testnet" | "public" {
  const isTestnet = /testnet/i.test(rpcUrl) || /Test SDF Network/i.test(networkPassphrase);
  return isTestnet ? "testnet" : "public";
}

export function useDid() {
  const { walletAddress } = useWalletContext();
  const { ownerDid, setOwnerDid } = useDidContext();
  const { rpcUrl, networkPassphrase } = getEnvDefaults();

  const computeDid = useCallback(() => {
    if (!walletAddress) return null;
    const tag = detectNetworkTag(rpcUrl, networkPassphrase);
    return `did:pkh:stellar:${tag}:${walletAddress}`;
  }, [walletAddress, rpcUrl, networkPassphrase]);

  const saveComputedDid = useCallback(() => {
    const did = computeDid();
    if (did) setOwnerDid(did);
    return did;
  }, [computeDid, setOwnerDid]);

  return {
    ownerDid,
    computeDid,
    saveComputedDid,
  };
}