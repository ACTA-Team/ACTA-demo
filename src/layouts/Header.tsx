'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/hooks/stellar/use-wallet-kit';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

function truncateAddress(addr: string, size = 4) {
  return `${addr.slice(0, 4)}...${addr.slice(-size)}`;
}

export function SiteHeader() {
  const { walletAddress, clearWalletInfo } = useWalletContext();
  const { connectWithWalletKit } = useWalletKit();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Logo only on mobile; logo + title on desktop */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="sr-only">ACTA Demo</span>
            <Image
              src="/black.png"
              alt="ACTA Logo"
              width={24}
              height={24}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/white.png"
              alt="ACTA Logo"
              width={24}
              height={24}
              className="hidden dark:block"
              priority
            />
            {/* Hide ACTA Demo text on mobile */}
            <span className="hidden md:inline font-semibold">ACTA Demo</span>
          </Link>
        </div>
        {/* Right: hide wallet UI on mobile; show logout icon if connected */}
        <div className="flex items-center gap-2">
          {/* Hide theme toggler on mobile to leave only logo */}
          <div className="hidden md:block">
            <AnimatedThemeToggler className="scale-75" />
          </div>

          {!walletAddress ? (
            // Hide connect button on mobile
            <Button
              className="hidden md:inline-flex"
              variant="default"
              onClick={async () => {
                try {
                  await connectWithWalletKit();
                  toast.success('Wallet connected');
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Failed to connect');
                }
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Desktop: show truncated address and disconnect button */}
              <span className="hidden md:inline text-sm font-mono">
                {truncateAddress(walletAddress)}
              </span>
              <Button
                className="hidden md:inline-flex"
                variant="outline"
                onClick={() => {
                  clearWalletInfo();
                  toast.info('Disconnected');
                }}
              >
                Disconnect
              </Button>
              {/* Mobile: show only a disconnect icon */}
              <Button
                aria-label="Disconnect"
                className="md:hidden"
                size="icon"
                variant="outline"
                onClick={() => {
                  clearWalletInfo();
                  toast.info('Disconnected');
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
