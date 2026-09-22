import type { ReactNode } from 'react';
import type { Metadata } from 'next';
// Order matters: the token custom properties first, then the UI base layer, then app globals
// (which declare @font-face and the body base that consume the tokens).
import '@platform/tokens/tokens.css';
import '@platform/ui/base.css';
import './globals.css';
import { DemoSessionProvider } from './demo/session';

export const metadata: Metadata = {
  title: 'پلتفرم — نمونهٔ اولیه',
  description:
    'GATE 4 prototype surface. Capabilities carry their truth level at the point of use.',
};

// Persian is the source language and RTL is the default, from the document root (ADR-0005).
// data-density defaults to the worker surface — the primary surface (foundations.md); the employer
// layout overrides it for its own subtree.
//
// The demo session wraps everything so the shared world survives navigation between surfaces.
// It is a client provider with server children, so a page that needs no session state stays a
// server component.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-density="worker">
      <body>
        <DemoSessionProvider>{children}</DemoSessionProvider>
      </body>
    </html>
  );
}
