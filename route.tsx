import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export class DiscussionHttpError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "DiscussionHttpError";
    this.status = status;
  }
}

export type DiscussionContext = {
  user: User;
  db: SupabaseClient;
  isAdmin: boolean;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new DiscussionHttpError(`Missing server environment variable: ${name}`, 500);
  return value;
}

export async function getDiscussionContext(request: Request): Promise<DiscussionContext> {
  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!publicKey) {
    throw new DiscussionHttpError(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in the hosting environment.",
      500
    );
  }
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new DiscussionHttpError("Please log in to use live discussions.", 401);

  const authClient = createClient(supabaseUrl, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    throw new DiscussionHttpError("Your login session is invalid or expired. Please sign in again.", 401);
  }

  const db = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data: adminRow, error: adminError } = await db
    .from("exam_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError) {
    throw new DiscussionHttpError(
      "Could not verify administrator access. Run the existing Online Tests SQL setup so public.exam_admins exists, and ensure this account is listed there.",
      500
    );
  }

  return { user: userData.user, db, isAdmin: Boolean(adminRow) };
}

export function requireDiscussionAdmin(context: DiscussionContext): void {
  if (!context.isAdmin) {
    throw new DiscussionHttpError("Only the approved Medical Research Centre administrator can manage this discussion.", 403);
  }
}

export function jsonError(error: unknown): Response {
  if (error instanceof DiscussionHttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Live discussion API error:", error);
  return Response.json(
    { error: error instanceof Error ? error.message : "Unexpected live discussion error." },
    { status: 500 }
  );
}

export async function dailyApi(path: string, init: { method?: string; body?: unknown } = {}) {
  const apiKey = requiredEnv("DAILY_API_KEY");
  const response = await fetch(`https://api.daily.co/v1${path}`, {
    method: init.method || "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerMessage =
      (typeof result.info === "string" && result.info) ||
      (typeof result.error === "string" && result.error) ||
      `Daily returned HTTP ${response.status}.`;
    throw new DiscussionHttpError(`Daily video service: ${providerMessage}`, 502);
  }
  return result as Record<string, any>;
}

export async function getCurrentDiscussion(db: SupabaseClient) {
  const { data, error } = await db
    .from("mrc_live_discussion")
    .select("id, room_name, room_url, topic, status, started_by, started_at, ended_at, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    throw new DiscussionHttpError(
      "Live discussion database is not ready. Run supabase/live-discussions.sql in your Supabase SQL Editor.",
      500
    );
  }
  return data;
}

export function userDisplayName(user: User): string {
  const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
  const emailName = user.email?.split("@")[0];
  const result = String(metadataName || emailName || "Medical Research Centre member").trim();
  return result.slice(0, 80) || "Medical Research Centre member";
}
