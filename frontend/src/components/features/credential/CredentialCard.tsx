'use client';
import { MagicCard } from '@/components/ui/magic-card';
export function CredentialCard() {
  return (
    <div className="relative flex justify-center items-center w-full h-full py-10">
      <MagicCard className="relative rounded-2xl ring-1 ring-border/40 w-[590px] aspect-[1.586/1] overflow-hidden shadow-xl bg-card/80 backdrop-blur-md">
        <div className="absolute mt-[15rem] left-[23rem] w-56 h-40 bg-[url('/dark.png')] bg-no-repeat bg-contain opacity-60 z-0 pointer-events-none select-none" />
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-8 text-foreground">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold">Credential</h2>
            <span className="text-xs md:text-sm opacity-70">ACTA</span>
          </div>
          <div className="border-t border-border/30 pt-4 grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Owner</span>
              <span className="text-[11px] md:text-xs font-mono truncate max-w-[420px]">
                GAGSFSAC..MUMDRXYZ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Issuer</span>
              <span className="text-sm font-medium">Example University</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Issued on</span>
              <span className="text-xs font-mono">01/01/2010</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Holder ID</span>
              <span className="text-[11px] md:text-xs font-mono truncate max-w-[420px]">
                MUMDRXYZ..GAGSFSAC
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Credential Type</span>
              <span className="text-sm font-medium">University Degree</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Degree Name</span>
              <span className="text-sm font-medium">Bachelor of Engineering</span>
            </div>
          </div>
          <div className="h-0" />
        </div>
        <div className="absolute left-8 mt-[2.5rem] z-10 text-[9px] uppercase tracking-wide opacity-70">
          ACTA • Verifiable Credential
        </div>
      </MagicCard>
    </div>
  );
}
