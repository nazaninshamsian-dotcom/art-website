# Studio Gallery

A website to display and sell your paintings. Visitors browse a gallery grid, click
into a piece, and buy it through Stripe Checkout. You manage everything — adding
paintings, marking them sold — from a private `/admin` page.

Built with Next.js, Prisma (Postgres), and Stripe. Deploys free on Vercel.

## What you get

- **Home page** — gallery grid of your paintings, each with a museum-style label (title, medium, size, price, availability)
- **Painting page** — full image, description, and a "Purchase this piece" button
- **Checkout** — handled entirely by Stripe (cards, Apple Pay, Google Pay); a piece is auto-marked "Reserved" the moment someone starts checkout, and "Sold" once payment completes, so you never sell the same painting twice
- **`/admin`** — password-protected page to add paintings (upload a photo, set price/details), mark pieces available/reserved/sold, or remove them

---

## 1. Prerequisites

You'll create three free accounts:

1. **[GitHub](https://github.com/signup)** — to hold your code
2. **[Vercel](https://vercel.com/signup)** — hosts the site (sign up with your GitHub account)
3. **[Stripe](https://dashboard.stripe.com/register)** — handles payments

You'll also need [Node.js](https://nodejs.org) (v18+) installed on your computer to test locally, though you can skip local testing and deploy straight to Vercel if you prefer.

## 2. Get the code onto GitHub

1. Unzip this project.
2. Create a new empty repository on GitHub (no README/license needed).
3. In a terminal, inside the unzipped folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Set up a database

Any Postgres works; the free tier of **[Neon](https://neon.tech)** is the easiest:

1. Create a Neon account and a new project.
2. Copy the connection string it gives you — use it for both `DATABASE_URL` and `DIRECT_URL`.

## 4. Set up Stripe

1. In the Stripe dashboard, go to **Developers → API keys** and copy the **Secret key** → this is `STRIPE_SECRET_KEY`. Use a **test mode** key while you're setting things up; switch to a live key when you're ready to accept real payments.
2. You'll set up the webhook (`STRIPE_WEBHOOK_SECRET`) in step 6, after the site is deployed and has a real URL.

## 5. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just pushed.
2. Before deploying, add these **Environment Variables** (from your `.env.example`):
   - `DATABASE_URL`, `DIRECT_URL` (from Neon)
   - `STRIPE_SECRET_KEY` (from Stripe)
   - `ADMIN_PASSWORD` (pick your own password)
   - `NEXT_PUBLIC_SITE_URL` — set this to your Vercel URL, e.g. `https://your-project.vercel.app`
   - Leave `STRIPE_WEBHOOK_SECRET` and `BLOB_READ_WRITE_TOKEN` blank for now
3. Click **Deploy**.
4. Once deployed, go to your project's **Storage** tab in Vercel → **Create Database** → choose **Blob**. This auto-adds `BLOB_READ_WRITE_TOKEN` for you — no copying needed.
5. Go to **Settings → Environment Variables**, redeploy (Deployments tab → ⋯ → Redeploy) so the new Blob variable takes effect.
6. Run the database migration once, from your computer:
   ```bash
   npm install
   # paste your Neon DATABASE_URL/DIRECT_URL into a local .env file first
   npx prisma db push
   npm run seed   # optional: adds 3 example paintings so the site isn't empty
   ```

## 6. Connect the Stripe webhook

This is what tells your site "the payment succeeded, mark it sold."

1. In Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://your-project.vercel.app/api/webhook`
3. Events to send: `checkout.session.completed` and `checkout.session.expired`.
4. Copy the **Signing secret** it gives you → add it to Vercel as `STRIPE_WEBHOOK_SECRET` (Settings → Environment Variables) → redeploy.

## 7. You're live

Visit your site, go to `/admin`, log in with the password you set, and add your first painting. It'll appear on the home page immediately.

When you're ready to take real payments, swap your Stripe key for a **live mode** secret key in Vercel's environment variables (and redo the webhook step with the live-mode signing secret).

---

## Using it day to day

- **Add a painting**: `/admin` → fill in the form, upload a photo → it appears on the site instantly.
- **Mark something sold manually** (e.g. sold in person): change its status in the dropdown next to it in `/admin`.
- **Remove a listing**: "Remove" button in `/admin`.

## Customizing

- **Your name / bio**: edit the "About the studio" section in `app/page.tsx`.
- **Site title**: `app/layout.tsx` → `metadata`.
- **Colors/fonts**: `tailwind.config.ts` and `app/layout.tsx`.
- **Shipping countries**: `app/api/checkout/route.ts` → `allowed_countries`.

## Custom domain

In Vercel → your project → **Settings → Domains**, add your own domain (e.g. `yourname.com`) and follow the DNS instructions. Then update `NEXT_PUBLIC_SITE_URL` to match.

## Local development

```bash
npm install
cp .env.example .env   # fill in your real values
npx prisma db push
npm run dev
```
Visit `http://localhost:3000`.
