"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <section className="panel">
        <p className="section-title">Something failed in the runtime view.</p>
        <p className="section-copy">Try resetting this view. If it persists, we should inspect the failing scenario data.</p>
        <button className="term-chip mt-4" type="button" onClick={reset}>Retry</button>
      </section>
    </main>
  );
}
