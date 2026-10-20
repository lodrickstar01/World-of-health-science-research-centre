import Link from "next/link";
import { Microscope, Menu } from "lucide-react";

const links = [
  ["Research", "/#research"],
  ["Publications", "/#publications"],
  ["Health education", "/#education"],
  ["Researchers", "/researcher-register"],
  ["Submit a project", "/submit-project"],
  ["Contact", "/contact"],
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container flex min-h-[76px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3" aria-label="World of Health Science Research Centre home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal text-white"><Microscope size={23} /></span>
          <span className="max-w-[230px] leading-tight">
            <strong className="block text-sm tracking-tight text-ink sm:text-base">WORLD OF HEALTH SCIENCE</strong>
            <span className="text-xs font-semibold text-teal">RESEARCH CENTRE</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([label, href]) => <Link className="nav-link" key={href} href={href}>{label}</Link>)}
          <Link href="/admin" className="btn btn-primary !px-4 !py-2.5 text-sm">Admin portal</Link>
        </nav>
        <details className="relative lg:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-slate-200"><Menu /></summary>
          <nav className="absolute right-0 top-12 flex w-64 flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            {links.map(([label, href]) => <Link className="nav-link" key={href} href={href}>{label}</Link>)}
            <Link className="nav-link" href="/admin">Admin portal</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
