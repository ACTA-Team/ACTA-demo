'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDidContext } from '@/providers/did.provider';
import { storeVcSingleCall } from '@/lib/vault/store';
import { getEnvDefaults } from '@/lib/env';
import { toast } from 'sonner';

export function CredentialForm() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { ownerDid } = useDidContext();
  const { issuanceContractId, rpcUrl, networkPassphrase } = getEnvDefaults();

  const [vcId, setVcId] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [subjectDid, setSubjectDid] = useState('');
  const [degreeType, setDegreeType] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [txId, setTxId] = useState<string | null>(null);

  const friendlyError = (e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  };

  const handleCreate = async () => {
    if (!walletAddress) return;
    if (!ownerDid) return;
    if (!issuanceContractId) return;
    if (!vcId || !issuerName || !subjectDid || !degreeType || !degreeName || !validFrom) return;
    if (!signTransaction) return;
    setTxId(null);
    try {
      const vc = {
        '@context': [
          'https://www.w3.org/ns/credentials/v2',
          'https://www.w3.org/ns/credentials/examples/v2',
        ],
        id: vcId,
        type: ['VerifiableCredential', 'ExampleDegreeCredential'],
        issuer: { id: ownerDid, name: issuerName },
        validFrom,
        credentialSubject: {
          id: subjectDid,
          degree: { type: degreeType, name: degreeName },
        },
        proof: {
          type: 'DataIntegrityProof',
          created: new Date().toISOString(),
          verificationMethod: 'did:key:zDnaebSRtPnW6YCpxAhR5JPxJqt9UunCsBPhLEtUokUvp87nQ',
          cryptosuite: 'ecdsa-rdfc-2019',
          proofPurpose: 'assertionMethod',
          proofValue:
            'z35CwmxThsUQ4t79JfacmMcw4y1kCqtD4rKqUooKM2NyKwdF5jmXMRo9oGnzHerf8hfQiWkEReycSXC2NtRrdMZN4',
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
        didUri: ownerDid,
        fields,
        signTransaction: (xdr, opts) => signTransaction(xdr, opts),
      });
      setTxId(result.txId);
      const isTestnet = /testnet/i.test(rpcUrl) || /Test SDF Network/i.test(networkPassphrase);
      const explorerBase = isTestnet
        ? 'https://stellar.expert/explorer/testnet'
        : 'https://stellar.expert/explorer/public';
      const explorerUrl = `${explorerBase}/tx/${result.txId}`;
      toast.success('Credential created', {
        action: {
          label: 'View on Stellar Expert',
          onClick: () => {
            try {
              window.open(explorerUrl, '_blank', 'noopener,noreferrer');
            } catch {
              window.location.href = explorerUrl;
            }
          },
        },
      });
    } catch (e: unknown) {
      toast.error('Could not create credential', {
        description: friendlyError(e, 'Something went wrong. Please try again.'),
      });
    }
  };

  const fillExample = () => {
    setVcId('http://university.example/credentials/3732');
    setIssuerName('Example University');
    setSubjectDid('did:example:ebfeb1f712ebc6f1c276e12ec21');
    setDegreeType('ExampleBachelorDegree');
    setDegreeName('Bachelor of Science and Arts');
    setValidFrom('2010-01-01T19:23:24Z');
  };

  return !walletAddress ? (
    <div className="rounded border p-6 md:p-8 min-h-[20vh] flex flex-col items-center justify-center text-center">
      <p className="text-base">Connect your wallet to begin.</p>
    </div>
  ) : (
    <div className="rounded border p-6 md:p-8 space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={fillExample}>
          Fill Example
        </Button>
      </div>
      <div>
        <label className="text-sm">Owner DID</label>
        <input className="w-full border rounded p-2" value={ownerDid || ''} readOnly />
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
        <Button
          className="!bg-white text-black hover:text-gray-95  0 hover:bg-gray-200 font-medium w-full"
          onClick={handleCreate}
          variant="outline"
          disabled={!walletAddress}
        >
          Create Credential
        </Button>
      </div>
      {txId && (
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Transaction submitted successfully.</p>
        </div>
      )}
    </div>
  );
}
