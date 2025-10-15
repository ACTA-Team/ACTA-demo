export type EnvDefaults = {
  apiBaseUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  issuanceContractId: string;
  vaultContractId: string;
};

export function getEnvDefaults(): EnvDefaults {
  const apiBaseUrl = process.env.NEXT_PUBLIC_ACTA_API_URL || "http://localhost:8000";
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
  const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
  const issuanceContractId = process.env.NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID || "";
  const vaultContractId = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID || "";
  return { apiBaseUrl, rpcUrl, networkPassphrase, issuanceContractId, vaultContractId };
}