# Trimify Admin Panel — Design & QA Review
**Reviewer:** Rajat Khoware (Founder)
**Date of review:** 1 August 2026
**Reference standard:** Keen As Mustard (KAM) admin panel
**Owners:** Raj (frontend/design) · Rajeev (architecture/backend + QA sign-off)

---

## 0. Read this first

The instruction for this build was clear and given up front: **match the Keen As Mustard admin panel** — its components, spacing, chip styles, tables, and overall standard. That panel already exists as the reference; nothing here is new ground.

Before this review, both of you confirmed the panel was **complete, matched to KAM, and had no issues from your side.** On review, that was not the case. The list below contains 40+ items — and several of them are not matters of taste. Dummy placeholder data (John Doe, Priya Sharma, KAM cover images) is still live. Forms save with every mandatory field empty. Dashboards and tables show static data that doesn't respond to filters. Images and banners are broken. **These are not "review feedback" — these are defects that should never have passed an internal check, and they were signed off as done.**

That is the real issue to absorb before the fix list: the gap here is not ability — you both have the skill to build this. The gap is that "done" was declared without the work being verified against the reference and against basic functionality. **That is the one thing that cannot repeat.** Every developer gets a review list; a long review list on a first pass is normal and expected. What is not acceptable is reporting work as finished and tested when placeholder data and empty-form saves are still in it.

To make "done" mean the same thing for all of us going forward, this document ends with two checklists — a **Definition of Done** (Section 20) that must be run *before* anyone says a screen is finished, and a **QA Sign-off list** (Section 21) that Rajeev verifies against before the word "complete" comes to me. From now on, "it's done" means "I ran these lists," not "I stopped working on it."

---

## How to use this document

Each item has an ID (for tracking) and a severity tag:

- 🔴 **[DEFECT]** — broken, wrong, or non-functional. **Fix these first.** These are the ones that should never have shipped.
- 🟡 **[CONSISTENCY]** — does not match the KAM reference. This is the bulk of the work and the whole point of the brief.
- 🔵 **[POLISH]** — refinement, redesign, or "make it better" quality items.

Two tasks must be **done and approved by me before mass changes** (they gate the rest):
1. **Chart accent-colour palette** — Section 2, item D-11. Build it, generate a dashboard mock-up with it, get my approval, *then* apply.
2. **Button design page** — Section 9, item DM-04. Build the HTML showcase with 3–4 improvement variations, get my approval, *then* apply.

---

## Cross-cutting issues (these repeat on almost every screen)

Fix these **once, at the component/token level**, and most of the per-screen items disappear:

- **CC-1 🟡 Chip component is inconsistent everywhere.** Build ONE chip component that matches KAM (left icon, hover-lift, selected state, correct colours) and reuse it on every screen. Nearly every "chip issue" below is this same component.
- **CC-2 🟡 Heading/subheading type sizes are globally smaller than KAM.** Fix the type scale globally, not screen by screen.
- **CC-3 🟡 Section/heading spacing is globally tighter than KAM.** Fix spacing tokens globally.
- **CC-4 🔴 Chart/data-viz colours are all shades of the primary blue.** Primary is used far too much. Build an accent palette; primary should be rare. (See D-11.)
- **CC-5 🟡 Email & phone icons missing in all tables.** KAM shows an email icon and phone icon beside each entry — add to every table showing email/phone.
- **CC-6 🔴 Dummy/placeholder data still present** (John Doe, Priya Sharma, KAM cover images). Replace with real data everywhere.
- **CC-7 🔴 Static data not wired.** Dashboards and tables must respond to date-range/filter selection like KAM. Right now they don't change.
- **CC-8 🔴 Missing form validation.** Forms save with empty required fields. Every required field must block save and show an error.
- **CC-9 🔵 Button hover styles disliked globally.** Needs a proper button system (see DM-04).

---

## 1. Global Layout & Left Sidebar

- **G-01 🔵** Trimify logo (top-left): reduce size by 20–30%.
- **G-02 🔴** Top-right "admin view" option: remove it — it's already shown bottom-left (duplicate).
- **G-03 🟡** Left menu is missing the **"Management"** section heading that KAM has.
- **G-04 🟡** Left-menu chip/highlight size and sizing differ from KAM — match KAM sizing for all menu headings and icons.
- **G-05 🟡** Left menu is missing the top spacing that KAM has — add it.
- **G-06 🟡** Overall left-menu sizing is slightly smaller than KAM — bring to parity.

## 2. Dashboard

