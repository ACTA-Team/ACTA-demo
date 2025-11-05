'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDidContext } from '@/providers/did.provider';
import { storeVcSingleCall } from '@/lib/vault/store';
import { getEnvDefaults } from '@/lib/env';
import { toast } from 'sonner';

export function CredentialForm() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { ownerDid } = useDidContext();
  const { issuanceContractId, rpcUrl, networkPassphrase } = getEnvDefaults();

  const [issuerName, setIssuerName] = useState('');
  const [subjectDid, setSubjectDid] = useState(
    'did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU'
  );
  const [degreeType, setDegreeType] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString());
  const [txId, setTxId] = useState<string | null>(null);
  const [openIssuerDidInfo, setOpenIssuerDidInfo] = useState(false);
  const [openIssuerNameInfo, setOpenIssuerNameInfo] = useState(false);
  const [openSubjectDidInfo, setOpenSubjectDidInfo] = useState(false);
  const [openCredentialTypeInfo, setOpenCredentialTypeInfo] = useState(false);
  const [openCredentialNameInfo, setOpenCredentialNameInfo] = useState(false);

  const friendlyError = (e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  };

  const randomId = () => `cred_${crypto.randomUUID().replace(/-/g, '')}`;

  const handleCreate = async () => {
    if (!walletAddress) return;
    if (!ownerDid) return;
    if (!issuanceContractId) return;
    if (!issuerName || !subjectDid || !degreeType || !degreeName) return;
    if (!signTransaction) return;
    setTxId(null);
    try {
      const generatedVcId = randomId();
      const vc = {
        '@context': [
          'https://www.w3.org/ns/credentials/v2',
          'https://www.w3.org/ns/credentials/examples/v2',
        ],
        id: generatedVcId,
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
        vcId: generatedVcId,
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
    setIssuerName('Example University');
    setSubjectDid(
      'did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU'
    );
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
        <div className="flex items-center gap-2">
          <label className="text-sm">Issuer DID (your DID)</label>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Issuer DID info"
            onClick={() => setOpenIssuerDidInfo(true)}
          >
            !
          </Button>
        </div>
        <input className="w-full border rounded p-2" value={ownerDid || ''} readOnly />
        <Dialog open={openIssuerDidInfo} onOpenChange={setOpenIssuerDidInfo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issuer DID</DialogTitle>
              <DialogDescription>
                Comes from your connected wallet and is read-only.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* Credential ID field removed; an ID is generated automatically on submit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Issuer name</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Issuer name info"
              onClick={() => setOpenIssuerNameInfo(true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={issuerName}
            onChange={(e) => setIssuerName(e.target.value)}
            placeholder="Example University"
          />
          <Dialog open={openIssuerNameInfo} onOpenChange={setOpenIssuerNameInfo}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issuer name</DialogTitle>
                <DialogDescription>
                  Name of the issuing organization (e.g., Example University).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {/* Valid from hidden: se establece automáticamente bajo el capó */}
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Subject (holder) DID</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Subject DID info"
              onClick={() => setOpenSubjectDidInfo(true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={subjectDid}
            onChange={(e) => setSubjectDid(e.target.value)}
            placeholder="did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU"
          />
          <Dialog open={openSubjectDidInfo} onOpenChange={setOpenSubjectDidInfo}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subject (holder) DID</DialogTitle>
                <DialogDescription>The DID of the credential holder (recipient).</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Credential type</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Credential type info"
              onClick={() => setOpenCredentialTypeInfo(true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={degreeType}
            onChange={(e) => setDegreeType(e.target.value)}
            placeholder="ExampleBachelorDegree"
          />
          <Dialog open={openCredentialTypeInfo} onOpenChange={setOpenCredentialTypeInfo}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credential type</DialogTitle>
                <DialogDescription>
                  A concise type for the credential (e.g., ExampleBachelorDegree).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Credential name</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Credential name info"
              onClick={() => setOpenCredentialNameInfo(true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={degreeName}
            onChange={(e) => setDegreeName(e.target.value)}
            placeholder="Bachelor of Science and Arts"
          />
          <Dialog open={openCredentialNameInfo} onOpenChange={setOpenCredentialNameInfo}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credential name</DialogTitle>
                <DialogDescription>
                  Human-readable name of the credential (e.g., Bachelor of Science and Arts).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
