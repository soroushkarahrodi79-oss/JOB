"""One-time migration of stale E-01 E2E expectations after SH-03 became navigable.

This script changes only the two existing assertions that incorrectly mark SH-03 PLANNED.
It refuses to edit when the original test's exact anchor does not occur once.
"""

from pathlib import Path

path = Path('apps/web/tests/e2e/employer-need-slice.spec.ts')
text = path.read_text(encoding='utf-8')
start_marker = "  test('the employer chrome names its unbuilt destinations without making them controls'"
assert text.count(start_marker) == 1, 'Expected one old employer rail test'
start = text.index(start_marker)
end_marker = '  });\n});\n\ntest.describe(\'E-01 — Employer Home\''
end = text.index(end_marker, start)
old_block = text[start:end]
assert old_block.count('rail-planned-SH-03') == 0, 'Expected template-based planned selector'
assert "['E-08', 'SH-03']" in old_block, 'Expected the old pair of planned destinations'
assert "name: 'پیام‌ها' })).toHaveCount(0)" in old_block, 'Expected obsolete non-link assertion'
new_block = """  test('keeps E-08 planned but exposes SH-03 as a real MOCK outbox destination', async ({
    page,
  }) => {
    await enterAsEmployer(page);
    await expect(page.getByTestId('rail-planned-E-08')).toContainText('PLANNED');
    const rail = page.getByRole('navigation', { name: 'پیمایش کارفرما' });
    await expect(rail.getByRole('link', { name: 'نمایهٔ اعتماد' })).toHaveCount(0);
    await expect(rail.getByTestId('rail-SH-03')).toHaveAttribute('href', '/outbox');
    await expect(rail.getByRole('link', { name: 'پیام‌ها' })).toHaveCount(1);
  });
"""
text = text[:start] + new_block + text[end:]
old_list = "for (const screenId of ['E-06', 'E-07', 'E-08', 'SH-03'])"
assert text.count(old_list) == 1, 'Expected one obsolete planned-area list'
text = text.replace(old_list, "for (const screenId of ['E-06', 'E-07', 'E-08'])")
old_comment = '    // E-04 is now built, so it is no longer named as an unbuilt area.'
assert text.count(old_comment) == 1, 'Expected old E-04 planned-area assertion'
text = text.replace(old_comment, "    await expect(planned).not.toContainText('SH-03');\n" + old_comment)
path.write_text(text, encoding='utf-8')
print('Reconciled only SH-03 related rendered assertions in', path)
