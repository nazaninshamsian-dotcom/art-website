'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { checkPassword, tokenForCookie, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '');
  if (!checkPassword(password)) {
    return { error: 'Incorrect password' };
  }
  cookies().set(ADMIN_COOKIE_NAME, tokenForCookie(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return { error: null };
}

export async function logoutAction() {
  cookies().delete(ADMIN_COOKIE_NAME);
}

export async function addPaintingAction(formData: FormData) {
  const title = String(formData.get('title') || '');
  const description = String(formData.get('description') || '');
  const medium = String(formData.get('medium') || '');
  const dimensions = String(formData.get('dimensions') || '');
  const year = Number(formData.get('year') || new Date().getFullYear());
  const priceDollars = Number(formData.get('price') || 0);
  const imageFile = formData.get('image') as File | null;

  if (!title || !imageFile || imageFile.size === 0 || !priceDollars) {
    return { error: 'Title, price, and an image are required.' };
  }

  const blob = await put(`paintings/${Date.now()}-${imageFile.name}`, imageFile, {
    access: 'public',
  });

  await prisma.painting.create({
    data: {
      title,
      description,
      medium: medium || 'Oil on canvas',
      dimensions: dimensions || '',
      year,
      priceCents: Math.round(priceDollars * 100),
      imageUrl: blob.url,
      status: 'available',
    },
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { error: null };
}

export async function updateStatusAction(id: string, status: 'available' | 'reserved' | 'sold') {
  await prisma.painting.update({ where: { id }, data: { status } });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deletePaintingAction(id: string) {
  await prisma.order.deleteMany({ where: { paintingId: id } });
  await prisma.painting.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}
