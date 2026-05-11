import { ReactNode } from 'react';

interface OverlayShellProps {
  children: ReactNode;
}

export default function OverlayShell({ children }: OverlayShellProps) {
  return (
    <div className="h-full w-full glass rounded-xl overflow-hidden">
      {children}
    </div>
  );
}
