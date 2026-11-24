
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type FreeBook = { title: string; subject: string; url: string };
type StudyFolder = { title: string; description: string; url: string };

const freeBooks: FreeBook[] = [
  {
    title: "Anatomy and Physiology 2e",
    subject: "Anatomy and Physiology",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    title: "Biology 2e",
    subject: "Cell Biology and Biology",
    url: "https://openstax.org/details/books/biology-2e",
  },
  {
    title: "NCBI Bookshelf",
    subject: "Free biomedical books",
    url: "https://www.ncbi.nlm.nih.gov/books/",
  },
  {
    title: "WHO Publications",
    subject: "Public Health and Guidelines",
    url: "https://www.who.int/publications",
  },
];

const studyFolders: StudyFolder[] = [
  {
    title: "Year 1 Medical Notes",
    description: "Study materials for first-year medical students.",
    url: "https://drive.google.com/drive/folders/1nyLUOK6VY4aAqkNvmBXF52pK14-hxPhS?usp=drive_link",
  },
  {
    title: "Year 2 Medical Notes",
    description: "Study materials for second-year medical students.",
    url: "https://drive.google.com/drive/folders/1UvSigMKATBu8aoM_RMVGHQvT1l_vCbs5?usp=drive_link",
  },
  {
    title: "Year 3 Medical Notes",
    description: "Study materials for third-year medical students.",
    url: "https://drive.google.com/drive/folders/1qjn_4uP_93v3qHdPCM9rf7yyhJS7Fq7X?usp=sharing",
  },
  {
    title: "Year 4 Medical Notes",
    description: "Study materials for fourth-year medical students.",
    url: "https://drive.google.com/drive/folders/1jRHnujhA_CELtDBsIwAtnzFpDkiiDPAv?usp=drive_link",
  },
  {
    title: "Year 5 - Internal Medicine",
    description: "Clinical study materials in internal medicine.",
    url: "https://drive.google.com/drive/folders/11gmAi-9JtoORxtcEGHKXipdHP49qIL6C",
  },
  {
    title: "Year 5 - Surgery Slides",
    description: "Surgery presentations and study slides.",
    url: "https://drive.google.com/drive/folders/1X4yGcqbIZQ6Gh9Alw1snrsUsyjG1qjqb",
  },
  {
    title: "Year 5 - Obstetrics and Gynecology",
    description: "Study materials in obstetrics and gynecology.",
    url: "https://drive.google.com/folderview?id=1iIU__0DHPL63u85-QIcp1HmF9pCwefP-",
  },
  {
    title: "Year 5 - Pediatrics",
    description: "Clinical study materials in pediatrics.",
    url: "https://drive.google.com/drive/folders/1X7yVCMTd2DXhdqC5jdZ9LwhZJjnFBTVh",
  },
];

// Reuse one client so the browser's Supabase Auth session stays consistent.
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or a supported public key in .env.local."
    );
    return null;
  }

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

export default function LibraryPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check that a member has a valid login session before displaying the library.
  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const client = getSupabaseClient();

      if (!client) {
        window.location.replace("/login");
        return;
      }

      try {
        const { data, error } = await client.auth.getSession();

        if (cancelled) return;

        if (error || !data.session) {
          window.location.replace("/login");
          return;
        }

        setCheckingAccess(false);
      } catch (err) {
        if (cancelled) return;
        console.error("Unable to verify member session:", err);
        window.location.replace("/login");
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadPDFs = useCallback(async () => {
    setLoading(true);
    setError("");

    const supabase = getSupabaseClient();

    if (!supabase) {
      setFiles([]);
      setError(
        "Supabase is not configured. Check the URL and public key in .env.local, then restart the development server."
      );
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        setFiles([]);
        setError("Please log in to your member account to view private PDFs.");
        return;
      }

      const { data, error: storageError } = await supabase.storage
        .from("medical-pdfs")
        .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

      if (storageError) throw storageError;

      setFiles(
        (data ?? [])
          .filter(
            (file) =>
              file.name.toLowerCase().endsWith(".pdf") &&
              file.name !== ".emptyFolderPlaceholder"
          )
          .map((file) => file.name)
      );
    } catch (err: unknown) {
      console.error("Unable to load PDFs from Supabase Storage:", err);
      setFiles([]);

      const message =
        err instanceof Error ? err.message : "Unknown error";

      setError(
        message.toLowerCase().includes("failed to fetch")
          ? "The browser could not reach Supabase. Check the project URL in .env.local, your internet connection, and the browser Console for a network/CORS error."
          : message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAccess) {
      void loadPDFs();
    }
  }, [checkingAccess, loadPDFs]);

  async function openPrivatePDF(fileName: string): Promise<void> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      alert("Supabase is not configured. Check your environment variables.");
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert("Please log in to your member account to access this PDF.");
        window.location.replace("/login");
        return;
      }

      const { data, error: signedUrlError } = await supabase.storage
        .from("medical-pdfs")
        .createSignedUrl(fileName, 600);

      if (signedUrlError || !data?.signedUrl) {
        throw signedUrlError ?? new Error("Could not create a secure PDF link.");
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      console.error("Unable to open private PDF:", err);
      alert(
        err instanceof Error
          ? `Could not open PDF: ${err.message}`
          : "Could not open PDF. Please try again."
      );
    }
  }

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking member access...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>Medical Research PDF Library</h1>
      <p>Access medical study materials and free educational resources.</p>

      <section style={{ marginTop: 32 }}>
        <h2>Medical Study Notes by Year</h2>
        <p>
          Browse study materials organized by year of medical training. Select
          a folder to open its resources in Google Drive.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {studyFolders.map((folder) => (
            <article
              key={folder.title}
              style={{
                border: "1px solid #444",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <h3>{folder.title}</h3>
              <p>{folder.description}</p>
              <a
                href={folder.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "10px 14px",
                  borderRadius: 6,
                  background: "#2563eb",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                Open Study Notes ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Uploaded PDF files</h2>

        <button
          type="button"
          onClick={() => void loadPDFs()}
          disabled={loading}
          style={{
            padding: "10px 16px",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Loading PDFs..." : "Refresh PDF list"}
        </button>

        {loading && <p>Loading your PDF library...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "crimson" }}>
            Could not load PDFs: {error}
          </p>
        )}

        {!loading && !error && files.length === 0 && (
          <p>No PDF files found in the medical-pdfs storage bucket yet.</p>
        )}

        {files.length > 0 && (
          <ul>
            {files.map((name) => (
              <li key={name} style={{ margin: "16px 0" }}>
                <strong>{name}</strong>{" "}
                <button
                  type="button"
                  onClick={() => void openPrivatePDF(name)}
                  style={{ marginLeft: 8, padding: "6px 10px" }}
                >
                  Open PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Free textbooks and reference libraries</h2>
        <ul>
          {freeBooks.map((book) => (
            <li key={book.title} style={{ margin: "20px 0" }}>
              <strong>{book.title}</strong>
              <p>{book.subject}</p>
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Access free resource
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
