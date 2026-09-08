import Link from 'next/link';

// The index is deliberately not a product screen. GATE 2 builds the engineering skeleton, the
// token layer and the primitives; the 24-screen prototype is GATE 4 (ADR-0011).
export default function HomePage() {
  return (
    <main style={{ maxInlineSize: '40rem', marginInline: 'auto', padding: 'var(--space-5)' }}>
      <h1 className="type-display">اسکلت مهندسی</h1>
      <p className="type-body">
        این برنامه، اسکلت مهندسیِ گیت ۲ است: لایهٔ توکن، بنیان‌های راست‌به‌چپ، و پریمیتیوهای طراحی.
        صفحه‌های محصول در گیت ۴ ساخته می‌شوند.
      </p>
      <p className="type-body">
        <Link
          className="type-body-strong"
          href="/gate2-verification"
          style={{ color: 'var(--color-fg-accent)' }}
        >
          صفحهٔ راستی‌آزمایی گیت ۲
        </Link>
      </p>
    </main>
  );
}
