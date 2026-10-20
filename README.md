# World of Health Science Research Centre

A responsive starter website for **WORLD OF HEALTH SCIENCE RESEARCH CENTRE**, planned for Kampala, Uganda. This project uses Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Included
- Responsive homepage and navigation
- Research/publications and health education sections (starter content)
- Researcher registration form
- Research project proposal form
- Contact and collaboration form
- Admin dashboard layout prototype
- Supabase SQL schema and row-level security starter policies
- Official contact details added to the footer

## Important status and safety notes
- This is starter source code, not a deployed production service. No live URL has been created by this project.
- The organisation is described as an initiative in development. Do not claim institutional registration, accreditation, ethics approval, or research capacity unless verified.
- Forms will persist data only after Supabase is configured and `supabase/schema.sql` is run.
- `/admin` is currently a dashboard **prototype, not a secure admin console**. Do not use it to view or manage real submissions until authentication, server-side authorization, and tested database policies are implemented.
- Do not collect patient-identifiable data, clinical records, or sensitive research participant data through this starter site.

## 1. Run locally
Install Node.js 20+ and npm. From this project folder:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## 2. Configure Supabase
1. Create a project at https://supabase.com/ and keep its database password private.
2. In Supabase project settings, copy the Project URL and publishable/anon key.
3. Put them in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Open the Supabase SQL Editor and run `supabase/schema.sql`.
5. Test each public form with non-sensitive dummy data.
6. Check RLS policies and table grants. Policies and grants must be reviewed together; never expose the service-role key in browser code.

## 3. Deploy free to Vercel
1. Create a GitHub account at https://github.com/ if you do not already have one.
2. Create a **private** repository and upload/push this project. Do not upload `.env.local`, passwords, or secret keys.
3. Sign in to https://vercel.com/ using GitHub and import the repository.
4. In Vercel project settings, add the same two public Supabase environment variables. Never add the Supabase service-role key to `NEXT_PUBLIC_*` variables.
5. Deploy and test the supplied Vercel URL on both phone and desktop. The Vercel Hobby plan is free for personal/non-commercial use; review current plan terms before using it for an organisation's commercial operations.
6. After future code changes, push to GitHub; Vercel can redeploy automatically.

## 4. Secure admin portal — do not skip
The current admin page is intentionally only a UI shell. Before enabling real management:
1. Use Supabase Auth for sign-in, email verification, password reset, and preferably MFA for privileged users.
2. Add server-side session handling (for example, `@supabase/ssr`) and protect every admin route on the server. A hidden link or client-only check is not authorization.
3. Assign admin/editor roles only through a trusted server-side process or controlled SQL by the project owner. Do not let users choose their own role during registration.
4. Enforce least-privilege table grants and row-level security for every exposed table. Only admins/editors should be able to read private submissions; only authorised editors/admins should approve or publish content.
5. Keep the service-role key only in server-side secret storage, never in browser code or GitHub.
6. Add audit logging, rate limits/bot protection, backups, error monitoring, and test both allowed and denied access before launch.

## 5. Governance and privacy
Before collecting real applications or research proposals, publish a privacy notice and retention policy, verify applicable Ugandan data-protection requirements, and obtain appropriate legal/ethics advice. Clinical research requires appropriate approvals and participant protections. The PDPO Uganda website is https://pdpo.go.ug/.

## Next steps
- Confirm the organisation's legal name and status, leadership, physical address, and approved contact details.
- Add verified research outputs only; do not invent publications or results.
- Add a reviewed content publishing workflow and a secure admin implementation.
