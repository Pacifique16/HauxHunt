### TASK: Make "Rent collected" KPI Card Interactive & Add Finance Routing

#### CONTEXT:
We are building the Owner/Property Manager Dashboard for HauxHunt. On the `Overview` page (`/partner-dashboard`), we have 4 KPI metric cards at the top. 

We need to make the second card ("Rent collected" - `USD 7,840`) interactive so clicking it navigates the user directly to the payout history and active billing schedules view.

---

#### STEP 1: Update the "Rent collected" KPI Card UI
1. Locate the KPI Card component in the Overview dashboard (rendering "Rent collected", `USD 7,840`, "This month", and the upward trend icon `↗`).
2. Update the card container styling for interaction:
   - Add a subtle hover state: `hover:border-gray-300`, `hover:shadow-md`, or `hover:bg-gray-50/80` with a smooth transition (`transition-all duration-200`).
   - Set cursor style: `cursor-pointer`.
   - Optional visual cue: Add a small arrow/chevron or external link icon next to the trend icon `↗` on hover to signal clickability.

---

#### STEP 2: Implement Navigation Logic
1. Wrap or handle the card click with Next.js `Link` or `router.push`:
   - Target route: `/partner-dashboard/finance` (or `/partner-dashboard/rent-collections`).
2. Add proper accessibility attributes:
   - `role="link"`
   - `tabIndex={0}`
   - `aria-label="View Rent Collection and Payout History"`
   - Support keyboard navigation (`Enter` / `Space` key presses trigger navigation).

---

#### STEP 3: Create Target Route Page Component (If not existing)
1. Build or stub the destination route: `/partner-dashboard/finance/page.tsx`.
2. Header layout:
   - **Title:** Rent & Finance
   - **Subtitle:** Track in-app rent collection, active billing schedules, and past payouts.
3. Structure 2 main view tabs or sections:
   - **Tab 1: Payout History** (Table showing transaction history, dates, amounts, property name, and payout statuses).
   - **Tab 2: Active Billing Schedules** (Active tenant rent schedules, upcoming due dates, and automated rent collection status).

---

#### STEP 4: Tier Gating / Free vs Paid Check (Optional)
1. Check user tier status (`isPaidOwner`):
   - **If Paid:** Directly show the payout history and billing schedules data.
   - **If Free:** Display the finance page layout with sample/blur placeholder data and an inline banner: *"In-app Rent Collection is a HauxHunt Paid feature. Upgrade to collect rent directly on platform."* with an **Upgrade Now** CTA.

---

#### REQUIREMENTS & STYLING:
- Maintain full design consistency with existing cards (white background, rounded corners `rounded-2xl`, dark text).
- Use TypeScript for route parameters and component props.