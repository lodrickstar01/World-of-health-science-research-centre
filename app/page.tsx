
"use client";

import { useEffect, useState } from "react";

const subjects = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Dental Anatomy",
  "Pharmacy",
  "General Medicine",
];

type Resource = {
  title: string;
  subject: string;
  type: string;
  access: string;
  description: string;
  url: string;
};

const resources: Resource[] = [
  {
    title: "Guyton and Hall Textbook of Medical Physiology",
    subject: "Physiology",
    type: "Textbook",
    access: "Publisher",
    description: "Comprehensive human physiology textbook.",
    url: "https://shop.elsevier.com/books/guyton-and-hall-textbook-of-medical-physiology/hall/978-0-443-11101-3",
  },
  {
    title: "OpenStax Anatomy and Physiology 2e",
    subject: "Anatomy",
    type: "Open textbook",
    access: "Free",
    description: "Open textbook covering human anatomy and physiology.",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    title: "OpenStax Biology 2e",
    subject: "Biochemistry",
    type: "Open textbook",
    access: "Free",
    description: "Foundational biology, cells, genetics and metabolism.",
    url: "https://openstax.org/details/books/biology-2e",
  },
  {
    title: "NCBI Bookshelf",
    subject: "General Medicine",
    type: "Online medical library",
    access: "Free",
    description: "Search biomedical books and clinical reference material.",
    url: "https://www.ncbi.nlm.nih.gov/books/",
  },
  {
    title: "OpenStax Chemistry 2e",
    subject: "Biochemistry",
    type: "Open textbook",
    access: "Free",
    description: "Chemical principles supporting biochemistry studies.",
    url: "https://openstax.org/details/books/chemistry-2e",
  },
  {
    title: "OpenStax Microbiology",
    subject: "General Medicine",
    type: "Open textbook",
    access: "Free",
    description: "Microbiology concepts, microorganisms and infection.",
    url: "https://openstax.org/details/books/microbiology",
  },
  {
    title: "Merck Manual Professional Edition",
    subject: "General Medicine",
    type: "Clinical reference",
    access: "Free online",
    description: "Medical conditions, diagnosis and treatment reference.",
    url: "https://www.merckmanuals.com/professional",
  },
  {
    title: "OpenStax Pharmacology",
    subject: "Pharmacy",
    type: "Textbook search",
    access: "Free resources",
    description: "Find open educational material relevant to pharmacology.",
    url: "https://openstax.org/subjects/science",
  },
  {
    title: "OpenStax Biology: Cell Biology and Genetics",
    subject: "Biochemistry",
    type: "Textbook",
    access: "Free",
    description: "Cell structure, DNA, genetics and biological processes.",
    url: "https://openstax.org/details/books/biology-2e",
  },
  {
    title: "OpenStax Anatomy: Skeletal and Muscular Systems",
    subject: "Anatomy",
    type: "Textbook",
    access: "Free",
    description: "Study skeletal, muscular and other body systems.",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    title: "OpenStax Chemistry: Biomolecules",
    subject: "Biochemistry",
    type: "Textbook",
    access: "Free",
    description: "Review chemical foundations useful for biomolecules.",
    url: "https://openstax.org/details/books/chemistry-2e",
  },
  {
    title: "NCBI Bookshelf: Dental and Biomedical References",
    subject: "Dental Anatomy",
    type: "Online reference",
    access: "Free",
    description: "Search available biomedical and oral-health references.",
    url: "https://www.ncbi.nlm.nih.gov/books/?term=dental+anatomy",
  },
  {
    title: "Human Anatomy Study Guide",
    subject: "Anatomy",
    type: "Study guide",
    access: "Free",
    description: "Bones, joints, muscles, nerves and organ systems.",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    title: "Upper Limb Anatomy",
    subject: "Anatomy",
    type: "Lecture notes",
    access: "Free",
    description: "Brachial plexus, arm, forearm, wrist and hand.",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    title: "Medical Physiology",
    subject: "Physiology",
    type: "Study guide",
    access: "Free",
    description: "Blood, cell physiology, cardiovascular and respiratory systems.",
    url: "https://shop.elsevier.com/books/guyton-and-hall-textbook-of-medical-physiology/hall/978-0-443-11101-3",
  },
  {
    title: "Blood Physiology Revision",
    subject: "Physiology",
    type: "Lecture notes",
    access: "Premium",
    description: "Haemoglobin, blood cells, plasma and haemostasis.",
    url: "https://www.ncbi.nlm.nih.gov/books/?term=blood+physiology",
  },
  {
    title: "Biochemistry Essentials",
    subject: "Biochemistry",
    type: "Study guide",
    access: "Free",
    description: "Proteins, amino acids, enzymes and metabolism.",
    url: "https://openstax.org/details/books/biology-2e",
  },
  {
    title: "Dental Anatomy and Morphology",
    subject: "Dental Anatomy",
    type: "Study guide",
    access: "Free",
    description: "Tooth identification, surfaces, dentition and occlusion.",
    url: "https://www.ncbi.nlm.nih.gov/books/?term=dental+anatomy",
  },
  {
    title: "Basic Pharmacology",
    subject: "Pharmacy",
    type: "Study guide",
    access: "Free",
    description: "Drug actions, pharmacokinetics and pharmacodynamics.",
    url: "https://www.ncbi.nlm.nih.gov/books/?term=pharmacology",
  },
  {
    title: "Introduction to General Medicine",
    subject: "General Medicine",
    type: "Reference notes",
    access: "Premium",
    description: "Clinical terminology and introductory clinical reasoning.",
    url: "https://www.merckmanuals.com/professional",
  },
];

