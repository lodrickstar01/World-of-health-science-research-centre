import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ArrowRight, BookOpen, Dna, HeartPulse, Microscope, ShieldCheck, Users } from "lucide-react";

const focusAreas = [
  { icon: HeartPulse, title: "Public health", body: "Explore health promotion, disease prevention, community health, and evidence-informed practice." },
  { icon: Dna, title: "Biomedical science", body: "Support responsible investigation into human biology, disease mechanisms, diagnostics, and therapeutics." },
  { icon: Microscope, title: "Clinical research", body: "Promote ethical, transparent research processes and collaboration among qualified research teams." },
];
const steps = [
  { number: "01", title: "Explore research", body: "Discover research themes, projects, and scientific publications." },
  { number: "02", title: "Learn with evidence", body: "Access understandable health education grounded in reputable evidence." },
  { number: "03", title: "Collaborate", body: "Connect with the centre to discuss partnerships and submit research proposals." },
];

export default function Home() {
  return <>
    <SiteHeader />
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-[#f0fbfa] via-white to-[#f1f6fc]">
        <div className="container grid items-center gap-12 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-teal"><span className="h-2 w-2 rounded-full bg-teal"/> Research • Education • Collaboration</div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">Better health begins with <span className="text-teal">better evidence.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">World of Health Science Research Centre aims to connect scientific inquiry, clear health education, and responsible collaboration for healthier communities.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/#research">Explore our focus <ArrowRight size={17}/></Link><Link className="btn btn-outline" href="/submit-project">Submit a research idea</Link></div>
            <p className="mt-5 text-xs leading-5 text-slate-500">Website starter content: confirm the centre’s actual activities, approvals, partnerships, and institutional status before public launch.</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-teal/10 blur-2xl"/>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink p-5 shadow-soft sm:p-7">
              <div className="rounded-[1.5rem] bg-white p-5 sm:p-7">
                <div className="mb-7 flex items-center justify-between"><div><p className="eyebrow">Research in action</p><h2 className="mt-2 text-2xl font-black">Questions lead to progress.</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal"><Microscope size={25}/></span></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f0f8fa] p-4"><BookOpen className="mb-4 text-teal"/><h3 className="font-bold">Open knowledge</h3><p className="mt-2 text-sm leading-6 text-slate-600">Make research easier to discover and understand.</p></div>
                  <div className="rounded-2xl bg-[#f2f7f2] p-4"><ShieldCheck className="mb-4 text-emerald-700"/><h3 className="font-bold">Ethics first</h3><p className="mt-2 text-sm leading-6 text-slate-600">Respect participants, privacy, and research integrity.</p></div>
                  <div className="rounded-2xl bg-[#f8f5ff] p-4 sm:col-span-2"><Users className="mb-3 text-violet-700"/><h3 className="font-bold">Stronger together</h3><p className="text-sm leading-6 text-slate-600">Encourage collaboration among researchers, educators, institutions, and communities.</p></div>
                </div>
              </div>
              <p className="px-2 pt-4 text-center text-xs text-slate-300">A platform for knowledge sharing and responsible research.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="research" className="section">
        <div className="container">
          <div className="max-w-2xl"><p className="eyebrow">What we focus on</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Research that serves people</h2><p className="mt-4 leading-7 text-slate-600">The following are proposed research themes. Publish only areas the centre is equipped and authorized to support.</p></div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">{focusAreas.map(({icon: Icon, title, body}) => <article className="card" key={title}><span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal"><Icon size={24}/></span><h3 className="text-xl font-extrabold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></article>)}</div>
        </div>
      </section>

      <section id="publications" className="section section-soft">
        <div className="container grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div><p className="eyebrow">Publications & knowledge</p><h2 className="mt-3 text-3xl font-black tracking-tight">Make good evidence easier to find.</h2><p className="mt-4 leading-7 text-slate-600">The publications library can host approved research papers, reports, conference abstracts, and educational resources with clear authorship and citations.</p><Link className="btn btn-primary mt-6" href="/publications">Browse publications <ArrowRight size={17}/></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="card"><p className="text-xs font-bold uppercase tracking-widest text-teal">Publication library</p><h3 className="mt-3 text-lg font-extrabold">Peer-reviewed research</h3><p className="mt-2 text-sm leading-6 text-slate-600">Add verified articles, DOI or source links, author details, and publication dates.</p><span className="mt-5 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Content to be added</span></article>
            <article className="card"><p className="text-xs font-bold uppercase tracking-widest text-teal">Research reports</p><h3 className="mt-3 text-lg font-extrabold">Reports & briefs</h3><p className="mt-2 text-sm leading-6 text-slate-600">Share approved findings, summaries, and downloadable reports.</p><span className="mt-5 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Content to be added</span></article>
          </div>
        </div>
      </section>

      <section id="education" className="section">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Health education</p><h2 className="mt-3 text-3xl font-black tracking-tight">Knowledge people can use</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Explain health topics in clear language, cite trusted sources, and review content before publication.</p></div><Link href="/health-education" className="btn btn-outline self-start">View health resources <ArrowRight size={17}/></Link></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[["Disease prevention","Practical, evidence-informed guidance on prevention and when to seek care."],["Medicines & safety","Clear explanations of medicine use, safety, and the importance of professional advice."],["Community health","Health literacy resources designed for different audiences and communities."]].map(([title,body])=><article className="rounded-2xl border border-slate-200 p-6" key={title}><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container"><div className="max-w-2xl"><p className="eyebrow">How to get involved</p><h2 className="mt-3 text-3xl font-black tracking-tight">From curiosity to collaboration</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{steps.map(s=><div key={s.number} className="card"><p className="text-sm font-black tracking-widest text-teal">{s.number}</p><h3 className="mt-3 text-xl font-extrabold">{s.title}</h3><p className="mt-3 leading-7 text-slate-600">{s.body}</p></div>)}</div><div className="mt-8 flex flex-wrap gap-3"><Link href="/researcher-register" className="btn btn-primary">Register as a researcher</Link><Link href="/contact" className="btn btn-outline">Discuss a partnership</Link></div></div>
      </section>
    </main>
    <SiteFooter/>
  </>;
}
