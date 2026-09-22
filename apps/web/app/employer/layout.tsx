import type { ReactNode } from 'react';
import { EmployerChrome } from './Chrome';

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return <EmployerChrome>{children}</EmployerChrome>;
}
