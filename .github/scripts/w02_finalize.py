"""One-time correction for the read-only W-02 UI. Remove after use."""
from pathlib import Path

page = Path('apps/web/app/worker/opportunity/[opportunityId]/page.tsx')
text = page.read_text(encoding='utf-8')
for old, new in (
    ("evaluation.location.kind === 'OutsideBoundary'", "evaluation.location.kind === 'Outside'"),
    ("evaluation.location.kind === 'WithinBoundary'", "evaluation.location.kind === 'Within'"),
):
    assert text.count(old) == 1, f'Expected exactly one occurrence of {old}'
    text = text.replace(old, new)
page.write_text(text, encoding='utf-8')
print('W-02 location discriminants reconciled with canonical location.ts')
