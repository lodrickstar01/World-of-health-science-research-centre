"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

type Discussion = { room_name: string; topic: string; status: "live" | "ended"; started_at: string | null };
type SpeakerRequest = {
  id: string;
  user_id: string;
  display_name: string;
  note: string;
  status: "pending" | "approved" | "declined" | "revoked";
  requested_at: string;
  reviewed_at?: string | null;
};
type CallParticipant = {
  session_id: string;
  user_id?: string;
  user_name?: string;
  local?: boolean;
  owner?: boolean;
  permissions?: { canSend?: boolean | string[] | Set<string>; canAdmin?: boolean | string[] | Set<string> };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function DiscussionsPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [myRequest, setMyRequest] = useState<{ id: string; status: SpeakerRequest["status"]; note?: string } | null>(null);
  const [requests, setRequests] = useState<SpeakerRequest[]>([]);
  const [participants, setParticipants] = useState<CallParticipant[]>([]);
  const [topic, setTopic] = useState("Medical Research Centre Live Discussion");
  const [requestNote, setRequestNote] = useState("");
  const [inCall, setInCall] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const callRef = useRef<any>(null);
  const callContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) {
      setError("Supabase configuration is missing. Add NEXT_PUBLIC_SUPABASE_URL and your public Supabase key to the hosting environment, then redeploy.");
      setAuthReady(true);
      return;
    }
    const client = createClient(supabaseUrl, supabaseKey);
    setSupabase(client);
    let active = true;
    client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: authListener } = client.auth.onAuthStateChange((_event, currentSession) => {
      if (!active) return;
      setSession(currentSession);
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const api = useCallback(async (path: string, method = "GET", body?: unknown) => {
    if (!session?.access_token) throw new Error("Please sign in again to continue.");
    const response = await fetch(path, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
    return payload as any;
  }, [session]);

  const syncParticipants = useCallback((frame?: any) => {
    const call = frame || callRef.current;
    if (!call) return;
    try {
      const current = call.participants() as Record<string, CallParticipant>;
      setParticipants(Object.values(current).filter((person) => !person.local));
    } catch (err) {
      console.warn("Could not refresh live discussion participants", err);
    }
  }, []);

  const leaveCall = useCallback(async () => {
    const call = callRef.current;
    callRef.current = null;
    setInCall(false);
    setParticipants([]);
    if (call) {
      try { await call.leave(); } catch { /* The call may already have ended. */ }
      try { await call.destroy(); } catch { /* Ignore cleanup errors. */ }
    }
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const payload = await api("/api/discussions/state");
      setDiscussion(payload.discussion || null);
      setIsAdmin(Boolean(payload.isAdmin));
      setMyRequest(payload.myRequest || null);
      setError("");
      if (payload.discussion?.status !== "live" && callRef.current) {
        await leaveCall();
        setNotice("The administrator has ended the discussion.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load live discussion status.");
    }
  }, [api, leaveCall]);

  const refreshRequests = useCallback(async () => {
    if (!isAdmin || !discussion || discussion.status !== "live") return;
    try {
      const payload = await api("/api/discussions/requests");
      setRequests(payload.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load speaker requests.");
    }
  }, [api, discussion, isAdmin]);

  useEffect(() => {
    if (!authReady) return;
    if (!session) {
      setNotice("Please log in with your Medical Research Centre member account to join a discussion.");
      return;
    }
    void refreshState();
    const stateTimer = window.setInterval(() => { void refreshState(); }, 7000);
    return () => window.clearInterval(stateTimer);
  }, [authReady, session, refreshState]);

  useEffect(() => {
    if (!session || !isAdmin || !discussion || discussion.status !== "live") {
      setRequests([]);
      return;
    }
    void refreshRequests();
    const requestTimer = window.setInterval(() => { void refreshRequests(); }, 4000);
    return () => window.clearInterval(requestTimer);
  }, [session, isAdmin, discussion, refreshRequests]);

  useEffect(() => () => {
    const call = callRef.current;
    callRef.current = null;
    if (call) {
      try {
        const leaving = call.leave();
        if (leaving && typeof leaving.catch === "function") void leaving.catch(() => undefined);
      } catch { /* Ignore cleanup errors. */ }
      try { call.destroy(); } catch { /* Ignore cleanup errors. */ }
    }
  }, []);

  async function startDiscussion() {
    setBusy(true); setError(""); setNotice("");
    try {
      const payload = await api("/api/discussions/start", "POST", { topic });
      setNotice(payload.alreadyLive ? "A discussion is already live." : "Live discussion started. Members can join as listeners and request permission to speak.");
      await refreshState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the discussion.");
    } finally { setBusy(false); }
  }

  async function joinDiscussion() {
    if (!discussion || discussion.status !== "live") return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (callRef.current) await leaveCall();
      const tokenInfo = await api("/api/discussions/token", "POST", {});
      const dailyModule = await import("@daily-co/daily-js");
      const DailyIframe = dailyModule.default;
      if (!callContainerRef.current) throw new Error("The video call container is not ready. Refresh the page and try again.");
      const frame = DailyIframe.createFrame(callContainerRef.current, {
        showLeaveButton: true,
        showFullscreenButton: true,
        iframeStyle: { width: "100%", height: "620px", border: "0", borderRadius: "12px" },
      });
      callRef.current = frame;
      const sync = () => syncParticipants(frame);
      frame.on("joined-meeting", sync);
      frame.on("participant-joined", sync);
      frame.on("participant-updated", sync);
      frame.on("participant-left", sync);
      frame.on("left-meeting", () => { setInCall(false); setParticipants([]); });
      await frame.join({ url: tokenInfo.roomUrl, token: tokenInfo.token });
      setIsAdmin(Boolean(tokenInfo.isAdmin));
      setInCall(true);
      syncParticipants(frame);
      setNotice(isAdmin
        ? "You joined as discussion host. Approve speaker requests from the panel below."
        : "You joined as a listener. Your microphone and camera stay restricted until the host approves your request to speak.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the live discussion.");
      await leaveCall();
    } finally { setBusy(false); }
  }

  async function requestToSpeak() {
    setBusy(true); setError(""); setNotice("");
    try {
      const payload = await api("/api/discussions/request-to-speak", "POST", { note: requestNote });
      setMyRequest(payload.request);
      setRequestNote("");
      setNotice(payload.alreadyPending ? "Your request is already waiting for the host." : "Your request to speak has been sent to the host.");
      if (isAdmin) await refreshRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your speaking request.");
    } finally { setBusy(false); }
  }

  async function reviewSpeakerRequest(item: SpeakerRequest, decision: "approved" | "declined" | "revoked") {
    setBusy(true); setError(""); setNotice("");
    try {
      const participant = participants.find((person) => person.user_id === item.user_id);
      if (decision === "approved" || decision === "revoked") {
        if (!participant) throw new Error("That member is not currently in the call. Ask them to join as a listener first.");
        if (!callRef.current) throw new Error("Join the discussion as host before changing speaker permissions.");
        // Daily's updatePermissions is an owner-only operation. Only an account
        // verified by the server receives an owner token.
        await callRef.current.updateParticipant(participant.session_id, {
          updatePermissions: { canSend: decision === "approved" ? ["audio", "video"] : [] },
        });
      }
      await api("/api/discussions/review-request", "POST", { requestId: item.id, decision });
      setNotice(decision === "approved" ? `${item.display_name} is now approved to speak.` : decision === "revoked" ? `Speaking permission removed for ${item.display_name}.` : `Request from ${item.display_name} declined.`);
      await refreshRequests();
      syncParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update speaker permissions.");
    } finally { setBusy(false); }
  }

  async function endDiscussion() {
    const confirmed = window.confirm("End this live discussion for everyone?");
    if (!confirmed) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api("/api/discussions/end", "POST", {});
      await leaveCall();
      await refreshState();
      setNotice("Discussion ended. Other members will be disconnected as their pages refresh the discussion state.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not end the discussion.");
    } finally { setBusy(false); }
  }

  const memberName = session?.user.user_metadata?.full_name || session?.user.user_metadata?.name || session?.user.email || "Member";
  const statusLabel = discussion?.status === "live" ? "LIVE NOW" : "NOT LIVE";
  const participantIsPresent = (userId: string) => participants.some((person) => person.user_id === userId);

  return (
    <main className="mrc-discussion-page">
      <style jsx global>{`
        .mrc-discussion-page { min-height: 100vh; padding: 28px 18px 48px; background: #030916; color: #edf5ff; font-family: Arial, sans-serif; }
        .mrc-discussion-wrap { width: min(1120px, 100%); margin: 0 auto; }
        .mrc-discussion-page a { color: #85cfff; }
        .mrc-discussion-header { padding: 24px; margin-bottom: 18px; background: #061326; border: 1px solid #17416d; border-radius: 16px; }
        .mrc-discussion-header h1 { margin: 0 0 8px; font-size: clamp(27px, 4vw, 40px); color: #55bdff; }
        .mrc-discussion-subtitle, .mrc-discussion-muted { color: #adc2db; line-height: 1.6; }
        .mrc-discussion-card { padding: 22px; margin: 18px 0; background: #081629; border: 1px solid #18436d; border-radius: 14px; }
        .mrc-discussion-card h2 { color: #55bdff; margin-top: 0; }
        .mrc-discussion-input, .mrc-discussion-textarea { box-sizing: border-box; width: 100%; margin: 6px 0 12px; padding: 12px; color: white; background: #030d1c; border: 1px solid #285174; border-radius: 8px; font: inherit; }
        .mrc-discussion-textarea { min-height: 74px; resize: vertical; }
        .mrc-discussion-btn { display: inline-block; margin: 4px 8px 4px 0; padding: 10px 15px; color: white; background: #0878d5; border: 1px solid #168de8; border-radius: 8px; font: inherit; cursor: pointer; text-decoration: none; }
        .mrc-discussion-btn:disabled { opacity: .55; cursor: not-allowed; }
        .mrc-discussion-btn.secondary { background: transparent; color: #90d3ff; }
        .mrc-discussion-btn.danger { background: #7f1d1d; border-color: #b91c1c; }
        .mrc-discussion-status { display: inline-block; padding: 5px 9px; margin: 0 0 10px; border-radius: 999px; background: #15314d; color: #b8ddff; font-size: 12px; font-weight: 700; letter-spacing: .06em; }
        .mrc-discussion-status.live { background: #123d31; color: #a7f3d0; }
        .mrc-discussion-note { padding: 12px 14px; margin: 12px 0; background: #0a2037; border: 1px solid #214c70; border-radius: 9px; line-height: 1.5; }
        .mrc-discussion-note.error { border-color: #b91c1c; color: #fecaca; background: #351317; }
        .mrc-discussion-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr); gap: 18px; align-items: start; }
        .mrc-discussion-request { padding: 14px; margin: 12px 0; background: #061326; border: 1px solid #20456b; border-radius: 10px; overflow-wrap: anywhere; }
        .mrc-discussion-call { min-height: 300px; width: 100%; }
        .mrc-discussion-call iframe { width: 100%; }
        @media (max-width: 780px) { .mrc-discussion-grid { grid-template-columns: 1fr; } .mrc-discussion-card { padding: 16px; } }
      `}</style>

      <div className="mrc-discussion-wrap">
        <header className="mrc-discussion-header">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1>Medical Research Centre Live Discussions</h1>
              <p className="mrc-discussion-subtitle">Learn together. Ask questions. Share medical knowledge live.</p>
            </div>
            <span className={`mrc-discussion-status ${discussion?.status === "live" ? "live" : ""}`}>{statusLabel}</span>
          </div>
          <p className="mrc-discussion-muted">Signed in as: {memberName}</p>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="/">Home</a><a href="/library">Medical library</a><a href="/tests">Online tests</a>
          </nav>
        </header>

        {!authReady && <section className="mrc-discussion-card">Checking your member session…</section>}
        {authReady && !session && (
          <section className="mrc-discussion-card">
            <h2>Sign in to join</h2>
            <p className="mrc-discussion-muted">Live discussions are available to registered Medical Research Centre members.</p>
            <a className="mrc-discussion-btn" href="/login">Go to login</a>
            <a className="mrc-discussion-btn secondary" href="/register">Register</a>
          </section>
        )}

        {error && <div className="mrc-discussion-note error" role="alert">{error}</div>}
        {notice && <div className="mrc-discussion-note" role="status">{notice}</div>}

        {session && (
          <>
            {isAdmin && (!discussion || discussion.status !== "live") && (
              <section className="mrc-discussion-card">
                <h2>Host a live discussion</h2>
                <p className="mrc-discussion-muted">Starting creates a private video room. Logged-in members can join to watch and listen. Their microphones and cameras remain blocked until you approve a speaker request.</p>
                <label htmlFor="discussion-topic">Discussion topic</label>
                <input id="discussion-topic" className="mrc-discussion-input" value={topic} maxLength={160} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Understanding immune responses" />
                <button className="mrc-discussion-btn" onClick={() => void startDiscussion()} disabled={busy || !topic.trim()}>{busy ? "Please wait…" : "Start live discussion"}</button>
              </section>
            )}

            {discussion?.status === "live" && (
              <section className="mrc-discussion-card">
                <h2>{discussion.topic}</h2>
                <p className="mrc-discussion-muted">Started {discussion.started_at ? new Date(discussion.started_at).toLocaleString("en-UG", { dateStyle: "medium", timeStyle: "short" }) : "recently"} (Uganda time may be shown based on your device settings).</p>
                {!inCall ? (
                  <button className="mrc-discussion-btn" onClick={() => void joinDiscussion()} disabled={busy}>{busy ? "Connecting…" : isAdmin ? "Join as host" : "Join and listen"}</button>
                ) : (
                  <button className="mrc-discussion-btn secondary" onClick={() => void leaveCall()} disabled={busy}>Leave discussion</button>
                )}
                {isAdmin && <button className="mrc-discussion-btn danger" onClick={() => void endDiscussion()} disabled={busy}>End discussion for everyone</button>}
                {inCall && !isAdmin && (
                  <div style={{ marginTop: 14 }}>
                    <p className="mrc-discussion-muted">You are listening. The host must approve you before your microphone or camera can send media.</p>
                    {myRequest?.status === "pending" ? (
                      <div className="mrc-discussion-note">Your request to speak is waiting for the host.</div>
                    ) : myRequest?.status === "approved" ? (
                      <div className="mrc-discussion-note">You have been approved to speak. Use the call controls to turn on your microphone or camera when ready.</div>
                    ) : (
                      <>
                        <label htmlFor="speaker-note">Optional note for the host</label>
                        <textarea id="speaker-note" className="mrc-discussion-textarea" value={requestNote} onChange={(event) => setRequestNote(event.target.value)} maxLength={240} placeholder="What would you like to contribute?" />
                        <button className="mrc-discussion-btn" onClick={() => void requestToSpeak()} disabled={busy}>Request to speak</button>
                      </>
                    )}
                    {myRequest && ["declined", "revoked"].includes(myRequest.status) && <p className="mrc-discussion-muted">Your previous request was {myRequest.status}. You may send a new request.</p>}
                  </div>
                )}
              </section>
            )}

            {discussion?.status === "live" && (
              <section className="mrc-discussion-card" style={{ display: inCall ? "block" : "none" }}>
                <div className="mrc-discussion-call" ref={callContainerRef} />
              </section>
            )}

            {isAdmin && discussion?.status === "live" && (
              <div className="mrc-discussion-grid">
                <section className="mrc-discussion-card">
                  <h2>Speaker verification</h2>
                  <p className="mrc-discussion-muted">Approve only members who are currently in this call. Approval enables microphone and camera transmission; they can still keep either one switched off.</p>
                  {!inCall && <p className="mrc-discussion-note">Join as host to see connected participants and approve speakers.</p>}
                  {requests.length === 0 && <p className="mrc-discussion-muted">No speaker requests yet. This list refreshes automatically.</p>}
                  {requests.map((item) => {
                    const present = participantIsPresent(item.user_id);
                    return (
                      <article className="mrc-discussion-request" key={item.id}>
                        <strong>{item.display_name}</strong>
                        <p className="mrc-discussion-muted">Requested {new Date(item.requested_at).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" })} · {present ? "In call" : "Not currently in call"}</p>
                        {item.note && <p>{item.note}</p>}
                        <span className="mrc-discussion-status">{item.status.toUpperCase()}</span>
                        <div>
                          {item.status === "pending" && (
                            <>
                              <button className="mrc-discussion-btn" onClick={() => void reviewSpeakerRequest(item, "approved")} disabled={busy || !inCall || !present}>Approve to speak</button>
                              <button className="mrc-discussion-btn secondary" onClick={() => void reviewSpeakerRequest(item, "declined")} disabled={busy}>Decline</button>
                            </>
                          )}
                          {item.status === "approved" && (
                            <button className="mrc-discussion-btn danger" onClick={() => void reviewSpeakerRequest(item, "revoked")} disabled={busy || !inCall || !present}>Revoke speaker permission</button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>

                <section className="mrc-discussion-card">
                  <h2>People in the call ({participants.length})</h2>
                  <p className="mrc-discussion-muted">Participants are visible here while you are joined as host.</p>
                  {!inCall && <p className="mrc-discussion-muted">Join the call to display the live participant list.</p>}
                  {participants.map((person) => {
                    const request = requests.find((item) => item.user_id === person.user_id && item.status === "approved");
                    return <article className="mrc-discussion-request" key={person.session_id}>
                      <strong>{person.user_name || "Member"}</strong>
                      <p className="mrc-discussion-muted">{person.owner ? "Host" : request ? "Approved speaker" : "Listener"}</p>
                    </article>;
                  })}
                </section>
              </div>
            )}

            {discussion?.status !== "live" && !isAdmin && (
              <section className="mrc-discussion-card">
                <h2>No live discussion at the moment</h2>
                <p className="mrc-discussion-muted">Please return later. When the administrator starts a discussion, it will appear here automatically.</p>
              </section>
            )}
          </>
        )}

        <footer className="mrc-discussion-card">
          <p className="mrc-discussion-muted">For a respectful learning space, share educational information, avoid exposing patient-identifying details, and follow the host's instructions. Calls are not recorded by this integration.</p>
          <p className="mrc-discussion-muted">Video calls use Daily. Its free tier currently includes 10,000 participant-minutes per month; usage beyond the free allowance may be billed. Check the provider's current pricing before hosting large events.</p>
        </footer>
      </div>
    </main>
  );
}
