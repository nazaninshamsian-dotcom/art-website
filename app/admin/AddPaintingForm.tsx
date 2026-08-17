'use client';

import { useRef, useState, useTransition } from 'react';
import { addPaintingAction } from './actions';

const inputClass =
  'w-full border border-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-ink';

export default function AddPaintingForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          const result = await addPaintingAction(formData);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            formRef.current?.reset();
          }
        });
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <input name="title" placeholder="Title" required className={inputClass} />
      <input name="price" type="number" step="1" min="1" placeholder="Price (USD)" required className={inputClass} />
      <input name="medium" placeholder="Medium (e.g. Oil on canvas)" className={inputClass} />
      <input name="dimensions" placeholder='Dimensions (e.g. 24 x 30 in)' className={inputClass} />
      <input name="year" type="number" placeholder="Year" className={inputClass} />
      <input name="image" type="file" accept="image/*" required className={`${inputClass} sm:col-span-2`} />
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        className={`${inputClass} sm:col-span-2`}
      />
      {error && <p className="sm:col-span-2 text-sm text-brass">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 bg-ink px-6 py-3 placard text-wall hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Uploading…' : 'Add to collection'}
      </button>
    </form>
  );
}
