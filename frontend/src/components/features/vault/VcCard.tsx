'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type VcRecord = Record<string, unknown>;

function safeParseJson<T = unknown>(str?: string | null): T | null {
  if (!str || typeof str !== 'string') return null;
  try {
    return JSON.parse(str);
  } catch {
    const cleaned = str.replace(/`/g, '').replace(/\\`/g, '').replace(/\s+,/g, ',');
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

function buildSummary(record: VcRecord) {
  const dataStr = typeof record.data === 'string' ? record.data : undefined;
  const meta = safeParseJson<Record<string, unknown>>(dataStr);
  const vcDataStr = typeof meta?.vcData === 'string' ? (meta?.vcData as string) : undefined;
  const vcInner = vcDataStr ? safeParseJson<Record<string, unknown>>(vcDataStr) : null;

  const getStringPath = (obj: unknown, path: string[]): string | undefined => {
    let current: unknown = obj;
    for (const key of path) {
      if (
        current &&
        typeof current === 'object' &&
        !Array.isArray(current) &&
        key in (current as Record<string, unknown>)
      ) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return typeof current === 'string' ? current : undefined;
  };

  const issuerName =
    (meta?.issuerName as string) || getStringPath(vcInner, ['issuer', 'name']) || '—';
  const subjectDid =
    (meta?.subjectDid as string) || getStringPath(vcInner, ['credentialSubject', 'id']) || '—';
  const degreeType =
    (meta?.degreeType as string) ||
    getStringPath(vcInner, ['credentialSubject', 'degree', 'type']) ||
    '—';
  const degreeName =
    (meta?.degreeName as string) ||
    getStringPath(vcInner, ['credentialSubject', 'degree', 'name']) ||
    '—';
  const validFrom =
    (meta?.validFrom as string) ||
    getStringPath(vcInner, ['validFrom']) ||
    getStringPath(vcInner, ['issuanceDate']) ||
    '—';

  return { issuerName, subjectDid, degreeType, degreeName, validFrom, meta, vcInner };
}

export function VcCard({ record, className }: { record: VcRecord; className?: string }) {
  const { issuerName, subjectDid, degreeType, degreeName, validFrom, meta, vcInner } =
    buildSummary(record);
  const id = typeof record.id === 'string' ? record.id : '—';
  const issuerDid = typeof record.issuer_did === 'string' ? record.issuer_did : '—';
  const contractId = typeof record.issuance_contract === 'string' ? record.issuance_contract : '—';

  return (
    <div className={cn('rounded border p-4 space-y-3', className)}>
      <div className="space-y-1">
        <p className="text-sm font-medium">Verifiable Credential</p>
        <p className="text-sm text-muted-foreground">
          Issued by <span className="font-medium">{issuerName}</span> to
          <span className="font-mono"> {subjectDid}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">VC ID</p>
          <p className="text-xs font-mono break-all">{id}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valid from</p>
          <p className="text-xs font-mono break-all">{validFrom}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Degree type</p>
          <p className="text-xs font-mono break-all">{degreeType}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Degree name</p>
          <p className="text-xs font-mono break-all">{degreeName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Issuer DID</p>
          <p className="text-[11px] font-mono break-all">{issuerDid}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Issuance Contract</p>
          <p className="text-[11px] font-mono break-all">{contractId}</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="details">
          <AccordionTrigger>
            <span className="text-xs">View details</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Meta</p>
                <pre className="text-[11px] whitespace-pre-wrap break-words">
                  {JSON.stringify(meta ?? {}, null, 2)}
                </pre>
              </div>
              {vcInner && (
                <div>
                  <p className="text-xs text-muted-foreground">VC (JSON)</p>
                  <pre className="text-[11px] whitespace-pre-wrap break-words">
                    {JSON.stringify(vcInner, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
