import Link from "next/link";
import { Microscope, Mail, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="container grid gap-9 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-teal"><Microscope /></span><strong>WORLD OF HEALTH SCIENCE<br/>RESEARCH CENTRE</strong></div>
          <p className="max-w-sm text-sm leading-6 text-slate-300">Supporting responsible research, evidence-informed health education, and scientific collaboration.</p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Explore</h3>
          <div className="grid gap-3 text-sm text-slate-300">
            <Link href="/#research">Research areas</Link><Link href="/#publications">Publications</Link><Link href="/#education">Health education</Link><Link href="/researcher-register">Join as a researcher</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Contact</h3>
          <a className="mb-3 flex gap-2 text-sm text-slate-300 hover:text-white" href="mailto:lodrickmumbere888@gmail.com"><Mail size={17}/> lodrickmumbere888@gmail.com</a>
          <a className="mb-3 flex gap-2 text-sm text-slate-300 hover:text-white" href="tel:+256775980853"><Phone size={17}/> +256 775 980853</a>
          <p className="flex gap-2 text-sm text-slate-300"><MapPin size={17}/> Kampala, Uganda</p>
          <p className="mt-4 text-xs leading-5 text-slate-400">Initiative in development. Institutional registration and research approvals should be confirmed before being claimed.</p>
        </div>
      </div>
      <div className="container mt-10 border-t border-white/15 pt-5 text-xs text-slate-400">© {new Date().getFullYear()} World of Health Science Research Centre. All rights reserved. Educational content is not a substitute for professional medical advice.</div>
    </footer>
  );
}
