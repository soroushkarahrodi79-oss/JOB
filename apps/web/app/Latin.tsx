import type { ReactNode } from 'react';

/**
 * A Latin run inside Persian text, isolated.
 *
 * rtl-accessibility.md rule 4 and typography.md, *Mixed Persian and Latin*: without isolation,
 * trailing punctuation migrates to the wrong end of the line. That defect is invisible to a
 * non-Persian reviewer and "reads as illiteracy to a Persian one", so it is not left to the
 * browser's heuristics.
 *
 * The run never sets its own type role — it inherits the surrounding one, so a mixed line keeps
 * one baseline and one colour of text.
 *
 * Latin runs are rare by design. These are screen identifiers (`E-04`), decision identifiers
 * (`D16`) and truth levels (`PLANNED`) — the vocabulary the prototype uses to say what is and is
 * not built. None of them is a term a real user of the product would ever see.
 */
export function Latin({ children }: { children: ReactNode }) {
  return (
    <bdi lang="en" dir="ltr">
      {children}
    </bdi>
  );
}
