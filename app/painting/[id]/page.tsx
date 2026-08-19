import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GalleryLabel from '@/components/GalleryLabel';
import BuyButton from './BuyButton';

export const revalidate = 0;

export default async function PaintingPage({ params }: { params: { id: string } }) {
  const painting = await prisma.painting.findUnique({ where: { id: params.id } });
  if (!painting) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-[4/5] bg-wall-dim">
          <Image
            src={painting.imageUrl}
            alt={painting.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className={`object-cover ${painting.status === 'sold' ? 'grayscale-[40%] opacity-80' : ''}`}
            priority
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <GalleryLabel {...painting} />
            <p className="mt-6 whitespace-pre-line text-ink-soft">{painting.description}</p>
          </div>
          <div className="mt-8">
           <BuyButton title={painting.title} priceCents={painting.priceCents} status={painting.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
