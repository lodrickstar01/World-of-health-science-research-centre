
"use client";

import { useState } from "react";

type Assessment = {
  level: "urgent" | "review";
  heading: string;
  message: string;
  nextSteps: string[];
};

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function assessSymptoms() {
    setAssessment(null);
    setApiError("");

    if (!symptoms.trim() || !age || !duration) {
      setApiError(
        "Please describe your symptoms and select your age group and symptom duration."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age,
          duration,
          severity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Unable to assess symptoms right now. Please try again."
        );
      }

      if (
        typeof data.heading !== "string" ||
        typeof data.message !== "string" ||
        !Array.isArray(data.nextSteps) ||
        !data.nextSteps.every(
          (step: unknown) => typeof step === "string"
        )
      ) {
        throw new Error(
          "The assessment service returned an invalid response. Please try again."
        );
      }

      setAssessment({
        level: data.level === "urgent" ? "urgent" : "review",
        heading: data.heading,
        message: data.message,
        nextSteps: data.nextSteps,
      });
    } catch (error: unknown) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the assessment service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030916",
        color: "#edf5ff",
        fontFamily: "Arial, sans-serif",
        padding: "30px 16px",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <nav style={{ marginBottom: 24 }}>
          <a href="/" style={{ color: "#80caff" }}>
            Home
          </a>
          {" · "}
          <a href="/health-education" style={{ color: "#80caff" }}>
            Health Education
          </a>
        </nav>

        <p style={{ color: "#55bdff", fontWeight: 700 }}>
          MEDICAL RESEARCH CENTRE
        </p>

        <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)" }}>
          AI Symptom Checker
        </h1>

        <p style={{ color: "#b5c7df", lineHeight: 1.7 }}>
          Describe how you feel to receive general health information,
          possible explanations, and guidance about appropriate next steps.
        </p>

        <section
          style={{
            background: "#321b18",
            border: "1px solid #a94d40",
            borderRadius: 12,
            padding: 16,
            margin: "22px 0",
          }}
        >
          <strong>Important medical safety notice</strong>
          <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
            This tool cannot diagnose illness, rule out serious conditions,
            or prescribe treatment. If you experience severe chest pain,
            difficulty breathing, signs of stroke, severe bleeding, or loss
            of consciousness, seek emergency medical care immediately.
            Do not delay care to use this website.
          </p>
        </section>

        <section
          style={{
            background: "#081629",
            border: "1px solid #18436d",
            borderRadius: 14,
            padding: 22,
          }}
        >
          <label htmlFor="symptoms">
            What symptoms are you experiencing?
          </label>

          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(event) => {
              setSymptoms(event.target.value);
              setAssessment(null);
              setApiError("");
            }}
            placeholder="Describe your symptoms, when they started, and any changes you have noticed. Do not enter your name or other identifying information."
            rows={6}
            maxLength={3000}
            required
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: 10,
              padding: 13,
              borderRadius: 8,
              border: "1px solid #285174",
              background: "#030d1c",
              color: "white",
              font: "inherit",
              lineHeight: 1.6,
            }}
          />

          <label
            htmlFor="age"
            style={{ display: "block", marginTop: 20 }}
          >
            Age group
          </label>

          <select
            id="age"
            value={age}
            onChange={(event) => {
              setAge(event.target.value);
              setAssessment(null);
              setApiError("");
            }}
            style={fieldStyle}
            required
          >
            <option value="">Select age group</option>
            <option value="under-5">Under 5 years</option>
            <option value="5-17">5–17 years</option>
            <option value="18-39">18–39 years</option>
            <option value="40-64">40–64 years</option>
            <option value="65-plus">65 years and above</option>
          </select>

          <label
            htmlFor="duration"
            style={{ display: "block", marginTop: 20 }}
          >
            How long have you had these symptoms?
          </label>

          <select
            id="duration"
            value={duration}
            onChange={(event) => {
              setDuration(event.target.value);
              setAssessment(null);
              setApiError("");
            }}
            style={fieldStyle}
            required
          >
            <option value="">Select duration</option>
            <option value="today">Started today</option>
            <option value="days">A few days</option>
            <option value="weeks">Several weeks</option>
            <option value="months">Months or longer</option>
          </select>

          <label
            htmlFor="severity"
            style={{ display: "block", marginTop: 20 }}
          >
            How severe are your symptoms?
          </label>

          <select
            id="severity"
            value={severity}
            onChange={(event) => {
              setSeverity(event.target.value);
              setAssessment(null);
              setApiError("");
            }}
            style={fieldStyle}
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>

          <button
            type="button"
            onClick={() => void assessSymptoms()}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 24,
              padding: 15,
              border: 0,
              borderRadius: 8,
              background: loading ? "#456780" : "#0878d5",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Reviewing symptoms…" : "Review my symptoms"}
          </button>

          {loading && (
            <p role="status" style={{ color: "#b5c7df" }}>
              Processing your request. This may take a few seconds.
            </p>
          )}

          {apiError && (
            <div
              role="alert"
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 8,
                border: "1px solid #94404c",
                background: "#381820",
                color: "#ffd8d8",
                lineHeight: 1.6,
              }}
            >
              <strong>Unable to complete the assessment</strong>
              <p style={{ marginBottom: 0 }}>{apiError}</p>
            </div>
          )}
        </section>

        {assessment && (
          <section
            aria-live="polite"
            style={{
              marginTop: 22,
              padding: 22,
              borderRadius: 12,
              border:
                assessment.level === "urgent"
                  ? "1px solid #d66a55"
                  : "1px solid #258b79",
              background:
                assessment.level === "urgent" ? "#321b18" : "#092c29",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                color:
                  assessment.level === "urgent" ? "#ffb4a9" : "#9be6d3",
              }}
            >
              {assessment.level === "urgent"
                ? "URGENT SAFETY GUIDANCE"
                : "GENERAL HEALTH GUIDANCE"}
            </p>

            <h2>{assessment.heading}</h2>

            <p style={{ lineHeight: 1.7 }}>{assessment.message}</p>

            <h3>Recommended next steps</h3>

            <ul style={{ lineHeight: 1.9, paddingLeft: 22 }}>
              {assessment.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>

            <p style={{ fontSize: 13, color: "#b5c7df", lineHeight: 1.7 }}>
              These results are informational, not a diagnosis. AI can make
              mistakes. Consult a qualified healthcare professional for
              individual assessment and treatment.
            </p>
          </section>
        )}

        <p
          style={{
            color: "#a9bfd9",
            fontSize: 13,
            lineHeight: 1.7,
            marginTop: 24,
          }}
        >
          Privacy: this page does not save symptom descriptions to your
          website database. When you request an AI assessment, your
          description is sent to the website server and may be processed by
          the external AI provider. Avoid entering names, contact details,
          or other identifying information.
        </p>
      </div>
    </main>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 10,
  padding: 13,
  borderRadius: 8,
  border: "1px solid #285174",
  background: "#030d1c",
  color: "white",
  font: "inherit",
};
