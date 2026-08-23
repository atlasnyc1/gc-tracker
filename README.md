# GC Tracker

Milestone 1 of the build plan: the smallest possible live version of the app, just to prove the pipes work.

## What's in here

A standard Next.js + Tailwind app — the same shape `create-next-app` produces. Nothing fancy yet, on purpose.

## Getting it live (once GitHub + Vercel accounts exist)

1. Create a new empty repository on GitHub.
2. Push this folder to it.
3. In Vercel, click "New Project" and import that GitHub repo. Leave every setting on default and click Deploy.
4. Vercel installs everything and builds the site for you — you'll get a real `https://...vercel.app` link in about a minute.

From then on, every time this code is updated and pushed to GitHub, Vercel automatically redeploys the live site. No manual "run npm install" step needed on your end.
