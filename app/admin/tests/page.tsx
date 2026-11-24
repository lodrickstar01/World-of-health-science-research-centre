"use client";

import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type AdminQuestion = {
  id: string;
  subject: string;
  question: string;
  active: boolean;
  created_at: string;
};

type AttemptRow = {
  user_id: string;
  email: string | null;
  paper_date: string;
  score: number;
  total: number;
  submitted_at: string;
};

let browserClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!browserClient) browserClient = createClient(url, key);
  return browserClient;
}

export default function ExamAdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [subject, setSubject] = useState("Physiology");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState("0");
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadAdminData() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase configuration is missing. Add the public URL and key to your hosting environment variables and redeploy.");
      return;
    }

    setRefreshing(true);
    setError("");
    const [questionResponse, attemptResponse] = await Promise.all([
      supabase
        .from("exam_questions")
        .select("id,subject,question,active,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.rpc("mrc_admin_exam_attempts"),
    ]);

    if (questionResponse.error) setError(`Could not load question bank: ${questionResponse.error.message}`);
    else setQuestions((questionResponse.data ?? []) as AdminQuestion[]);

    if (attemptResponse.error) setError((current) => current || `Could not load member results: ${attemptResponse.error.message}`);
    else setAttempts((Array.isArray(attemptResponse.data) ? attemptResponse.data : []) as AttemptRow[]);
    setRefreshing(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase configuration is missing. Add the public URL and key to your hosting environment variables and redeploy.");
        setChecking(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (cancelled) return;
        if (sessionError || !session) {
          window.location.replace("/login");
          return;
        }

        const { data: admin, error: adminError } = await supabase.rpc("mrc_is_exam_admin");
        if (cancelled) return;
        if (adminError) {
          setError(`Could not verify exam administrator access: ${adminError.message}. Run the supplied SQL and register your user ID as an exam administrator.`);
          setChecking(false);
          return;
        }
        setIsAdmin(Boolean(admin));
        setChecking(false);
        if (admin) await loadAdminData();
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not verify administrator access.");
          setChecking(false);
        }
      }
    }

    void checkAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedQuestion = question.trim();
    const cleanOptions = options.map((option) => option.trim());
    if (!trimmedQuestion || cleanOptions.some((option) => !option)) {
      setError("Enter the question and all four answer options.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase configuration is missing.");
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("exam_questions").insert({
      subject,
      question: trimmedQuestion,
      options: cleanOptions,
      correct_index: Number(correctIndex),
      explanation: explanation.trim(),
      active: true,
    });
    setSaving(false);

    if (insertError) {
      setError(`Could not save question: ${insertError.message}`);
      return;
    }

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex("0");
    setExplanation("");
    setMessage("Question saved. It can appear in the next daily paper. Today's paper stays fixed once generated.");
    await loadAdminData();
  }

  async function changeQuestionStatus(item: AdminQuestion) {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setError("");
    const { error: updateError } = await supabase
      .from("exam_questions")
      .update({ active: !item.active })
      .eq("id", item.id);

    if (updateError) {
      setError(`Could not update question: ${updateError.message}`);
      return;
    }
    setQuestions((current) => current.map((questionItem) => questionItem.id === item.id ? { ...questionItem, active: !item.active } : questionItem));
    setMessage(item.active ? "Question deactivated. It won't be selected for new daily papers." : "Question activated. It may be selected for a future daily paper.");
  }

  if (checking) {
    return <main style={{ padding: 28, fontFamily: "Arial, sans-serif" }}>Checking exam administrator access…</main>;
  }

  if (!isAdmin) {
    return (
      <main style={{ maxWidth: 760, margin: "40px auto", padding: 20, fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <h1>Online Test Administration</h1>
        <p role="alert" style={{ color: "#b42318" }}>{error || "This account is not registered as an exam administrator."}</p>
        <p>To enable monitoring, sign in with your account and add that account's Supabase Auth user ID to the <code>public.exam_admins</code> table using the supplied setup instructions.</p>
        <a href="/">Return to homepage</a>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#030916", color: "#edf5ff", fontFamily: "Arial, sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ borderBottom: "1px solid #17416d", paddingBottom: 18, marginBottom: 22 }}>
          <p style={{ color: "#55bdff", marginBottom: 6 }}>MEDICAL RESEARCH CENTRE</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "6px 0" }}>Online Test Administration</h1>
          <p style={{ color: "#a9bfd9", lineHeight: 1.6 }}>Create MCQ questions, maintain the question bank and monitor members' scores.</p>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="/" style={{ color: "#90d3ff" }}>Home</a>
            <a href="/tests" style={{ color: "#90d3ff" }}>Member tests</a>
          </nav>
        </header>

        {error && <p role="alert" style={{ background: "#381820", border: "1px solid #94404c", padding: 12, borderRadius: 8 }}>{error}</p>}
        {message && <p role="status" style={{ background: "#092c29", border: "1px solid #1c806b", padding: 12, borderRadius: 8 }}>{message}</p>}

        <section style={{ padding: 22, border: "1px solid #18436d", borderRadius: 12, background: "#081629", marginBottom: 24 }}>
          <h2 style={{ color: "#55bdff", marginTop: 0 }}>Add a multiple-choice question</h2>
          <form onSubmit={(event) => void addQuestion(event)}>
            <label htmlFor="exam-subject">Subject</label>
            <select id="exam-subject" value={subject} onChange={(event) => setSubject(event.target.value)} style={fieldStyle}>
              {["Anatomy", "Physiology", "Biochemistry", "Dental Anatomy", "Pharmacy", "General Medicine", "Histology", "Embryology"].map((item) => <option key={item}>{item}</option>)}
            </select>

            <label htmlFor="exam-question">Question</label>
            <textarea id="exam-question" required value={question} onChange={(event) => setQuestion(event.target.value)} style={{ ...fieldStyle, minHeight: 100, resize: "vertical" }} placeholder="Write a clear exam question" />

            {options.map((option, index) => (
              <div key={index}>
                <label htmlFor={`exam-option-${index}`}>Option {String.fromCharCode(65 + index)}</label>
                <input id={`exam-option-${index}`} required value={option} onChange={(event) => setOptions((current) => current.map((value, optionIndex) => optionIndex === index ? event.target.value : value))} style={fieldStyle} placeholder={`Enter option ${String.fromCharCode(65 + index)}`} />
              </div>
            ))}

            <label htmlFor="correct-option">Correct answer</label>
            <select id="correct-option" value={correctIndex} onChange={(event) => setCorrectIndex(event.target.value)} style={fieldStyle}>
              {options.map((option, index) => <option key={index} value={index}>{String.fromCharCode(65 + index)}{option.trim() ? ` — ${option.trim()}` : ""}</option>)}
            </select>

            <label htmlFor="exam-explanation">Explanation (optional)</label>
            <textarea id="exam-explanation" value={explanation} onChange={(event) => setExplanation(event.target.value)} style={{ ...fieldStyle, minHeight: 75, resize: "vertical" }} placeholder="Why is the answer correct? (visible to admin only in this version)" />

            <button type="submit" disabled={saving} style={primaryButtonStyle}>{saving ? "Saving question…" : "Save question"}</button>
          </form>
          <p style={{ color: "#a9bfd9", lineHeight: 1.6 }}>Aim for at least 20 active questions for meaningful daily variation. The paper for today is fixed when first generated; newly added questions can appear in a future day's paper.</p>
        </section>

        <section style={{ padding: 22, border: "1px solid #18436d", borderRadius: 12, background: "#081629", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h2 style={{ color: "#55bdff", marginTop: 0 }}>Question bank ({questions.length})</h2>
            <button type="button" onClick={() => void loadAdminData()} disabled={refreshing} style={secondaryButtonStyle}>{refreshing ? "Refreshing…" : "Refresh data"}</button>
          </div>
          {questions.length === 0 ? <p>No questions have been added yet.</p> : (
            <div style={{ display: "grid", gap: 10 }}>
              {questions.map((item) => (
                <article key={item.id} style={{ border: "1px solid #285174", padding: 14, borderRadius: 8 }}>
                  <p style={{ color: "#90d3ff", marginTop: 0 }}>{item.subject} · {item.active ? "Active" : "Inactive"}</p>
                  <p>{item.question}</p>
                  <button type="button" onClick={() => void changeQuestionStatus(item)} style={secondaryButtonStyle}>{item.active ? "Deactivate" : "Activate"}</button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={{ padding: 22, border: "1px solid #18436d", borderRadius: 12, background: "#081629" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <h2 style={{ color: "#55bdff", marginTop: 0 }}>Member results ({attempts.length} most recent)</h2>
            <button type="button" onClick={() => void loadAdminData()} disabled={refreshing} style={secondaryButtonStyle}>Refresh results</button>
          </div>
          {attempts.length === 0 ? <p>No submitted tests yet. Results will appear after members submit a paper.</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
                <thead><tr>
                  <th style={cellHeadStyle}>Member email</th><th style={cellHeadStyle}>Paper date</th><th style={cellHeadStyle}>Score</th><th style={cellHeadStyle}>Percent</th><th style={cellHeadStyle}>Submitted (Kampala)</th>
                </tr></thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr key={`${attempt.user_id}-${attempt.paper_date}-${index}`}>
                      <td style={cellStyle}>{attempt.email || attempt.user_id}</td>
                      <td style={cellStyle}>{attempt.paper_date}</td>
                      <td style={cellStyle}>{attempt.score} / {attempt.total}</td>
                      <td style={cellStyle}>{attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0}%</td>
                      <td style={cellStyle}>{new Date(attempt.submitted_at).toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const fieldStyle: CSSProperties = {
  display: "block",
  width: "100%",
  margin: "6px 0 14px",
  padding: 12,
  background: "#030d1c",
  color: "#ffffff",
  border: "1px solid #285174",
  borderRadius: 8,
  font: "inherit",
};

const primaryButtonStyle: CSSProperties = {
  background: "#0878d5",
  color: "white",
  border: 0,
  borderRadius: 8,
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  background: "transparent",
  color: "#90d3ff",
  border: "1px solid #168de8",
  borderRadius: 8,
  padding: "9px 12px",
  cursor: "pointer",
};

const cellHeadStyle: CSSProperties = {
  textAlign: "left",
  padding: 10,
  borderBottom: "1px solid #285174",
  color: "#90d3ff",
};

const cellStyle: CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #18344f",
  verticalAlign: "top",
};
