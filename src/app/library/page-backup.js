
"use client";

import { useState } from "react";

const notes = [
  {
    id: 1,
    title: "Cell Membrane and Transport",
    subject: "Cell Biology",
    level: "Year 1",
    summary: "Structure of the plasma membrane and movement of substances.",
    content: `The plasma membrane consists mainly of a phospholipid bilayer with embedded proteins, cholesterol and carbohydrates.

Key concepts:
• Simple diffusion moves substances down their concentration gradient.
• Facilitated diffusion uses membrane proteins without direct energy expenditure.
• Primary active transport uses energy directly, often from ATP.
• Osmosis is the net movement of water across a selectively permeable membrane.

Study reference: Guyton and Hall Textbook of Medical Physiology; Alberts, Molecular Biology of the Cell.`
  },
  {
    id: 2,
    title: "Introduction to Blood",
    subject: "Physiology",
    level: "Year 1",
    summary: "Plasma, red cells, white cells and platelets.",
    content: `Blood is a specialized connective tissue made up of plasma and formed elements.

Key concepts:
• Red blood cells transport oxygen using haemoglobin.
• White blood cells participate in immune defence.
• Platelets contribute to haemostasis.
• Plasma carries proteins, electrolytes, nutrients and waste products.

Study reference: Guyton and Hall Textbook of Medical Physiology.`
  },
  {
    id: 3,
    title: "Proteins and Amino Acids",
    subject: "Biochemistry",
    level: "Year 1",
    summary: "Amino acid structure, peptide bonds and protein organization.",
    content: `Amino acids contain an amino group, a carboxyl group, a hydrogen atom and a variable side chain attached to the alpha carbon.

Key concepts:
• Amino acids join through peptide bonds.
• Primary structure is the amino acid sequence.
• Secondary structure includes alpha helices and beta sheets.
• Tertiary structure describes the overall three-dimensional folding of a polypeptide.
• Protein shape is important for biological function.

Study reference: Harper's Illustrated Biochemistry.`
  },
  {
    id: 4,
    title: "Mitosis and the Cell Cycle",
    subject: "Cell Biology",
    level: "Year 1",
    summary: "Cell-cycle phases and the stages of mitosis.",
    content: `The cell cycle includes interphase and the M phase.

Key concepts:
• G1: cell growth and preparation.
• S phase: DNA replication.
• G2: further growth and preparation for division.
• Mitosis: prophase, prometaphase, metaphase, anaphase and telophase.
• Cytokinesis divides the cytoplasm.

Cell-cycle checkpoints help prevent division when important processes are incomplete.

Study reference: Alberts, Molecular Biology of the Cell.`
  },
  {
    id: 5,
    title: "Upper Limb: Brachial Plexus",
    subject: "Anatomy",
    level: "Year 1",
    summary: "Roots, trunks, divisions, cords and terminal branches.",
    content: `The brachial plexus usually arises from the anterior rami of spinal nerves C5 to T1.

Organization:
• Roots: C5, C6, C7, C8 and T1.
• Trunks: upper, middle and lower.
• Divisions: anterior and posterior.
• Cords: lateral, posterior and medial.
• Major terminal nerves: musculocutaneous, axillary, radial, median and ulnar.

Clinical anatomy: nerve injuries produce characteristic patterns of weakness and sensory loss.

Study reference: Moore, Clinically Oriented Anatomy.`
  },
  {
    id: 6,
    title: "Enzymes and Inhibition",
    subject: "Biochemistry",
    level: "Year 1",
    summary: "Enzyme activity and common inhibition mechanisms.",
    content: `Enzymes accelerate biochemical reactions by lowering activation energy.

Key concepts:
• Competitive inhibitors compete with substrate at the active site.
• In pure competitive inhibition, apparent Km increases while Vmax remains unchanged.
• Pure noncompetitive inhibition decreases Vmax without changing Km.
• Enzyme activity can be affected by temperature, pH and substrate concentration.

Study reference: Harper's Illustrated Biochemistry.`
  }
];

const subjects = [
  "All",
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Cell Biology"
];

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [activeNote, setActiveNote] = useState(null);

  const filteredNotes = notes.filter((note) => {
    const matchesSubject =
      subject === "All" || note.subject === subject;

    const text = (
      note.title + " " +
      note.subject + " " +
      note.summary + " " +
      note.content
    ).toLowerCase();

    return matchesSubject && text.includes(query.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl bg-slate-900 p-7 text-white sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Medical Research Centre
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Active Medical Library
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Explore medical notes, revise core concepts and
            build your understanding of the human body.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2">
              {notes.length} study notes
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              {subjects.length - 1} subjects
            </span>
          </div>
        </header>

        <section className="mb-7">
          <label htmlFor="library-search" className="mb-2 block font-semibold">
            Search the library
          </label>
          <input
            id="library-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anatomy, enzymes, cell biology..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
        </section>

        <div className="mb-7 flex flex-wrap gap-2">
          {subjects.map((item) => (
            <button
              key={item}
              onClick={() => setSubject(item)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                subject === item
                  ? "border-cyan-700 bg-cyan-700 text-white"
                  : "border-slate-300 bg-white hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Study notes</h2>
          <span className="text-sm text-slate-500">
            {filteredNotes.length} results
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="mb-3 w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                {note.subject}
              </span>
              <h3 className="text-lg font-bold">{note.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {note.summary}
              </p>
              <p className="mt-3 text-xs text-slate-500">{note.level}</p>
              <button
                onClick={() =>
                  setActiveNote(activeNote === note.id ? null : note.id)
                }
                className="mt-5 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700"
              >
                {activeNote === note.id ? "Close notes" : "Read notes"}
              </button>

              {activeNote === note.id && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="mb-2 font-semibold">Study summary</h4>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                    {note.content}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-slate-600">
            No notes found. Try another search or subject.
          </p>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">
          Educational study materials. Verify clinical and
          scientific information against current textbooks,
          guidelines and primary research before applying it.
        </footer>
      </div>
    </main>
  );
}
