'use client';
import { BorderBeam } from '@/components/ui/border-beam';
import { MagicCard } from '@/components/ui/magic-card';
export function CredentialCard() {
  return (
    <div className="relative flex justify-center items-center w-full h-full py-4 sm:py-6 md:py-10">
      <MagicCard
        className="relative rounded-xl sm:rounded-2xl ring-1 ring-border/40 w-full sm:w-[590px] max-w-[590px] aspect-[1.586/1] shadow-xl bg-card/80 backdrop-blur-md mx-auto"
        overlayChildren={
          <BorderBeam
            size={160}
            duration={6}
            delay={0.3}
            colorFrom="#9E7AFF"
            colorTo="#FE8BBB"
            borderWidth={2}
            className="opacity-60"
          />
        }
      >
        {/* Main Content */}
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 text-foreground">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold">Credential</h2>
            <span className="text-[10px] sm:text-xs md:text-sm opacity-70">ACTA</span>
          </div>
          
          {/* Credential Details */}
          <div className="border-t border-border/30 pt-3 sm:pt-4 grid grid-cols-1 gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Owner</span>
              <span className="text-[9px] sm:text-[11px] md:text-xs font-mono truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-[420px]">
                GAGSFSAC..MUMDRXYZ
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Issuer</span>
              <span className="text-xs sm:text-sm font-medium">Example University</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Issued on</span>
              <span className="text-[10px] sm:text-xs font-mono">01/01/2010</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Holder ID</span>
              <span className="text-[9px] sm:text-[11px] md:text-xs font-mono truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-[420px]">
                MUMDRXYZ..GAGSFSAC
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Credential Type</span>
              <span className="text-xs sm:text-sm font-medium">University Degree</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs opacity-70">Degree Name</span>
              <span className="text-xs sm:text-sm font-medium">Bachelor of Engineering</span>
            </div>
          </div>
          
          {/* Bottom section with background image */}
          <div className="flex justify-end items-end">
            {/* Background Image */}
            <div className="relative ml-auto mt-auto self-end justify-self-end w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[url('/dark.png')] bg-no-repeat bg-contain opacity-30 sm:opacity-40 md:opacity-60 pointer-events-none select-none" />
          </div>
        </div>
        
        {/* Footer */}
        <div className="bottom-5 sm:left-4 sm:bottom-4 md:left-6 md:bottom-6 lg:left-8 lg:bottom-8 z-10 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-wide opacity-70">
          ACTA • Verifiable Credential
        </div>
      </MagicCard>
    </div>
  );
}
