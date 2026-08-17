'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await loginAction(formData);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            router.refresh();
          }
        });
      }}
      className="space-y-4"
    >
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full border border-line bg-transparent px-4 py-3 text-ink placeholder:text-ink-soft focus:border-ink"
      />
      {error && <p className="text-sm text-brass">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-6 py-3 placard text-wall hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  );
}
