# GC Tracker

Milestone 5 of the build plan: a punch list you can add to and check off, per project.

## Setup for Milestone 5

1. In Supabase's SQL Editor, new snippet, paste in the contents of `supabase/schema-punchlist.sql`, click Run.
2. No new environment variables needed.

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
