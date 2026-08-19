const CONTACT_EMAIL = 'nazaninshamsian@gmail.com';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    cents / 100
  );
}

export default function BuyButton({
  title,
  priceCents,
  status,
}: {
  title: string;
  priceCents: number;
  status: string;
}) {
  if (status !== 'available') {
    return (
      <button disabled className="w-full cursor-not-allowed border border-line px-6 py-3 placard text-ink-soft">
        {status === 'reserved' ? 'Reserved' : 'Sold'}
      </button>
    );
  }

  const subject = encodeURIComponent(`Inquiry about "${title}"`);
  const body = encodeURIComponent(
    `Hi,\n\nI'm interested in "${title}" (${formatPrice(priceCents)}). Could you tell me more?\n\nThanks!`
  );
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <a
      href={mailtoHref}
      className="block w-full bg-ink px-6 py-3 text-center placard text-wall transition-opacity hover:opacity-90"
    >
      Inquire about this piece
    </a>
  );
}