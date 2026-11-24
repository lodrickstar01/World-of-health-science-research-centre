 "use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, BookOpen, Brain, Check, Dna, FileText,
  FlaskConical, HeartPulse, Menu, Microscope, Search, ShieldCheck,
  Stethoscope, Users, X, GraduationCap, ChevronRight
} from "lucide-react";
import styles from "./page.module.css";

const subjects = [
  { name: "Anatomy", icon: Brain, description: "Structure of the human body", color: "blue" },
  { name: "Physiology", icon: HeartPulse, description: "How body systems function", color: "cyan" },
  { name: "Biochemistry", icon: FlaskConical, description: "Molecules, enzymes and metabolism", color: "violet" },
  { name: "Histology", icon: Microscope, description: "Cells and tissues under the microscope", color: "pink" },
  { name: "Embryology", icon: Dna, description: "Human growth and development", color: "green" },
  { name: "Dental Anatomy", icon: Activity, description: "Teeth and oral structures", color: "gold" },
  { name: "Pathology", icon: ShieldCheck, description: "Mechanisms and effects of disease", color: "orange" },
  { name: "Pharmacology", icon: FlaskConical, description: "Medicines and their actions", color: "teal" },
];

const resources = [
  { title: "Introduction to Human Anatomy", subject: "Anatomy", type: "Study guide", description: "Terminology, body planes, tissues and organ systems." },
  { title: "Human Physiology Essentials", subject: "Physiology", type: "Revision notes", description: "Homeostasis, membrane transport and body functions." },
  { title: "Biochemistry Foundations", subject: "Biochemistry", type: "Study guide", description: "Proteins, enzymes, carbohydrates and metabolism." },
  { title: "Basic Histology Learning Guide", subject: "Histology", type: "Visual learning", description: "Recognising tissues and understanding their functions." },
  { title: "Human Embryology Overview", subject: "Embryology", type: "Revision notes", description: "Fertilisation, implantation and early development." },
  { title: "Dental Anatomy Essentials", subject: "Dental Anatomy", type: "Learning resource", description: "Tooth morphology, dentitions and oral anatomy." },
  { title: "General Pathology Concepts", subject: "Pathology", type: "Study guide", description: "Cell injury, inflammation and tissue repair." },
  { title: "Pharmacology Principles", subject: "Pharmacology", type: "Revision notes", description: "Pharmacokinetics, pharmacodynamics and safe use." },
];

const quiz = [
  { subject: "Anatomy", question: "Which is the longest bone in the human body?", options: ["Tibia", "Femur", "Humerus", "Fibula"], answer: 1, explanation: "The femur is the longest bone in the human body." },
  { subject: "Physiology", question: "Which hormone normally lowers blood glucose?", options: ["Glucagon", "Insulin", "Cortisol", "Adrenaline"], answer: 1, explanation: "Insulin promotes glucose uptake and storage, helping lower blood glucose." },
  { subject: "Biochemistry", question: "Which molecule is the immediate energy currency of the cell?", options: ["DNA", "ATP", "Urea", "Cholesterol"], answer: 1, explanation: "ATP transfers usable chemical energy for many cellular processes." },
];

