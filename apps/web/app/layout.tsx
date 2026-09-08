import type { ReactNode } from 'react';
import type { Metadata } from 'next';
// Order matters: the token custom properties first, then the UI base layer, then app globals
// (which declare @font-face and the body base that consume the tokens).
import '@platform/tokens/tokens.css';
import '@platform/ui/base.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'پلتفرم — اسکلت مهندسی',
  description: 'GATE 2 engineering skeleton. Not the product prototype; screens are GATE 4.',
};

// Persian is the source language and RTL is the default, from the document root (ADR-0005).
// data-density defaults to the worker surface — the primary surface (foundations.md).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-density="worker">
      <body>{children}</body>
    </html>
  );
}
