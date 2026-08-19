'use client';

import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { addPaintingAction } from './actions';

const inputClass =
  'w-full border border-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:border-ink';

export default function AddPaintingForm() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const file = formData.get('image') as File | null;
    if (!file || file.size === 0) {
      setError('Please choose a photo of the painting.');
      return;
    }

    try {
      setStatus('uploading');
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      formData.set('imageUrl', blob.url);
      formData.delete('image');

      setStatus('saving');
      const result = await addPaintingAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setStatus('idle');
    }
  }

  const busy = status !== 'idle';

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-3 sm:grid-cols-2">
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
        disabled={busy}
        className="sm:col-span-2 bg-ink px-6 py-3 placard text-wall hover:opacity-90 disabled:opacity-60"
      >
        {status === 'uploading' ? 'Uploading photo…' : status === 'saving' ? 'Saving…' : 'Add to collection'}
      </button>
    </form>
  );
}