export default function NewHomePage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => resources.filter((r) =>
    (subject === "All" || r.subject === subject) &&
    `${r.title} ${r.subject} ${r.type} ${r.description}`.toLowerCase().includes(search.toLowerCase())
  ), [search, subject]);

  const score = quiz.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);

  return <main className={styles.site}>
    <header className={styles.header}>
      <a className={styles.brand} href="#home"><span className={styles.logo}><Stethoscope size={25}/></span><span><b>MEDICAL RESEARCH</b><small>CENTRE <i>•</i> LEARN. RESEARCH. ADVANCE.</small></span></a>
      <button className={styles.menu} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}>
        <a href="#library" onClick={() => setMenuOpen(false)}>Library</a><a href="#research" onClick={() => setMenuOpen(false)}>Research</a><a href="#mcqs" onClick={() => setMenuOpen(false)}>MCQs</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a>
      </nav>
      <a className={styles.headerCta} href="#library">Explore library <ArrowRight size={15}/></a>
    </header>

    <section id="home" className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}><span/> KNOWLEDGE FOR BETTER HEALTH</div>
        <h1>Discover.<br/><em>Understand.</em><br/>Advance medicine.</h1>
        <p>A learning and research hub for medical students, healthcare professionals and curious minds. Find study resources, practise MCQs and share evidence-led ideas.</p>
        <div className={styles.actions}><a className={styles.primary} href="#library">Explore the library <ArrowRight size={17}/></a><a className={styles.secondary} href="#research">Contribute research</a></div>
        <div className={styles.trust}><span><Check size={15}/> Learning resources</span><span><Check size={15}/> Research community</span><span><Check size={15}/> Evidence-minded</span></div>
      </div>
      <div className={styles.heroArt} aria-label="Medical science illustration">
        <div className={styles.ringOne}/><div className={styles.ringTwo}/><div className={styles.artGrid}/>
        <div className={styles.dna}><Dna size={180} strokeWidth={0.8}/></div>
        <div className={styles.floatCard}><Microscope/><span><b>Explore science</b><small>Across health disciplines</small></span></div>
        <div className={`${styles.floatCard} ${styles.floatBottom}`}><Activity/><span><b>Build understanding</b><small>One concept at a time</small></span></div>
        <div className={styles.artLabel}>MRC / 001 <span>RESEARCH • LEARNING</span></div>
      </div>
    </section>

    <div className={styles.marquee}><div>{["ANATOMY","PHYSIOLOGY","BIOCHEMISTRY","HISTOLOGY","EMBRYOLOGY","DENTAL ANATOMY","MCQ PRACTICE","RESEARCH"].map(x=><span key={x}><i/> {x}</span>)}</div></div>

    <section className={styles.section} id="library">
      <div className={styles.sectionHead}><div><div className={styles.eyebrow}>THE KNOWLEDGE HUB</div><h2>Explore the <em>library.</em></h2><p>Browse by subject or search for a topic. Resource entries below are starter examples; add verified links or your own licensed files before publishing.</p></div><span className={styles.sectionIndex}>01 / LIBRARY</span></div>
      <div className={styles.searchBar}><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search subjects, topics and resources…"/>{search && <button onClick={()=>setSearch("")}>Clear</button>}</div>
      <div className={styles.filters}>{["All", ...subjects.map(s=>s.name)].map(s=><button className={subject===s?styles.selected:""} onClick={()=>setSubject(s)} key={s}>{s}</button>)}</div>
      <div className={styles.subjectGrid}>{subjects.map((s,i)=>{const Icon=s.icon;return <button key={s.name} className={`${styles.subjectCard} ${styles[s.color]}`} onClick={()=>{setSubject(s.name);document.getElementById("resource-list")?.scrollIntoView({behavior:"smooth"})}}><span className={styles.subjectIcon}><Icon/></span><span className={styles.subjectNo}>0{i+1}</span><h3>{s.name}</h3><p>{s.description}</p><span className={styles.cardLink}>View resources <ChevronRight size={15}/></span></button>})}</div>
      <div id="resource-list" className={styles.resourceArea}><div className={styles.resourceTitle}><h3>Resource directory</h3><span>{filtered.length} found</span></div><div className={styles.resourceGrid}>{filtered.map((r,i)=><article className={styles.resourceCard} key={r.title}><div className={styles.resourceTop}><BookOpen size={26}/><span>RESOURCE / 0{i+1}</span></div><div className={styles.resourceBody}><span className={styles.tag}>{r.subject} · {r.type}</span><h4>{r.title}</h4><p>{r.description}</p><button onClick={()=>setMessage(`“${r.title}” is a sample listing. Add a verified open-access URL or licensed PDF to activate it.`)}>Open resource <ArrowRight size={14}/></button></div></article>)}</div>{!filtered.length&&<p className={styles.empty}>No resources match. Try another search or subject.</p>}</div>
    </section>

    <section className={styles.researchSection} id="research"><div className={styles.researchWrap}><div><div className={styles.eyebrow}>FROM QUESTIONS TO EVIDENCE</div><h2>Research that<br/><em>moves us forward.</em></h2><p>Give researchers a place to introduce their work, submit proposals and discover publication opportunities. Submissions should be reviewed for ethics, originality and scientific quality.</p><a className={styles.primary} href="mailto:lodrickmumbere888@gmail.com?subject=Research%20submission%20enquiry">Enquire about submitting <ArrowRight size={16}/></a></div><div className={styles.researchPanel}><div className={styles.panelTop}><FileText/><span>RESEARCH PATHWAY</span></div>{[["01","Prepare your work","Follow relevant ethics and reporting guidance."],["02","Submit for review","Provide author, institution and study details."],["03","Editorial assessment","A qualified editor reviews scope and quality."],["04","Share responsibly","Approved work can be listed with clear citations."]].map(x=><div className={styles.step} key={x[0]}><b>{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div></div>)}</div></div></section>

    <section className={styles.section} id="mcqs"><div className={styles.sectionHead}><div><div className={styles.eyebrow}>ACTIVE RECALL</div><h2>Test what you <em>understand.</em></h2><p>Try these sample questions. More question banks can be added by subject with reviewed explanations.</p></div><span className={styles.sectionIndex}>02 / PRACTICE</span></div><div className={styles.quizLayout}><div className={styles.quizIntro}><GraduationCap size={34}/><h3>Quick knowledge check</h3><p>Choose one answer for each question, then submit to see your score and explanations.</p><div className={styles.quizMeta}><span>{quiz.length} sample questions</span><span>Instant feedback</span></div><button className={styles.primary} onClick={()=>{setAnswers({});setSubmitted(false)}}>Reset quiz <ArrowRight size={15}/></button></div><div className={styles.quizQuestions}>{quiz.map((q,i)=><article className={styles.question} key={q.question}><span className={styles.tag}>{q.subject.toUpperCase()}</span><h4>{i+1}. {q.question}</h4>{q.options.map((o,j)=><label className={`${styles.option} ${submitted&&j===q.answer?styles.correct:""} ${submitted&&answers[i]===j&&j!==q.answer?styles.incorrect:""}`} key={o}><input type="radio" name={`q-${i}`} checked={answers[i]===j} disabled={submitted} onChange={()=>setAnswers(prev=>({...prev,[i]:j}))}/>{o}</label>)}{submitted&&<p className={styles.explanation}><b>{answers[i]===q.answer?"Correct.":"Review:"}</b> {q.explanation}</p>}</article>)}<button className={styles.primary} onClick={()=>setSubmitted(true)} disabled={submitted||Object.keys(answers).length!==quiz.length}>{submitted?`Score: ${score}/${quiz.length}`:"Submit answers"} <ArrowRight size={15}/></button>{submitted&&<p className={styles.score}>You scored {score} out of {quiz.length} ({Math.round(score/quiz.length*100)}%).</p>}</div></div></section>

    <section className={styles.join} id="about"><div className={styles.joinInner}><div><div className={styles.eyebrow}>A COMMUNITY FOR DISCOVERY</div><h2>Learn together.<br/><em>Improve tomorrow.</em></h2><p>Designed for students, clinicians, educators and researchers who value accessible learning and responsible scholarship.</p></div><div className={styles.joinCard}><Users size={27}/><h3>Be part of the community</h3><p>Member registration, saved resources and submission tracking can be connected to your existing Supabase project as the next step.</p><a href="mailto:lodrickmumbere888@gmail.com" className={styles.secondary}>Contact the team <ArrowRight size={15}/></a><small>Membership payments are not enabled on this preview.</small></div></div></section>

    <footer className={styles.footer}><a className={styles.brand} href="#home"><span className={styles.logo}><Stethoscope size={23}/></span><span><b>MEDICAL RESEARCH</b><small>CENTRE <i>•</i> LEARN. RESEARCH. ADVANCE.</small></span></a><p>Knowledge for learners. A platform for researchers.</p><div className={styles.footerContact}><a href="mailto:lodrickmumbere888@gmail.com">lodrickmumbere888@gmail.com</a><a href="tel:+256775980853">Call: +256 775 980853</a><a href="https://wa.me/256775980853" target="_blank" rel="noreferrer">WhatsApp: +256 775 980853</a></div><span>© {new Date().getFullYear()} Medical Research Centre · Educational use only</span></footer>
    {message&&<div className={styles.toast} role="status"><span>{message}</span><button onClick={()=>setMessage("")} aria-label="Close message"><X size={17}/></button></div>}
  </main>;
}
