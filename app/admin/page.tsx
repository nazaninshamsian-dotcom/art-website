import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE_NAME, isValidToken } from '@/lib/adminAuth';
import { logoutAction } from './actions';
import LoginForm from './LoginForm';
import AddPaintingForm from './AddPaintingForm';
import PaintingRow from './PaintingRow';

export const revalidate = 0;

export default async function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const authed = isValidToken(token);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-6 py-24">
        <p className="placard mb-4 text-ink-soft">Studio access</p>
        <h1 className="font-display text-2xl italic text-ink">Sign in to manage your collection</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    );
  }

  const paintings = await prisma.painting.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl italic text-ink">Studio dashboard</h1>
        <form action={logoutAction}>
          <button className="placard text-ink-soft hover:text-ink">Sign out</button>
        </form>
      </div>

      <section className="mt-10 border border-line p-6">
        <p className="placard mb-4 text-ink-soft">Add a painting</p>
        <AddPaintingForm />
      </section>

      <section className="mt-10">
        <p className="placard mb-4 text-ink-soft">Current collection ({paintings.length})</p>
        <div className="divide-y divide-line border border-line">
          {paintings.length === 0 && (
            <p className="p-6 text-sm text-ink-soft">Nothing added yet — use the form above.</p>
          )}
          {paintings.map((p) => (
            <PaintingRow key={p.id} painting={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