- **D-01 🟡** Cards/chips have **no section heading**. KAM has "Today at a glance — key insights that matter to you right now." Add the heading.
- **D-02 🟡** Chip style is completely different (unwanted borders). Match KAM chip style (see CC-1).
- **D-03 🟡** The **% increase/decrease indicator is missing from all cards.** KAM shows it as a chip on the card's top-right — add it.
- **D-04 🟡** Spacing between the alert section (heading/subheading) and the cards above is not per KAM — increase to match. Apply the same heading↔section spacing fix everywhere (see CC-3).
- **D-05 🔴 User Goal Distribution chart:** colours are all variations of primary. Replace with accent colours (minimal, not glittery). Categories (Unspecified / Weight Loss / Gain Muscle / Manage Hypertension / Manage Weight) must be visually distinct.
- **D-06 🔴 Gender group chart:** Male / Female / Other are near-identical colours — differentiate clearly.
- **D-07 🔴 Veg/Non-veg chart:** Non-veg = red, Veg = green, Unspecified = grey.
- **D-08 🟡 Total Sign-up (100%):** currently primary blue — use a distinct highlight colour so it reads as the top-of-funnel total.
- **D-09 🔴 Conversion funnel:** remove the "98% decrease" chip on the right (a funnel always decreases — the chip is meaningless).
- **D-10 🟡** "Not paid yet" / drop-off-rate numbers: use a better, more legible colour.
- **D-11 🔴🚦 FIRST DELIVERABLE — chart accent palette (approval-gated):** Take a screenshot of the dashboard, build a chart accent-colour palette (use ChatGPT to help articulate the problem: we want minimal accent colours, primary used rarely), generate a mock-up image of the dashboard using it, and **send it to me for approval before changing any charts.** Do NOT change everything at once.
- **D-12 🔵** Recent-joined-user table: looks good — just add a **serial number** column on the left.
- **D-13 🔴** Revenue data does not update when the month changes. User data is all static. **Wire all dashboard data to real data and to the selection/filters** so the whole dashboard reacts like KAM (see CC-7).

## 3. Sub-Admin Page

- **SA-01 🟡** Top chips (Total Sub-Admin / Active Account / Sub-Admin User / Whitelisted User) don't match KAM — KAM chips have a **left icon**; add it. Add the **hover-lift** effect and selected state (see CC-1).
- **SA-02 🔴** Tap-to-filter: tapping a top card should filter the table below. Works for Active Accounts, Sub-Admin, Whitelisted — **not working for Total Sub-Admin.** *Decision:* Total Sub-Admin shouldn't filter anyway (all are sub-admins), so remove the tap-filter behaviour on that one card rather than "fixing" it.
- **SA-03 🟡** Table column order — currently Serial then Created-At. Move **Created-At to the last column** (just left of Action). Correct order: **Serial → Username → Email ID → Hospital/Clinic → Designation → Role → Status → Country → Created At → Action.**
- **SA-04 🟡** Designation field: use the same chip design as the User-Management "Active Plan" chip (e.g. the green premium style) for Manager / Dental / QA etc.

## 4. User Management

- **UM-01 🟡** Same chip issue — fix (CC-1).
- **UM-02 🟡** Column order: **Serial → Username → Email Address → Contact Number → Active Plan → Added By → Status → Started → Expired → Action.**
- **UM-03 🔴** Remove the stray **"dots" in the Contact Number heading.**
- **UM-04 🟡** Do **not** show User ID in this table.
- **UM-05 🟡** Add **email icon + phone icon** beside each email/contact entry (see CC-5).

## 5. Program Management

- **PM-01 🟡** All sections have the chip issue — fix (CC-1).
- **PM-02 🟡** "View User" and "Open Program" buttons use primary colour and don't look good. Use the KAM **KYC-verification "View Doc" button style** for View User, and the same approach for Open Program.
- **PM-03 🟡** Tapping "View User" opens the view-user tab — design that table with the **same structure/column order as User Management** (Section 4).
- **PM-04 🟡** Add email/phone icons in the user tables here too (CC-5).

## 6. Managed Program → Food Category / Add Food Item

- **FC-01 🔴** Food-category images are **broken** — fix so images are clearly visible.
- **FC-02 🔵** Add Food Item: increase spacing between the heading and the Approve / Non-approve radio options.
- **FC-03** Search field: fine, no change.

## 7. Fit Zone

- **FZ-01 🟡** Description should show on **one line then truncate** (in the added/list view).
- **FZ-02 🔴** Editing a Fit Zone shows a **broken banner** — use the banner from the previous (KAM) admin panel.
- **FZ-03 🔵** The Add-Fit-Zone icon should match the context (a dumbbell / workout icon). **Icons must match their context everywhere**, not generic.

