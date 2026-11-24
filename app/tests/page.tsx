"use client";

import { useEffect, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type DailyQuestion = {
  paper_date: string;
  title: string;
  question_id: string;
  subject: string;
  question: string;
  options: string[];
  question_order: number;
};

type ExamResult = {
  score: number;
  total: number;
  submitted_at: string;
  paper_date?: string;
  already_submitted?: boolean;
};

type ReviewedQuestion = {
  question_id: string;
  subject: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  selected_index: number | null;
  is_correct: boolean;
  question_order: number;
};

async function fetchExamReview(
  supabase: SupabaseClient,
  paperDate: string
): Promise<ReviewedQuestion[]> {
  const { data, error } = await supabase.rpc("mrc_review_daily_exam", {
    p_paper_date: paperDate,
  });

  if (error) throw error;
  return (Array.isArray(data) ? data : []) as ReviewedQuestion[];
}

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

export default function OnlineTestsPage() {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [review, setReview] = useState<ReviewedQuestion[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadExam() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError(
          "Supabase configuration is missing. Add NEXT_PUBLIC_SUPABASE_URL and your public Supabase key to the hosting environment variables, then redeploy."
        );
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (cancelled) return;
        if (sessionError || !session) {
          window.location.replace("/login");
          return;
        }

        const { data, error: examError } = await supabase.rpc("mrc_get_daily_exam");
        if (cancelled) return;
        if (examError) {
          setError(
            `Could not load today's paper: ${examError.message}. Check that the online-tests SQL script has been run in Supabase.`
          );
          setLoading(false);
          return;
        }

        const rows = (Array.isArray(data) ? data : []) as DailyQuestion[];
        setQuestions(rows);

        if (rows.length > 0) {
          const { data: previous, error: previousError } = await supabase
            .from("exam_attempts")
            .select("score,total,submitted_at,paper_date")
            .eq("user_id", session.user.id)
            .eq("paper_date", rows[0].paper_date)
            .maybeSingle();

          if (cancelled) return;
          if (!previousError && previous) {
            setResult(previous as ExamResult);
            setNotice("You have already submitted today's paper. Your recorded score and corrections are shown below.");
            setReviewLoading(true);
            try {
              const reviewRows = await fetchExamReview(supabase, rows[0].paper_date);
              if (!cancelled) setReview(reviewRows);
            } catch (reviewErr: unknown) {
              if (!cancelled) {
                setReviewError(
                  reviewErr instanceof Error
                    ? `${reviewErr.message}. Run the exam-review SQL patch in Supabase to enable answer corrections.`
                    : "Could not load corrections. Run the exam-review SQL patch in Supabase."
                );
              }
            } finally {
              if (!cancelled) setReviewLoading(false);
            }
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred while loading the paper.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadExam();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitExam() {
    setError("");
    setNotice("");

    if (!questions.length) {
      setError("There is no paper available to submit yet.");
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      setError(`Please answer every question before submitting. You have answered ${Object.keys(answers).length} of ${questions.length}.`);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase configuration is missing. Please contact the website administrator.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: submitError } = await supabase.rpc("mrc_submit_daily_exam", {
        p_answers: answers,
      });

      if (submitError) throw submitError;
      const saved = data as ExamResult | null;
      if (!saved || typeof saved.score !== "number" || typeof saved.total !== "number") {
        throw new Error("The server did not return a valid score. Refresh the page and check your results.");
      }

      setResult(saved);
      setNotice(
        saved.already_submitted
          ? "Today's attempt was already recorded. Your original score and corrections are displayed."
          : "Your answers have been marked automatically and your score has been saved. Review the questions you missed below."
      );

      const paperDate = saved.paper_date || questions[0].paper_date;
      setReviewLoading(true);
      setReviewError("");
      try {
        const reviewRows = await fetchExamReview(supabase, paperDate);
        setReview(reviewRows);
      } catch (reviewErr: unknown) {
        setReviewError(
          reviewErr instanceof Error
            ? `${reviewErr.message}. Run the exam-review SQL patch in Supabase to enable answer corrections.`
            : "Your score was saved, but corrections could not be loaded. Run the exam-review SQL patch in Supabase."
        );
      } finally {
        setReviewLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to submit the paper. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const percentage = result && result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <main style={{ minHeight: "100vh", background: "#030916", color: "#edf5ff", fontFamily: "Arial, sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <header style={{ borderBottom: "1px solid #17416d", paddingBottom: 18, marginBottom: 22 }}>
          <p style={{ color: "#55bdff", marginBottom: 6 }}>MEDICAL RESEARCH CENTRE</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "6px 0" }}>Online Medical Tests</h1>
          <p style={{ color: "#a9bfd9", lineHeight: 1.6, marginBottom: 12 }}>
            Take today's multiple-choice paper, submit your answers and receive your score immediately.
            A new paper is generated each day using the active question bank.
          </p>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="/" style={{ color: "#90d3ff" }}>Home</a>
            <a href="/library" style={{ color: "#90d3ff" }}>Medical PDF Library</a>
            <a href="/admin/tests" style={{ color: "#90d3ff" }}>Exam Admin</a>
          </nav>
        </header>

        {loading && <p role="status">Loading today's paper…</p>}
        {error && <p role="alert" style={{ background: "#381820", border: "1px solid #94404c", padding: 12, borderRadius: 8 }}>{error}</p>}
        {notice && <p role="status" style={{ background: "#092c29", border: "1px solid #1c806b", padding: 12, borderRadius: 8 }}>{notice}</p>}

        {!loading && !error && questions.length === 0 && (
          <section style={{ padding: 22, border: "1px solid #18436d", borderRadius: 12, background: "#081629" }}>
            <h2 style={{ color: "#55bdff" }}>No paper available yet</h2>
            <p>The administrator needs to add active questions before the first daily paper can be generated.</p>
          </section>
        )}

        {!loading && questions.length > 0 && (
          <>
            <section style={{ padding: 18, border: "1px solid #18436d", borderRadius: 12, background: "#081629", marginBottom: 20 }}>
              <h2 style={{ color: "#55bdff", marginTop: 0 }}>{questions[0].title}</h2>
              <p style={{ color: "#a9bfd9" }}>Paper date: {questions[0].paper_date} (East Africa Time)</p>
              <p>{questions.length} questions · Answer all questions · One submission per member per day.</p>
              {!result && <p style={{ color: "#a9bfd9" }}>Progress: {answeredCount} / {questions.length} answered</p>}
            </section>

            {questions.map((item, index) => (
              <section key={item.question_id} style={{ padding: 20, border: "1px solid #18436d", borderRadius: 12, background: "#081629", marginBottom: 16 }}>
                <p style={{ color: "#55bdff", marginTop: 0 }}>Question {index + 1} · {item.subject}</p>
                <h3 style={{ lineHeight: 1.5 }}>{item.question}</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {(item.options || []).map((option, optionIndex) => (
                    <label key={`${item.question_id}-${optionIndex}`} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, border: "1px solid #285174", borderRadius: 8, cursor: result ? "default" : "pointer", background: answers[item.question_id] === optionIndex ? "#0c2f4d" : "#030d1c" }}>
                      <input
                        type="radio"
                        name={item.question_id}
                        value={optionIndex}
                        checked={answers[item.question_id] === optionIndex}
                        disabled={Boolean(result) || submitting}
                        onChange={() => setAnswers((previous) => ({ ...previous, [item.question_id]: optionIndex }))}
                        style={{ marginTop: 4 }}
                      />
                      <span>{String.fromCharCode(65 + optionIndex)}. {option}</span>
                    </label>
                  ))}
                </div>
              </section>
            ))}

            {!result ? (
              <button type="button" onClick={() => void submitExam()} disabled={submitting} style={{ background: "#0878d5", color: "white", border: 0, borderRadius: 8, padding: "13px 20px", fontWeight: 700, cursor: submitting ? "wait" : "pointer" }}>
                {submitting ? "Marking your paper…" : "Submit paper and see score"}
              </button>
            ) : (
              <section aria-live="polite" style={{ padding: 24, border: "1px solid #1c806b", borderRadius: 12, background: "#092c29", marginTop: 20 }}>
                <p style={{ marginTop: 0, color: "#9be6d3" }}>RESULT</p>
                <h2 style={{ fontSize: 32, margin: "8px 0" }}>{result.score} / {result.total}</h2>
                <p style={{ fontSize: 22, margin: "8px 0" }}>{percentage}%</p>
                <p>Your score has been recorded for administrator monitoring.</p>
                <p style={{ color: "#a9bfd9", fontSize: 13 }}>Submitted: {new Date(result.submitted_at).toLocaleString("en-UG", { timeZone: "Africa/Kampala" })}</p>
                <p style={{ color: "#a9bfd9" }}>A new daily paper becomes available after the date changes in Uganda.</p>
              </section>
            )}

            {result && (
              <section style={{ padding: 22, border: "1px solid #285174", borderRadius: 12, background: "#081629", marginTop: 20 }}>
                <h2 style={{ color: "#55bdff", marginTop: 0 }}>Review your mistakes and corrections</h2>
                <p style={{ color: "#a9bfd9", lineHeight: 1.6 }}>
                  Compare your submitted answers with the correct answers and read the explanation for each question you missed.
                </p>
                {reviewLoading && <p role="status">Loading your corrections…</p>}
                {reviewError && <p role="alert" style={{ background: "#381820", border: "1px solid #94404c", padding: 12, borderRadius: 8 }}>{reviewError}</p>}
                {!reviewLoading && !reviewError && review.length > 0 && review.filter((item) => !item.is_correct).length === 0 && (
                  <p style={{ background: "#092c29", border: "1px solid #1c806b", padding: 14, borderRadius: 8 }}>
                    Excellent work — you answered every question correctly. Keep it up!
                  </p>
                )}
                {!reviewLoading && !reviewError && review.filter((item) => !item.is_correct).map((item) => (
                  <article key={item.question_id} style={{ border: "1px solid #94404c", borderRadius: 10, padding: 16, marginTop: 14, background: "#101725" }}>
                    <p style={{ color: "#ffb5bd", marginTop: 0 }}>Question {item.question_order} · {item.subject} · Incorrect</p>
                    <h3 style={{ lineHeight: 1.5 }}>{item.question}</h3>
                    <p><strong>Your answer: </strong>{item.selected_index === null || item.selected_index < 0 || item.selected_index >= item.options.length ? "No answer recorded" : `${String.fromCharCode(65 + item.selected_index)}. ${item.options[item.selected_index]}`}</p>
                    <p style={{ color: "#9be6d3" }}><strong>Correct answer: </strong>{String.fromCharCode(65 + item.correct_index)}. {item.options[item.correct_index]}</p>
                    {item.explanation?.trim() ? (
                      <p style={{ color: "#c8d8eb", lineHeight: 1.6 }}><strong>Correction: </strong>{item.explanation}</p>
                    ) : (
                      <p style={{ color: "#c8d8eb" }}><strong>Correction: </strong>Review why the correct option matches the question and why your selected option does not.</p>
                    )}
                  </article>
                ))}
                {!reviewLoading && !reviewError && review.length === 0 && (
                  <p>No review details were returned for this attempt.</p>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}