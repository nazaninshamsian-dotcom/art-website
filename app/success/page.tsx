export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="placard mb-4 text-ink-soft">Thank you</p>
      <h1 className="font-display text-3xl italic text-ink">Your painting is on its way to a new home.</h1>
      <p className="mt-6 text-ink-soft">
        A confirmation has been sent to your email. The piece will be carefully packed and shipped,
        along with your certificate of authenticity.
      </p>
      <a href="/" className="mt-10 inline-block border border-ink px-6 py-3 placard text-ink hover:bg-ink hover:text-wall">
        Back to the collection
      </a>
    </div>
  );
}
