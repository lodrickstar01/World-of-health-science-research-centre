 "use client";
import { FormEvent, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FormStatus from "@/components/FormStatus";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { Mail, Handshake, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus(""); setError(false);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const payload = { name: String(form.get("name")||"").trim(), email: String(form.get("email")||"").trim(), organisation: String(form.get("organisation")||"").trim() || null, enquiry_type: String(form.get("enquiry_type")||"general"), message: String(form.get("message")||"").trim() };
    if (!supabaseConfigured || !supabase) { setError(true); setStatus("Database not connected yet. Configure Supabase using the README before accepting messages."); return; }
    const { error } = await supabase.from("contact_messages").insert(payload);
    if (error) { setError(true); setStatus("We could not send your message. Please check the database setup or try again later."); return; }
    setStatus("Message received. The centre should follow up using the contact details you provided."); formElement.reset();
  }
  return <><SiteHeader/><main className="section section-soft min-h-[65vh]"><div className="container grid gap-8 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Get in touch</p><h1 className="mt-3 text-4xl font-black">Let’s work together.</h1><p className="mt-4 leading-7 text-slate-600">Contact the centre about research collaboration, educational content, institutional partnerships, or general enquiries.</p><div className="mt-7 grid gap-3"><div className="card flex gap-4"><span className="text-teal"><Handshake/></span><div><h2 className="font-extrabold">Collaboration</h2><p className="mt-1 text-sm leading-6 text-slate-600">Discuss a potential partnership or shared research idea.</p></div></div><div className="card flex gap-4"><span className="text-teal"><MessageSquare/></span><div><h2 className="font-extrabold">General enquiries</h2><p className="mt-1 text-sm leading-6 text-slate-600">Ask about resources, events, and the centre’s activities.</p></div></div><div className="card flex gap-4"><span className="text-teal"><Mail/></span><div><h2 className="font-extrabold">Official contact details</h2><p className="mt-1 text-sm leading-6 text-slate-600">Add a verified institutional email and telephone number before launch.</p></div></div></div></div><form className="card grid gap-4" onSubmit={submit}><label className="field">Full name *<input name="name" required maxLength={120}/></label><label className="field">Email address *<input name="email" type="email" required maxLength={254}/></label><label className="field">Organisation (optional)<input name="organisation" maxLength={180}/></label><label className="field">Enquiry type<select name="enquiry_type" defaultValue="general"><option value="general">General enquiry</option><option value="collaboration">Research collaboration</option><option value="education">Health education</option><option value="media">Media / publications</option></select></label><label className="field">Message *<textarea name="message" required minLength={10} maxLength={4000}/></label><FormStatus message={status} error={error}/><button className="btn btn-primary w-full" type="submit">Send message</button><p className="text-xs leading-5 text-slate-500">Please do not include personal medical information or confidential research data.</p></form></div></main><SiteFooter/></>;
}
