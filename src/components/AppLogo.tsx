import { Wallet } from 'lucide-react';
import Link from 'next/link';

export function AppLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 px-3 py-4">
      <Wallet className="h-7 w-7 text-primary" />
      {!collapsed && <span className="text-xl font-headline font-semibold text-primary">AContaFacil</span>}
    </Link>
  );
}
