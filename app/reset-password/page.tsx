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
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Clicking the link in the reset email brings the visitor here with a
    // special one-time code in the web address. Supabase reads that
    // automatically and fires this event once it's turned into a real,
    // temporary login just for setting a new password.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Belt-and-suspenders: some browsers have the session ready before the
    // listener above ever fires, so also check directly on load.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
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

        {!ready ? (
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
