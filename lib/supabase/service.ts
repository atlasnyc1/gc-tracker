import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Only ever used on the server, for pages that must be viewable
// without anyone being logged in (like the client portal link).
// This key can see everything in the database — never send it to
// the browser, and never import this file from a "use client" component.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}
