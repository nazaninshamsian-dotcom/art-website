'use client';

import { useState } from 'react';

export default function BuyButton({ paintingId, status }: { paintingId: string; status: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== 'available') {
    return (
      <button disabled className="w-full cursor-not-allowed border border-line px-6 py-3 placard text-ink-soft">
        {status === 'reserved' ? 'Reserved' : 'Sold'}
      </button>
    );
  }

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paintingId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Could not start checkout');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-ink px-6 py-3 placard text-wall transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Redirecting to checkout…' : 'Purchase this piece'}
      </button>
      {error && <p className="mt-2 text-sm text-brass">{error}</p>}
    </div>
  );
}
