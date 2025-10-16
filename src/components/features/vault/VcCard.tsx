'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BorderBeam } from '@/components/ui/border-beam';
import { cn } from '@/lib/utils';

type VcRecord = {
  id?: string;
  issuance_contract?: string;
  issuer_did?: string;
  data?: string;
  [key: string]: any;
};

function safeParseJson<T = any>(str?: string | null): T | null {
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
  const meta = safeParseJson(record.data);
  const vcInner = meta?.vcData ? safeParseJson(meta.vcData) : null;

  const issuerName = (meta?.issuerName as string) || (vcInner?.issuer?.name as string) || '—';
  const subjectDid =
    (meta?.subjectDid as string) || (vcInner?.credentialSubject?.id as string) || '—';
  const degreeType =
    (meta?.degreeType as string) || (vcInner?.credentialSubject?.degree?.type as string) || '—';
  const degreeName =
    (meta?.degreeName as string) || (vcInner?.credentialSubject?.degree?.name as string) || '—';
  const validFrom =
    (meta?.validFrom as string) ||
    (vcInner?.validFrom as string) ||
    (vcInner?.issuanceDate as string) ||
    '—';

  return { issuerName, subjectDid, degreeType, degreeName, validFrom, meta, vcInner };
}

export function VcCard({ record, className }: { record: VcRecord; className?: string }) {
  const { issuerName, subjectDid, degreeType, degreeName, validFrom, meta, vcInner } =
    buildSummary(record);
  const id = record.id || '—';
  const issuerDid = record.issuer_did || '—';
  const contractId = record.issuance_contract || '—';

  return (
    <div className={cn('relative overflow-hidden rounded border p-4 space-y-3', className)}>
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

      <BorderBeam duration={6} size={400} colorFrom="#EDEDD0" colorTo="#EDEDD0" />
      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        borderWidth={2}
        colorFrom="#EDEDD0"
        colorTo="#EDEDD0"
      />
    </div>
  );
}
