type Props = {
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  priceCents: number;
  status: string;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    cents / 100
  );
}

export default function GalleryLabel({ title, medium, dimensions, year, priceCents, status }: Props) {
  const isAvailable = status === 'available';
  return (
    <div className="border border-line bg-wall px-4 py-3">
      <p className="font-display italic text-base text-ink">{title}, {year}</p>
      <p className="placard mt-1 text-ink-soft">{medium} · {dimensions}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="placard flex items-center gap-1.5 text-ink-soft">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-moss' : 'bg-brass'}`}
            aria-hidden
          />
          {isAvailable ? 'Available' : status === 'reserved' ? 'Reserved' : 'Sold'}
        </span>
        <span className="font-mono text-sm text-ink">{formatPrice(priceCents)}</span>
      </div>
    </div>
  );
}
