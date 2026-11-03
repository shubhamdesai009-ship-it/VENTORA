
# VENTORA — Where Ideas Meet Opportunity

A polished, responsive static website starter for a startup idea-validation, community feedback and investor-discovery platform.

## Deploy to GitHub + Cloudflare Pages

1. Download or clone this project.
2. Create a GitHub repository (for example, `VENTORA`).
3. Upload the contents of this folder to the repository root. `index.html` must be at the root, not inside another nested folder.
4. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
5. Select the VENTORA repository and branch (`main`).
6. Framework preset: **None**.
7. Build command: leave blank.
8. Build output directory: `/` (or `.` if the dashboard asks for a path).
9. Save and deploy. Cloudflare Pages will publish the static website.

## Included in the first launch build

- Responsive VENTORA landing page.
- Editorial-style visual design.
- Scroll reveal animations and 3D-style hero composition.
- Subtle card tilt and animated ticker.
- Separate account entry paths for founders, investors and community reviewers.
- Idea discovery sample cards.
- Category filters and idea search.
- Founder and investor membership pricing interface.
- Monthly/yearly pricing switch.
- Sign-up and login interface previews.

## Important: Current platform limitations

VENTORA is currently a **frontend-only prototype**.

The following features are not connected yet:

- Real user registration and login.
- Database and persistent user profiles.
- Idea submissions and founder dashboards.
- Real ratings and community comments.
- Subscription checkout and payment processing.
- Investor identity verification.
- Private idea permissions and confidential pitch materials.
- Investor introduction requests.
- Investment transactions.

The displayed ideas, numbers and pricing are illustrative until the relevant backend and business processes are implemented.

**Do not collect real user information or payments through the current demo forms.**

## Recommended technology stack

### 1. Authentication
Use **Supabase Auth** for secure registration and login, including separate founder, reviewer and investor roles.

### 2. Database
Use **Supabase Postgres with Row Level Security (RLS)** for:

- User profiles.
- Startup ideas.
- Ratings and comments.
- Saved ideas.
- Investor and founder permissions.
- Introduction requests.

### 3. File storage
Use **Supabase Storage** for founder-uploaded images, pitch decks and other permitted materials.

### 4. Subscription payments
Use **Razorpay Subscriptions** or another supported payment provider.

Important:
- Create checkouts securely on the server.
- Verify payment signatures and webhooks.
- Store subscription status in the database.
- Never expose secret API keys in browser JavaScript.
- Do not promise investment, returns or funding in exchange for a subscription.

### 5. Investor verification and security
Implement investor identity verification, founder-approved access to confidential materials, reporting and moderation.

Obtain appropriate legal and compliance advice before enabling investment-related activities in any country where VENTORA operates.

## Suggested development roadmap

1. Create a Supabase project and connect secure authentication.
2. Build separate founder, reviewer and investor dashboards.
3. Implement idea submission and founder profile management.
4. Add public idea pages, ratings and comments with anti-spam controls.
5. Add subscription checkout and access-entitlement checks.
6. Implement investor verification and founder-approved introduction requests.
7. Add admin moderation, reporting and account management.
8. Test security, mobile responsiveness and the complete user journey before public launch.

## Brand identity

**Brand name:** VENTORA

**Tagline:** Where Ideas Meet Opportunity

**Positioning:** A platform where startup founders can present ideas, receive community feedback and discover potential investor connections.

## Project files

- `index.html` — Website structure and content.
- `styles.css` — Design, layout, animations and responsive styling.
- `script.js` — Frontend interactions, filters, pricing switch and demo account forms.
- `README.md` — Project documentation and deployment instructions.

---

**VENTORA — Where Ideas Meet Opportunity.**
