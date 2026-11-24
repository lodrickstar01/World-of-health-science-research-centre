 "use client";
import { FormEvent, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FormStatus from "@/components/FormStatus";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function SubmitProjectPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(""); setError(false);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = { title: String(form.get("title")||"").trim(), lead_name: String(form.get("lead_name")||"").trim(), email: String(form.get("email")||"").trim(), research_area: String(form.get("research_area")||"").trim(), summary: String(form.get("summary")||"").trim(), ethics_status: String(form.get("ethics_status")||"not_applicable"), status: "submitted" };
    if (!supabaseConfigured || !supabase) { setError(true); setStatus("Database not connected yet. Configure Supabase using the README before accepting submissions."); return; }
    const { error } = await supabase.from("project_submissions").insert(payload);
    if (error) { setError(true); setStatus("Submission failed. Please check database setup or contact the site administrator."); return; }
    setStatus("Project proposal received. Submission is not approval to conduct research."); formElement.reset();
  }
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container grid gap-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Research proposals</p><h1 className="mt-3 text-4xl font-black">Submit a research project</h1><p className="mt-4 leading-7 text-slate-600">Share a short proposal for initial consideration. The centre must independently assess feasibility, expertise, permissions, and ethical requirements.</p><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Important:</strong> Do not submit participant-identifying data, patient records, confidential datasets, or sensitive unpublished data in this form.</div></div><form className="card grid gap-4" onSubmit={submit}><label className="field">Project title *<input name="title" required maxLength={240}/></label><label className="field">Project lead name *<input name="lead_name" required maxLength={120}/></label><label className="field">Contact email *<input name="email" type="email" required maxLength={254}/></label><label className="field">Research area *<select name="research_area" required defaultValue=""><option value="" disabled>Select an area</option><option>Public health</option><option>Biomedical science</option><option>Clinical research</option><option>Pharmacy and medicines</option><option>Health systems</option><option>Other</option></select></label><label className="field">Project summary *<textarea name="summary" required minLength={30} maxLength={5000} placeholder="Include the research question, rationale, proposed methods, and expected public benefit."/></label><label className="field">Ethics review status<select name="ethics_status" defaultValue="not_applicable"><option value="not_applicable">Not yet assessed / not applicable</option><option value="planned">Review planned</option><option value="pending">Application pending</option><option value="approved">Approved (approval details will be verified separately)</option></select></label><label className="flex gap-3 text-sm leading-6 text-slate-600"><input className="mt-1" type="checkbox" required/> I confirm this is a preliminary proposal and does not authorize research activity. *</label><FormStatus message={status} error={error}/><button className="btn btn-primary w-full" type="submit">Send proposal</button></form></div></main><SiteFooter/></>;
}
