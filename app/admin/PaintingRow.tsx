'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { deletePaintingAction, updateStatusAction } from './actions';

type Painting = {
  id: string;
  title: string;
  priceCents: number;
  imageUrl: string;
  status: string;
};

export default function PaintingRow({ painting }: { painting: Painting }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-wall-dim">
        <Image src={painting.imageUrl} alt={painting.title} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-display italic text-ink">{painting.title}</p>
        <p className="placard text-ink-soft">${(painting.priceCents / 100).toFixed(0)}</p>
      </div>
      <select
        value={painting.status}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => updateStatusAction(painting.id, e.target.value as any))
        }
        className="border border-line bg-transparent px-2 py-1 text-sm text-ink"
      >
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm(`Remove "${painting.title}" permanently?`)) {
            startTransition(() => deletePaintingAction(painting.id));
          }
        }}
        className="placard text-ink-soft hover:text-brass"
      >
        Remove
      </button>
    </div>
  );
}
