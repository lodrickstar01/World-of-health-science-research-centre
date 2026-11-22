
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setMessage("Supabase configuration is missing. Check .env.local.");
      setLoading(false);
      return;
    }

    const supabase = createClient(url, key);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/library";
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-950 p-8">
        <h1 className="text-3xl font-bold text-center">
          MEDICAL RESEARCH CENTRE
        </h1>
        <p className="mt-3 mb-8 text-center text-gray-400">
          Sign in to access your research library.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white"
              placeholder="Enter your password"
            />
          </div>

          {message && (
            <p role="alert" className="text-sm text-red-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Do not have an account?{" "}
          <Link href="/register" className="text-blue-400 underline">
            Register here
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-gray-400 underline">
            Back to Home
          </Link>
        </p>
      </section>
    </main>
  );
}
