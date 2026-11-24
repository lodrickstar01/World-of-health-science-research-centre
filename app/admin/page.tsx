import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FileText, Users, Inbox, BookOpen, ShieldAlert, Settings } from "lucide-react";

const tiles = [
  { icon: FileText, title: "Project submissions", detail: "Review and triage incoming proposals", href: "/submit-project", label: "Open submission form" },
  { icon: Users, title: "Researcher applications", detail: "Review requests to join the network", href: "/researcher-register", label: "Open registration form" },
  { icon: Inbox, title: "Contact messages", detail: "Collaboration and general enquiries", href: "/contact", label: "Open contact form" },
  { icon: BookOpen, title: "Publications", detail: "Prepare reviewed articles and reports", href: "/publications", label: "View library" },
];

export default function AdminPage() {
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container"><p className="eyebrow">Management area</p><h1 className="mt-3 text-4xl font-black">Admin dashboard</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">Dashboard layout preview. Authentication and role-based authorization must be implemented before using this area to manage real submissions or publish content.</p><div className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-5"><div className="flex gap-3"><ShieldAlert className="shrink-0 text-amber-800"/><div><h2 className="font-extrabold text-amber-950">Not secured for production yet</h2><p className="mt-1 text-sm leading-6 text-amber-900">This page is not an authenticated admin console. Do not put confidential information here or expose management actions until server-side access controls and database policies are verified.</p></div></div></div><div className="mt-7 grid gap-5 md:grid-cols-2">{tiles.map(({icon:Icon,title,detail,href,label})=><article key={title} className="card"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal"><Icon/></span><Settings className="text-slate-400"/></div><h2 className="mt-5 text-xl font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p><Link className="mt-5 inline-flex text-sm font-bold text-teal underline underline-offset-4" href={href}>{label}</Link></article>)}</div><div className="mt-8 card"><h2 className="text-xl font-extrabold">Before enabling admin actions</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Configure Supabase Auth and verified admin accounts.</li><li>Enforce authorization on the server and in database row-level security policies.</li><li>Keep audit logs for review, rejection, approval, and publication.</li><li>Set up backups, abuse protection, and a data retention policy.</li></ul></div></div></main><SiteFooter/></>;
}
