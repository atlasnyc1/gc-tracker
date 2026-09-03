# GC Tracker

Milestone 7 of the build plan: a read-only client link, no login needed.

## Setup for Milestone 7

No SQL script this time. Instead, one new environment variable:

1. In Supabase: Settings > API Keys, copy the key labeled **secret** (not publishable/anon this time).
2. In Vercel: Settings > Environment Variables > Add, Key: `SUPABASE_SECRET_KEY`, Value: that secret key. Save.
3. This key is powerful — it's what lets the client's link show project info without them logging in. It stays server-only and is never sent to anyone's browser.

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