const questions = [
  {
    subject: "Physiology",
    question: "Which plasma protein contributes most to plasma oncotic pressure?",
    options: ["Albumin", "Haemoglobin", "Fibrin", "Insulin"],
    answer: 0,
    explanation:
      "Albumin is the main contributor to plasma colloid osmotic pressure.",
  },
  {
    subject: "Anatomy",
    question: "Which nerve supplies most intrinsic muscles of the hand?",
    options: ["Axillary", "Ulnar", "Radial", "Musculocutaneous"],
    answer: 1,
    explanation:
      "The ulnar nerve supplies most intrinsic hand muscles, with important exceptions supplied by the median nerve.",
  },
  {
    subject: "Biochemistry",
    question: "What do enzymes generally do to activation energy?",
    options: [
      "Increase it",
      "Lower it",
      "Make it infinite",
      "Change the reaction equilibrium",
    ],
    answer: 1,
    explanation:
      "Enzymes lower activation energy and accelerate reactions without changing the equilibrium position.",
  },
  {
    subject: "Dental Anatomy",
    question: "Which structure covers the anatomical crown of a tooth?",
    options: ["Cementum", "Enamel", "Pulp", "Periodontal ligament"],
    answer: 1,
    explanation: "Enamel covers the anatomical crown; cementum covers the root.",
  },
  {
    subject: "Pharmacy",
    question: "Pharmacokinetics studies:",
    options: [
      "What a drug does to the body",
      "What the body does to a drug",
      "Tooth development",
      "Bone formation",
    ],
    answer: 1,
    explanation:
      "Pharmacokinetics includes absorption, distribution, metabolism and excretion.",
  },
];

type Note = {
  id: string;
  title: string;
  subject: string;
  content: string;
};

