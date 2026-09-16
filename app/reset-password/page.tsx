"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkFailed, setLinkFailed] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    // Clicking the link in the reset email brings the visitor here with a
    // one-time code in the web address (?code=...). We have to explicitly
    // trade that code in for a real, temporary login before they can set a
    // new password — it doesn't happen automatically.
    async function init() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (!error) {
          setReady(true);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      } else if (!code) {
        // No code in the link and no existing session — this page was
        // opened directly, not from a real reset email.
        setLinkFailed(true);
      }
    }

    init();

    // Belt-and-suspenders for older-style links that do log the visitor in
    // automatically and fire this event instead.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Safety net: if nothing above worked within a few seconds, stop
    // showing "Checking…" forever and tell the visitor what to do.
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setReady((r) => {
          if (!r) setLinkFailed(true);
          return r;
        });
      }
    }, 8000);

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-xl font-bold text-ink mb-2">
            Password updated
          </h1>
          <p className="text-ink/60 text-sm">Taking you to your dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-ink mb-1 text-center">
          Set a new password
        </h1>
        <p className="text-ink/60 text-sm text-center mb-6">
          Choose a new password for your account.
        </p>

        {linkFailed ? (
          <div className="text-center">
            <p className="text-sm text-red-600 mb-4">
              This reset link didn&apos;t work — it may have expired or
              already been used.
            </p>
            <a href="/login" className="text-sm text-accent underline">
              Request a new one
            </a>
          </div>
        ) : !ready ? (
          <p className="text-sm text-ink/60 text-center">
            Checking your reset link…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              required
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white rounded px-3 py-3 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Please wait…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
