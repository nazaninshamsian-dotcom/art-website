import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { paintingId } = await req.json();
    const painting = await prisma.painting.findUnique({ where: { id: paintingId } });

    if (!painting) {
      return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
    }
    if (painting.status !== 'available') {
      return NextResponse.json({ error: 'This piece is no longer available' }, { status: 409 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: painting.priceCents,
            product_data: {
              name: painting.title,
              description: `${painting.medium}, ${painting.dimensions}`,
              images: [painting.imageUrl],
            },
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'IE', 'NZ'],
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/painting/${painting.id}`,
      metadata: { paintingId: painting.id },
    });

    // Mark as reserved immediately so two buyers can't both check out the same piece.
    await prisma.painting.update({ where: { id: painting.id }, data: { status: 'reserved' } });
    await prisma.order.create({
      data: { paintingId: painting.id, stripeSessionId: session.id, status: 'pending' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
