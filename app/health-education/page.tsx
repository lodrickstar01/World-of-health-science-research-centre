import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { HeartPulse, BookOpen, ShieldCheck } from "lucide-react";

const topics = [
  { icon: HeartPulse, title: "Disease prevention", text: "Create reviewed explainers on prevention, symptoms, screening, and when to seek professional care." },
  { icon: BookOpen, title: "Medicines and health literacy", text: "Explain medicine safety and common health concepts in accessible language with reputable references." },
  { icon: ShieldCheck, title: "Evidence and misinformation", text: "Help readers check sources, understand uncertainty, and recognize misleading health claims." },
];

export default function HealthEducationPage() {
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container"><p className="eyebrow">Learn with evidence</p><h1 className="mt-3 max-w-3xl text-4xl font-black">Health education for everyone</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">This section is a framework for public-facing education. Each article should be medically reviewed, dated, sourced, and updated when guidance changes.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{topics.map(({icon:Icon,title,text})=><article className="card" key={title}><Icon className="text-teal" size={28}/><h2 className="mt-4 text-xl font-extrabold">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p><p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Draft topic — article not yet published</p></article>)}</div><div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Health information notice:</strong> General education only; it does not diagnose or treat an individual. For urgent symptoms, seek local emergency care. Always consult a qualified health professional for personal medical decisions.</div><Link href="/contact" className="btn btn-primary mt-6">Suggest a health topic</Link></div></main><SiteFooter/></>;
}
