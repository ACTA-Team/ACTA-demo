'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/hooks/stellar/use-wallet-kit';
import { toast } from 'sonner';

function truncate(addr: string, size = 4) {
  return `${addr.slice(0, size)}...${addr.slice(-size)}`;
}

export function SiteHeader() {
  const { walletAddress, clearWalletInfo } = useWalletContext();
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();

  const handleConnect = async () => {
    try {
      await connectWithWalletKit();
      toast.success('Wallet connected');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWalletKit();
    } catch {
      // ignore SDK disconnect errors, still clear local state
    }
    clearWalletInfo();
    toast.info('Disconnected');
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/white.png"
            alt="ACTA"
            width={60}
            height={32}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/black.png"
            alt="ACTA"
            width={60}
            height={32}
            className="block dark:hidden"
            priority
          />
        </Link>

        {/* Wallet controls + theme */}
        <div className="flex items-center gap-2">
          {walletAddress ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground hidden sm:inline">
                {truncate(walletAddress, 3)}
              </span>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}

          <AnimatedThemeToggler
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Change theme"
          />
        </div>
      </div>
    </header>
  );
}
