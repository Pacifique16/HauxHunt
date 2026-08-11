### TASK: Implement "View History" CTA & Paywall Trigger on Tenant Application Cards

#### CONTEXT:
We are building the Property Manager/Owner Dashboard for HauxHunt. We need to add a "View History" feature to application cards where owners can view applicant background/tenant history. This is a PAID feature for Owners (Free tier owners should see an upgrade Paywall Modal when clicked).

---

#### STEP 1: Update Application Card Component
1. Locate or open the `ApplicationCard` component (or equivalent component rendering applicants in the Applications view).
2. Add a secondary CTA button next to existing actions labeled:
   - **Label:** `View Tenant History` (or `View History`)
   - **Style:** Outline or subtle ghost button style with an eye/history icon.
   - **Props Needed:** Pass `applicantId`, `propertyId`, and `isPaidOwner` (or consume user plan context/state).

---

#### STEP 2: Logic & Click Handling
1. Implement a click/press handler `handleViewHistory(applicantId)`:
   - **Check User Tier:**
     - `IF` user tier is `FREE`: Open the `UpgradePaywallModal` passing `feature="tenant_history"`.
     - `ELSE` (`PAID` tier): Trigger navigation or open a slide-over/modal showing the `TenantHistoryDrawer` with data for `applicantId`.

---

#### STEP 3: Create `UpgradePaywallModal` Component (If not existing)
1. Build a reusable modal component for locked features with the following props:
   - `isOpen: boolean`
   - `onClose: () => void`
   - `featureName: string` (e.g., "Tenant History")
2. **UI Content:**
   - **Header:** "Unlock Tenant History"
   - **Body:** "Access previous landlord reviews, past payment reliability, and rental history records to make informed tenant decisions."
   - **Badge/Tag:** `PRO FEATURE`
   - **Primary Action CTA:** "Upgrade to Pro" (Redirects to billing/subscription flow).
   - **Secondary Action CTA:** "Maybe Later" / Close button.

---

#### STEP 4: Create `TenantHistoryDrawer` / Detailed View Component
1. Build the view that displays when a **PAID** owner clicks "View History":
   - **Header:** `Tenant History - [Applicant Name]`
   - **Metrics/Section Overview:**
     - Previous Stay Duration (e.g., 24 months across 2 properties)
     - On-time Payment Score / History
     - Previous Landlord Ratings/Comments
2. Fetch data using your API endpoint (e.g., `GET /api/tenants/:id/history`). Handle loading and empty states cleanly.

---

#### REQUIREMENTS & TYPES:
- Use TypeScript for strict typing (`interface ApplicationCardProps`, `interface UpgradePaywallModalProps`).
- Maintain existing styling system (Tailwind CSS / styled-components).
- Ensure accessible button labels and keyboard navigation support.