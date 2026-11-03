# IdeaPulse website

A polished, responsive static website starter for an idea-validation and investor-discovery platform.

## Deploy to GitHub + Cloudflare Pages

1. Download and unzip this folder.
2. Create a new GitHub repository (for example `ideapulse-website`).
3. Upload **the contents of this folder** to the repository root. `index.html` must be at the root, not inside another nested folder.
4. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
5. Select the repository and branch (`main`).
6. Framework preset: **None**. Build command: leave blank. Build output directory: `/` (or `.` if the dashboard asks for a path).
7. Save and deploy. Cloudflare Pages will publish the static site.

## Included in this first launch build

- Responsive landing page with elegant editorial visual design.
- Scroll reveal, 3D-style hero composition, subtle card tilt and animated ticker.
- Separate account entry paths for founders, investors and community reviewers.
- Idea discovery sample cards, category filters and search.
- Founder and investor membership pricing UI with monthly/yearly switch.
- Sign-up/login interface previews.

## Important: what is not connected yet

This is **frontend-only**. Forms intentionally do not send or store personal information. The demo idea cards and numbers are illustrative. No real account creation, database, ratings/comments, subscription checkout, investor verification, private idea permissions or investment transactions are active yet.

Before collecting real users or money, connect:
- **Supabase Auth** for secure registration/login and role-based accounts.
- **Supabase Postgres + Row Level Security** for profiles, ideas, comments, ratings, saved ideas and access permissions.
- **Supabase Storage** for founder-uploaded images and pitch materials.
- **Razorpay Subscriptions** (or another supported payment provider) using server-side checkout creation and verified webhooks. Never put secret API keys in browser JavaScript.
- Investor identity verification and legal review appropriate to each country where the service operates.

Suggested next build order:
1. Supabase project + secure role-specific registration.
2. Idea submission and founder dashboard.
3. Public idea detail pages with real ratings/comments and anti-spam controls.
4. Subscription checkout and entitlement checks.
5. Investor verification, confidential-information approval flow and founder introduction requests.
6. Admin moderation and reporting tools.

## Brand

Working brand: **IdeaPulse**  
Positioning: *Every big thing starts with an idea.*

You can change the name, pricing and copy in `index.html` and styles in `styles.css`.
