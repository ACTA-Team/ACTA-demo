export type EnvDefaults = {
  apiBaseUrl: string;
  rpcUrl: string;
  networkPassphrase: string;
  issuanceContractId: string;
  vaultContractId: string;
};

export function getEnvDefaults(): EnvDefaults {
  // Prefer explicit TESTNET base URL if provided, otherwise fall back
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_ACTA_API_URL_TESTNET ||
    process.env.NEXT_PUBLIC_ACTA_API_URL ||
    'https://api.testnet.acta.build';
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
  const networkPassphrase =
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
  const issuanceContractId = process.env.NEXT_PUBLIC_ACTA_ISSUANCE_CONTRACT_ID || '';
  const vaultContractId = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID || '';
  return { apiBaseUrl, rpcUrl, networkPassphrase, issuanceContractId, vaultContractId };
}

let cachedConfig: EnvDefaults | null = null;

export async function getClientConfig(): Promise<EnvDefaults> {
  if (cachedConfig) return cachedConfig;
  const defaults = getEnvDefaults();
  try {
    const resp = await fetch(`${defaults.apiBaseUrl}/config`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!resp.ok) throw new Error(`config_http_${resp.status}`);
    const json = (await resp.json()) as Partial<EnvDefaults>;
    const merged: EnvDefaults = {
      apiBaseUrl: defaults.apiBaseUrl,
      rpcUrl: json.rpcUrl || defaults.rpcUrl,
      networkPassphrase: json.networkPassphrase || defaults.networkPassphrase,
      issuanceContractId: json.issuanceContractId || defaults.issuanceContractId,
      vaultContractId: json.vaultContractId || defaults.vaultContractId,
    };
    cachedConfig = merged;
    return merged;
  } catch {
    // If primary API base fails, attempt a transparent fallback to testnet
    const testnetBase = 'https://api.testnet.acta.build';
    if (defaults.apiBaseUrl !== testnetBase) {
      try {
        const resp2 = await fetch(`${testnetBase}/config`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (resp2.ok) {
          const json2 = (await resp2.json()) as Partial<EnvDefaults>;
          const merged2: EnvDefaults = {
            apiBaseUrl: testnetBase,
            rpcUrl: json2.rpcUrl || defaults.rpcUrl,
            networkPassphrase: json2.networkPassphrase || defaults.networkPassphrase,
            issuanceContractId: json2.issuanceContractId || defaults.issuanceContractId,
            vaultContractId: json2.vaultContractId || defaults.vaultContractId,
          };
          cachedConfig = merged2;
          return merged2;
        }
      } catch {}
    }
    // Final fallback to defaults if neither API is reachable
    cachedConfig = defaults;
    return defaults;
  }
}
