# GC Tracker

Milestone 8 of the build plan: charge a monthly subscription via Stripe.

## Setup for Milestone 8

1. In Supabase's SQL Editor, new snippet, paste in the contents of `supabase/schema-billing.sql`, click Run.
2. In Stripe: create a Product with a recurring monthly Price. Copy its Price ID (starts with `price_...`).
3. In Stripe: Developers > API keys, copy the Secret key (starts with `sk_...`).
4. In Stripe: Developers > Webhooks, add an endpoint pointing to `https://your-site.vercel.app/api/stripe/webhook`, listening for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Copy its Signing secret (starts with `whsec_...`).
5. In Vercel, add three environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`.
6. Push the code, redeploy, then test with Stripe's test card number 4242 4242 4242 4242, any future expiry date, any CVC.

## Setup for Milestone 2 (Supabase)

1. Create a free project at supabase.com.
2. In your Supabase project, go to Authentication > Providers > Email, and turn OFF "Confirm email" (so sign-ups work instantly without needing an email click, for now).
3. Go to the SQL Editor, paste in the contents of `supabase/schema.sql`, and click Run.
4. Go to Settings > API and copy the "Project URL" and the "anon public" key.
5. In Vercel: Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
6. Redeploy on Vercel so the new variables take effect.

## What's in here

A standard Next.js + Tailwind app — the same shape `create-next-app` produces. Nothing fancy yet, on purpose.

## Getting it live (once GitHub + Vercel accounts exist)

1. Create a new empty repository on GitHub.
2. Push this folder to it.
3. In Vercel, click "New Project" and import that GitHub repo. Leave every setting on default and click Deploy.
4. Vercel installs everything and builds the site for you — you'll get a real `https://...vercel.app` link in about a minute.

From then on, every time this code is updated and pushed to GitHub, Vercel automatically redeploys the live site. No manual "run npm install" step needed on your end.
