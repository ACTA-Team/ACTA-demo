'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type OnboardingStepsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OnboardingStepsModal({ open, onOpenChange }: OnboardingStepsModalProps) {
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const isLast = step === 4;
  const isFirst = step === 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Step {step}</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Create your vault'}
            {step === 2 && 'Authorize your wallet in the vault'}
            {step === 3 && 'Create a credential'}
            {step === 4 && 'Get the credential information'}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <div className="rounded-md border p-4">
            {step === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Initialize your personal vault to store credentials securely.
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Authorize your wallet as an allowed issuer in the vault.
                </p>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Create a verifiable credential and prepare it for storage.
                </p>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Retrieve the credential information from your vault and verify it.
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="justify-between gap-2">
          <div className="pl-6">
            <p className="text-xs text-muted-foreground">
              Follow the steps to complete the demo flow.
            </p>
          </div>
          <div className="flex gap-2 pr-6">
            {!isFirst && (
              <Button type="button" variant="outline" onClick={back}>
                Back
              </Button>
            )}
            {!isLast && (
              <Button type="button" onClick={next}>
                Next
              </Button>
            )}
            {isLast && (
              <Button type="button" onClick={() => onOpenChange(false)}>
                Finish
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
