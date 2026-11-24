import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { BookOpen, ExternalLink } from "lucide-react";

export default function PublicationsPage() {
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container"><p className="eyebrow">Knowledge library</p><h1 className="mt-3 text-4xl font-black">Publications & research reports</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">This library is ready for approved publications. No research papers have been added yet; we will not invent findings or citations.</p><div className="card mt-8 max-w-3xl"><BookOpen className="text-teal" size={28}/><h2 className="mt-4 text-xl font-extrabold">The publication library is being prepared</h2><p className="mt-2 leading-7 text-slate-600">When available, each record should include its title, authors, journal or publisher, year, abstract, DOI/source link, and any applicable open-access licence.</p><Link className="btn btn-primary mt-5" href="/contact">Ask about contributing <ExternalLink size={16}/></Link></div></div></main><SiteFooter/></>;
}