export default function MedicalLibraryPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [noteSubject, setNoteSubject] = useState("Anatomy");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  // Load notes only in the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mrc-personal-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      console.error("Could not load saved notes.");
    }
  }, []);

  function storeNotes(updated: Note[]) {
    setNotes(updated);
    try {
      localStorage.setItem("mrc-personal-notes", JSON.stringify(updated));
    } catch {
      alert("Notes could not be saved in this browser.");
    }
  }

  function saveNote() {
    if (!title.trim() || !content.trim()) {
      alert("Enter a title and the note content.");
      return;
    }

    const note: Note = {
      id: editingId || crypto.randomUUID(),
      title: title.trim(),
      subject: noteSubject,
      content: content.trim(),
    };

    storeNotes(
      editingId
        ? notes.map((item) => item.id === editingId ? note : item)
        : [note, ...notes]
    );

    setTitle("");
    setContent("");
    setEditingId(null);
  }

  function downloadNote(note: Note) {
    const file = new Blob(
      [`${note.title}\nSubject: ${note.subject}\n\n${note.content}`],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredResources = resources.filter((item) => {
    const matchesSubject =
      subject === "All Subjects" || item.subject === subject;

    const matchesSearch =
      `${item.title} ${item.subject} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  const currentQuestion = questions[questionIndex];

  return (
    <main className="medical">
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #030916; color: #edf5ff;
          font-family: Arial, sans-serif; }
        .medical { min-height: 100vh; background: #030916; }
        .header { padding: 22px 5%; border-bottom: 1px solid #17416d;
          background: #061326; }
        .header strong { color: #50bdff; font-size: 22px; }
        .header p, .muted { color: #a9bfd9; line-height: 1.6; }
        .container { max-width: 1200px; padding: 28px 20px;
          margin: auto; }
        .hero, .two-col { display: grid; grid-template-columns: 1fr 1fr;
          gap: 18px; }
        .panel { padding: 22px; border: 1px solid #18436d;
          border-radius: 14px; background: #081629; margin-bottom: 20px; }
        h1 { font-size: clamp(30px, 4vw, 46px); }
        h1 span, h2 { color: #55bdff; }
        h2 { margin-top: 0; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px; }
        .item { background: #071020; border: 1px solid #20456b;
          border-radius: 10px; padding: 16px; }
        .item p { color: #afc2da; line-height: 1.5; font-size: 14px; }
        .field { width: 100%; margin: 6px 0 14px; padding: 12px;
          background: #030d1c; color: white; border: 1px solid #285174;
          border-radius: 8px; font: inherit; }
        textarea.field { min-height: 160px; resize: vertical; }
        .btn { border: 1px solid #168de8; border-radius: 8px;
          padding: 10px 14px; color: white; background: #0878d5;
          cursor: pointer; margin: 4px 4px 4px 0; }
        .btn:hover { background: #1297ff; }
        .secondary { background: transparent; color: #90d3ff; }
        .tag { color: #ffdf79; font-size: 12px; }
        .option { display: block; width: 100%; text-align: left;
          margin: 8px 0; padding: 12px; background: #061326;
          border: 1px solid #285174; color: white; border-radius: 8px;
          cursor: pointer; }
        .option:disabled { opacity: 1; }
        .correct { border-color: #21bf8b; }
        .wrong { border-color: #ee717d; }
        .footer { padding: 24px; text-align: center;
          border-top: 1px solid #17416d; color: #9cb2ce; }
        @media (max-width: 750px) {
          .hero, .two-col { grid-template-columns: 1fr; }
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 500px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="header">
        <strong>âš• Medical Research Centre</strong>
        <p>Learn â€¢ Research â€¢ Advance</p>
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <a className="btn" href="/">Home</a>
          <a className="btn" href="/login">Login</a>
          <a className="btn secondary" href="/comments">
  Community Comments
</a>
<a
  href="/symptom-checker"
  style={{
    display: "inline-block",
    padding: "14px 24px",
    margin: "10px 10px 10px 0",
    background: "#dc2626",
    color: "#ffffff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
  }}
>
  Check Your Symptoms
</a>
<a className="btn" href="/tests">Online Tests</a>
<a className="btn secondary" href="/admin/tests">Exam Admin</a>
          <a className="btn" href="/register">Register</a>
          <a className="btn" href="/library">Medical PDF Library</a>
          <a className="btn secondary" href="#library">Study Resources</a>
          <a className="btn secondary" href="#notes">My Notes</a>
          <a className="btn secondary" href="#mcqs">MCQs</a>
          <a className="btn secondary" href="#membership">Membership</a>
        </nav>
      </header>

      <div className="container">
        <section className="hero">
          <div className="panel">
            <p className="tag">YOUR MEDICAL LEARNING HUB</p>
            <h1>Learn medicine.<br /><span>Build understanding.</span></h1>
            <p className="muted">
              Explore learning resources, organise your notes and practise
              medical questions across six subjects.
            </p>
            <a className="btn" href="#library">Explore library â†“</a>
          </div>

          <div className="panel" id="membership">
            <p className="tag">MEMBERSHIP</p>
            <h2>Registration fee: $3</h2>
            <p className="muted">
              The registration fee will be introduced after the current grace
              period. Members can register and use the library for now.
            </p>
            <button
              className="btn"
              onClick={() => alert(
                "Registration payments are not active yet. You can register and use the library during the current grace period."
              )}
            >
              Registration payment coming soon
            </button>
            <p className="muted">
              Online payment is not connected yet. Do not submit a payment through this button.
            </p>
          </div>
        </section>

        <section className="panel" id="library">
          <h2>Medical Library</h2>
          <p className="muted">
            Search resources or filter them by subject.
          </p>

          <input
            className="field"
            placeholder="Search textbooks, topics or notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="field"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            <option>All Subjects</option>
            {subjects.map((item) => <option key={item}>{item}</option>)}
          </select>

          <div className="grid">
            {filteredResources.map((item) => (
              <article className="item" key={item.title}>
                <span className="tag">{item.access}</span>
                <h3>{item.title}</h3>
                <p>{item.subject} â€¢ {item.type}</p>
                <p>{item.description}</p>
              
<a
  className="btn secondary"
  href={item.url}
  target="_blank"
  rel="noopener noreferrer"
>
  Open resource
</a>

              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="notes">
          <h2>My Medical Notes</h2>
          <p className="muted">
            Write, save, edit and download your own study notes.
          </p>

          <div className="two-col">
            <div>
              <label htmlFor="note-title">Note title</label>
              <input
                id="note-title"
                className="field"
                placeholder="e.g. Cell membrane physiology"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />

              <label htmlFor="note-subject">Subject</label>
              <select
                id="note-subject"
                className="field"
                value={noteSubject}
                onChange={(event) => setNoteSubject(event.target.value)}
              >
                {subjects.map((item) => <option key={item}>{item}</option>)}
              </select>

              <label htmlFor="note-content">Write your notes</label>
              <textarea
                id="note-content"
                className="field"
                placeholder="Write definitions, explanations, examples and revision points..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />

              <button className="btn" onClick={saveNote}>
                {editingId ? "Save changes" : "Save note"}
              </button>

              {editingId && (
                <button
                  className="btn secondary"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setContent("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

            <div>
              <h3>Your saved notes ({notes.length})</h3>
              {notes.length === 0 && (
                <p className="muted">Your saved notes will appear here.</p>
              )}

              {notes.map((note) => (
                <article className="item" key={note.id}>
                  <span className="tag">{note.subject}</span>
                  <h3>{note.title}</h3>
                  <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>

                  <button
                    className="btn secondary"
                    onClick={() => {
                      setEditingId(note.id);
                      setTitle(note.title);
                      setNoteSubject(note.subject);
                      setContent(note.content);
                      document.getElementById("notes")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn secondary"
                    onClick={() => downloadNote(note)}
                  >
                    Download
                  </button>

                  <button
                    className="btn secondary"
                    onClick={() => {
                      if (confirm("Delete this note?")) {
                        storeNotes(notes.filter((n) => n.id !== note.id));
                      }
                    }}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          </div>

          <p className="muted">
            Notes currently stay in this browser on this device. They are not
            synced to an account or protected by server-side access controls.
          </p>
        </section>

        <section className="panel" id="mcqs">
          <h2>MCQ Practice</h2>
          <p className="muted">
            Question {questionIndex + 1} of {questions.length} â€¢ {currentQuestion.subject}
          </p>
          <h3>{currentQuestion.question}</h3>

          {currentQuestion.options.map((option, index) => (
            <button
              className={
                "option " +
                (answer !== null && index === currentQuestion.answer
                  ? "correct"
                  : answer === index
                    ? "wrong"
                    : "")
              }
              key={option}
              disabled={answer !== null}
              onClick={() => setAnswer(index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}

          {answer !== null && (
            <div className="item">
              <strong>
                {answer === currentQuestion.answer ? "Correct!" : "Review the answer"}
              </strong>
              <p>{currentQuestion.explanation}</p>
              <button
                className="btn"
                onClick={() => {
                  setQuestionIndex((questionIndex + 1) % questions.length);
                  setAnswer(null);
                }}
              >
                Next question â†’
              </button>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Grow the library</h2>
          <p className="muted">
            Add original lecture notes, authorised textbooks, openly licensed
            resources and verified research links. Each catalogue entry must
            be connected to a real resource before it can be opened.
          </p>
        </section>
      </div>

      <footer className="footer">
        Medical Research Centre â€¢ Learn â€¢ Research â€¢ Advance
      </footer>
      
<section
  id="contact-information"
  style={{
    padding: "40px 20px",
    margin: "30px auto",
    maxWidth: "900px",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "16px",
    textAlign: "center",
  }}
>
  <h2>Contact for More Information</h2>

  <p>
    For more information about the Medical Research Centre,
    our research, learning resources, and membership, contact us:
  </p>

  <p>
    <strong>Phone:</strong>{" "}
    <a
      href="tel:+256775980853"
      style={{ color: "#60a5fa" }}
    >
      +256-775980853
    </a>
  </p>

  <p>
    <strong>Email:</strong>{" "}
    <a
      href="mailto:lodrickmumbere888@gmail.com"
      style={{ color: "#60a5fa" }}
    >
      lodrickmumbere888@gmail.com
    </a>
  </p>
</section>

    
<a href="/live-study-chart" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Live Study Chart</a>
</main>
  );
}

