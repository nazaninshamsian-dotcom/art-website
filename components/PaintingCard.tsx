import Image from 'next/image';
import Link from 'next/link';
import GalleryLabel from './GalleryLabel';

type Painting = {
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  priceCents: number;
  imageUrl: string;
  status: string;
};

export default function PaintingCard({ painting }: { painting: Painting }) {
  return (
    <Link href={`/painting/${painting.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-wall-dim">
        <Image
          src={painting.imageUrl}
          alt={painting.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            painting.status === 'sold' ? 'grayscale-[40%] opacity-80' : ''
          }`}
        />
      </div>
      <div className="mt-3">
        <GalleryLabel {...painting} />
      </div>
    </Link>
  );
}
