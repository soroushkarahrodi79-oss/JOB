"""One-time patch against exactly the existing JOB demo files; remove before merging."""
from pathlib import Path

workflow = Path('.github/workflows/zz-w05-integration.yml').read_text(encoding='utf-8')
raw = workflow.split("          python3 - <<'PY'\n", 1)[1].split('\n          PY', 1)[0]
code = '\n'.join(line[10:] if line.startswith('          ') else line for line in raw.splitlines())
marker = "\nresponse='apps/web/app/worker/opportunity/[opportunityId]/respond/page.tsx'"
if code.count(marker) != 1:
    raise RuntimeError('Could not isolate W-04 acceptance-link splice')
exec(compile(code.split(marker, 1)[0], '<bounded-w05>', 'exec'))
page = Path('apps/web/app/worker/opportunity/[opportunityId]/respond/page.tsx')
content = page.read_text(encoding='utf-8')
anchor = '            <Link href="/worker">بازگشت به کارهای من</Link>'
if content.count(anchor) != 2:
    raise RuntimeError('W-04 accepted response cannot be isolated')
link = (
    '            <Link href={`/worker/opportunity/${opportunityId}/engagement`} '
    'data-testid="worker-engagement-link">\n'
    '              دیدن شرایط پذیرفته‌شده و ورود به شیفت\n'
    '            </Link>\n'
)
page.write_text(content.replace(anchor, link + anchor, 1), encoding='utf-8')
