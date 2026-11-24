"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PublicComment = {
  id: string;
  name: string;
  comment: string;
  created_at: string;
};

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key);
    } catch (error) {
      console.error("Supabase client initialization failed:", error);
      return null;
    }
  }

  return supabaseClient;
}

export default function CommentsPage() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const loadComments = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setMessage("Comments are not connected yet. Check the Supabase environment variables on your hosting platform.");
      setIsError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await client
      .from("mrc_comments")
      .select("id, name, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Could not load comments:", error);
      setMessage("Comments could not be loaded. Check that the mrc_comments table and its Supabase policies have been created.");
      setIsError(true);
    } else {
      setComments((data ?? []) as PublicComment[]);
      setMessage("");
      setIsError(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (!cleanName || cleanName.length > 80) {
      setMessage("Enter your name (up to 80 characters).");
      setIsError(true);
      return;
    }
    if (!cleanComment || cleanComment.length > 1000) {
      setMessage("Enter a comment of up to 1,000 characters.");
      setIsError(true);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setMessage("Comments are not connected yet. Please try again later.");
      setIsError(true);
      return;
    }

    setSubmitting(true);
   const {
  data: { user },
  error: userError,
} = await client.auth.getUser();

if (userError || !user) {
  setSubmitting(false);
  setMessage("Please log in before commenting.");
  setIsError(true);
  return;
}

const { error } = await client
  .from("mrc_comments")
  .insert({
    name: cleanName,
    comment: cleanComment,
    user_id: user.id,
  });
    setSubmitting(false);

    if (error) {
      console.error("Could not submit comment:", error);
      setMessage("Your comment could not be submitted. Please try again later.");
      setIsError(true);
      return;
    }

    setName("");
    setComment("");
    await loadComments();
    setMessage("Thank you! Your comment has been published.");
    setIsError(false);
  }

  return (
    <main className="min-h-screen bg-[#030916] px-4 py-8 text-[#edf5ff] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 flex flex-wrap gap-3 text-sm" aria-label="Main navigation">
          <a className="rounded-lg border border-sky-800 px-4 py-2 text-sky-200 hover:bg-sky-950" href="/">Home</a>
          <a className="rounded-lg border border-sky-800 px-4 py-2 text-sky-200 hover:bg-sky-950" href="/login">Login</a>
          <a className="rounded-lg border border-sky-800 px-4 py-2 text-sky-200 hover:bg-sky-950" href="/register">Register</a>
          <a className="rounded-lg border border-sky-800 px-4 py-2 text-sky-200 hover:bg-sky-950" href="/library">Medical PDF Library</a>
        </nav>

        <header className="mb-8 border-b border-sky-900 pb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-300">Medical Research Centre</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Community Comments</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Share feedback, ask a general question, or tell us how the Medical Research Centre can improve.
            Please keep comments respectful and do not post private medical information.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-sky-900 bg-[#081629] p-5 sm:p-7">
          <h2 className="mb-4 text-xl font-semibold text-sky-300">Leave a comment</h2>
          <form className="space-y-4" onSubmit={submitComment}>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="comment-name">Your name</label>
              <input
                id="comment-name"
                name="name"
                autoComplete="name"
                maxLength={80}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-sky-900 bg-[#030d1c] p-3 text-white outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="comment-text">Your comment</label>
              <textarea
                id="comment-text"
                name="comment"
                required
                maxLength={1000}
                rows={5}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write your feedback or comment..."
                className="w-full resize-y rounded-lg border border-sky-900 bg-[#030d1c] p-3 text-white outline-none focus:border-sky-400"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{comment.length}/1000 characters</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Post comment"}
            </button>
          </form>
          {message && (
            <p role={isError ? "alert" : "status"} className={`mt-4 rounded-lg p-3 text-sm ${isError ? "bg-red-950 text-red-200" : "bg-emerald-950 text-emerald-200"}`}>
              {message}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-sky-900 bg-[#081629] p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-sky-300">Community feedback</h2>
              <p className="mt-1 text-sm text-slate-400">Showing the latest {Math.min(comments.length, 100)} comments</p>
            </div>
            <button type="button" onClick={() => void loadComments()} className="rounded-lg border border-sky-800 px-3 py-2 text-sm text-sky-200 hover:bg-sky-950">
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-300">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-sky-900 p-5 text-slate-300">No comments yet. Be the first to share your feedback.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((item) => (
                <article key={item.id} className="rounded-xl border border-sky-950 bg-[#061020] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <time className="text-xs text-slate-400" dateTime={item.created_at}>
                      {new Date(item.created_at).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-200">{item.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-sm text-slate-500">
          Medical Research Centre • Learn • Research • Advance
        </footer>
      </div>
    </main>
  );
}
