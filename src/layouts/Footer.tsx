'use client';

import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3 justify-items-center text-center">

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email:{' '}
              <Link href="mailto:acta.xyz@gmail.com" className="hover:underline">
                acta.xyz@gmail.com
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Website:{' '}
              <Link href="https://acta.build" target="_blank" rel="noopener noreferrer" className="hover:underline">
                acta.build
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Documentation:{' '}
              <Link href="https://docs.acta.build" target="_blank" rel="noopener noreferrer" className="hover:underline">
                docs.acta.build
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              GitHub:{' '}
              <Link href="https://github.com/ACTA-Team" target="_blank" rel="noopener noreferrer" className="hover:underline">
                github.com/ACTA-Team
              </Link>
            </p>
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Team Members</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <Link
                  href="https://www.linkedin.com/in/josue-brenes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Josué Brenes
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/menasebastian/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Sebas Mena
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/daniel-coto-jimenez/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Daniel Coto
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Social</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <Link
                  href="https://www.linkedin.com/company/acta-org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/ActaXyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  X (Twitter)
                </Link>
              </li>
              <li>
                <Link
                  href="https://t.me/+ACTATeam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Telegram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {currentYear} ACTA Team. All rights reserved.
        </p>
      </div>
    </footer>
  );
}