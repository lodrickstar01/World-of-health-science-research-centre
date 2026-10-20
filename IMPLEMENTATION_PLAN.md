# Implementation plan — World of Health Science Research Centre

## Current configuration
- Display name: WORLD OF HEALTH SCIENCE RESEARCH CENTRE
- Location: Kampala, Uganda
- Status: initiative in development / planning
- Public contact email: lodrickmumbere888@gmail.com
- Public contact phone: +256 775 980853
- Hosting preference: free to start

## Phase 1 — Public website
Homepage, research focus areas, publications library, health education, researcher registration, project proposal, and contact/collaboration pages. Content that depends on actual institutional facts is marked as proposed or awaiting content.

## Phase 2 — Supabase data
Tables for researcher applications, project proposals, contact messages, publications, health articles, and profiles. Public forms insert limited contact/application metadata. Public reads of submissions are not allowed by the starter policies; public content reads are limited to published records.

## Phase 3 — Secure administration
- Configure Supabase Auth, verified admin accounts, password reset, and MFA where available.
- Add trusted server-side role assignment and secure server-side session checks.
- Add role-based RLS policies and least-privilege grants for admin/editor operations.
- Add review queues, approve/reject/publish workflows, and audit logging.
- Test denied access for anonymous users and ordinary researchers before enabling the admin console.

## Phase 4 — Free hosting
- Store the code in a private GitHub repository.
- Import it into Vercel and configure the public Supabase URL and anon/publishable key as environment variables.
- Keep all service-role keys and database passwords out of source control and client-side code.
- Review current free-tier terms; free hosting may have usage limits and may not suit all organisational/commercial uses.

## Phase 5 — Research governance
Confirm the organisation's actual registration and scope. Before handling real research data, establish a privacy notice, retention policy, access controls, backup/incident response plan, research ethics review and consent processes where applicable, and compliance with applicable Ugandan data-protection requirements. Do not collect patient records in this starter app.
