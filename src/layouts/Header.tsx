"use client";

import Link from "next/link";
import { useWalletContext } from "@/providers/wallet.provider";
import { useWalletKit } from "@/hooks/stellar/use-wallet-kit";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { toast } from "sonner";

function truncateAddress(addr: string, size = 4) {
  return `${addr.slice(0, 4)}...${addr.slice(-size)}`;
}

export function SiteHeader() {
  const { walletAddress, clearWalletInfo } = useWalletContext();
  const { connectWithWalletKit } = useWalletKit();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">ACTA Demo</Link>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="scale-75" />
          {!walletAddress ? (
            <Button
              variant="default"
              onClick={async () => {
                try {
                  await connectWithWalletKit();
                  toast.success("Wallet connected");
                } catch (e) {
                  toast.error(
                    e instanceof Error ? e.message : "Failed to connect"
                  );
                }
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">
                {truncateAddress(walletAddress)}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  clearWalletInfo();
                  toast.info("Disconnected");
                }}
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
