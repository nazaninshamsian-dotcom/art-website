import { prisma } from '@/lib/prisma';
import PaintingCard from '@/components/PaintingCard';

export const revalidate = 0;

export default async function HomePage() {
  const paintings = await prisma.painting.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="placard mb-4 text-ink-soft">Original paintings · One of a kind</p>
          <h1 className="max-w-2xl font-display text-4xl italic leading-tight text-ink sm:text-5xl">
            Each piece leaves the studio once — then it belongs to you.
          </h1>
          <p className="mt-6 max-w-md text-ink-soft">
            A working collection of current paintings, available to purchase directly.
            Every piece ships insured, with a certificate of authenticity.
          </p>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-6xl px-6 py-16">
        {paintings.length === 0 ? (
          <div className="border border-dashed border-line px-6 py-16 text-center">
            <p className="placard text-ink-soft">No paintings on the wall yet</p>
            <p className="mt-2 text-sm text-ink-soft">
              Add your first piece from <a href="/admin" className="underline">the admin page</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {paintings.map((p) => (
              <PaintingCard key={p.id} painting={p} />
            ))}
          </div>
        )}
      </section>

      <section id="about" className="border-t border-line bg-wall-dim">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="placard mb-4 text-ink-soft">About the studio</p>
          <p className="max-w-2xl text-ink">
            Update this section with your own artist statement — your background, materials,
            and what collectors should know before buying an original piece.
          </p>
        </div>
      </section>
    </div>
  );
}