## 8. Data Management (Foods — protein/carbs/calories/meals)

- **DM-01 🔵** Table looks good.
- **DM-02 🔴** Tapping any table entry should **open that item's edit page** (currently does nothing).
- **DM-03 🟡** "Add Food" and "Upload Food" buttons aren't highlighted initially; they only turn primary on hover. Both should be **primary by default**, with a *different* style on hover.
- **DM-04 🔵🚦 SECOND DELIVERABLE — button design page (approval-gated):** You dislike the hover style of all buttons. Identify **every** button used across the panel and build a **single HTML page** showing the current design of each, plus **3–4 improved variations** for each. Send to me for approval before applying.

## 9. Add Food Form

- **AF-01 🔴** Form **saves with all fields empty** — no validation. Every required field (Food Title, Image URL, Protein, Carbs, etc.) must **block save** and show a "required" error (or something better).
- **AF-02 🔵** Remove the **divider** between the "Meal Serving" field and the buttons.

## 10. AI Food Upload

- **AIF-01 🟡** Status chips don't match our chip design — fix (CC-1).
- **AIF-02 🔴** Duplicate handling: when a generated image already exists, give **two options — update the existing listing OR delete the existing item.**
- **AIF-03 🔴** Add a **"delete generated"** option. Right now a generated item (e.g. a soya-chaap image you don't want) can only be *added* to the catalogue — there's no way to discard it. Once an item is added, it should be **removed from the generated list.**
- **AIF-04 🔵** In the generated-item view/edit: photo is on the left, content on the right — **reverse it** (content left, photo right). Current layout breaks the UX hierarchy.

## 11. Blog Management → Manage Category (Edit Category)

- **BC-01 🟡** Heading/subheading sizes on every text field are too small — match KAM (see CC-2).
- **BC-02 🔵** "Replace current icon": the current icon shows inside a box but isn't fully visible, and the UI is not useful. Redesign: rename the heading to **"Category Icon"**; if an icon exists, show it with a **cross / re-upload** control; tapping it re-uploads.

## 12. Blog Management → Manage Blog (Edit Blog Posts)

- **BB-01 🟡** Same heading/subheading size issue as BC-01.
- **BB-02 🟡** Same "replace feature image" redesign as BC-02.
- **BB-03 🔴** Text editor shows a dev placeholder ("press ⌘0 for help") under the content description — review/remove.
- **BB-04 🔵** The editor is too short — **double the content height** of the text editor.

## 13. Subscription Management

- **SM-01 🟡** Dashboard: apply **all the same fixes as the main Dashboard** (Section 2).
- **SM-02** Products: fine, no change.
- **SM-03 🔴** Subscribers: the first row (Priya Sharma demo) shows status "Revoke" and, below it, the text **"inconsistent state"** — remove that text; it should never appear.
- **SM-04 🟡** Subscribers column order: **Serial → Subscriber Name → Email → Plan → Status → Started → Expired → Action** (Status moves ahead of the dates). Add email icon (CC-5).
- **SM-05 🔴** Transactions: tapping a table row **redirects to User Management** — remove that. Row-tap should do nothing; the "View User" action already exists in the Action column.

## 14. Privacy Content Management
- Fine, no issues.

## 15. Notification Management

- **NM-01 🟡** Email/message history: a few table issues remain — clean up to match KAM.
- **NM-02 🟡** Campaign-history overview card: match the KAM card style.
- **NM-03 🟡** Channel chip (e.g. "email"): chip design doesn't match — fix (CC-1).

## 16. Account / Settings

- **AC-01 🔴** Tapping a user (e.g. Shabnam Ahmadi) → Account still shows **KAM cover image, John Doe profile image, and dummy details** — replace with real data (CC-6).
- **AC-02 🟡** Confirm-password field — review.
- **AC-03 🟡** Left menu has "Account Setting" and, below it, the user (Shabnam Ahmadi). The **account-setting options should appear under the user/account item**, not where they currently are — fix placement.

## 17. User Detail / View Profile Page  ⚠️ *largest rework — reads as unfinished/vibe-coded*

- **VP-01 🟡** Missing the **"User Directory / Profile View" breadcrumb** that KAM has.
- **VP-02 🟡** Missing the **User ID** on the right of the breadcrumb.
- **VP-03 🔵** No profile picture — a placeholder (e.g. initials) is acceptable.
- **VP-04 🟡** Header meta is wrong: KAM shows **status (active), plan (free), joined, updated at**. This shows UID / age / gender instead — replicate KAM.
- **VP-05 🟡** Tab-bar chips don't look good — follow the KAM tab-bar style.
- **VP-06 🔵** "Overall" cards (Program Enrolled, Fitness, Fit Zone Assessment, Step Log, Daily Activity) look **too generic / below standard** — redesign to KAM quality.
- **VP-07 🔴** Recent Activity: activity icons have **no colour differentiation**; and **"0 steps logged"** entries are showing — do **not** display zero-step logs. Improve overall.
- **VP-08 🔵** Fit-Zone Activity / Snapshot Plan: remove the **divider** between snapshot and plan (premium/paid).
- **VP-09 🔵** Active Program: shows a "12-week loss program" with an **"Active" chip** on the right, but the heading already says "Active Program" — remove the redundant chip.
- **VP-10 🔵🔬 RESEARCH TASK:** This overview is too basic. KAM shows **account connectivity (email, phone)** — add those. Then research and propose what else the overview should show, and send me the options before building.
- **VP-11 🔵** Health & Goal / Body Measurement / BMI: fine.
- **VP-12 🔵** Daily Target (water goal, calorie, step tracker): design not good — propose alternative designs.
- **VP-13 🔴** Macro split (protein/carbs/fat, fluid restriction): same colour-blending problem — categories not distinguishable. Fix with the accent palette.
- **VP-14 🔵** Fitness profile: remove the **divider between each section.**
- **VP-15 🟡** Previous overview/snapshot card uses icons on the right — here the **icon is missing** — add it.
- **VP-16 🔴** Account card → Settings: completely different from KAM — review KAM and rework.
- **VP-17 🔴** Transaction and Settings designs are not consistent with KAM — **rework fully.**

---

## 20. Definition of Done — run this BEFORE saying a screen is "done"

*(Whoever builds a screen runs this on it. If any box is unchecked, the screen is not done.)*

- [ ] **No placeholder/dummy data** anywhere on the screen (no John Doe, no Priya Sharma, no KAM cover images, no lorem text).
- [ ] **All data is wired to real data** and updates correctly when filters / date-ranges / month selectors change.
- [ ] **All required form fields validate** — save is blocked on empty required fields, with a clear error message.
- [ ] **No broken images or banners** — every image and banner loads and is fully visible.
- [ ] **No dev placeholders** left visible (e.g. editor hint text, console-only strings).
- [ ] **Chips, buttons, cards, spacing, and type sizes match the KAM component/token set** (not eyeballed — the actual shared component).
- [ ] **Table columns are in the specified order**, with email/phone icons where email/phone appear.
- [ ] **Every interactive element does what it should** — taps open the right page, filters apply, no dead clicks, no wrong redirects.
- [ ] **Icons match their context** (no generic icon where a specific one belongs).
- [ ] Screen was **compared side-by-side against the equivalent KAM screen** before being marked done.

## 21. QA Sign-off — Rajeev verifies this BEFORE reporting "complete" to me

*(This is the responsibility you were given. "No issues" means you ran this list — not that you glanced at the screen.)*

- [ ] I opened **every screen** in the panel, not a sample.
- [ ] I ran the **Definition of Done (Section 20)** against each screen personally.
- [ ] I confirmed **no dummy data, no broken images, no unvalidated forms, no static/unwired data** remain anywhere.
- [ ] I clicked **every button, row, tab, and filter** and confirmed correct behaviour.
- [ ] I compared each screen against its **KAM equivalent** for chip/button/card/spacing/type consistency.
- [ ] I logged any remaining known issues **honestly** before handing over — I did not report "no issues" while issues existed.
- [ ] **Signed off by:** _______________  **Date:** __________

---

## Expectations going forward

1. **"Done" now has a definition.** Sections 20–21 are it. Reporting work as done and tested when it isn't is the one thing that cannot happen again.
2. **Growth is the expectation, project to project.** The KAM panel taught these exact lessons — chip consistency, spacing, validation, real data. Those lessons are expected to *carry into every new project* without being re-taught. Repeating first-product mistakes on the second product is the specific gap to close.
3. **Fix order:** all 🔴 [DEFECT] items first, then the two approval-gated deliverables (D-11 palette, DM-04 buttons), then 🟡 [CONSISTENCY], then 🔵 [POLISH].
4. **When unsure, ask before assuming.** A quick question beats a wrong build discovered at review.

*End of review. Track each item by ID as it's closed.*
