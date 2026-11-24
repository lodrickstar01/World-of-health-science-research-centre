 "use client";
import { FormEvent, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FormStatus from "@/components/FormStatus";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export default function ResearcherRegisterPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(""); setError(false);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = { full_name: String(form.get("full_name")||"").trim(), email: String(form.get("email")||"").trim(), institution: String(form.get("institution")||"").trim() || null, role_title: String(form.get("role_title")||"").trim() || null, research_interests: String(form.get("research_interests")||"").trim(), status: "pending" };
    if (!supabaseConfigured || !supabase) { setError(true); setStatus("Database not connected yet. Configure Supabase using the README before accepting registrations."); return; }
    const { error } = await supabase.from("researcher_applications").insert(payload);
    if (error) { setError(true); setStatus("We could not submit your application. Check the database setup or contact the site administrator."); return; }
    setStatus("Application received. The centre should review it and contact you using the email provided."); formElement.reset();
  }
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container grid gap-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Join the network</p><h1 className="mt-3 text-4xl font-black">Researcher registration</h1><p className="mt-4 leading-7 text-slate-600">Tell us about your professional or academic interests so the centre can explore appropriate research and collaboration opportunities.</p><p className="mt-5 text-sm leading-6 text-slate-500">Submitting this form does not automatically grant affiliation or professional accreditation.</p></div><form className="card grid gap-4" onSubmit={submit}><label className="field">Full name *<input name="full_name" required maxLength={120} autoComplete="name"/></label><label className="field">Email address *<input name="email" type="email" required maxLength={254} autoComplete="email"/></label><label className="field">Institution / organisation<input name="institution" maxLength={180}/></label><label className="field">Role or title<input name="role_title" maxLength={120} placeholder="e.g. student, researcher, clinician"/></label><label className="field">Research interests *<textarea name="research_interests" required minLength={10} maxLength={3000} placeholder="Briefly describe your research interests and experience."/></label><label className="flex gap-3 text-sm leading-6 text-slate-600"><input className="mt-1" type="checkbox" required/> I agree that the centre may use these details to respond to my registration request. *</label><FormStatus message={status} error={error}/><button className="btn btn-primary w-full" type="submit">Submit registration</button><p className="text-xs leading-5 text-slate-500">Do not include patient names, medical records, or other sensitive health information.</p></form></div></main><SiteFooter/></>;
}
