import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const paintingId = session.metadata?.paintingId;
    if (paintingId) {
      await prisma.painting.update({ where: { id: paintingId }, data: { status: 'sold' } });
      await prisma.order.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: 'paid', buyerEmail: session.customer_details?.email ?? undefined },
      });
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const paintingId = session.metadata?.paintingId;
    if (paintingId) {
      // Release the reservation so the piece goes back on sale.
      await prisma.painting.update({ where: { id: paintingId }, data: { status: 'available' } });
      await prisma.order.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: 'cancelled' },
      });
    }
  }

  return NextResponse.json({ received: true });
}
