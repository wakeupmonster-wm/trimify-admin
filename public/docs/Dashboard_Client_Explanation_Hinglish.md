# Trimify Admin Dashboard — Client Explanation Guide

> **Purpose:** Yeh document manager/client demo ke time use kiya ja sakta hai. Har dashboard item ke liye yahan clear hai: data kya hai, kahan se aata hai, kaise calculate hota hai, admin ko kya action lena chahiye, aur kaunse edge cases samajhne zaroori hain.

## 1. Dashboard data ka source

Dashboard ka main source backend API hai: `GET /admin/dashboard/all`.

Frontend koi counts hardcode nahi karta. Backend real database tables—jaise `users`, `transactions`, `assigned_programs`, `step_counters`, `consumed_foods`, `water_goals`, aur `weight_trackings`—se data calculate karke bhejta hai.

Client ko simple wording mein bol sakte hain:

> “Dashboard is a real operational view. It brings growth, revenue, user engagement, content performance and follow-up actions into one screen, so the admin does not have to manually check multiple modules.”

### Date filter ka rule

| Filter | Meaning |
| --- | --- |
| Today | Aaj midnight se ab tak ka data |
| Yesterday | Kal ka full calendar day |
| Last 7 / 30 / 90 Days | Today ko include karke last 7 / 30 / 90 calendar days |
| This Month | Current month ke start se aaj tak |
| Last Month | Previous calendar month |
| Custom | Selected From aur To date, dono full days included |

Custom range maximum 365 days ka ho sakta hai. Dashboard metrics short cache window (generally 30–60 seconds) use karte hain; isliye recently added transaction ya activity short delay ke baad reflect hona expected hai.

> **Important:** Har widget date filter se controlled nahi hai. Revenue, new content, signup cohort aur engagement trends selected range follow karte hain. Renewal and operational alerts current/live state dikhate hain, isliye date range change se unka number same reh sakta hai.

---

## 2. Top KPI cards

### 2.1 Revenue

**Simple meaning:** Selected period mein kitna actual successful payment revenue collect hua.

**Data source:** `transactions` table.

**Calculation:** Sirf `status = success` transactions ka `amount` sum hota hai. Failed transactions revenue mein include nahi hote.

**Example:** Last 30 Days mein 20 successful payments total `$5,000` ke hue, toh Revenue `$5,000` show hoga.

**Admin benefit:**

- Revenue growth ya decline identify karna
- Campaign ke baad payment impact dekhna
- Previous equal-length period se comparison karna

**Edge cases:**

- Successful transaction na ho toh Revenue `$0` hoga.
- Previous period zero aur current period positive ho, toh trend `+100%` aa sakta hai. Iska matlab base zero tha; growth percentage ko context ke saath dekhein.
- UI ka old helper text “All-time” keh sakta hai, lekin displayed value selected period ka revenue hai. Client explanation mein “Revenue in selected period” bolna correct hai.

### 2.2 Total Programs

**Simple meaning:** Selected period mein kitne program records create hue.

**Data source:** `manage_programs.created_at`.

**Admin benefit:** Content team ki program creation activity monitor karna.

**Important:** Yeh all-time total nahi; selected date range mein **newly created programs** ka count hai.

### 2.3 Total Blogs

**Simple meaning:** Selected period mein kitne blog records create hue.

**Data source:** `blogs.created_at`.

**Admin benefit:** Blog/content publishing activity track karna.

**Important:** Yeh total live/published blogs nahi; range ke andar created blog records hain. Published-only count ko is card se infer nahi karna chahiye.

### 2.4 Fitzone Sessions

**Simple meaning:** Selected period mein kitne Fitzone session records create hue.

**Data source:** `fitzones.created_at`.

**Admin benefit:** Fitness content library kitni grow ho rahi hai, yeh track karna.

**Important:** Yeh user workout completion count nahi hai; yeh admin/content-side session record creation count hai.

### 2.5 Missed Step Goals

**Simple meaning:** Kitne non-deleted users ne selected period mein ek bhi step record log nahi kiya.

**Data source:** `users` minus distinct users from `step_counters` for selected range.

**Example:** 500 existing users hain aur last 7 days mein sirf 180 users ne steps log kiye, toh Missed Step Goals = `320`.

**Admin benefit:** Low step-tracking engagement cohort ko reminder, coach follow-up ya push campaign bhejna.

**Edge cases:**

- User ne app open kiya ho but steps log na kiye ho, woh count hoga.
- Iska matlab user completely inactive hai, yeh zaroori nahi; shayad user food/water log kar raha ho.
- Count whole current user base ke against hai, sirf selected range ke new signups ke against nahi.

### 2.6 Missed Diet Logs

**Simple meaning:** Kitne non-deleted users ne selected period mein ek bhi food/diet entry nahi ki.

**Data source:** `users` minus distinct users from `consumed_foods`.

**Admin benefit:** Nutrition tracking engagement gap identify karna aur targeted food logging reminders bhejna.

### 2.7 Missed Water Logs

**Simple meaning:** Kitne non-deleted users ne selected period mein water log nahi kiya.

**Data source:** `users` minus distinct users from `water_goals`.

**Admin benefit:** Hydration engagement aur reminder campaigns manage karna.

### 2.8 Expiring Soon

**Simple meaning:** Kitne active, non-revoked subscription users ka plan next 15 days mein expire hoga.

**Data source:** `users.plan`, `users.plan_expiry`, `users.revoked_at`.

**Rule:** User ka plan hona chahiye, revoked nahi hona chahiye, aur expiry today se next 15 days ke beech honi chahiye.

**Admin benefit:** Renewal reminder, retention call, discount offer ya support follow-up ka ready-made action queue.

**Important:** Yeh date filter dependent nahi hai. Yeh always current “next 15 days” renewal risk dikhata hai.

### KPI trend badge ka matlab

Trend current selected period ko immediately previous equal-length period se compare karta hai.

| Example | Comparison |
| --- | --- |
| Last 7 Days | Uske just previous 7 days |
| Yesterday | Uske previous day |
| Last 30 Days | Uske just previous 30 days |

Revenue, program, blog aur Fitzone content count increase hona generally positive hai. Missed Step/Diet/Water count increase hona negative hai, kyunki more users tracking miss kar rahe hain.

---

## 3. Alerts — “Needs Attention”

Alerts live operational checks hain. Inka purpose manager ko “aaj kis issue par action lena hai” batana hai. Yeh manually maintained list nahi; backend current tables se calculate karta hai.

### 3.1 Ghosting Users

**Simple meaning:** Aise users jo 60+ days pehle join hue aur last 60 days se water, food, weight ya steps mein koi activity nahi kar rahe.

**Data source:** `users`, `water_goals`, `consumed_foods`, `weight_trackings`, `step_counters`.

**Client explanation:**

> “These are long-term disengaged users. They have had enough time to use the app, but they have not logged any meaningful health activity for at least 60 days.”

**Admin action:** Win-back push/email/WhatsApp, coach call, personalised plan reminder, or reactivation offer.

**What it does not mean:** User ne app kabhi open nahi kiya, yeh prove nahi hota. Yeh specifically health tracker activity measure karta hai.

### 3.2 Content Stagnation

**Simple meaning:** Programs/content records jo 14+ days se update nahi hue.

**Data source:** `manage_programs`, `blogs`, `work_out_sessions` ke `updated_at` timestamps.

**Current dashboard alert focus:** Dashboard call-to-action stale programs par focus karta hai.

**Admin action:** Content audit, outdated plan update, new meals/workouts add karna, or stale program archive karna.

**Important:** Yeh selected date filter se controlled nahi hai. Yeh current freshness signal hai.

### 3.3 Zero Enrollment

**Exact meaning:**

> “Active program jo minimum 15 days purana hai aur jiske against `assigned_programs` table mein kabhi ek bhi assignment record create nahi hua.”

**Data source:** `manage_programs` + `assigned_programs`.

**Rule:**

```text
Program status = Active
AND created 15+ days ago
AND no assigned_programs record exists for that program
```

**Why 15-day grace period?** New program ko immediately problem flag nahi karna chahiye. Usko discovery/assignment ka reasonable time milta hai.

**Admin action:** Program visible hai ya nahi, onboarding mapping sahi hai ya nahi, title/image/description weak toh nahi, aur recommendation logic program ko users tak bhej raha hai ya nahi—yeh review karna.

**Very important difference:** “Zero Enrollment” ka current technical meaning **never assigned** hai; “currently zero active users” nahi.

| Scenario | Alert mein aayega? |
| --- | --- |
| Active, 20 days old, never assigned | Yes |
| Active, 5 days old, never assigned | No — grace period |
| Inactive, 2 months old, never assigned | No — inactive |
| Active, old, past mein one assignment tha but currently no user visible | No — historic assignment exists |

Isliye Program Management mein kuch programs “zero users” lag sakte hain, lekin Zero Enrollment alert mein nahi aate. They may be new, inactive, or historically assigned once.

---

## 4. Composition — new user profile breakdown

Composition charts selected date range mein **newly registered users** ka profile dikhate hain. Yeh all-time user base ya active-user breakdown nahi hai.

### 4.1 User Goal Distribution

**Simple meaning:** Selected period mein jo naye users join hue, unhone onboarding mein apna primary health/fitness goal kya choose kiya.

**Data source:** `users.created_at` + `users.main_goal`.

**Example:** Last 30 Days mein 100 users join hue:

| Goal | Users | Meaning |
| --- | ---: | --- |
| Weight Loss | 55 | 55 new users weight lose karna chahte hain |
| Gain Muscle | 20 | 20 users muscle gain goal ke liye join hue |
| Maintain Weight | 10 | 10 users current weight maintain karna chahte hain |
| Unspecified | 15 | 15 users ne goal fill nahi kiya |

**Client explanation:**

> “This chart tells us why new users are joining Trimify. It helps us prioritise programs, meal plans, coaches, onboarding and marketing according to actual demand.”

**Admin benefit:**

- Weight Loss high ho toh weight-loss content/recommendations prioritise karo.
- Diabetes/Hypertension goals grow ho rahe hon toh relevant safe nutrition plans review karo.
- Unspecified high ho toh onboarding form completion investigate karo; personalization weak ho sakti hai.

**Data cleaning:** `weight_loss`, `Weight Loss`, aur `lose weight` jaise known variants ek “Weight Loss” bucket mein merge hote hain, so same goal fragmented nahi dikhta.

**Edge cases:**

- Blank/null goal = `Unspecified`.
- Unknown/custom goal hide nahi hota; separate bucket mein aata hai.
- Yeh goal achievement nahi dikhata. User ne goal complete kiya ya nahi, is chart ka subject nahi hai.
- Selected range mein no signup ho toh chart empty/zero hoga.

### 4.2 Gender Distribution

**Simple meaning:** Selected period ke new signups ka gender mix.

**Data source:** `users.created_at` + `users.gender`.

**Admin benefit:** Campaign creatives, content tone, and demographic demand understand karna.

**Edge cases:** Blank/null = `Unspecified`. System database mein jo value stored hai woh show karega; it is not restricted only to Male/Female.

### 4.3 Vegetarian vs Non-veg

**Simple meaning:** Newly joined users ki meal preference split.

**Data source:** `users.vegetarian`.

| Stored value | Dashboard label |
| --- | --- |
| `1` | Vegetarian |
| `0` | Non-Vegetarian |
| null/unknown | Unspecified |

**Admin benefit:** Veg/non-veg meal plans, recipes, food database aur nutrition campaigns ka right mix decide karna.

**Important:** High Unspecified means user preference data missing hai; it does not mean those users are non-vegetarian.

### 4.4 Conversion Funnel

**Simple meaning:** New signup se paid subscription tak journey.

**Data source:** `users` + successful `transactions`.

| Funnel field | Meaning |
| --- | --- |
| Total Signups | Selected period mein registered non-deleted users |
| Paid Users | In signups mein se users jinke paas at least one successful transaction hai |
| Not Paid Yet | Total Signups minus Paid Users |
| Conversion Rate | Paid Users ÷ Total Signups × 100 |
| Drop-off Rate | Not Paid Yet ÷ Total Signups × 100 |

**Example:** 100 new signups, 35 successful payers:

```text
Conversion Rate = 35%
Not Paid Yet = 65 users
Drop-off Rate = 65%
```

**Admin benefit:** Payment funnel problem identify karna, unpaid signups ko follow up karna, and acquisition quality measure karna.

**Important:** Yeh cohort conversion hai. User selected period mein signup kare aur later payment complete kare, toh woh signup cohort ka paid user count ho sakta hai.

---

## 5. Trends

### 5.1 Engagement Trend (DAU)

**DAU ka full form:** Daily Active Users.

**Simple meaning:** Kisi date par kitne unique users ne at least one meaningful health activity log ki—food, water, step ya weight.

**Data source:** `consumed_foods`, `water_goals`, `step_counters`, `weight_trackings`.

**Example:** Ek user same day food, water aur steps tino log kare, toh DAU count mein user only once count hoga.

**Admin benefit:** App install/signup aur actual health-tracking usage ka difference samajhna. DAU drop ho toh re-engagement action lena.

**Grouping:**

| Range size | Chart grouping |
| --- | --- |
| Today | One total point |
| Up to 7 days | Day-wise |
| 8–31 days | Week-wise |
| Above 31 days | Month-wise |

**Edge cases:** Zero-activity date bhi zero ke saath visible reh sakta hai; missing chart point ka matlab automatically missing API data nahi.

### 5.2 Fitzone Users Assigned

**Simple meaning:** Selected period mein kitne unique users ko admin ne aisi Fitzone category assign ki jo Active hai aur jiske andar active workout session available hai.

**Data source:** `assigned_fitzones`, `fitzones`, `work_out_sessions`, `fitzone_sessions`.

**Example:** Admin ek active Fitzone category ko 20 users ko assign karta hai. Chart mein `20` users show honge—same user ko multiple categories milne par us period bucket mein user ek hi baar count hoga.

**Admin benefit:** Admin verify kar sakta hai ki usable Fitzone workout content kitne real users tak pahucha. New Fitzone create karne se count nahi badhega; count tabhi badhega jab User Management se valid category kisi user ko assign ki jaaye.

**What it does not prove:** User ne workout open ya complete kiya. Completion metric ke liye mobile app/backend ko separate completion event save karna hoga.

### 5.3 Program Enrollment Split

**Simple meaning:** Selected period mein kaunse programs ke assignment/enrollment records sabse zyada bane. UI top 5 programs dikhata hai.

**Data source:** `assigned_programs` joined with `manage_programs`.

**Admin benefit:** High-demand programs identify karna, low-adoption programs improve karna, and recommendation strategy adjust karna.

**Important:** Current count assignment rows ka hai; strict unique-user count nahi. Same user ke multiple assignment rows create hon toh count increase ho sakta hai.

### 5.4 Recent Joined Users

**Simple meaning:** Last 15 calendar days mein jo latest users registered hue, newest first. Dashboard maximum 5 newest records dikhata hai.

**Fields:** User name, email, and joined/account-created date.

**Admin benefit:** New acquisition quickly review karna aur user profile open karke support/follow-up karna.

**Important:** Yeh table global Dashboard date filter follow nahi karti. Today, Last 30 Days, Last 90 Days ya Custom filter change karne par bhi table ka meaning same rehta hai: “Who joined recently in the past 15 days?”

---

## 6. Follow-ups & Roster

### Pending / Abandoned Checkouts

**Simple meaning:** Unpaid users jo at least 7 days pehle signup hue, but last 60 days ke andar hi signup hue.

**Data source:** `users.paid`, `users.created_at`, plus goal/gender profile fields.

**Rule:**

```text
paid = 0
AND signup age >= 7 days
AND signup age <= 60 days
```

**Admin benefit:** Actionable sales/retention queue—payment reminder, coupon, support call, or onboarding help.

**Important:** Yeh prove nahi karta ki user checkout page par gaya tha. It means user is registered but still unpaid.

**Why 60-day cap?** Very old unpaid records practical follow-up queue ko clutter karte hain. List recent, actionable leads par focused rehti hai.

**Fields:**

| Field | Meaning |
| --- | --- |
| Signed Up | Account creation date/time |
| Days Since | Signup ke baad ka time |
| Goal | Personalized follow-up ke liye user goal |
| Gender | Relevant communication context, if available |

---

## 7. Quick client-facing summary

> “The Trimify Dashboard combines four areas in one place: business performance, user engagement, content adoption and action queues. Revenue shows successful payment collection; the goal, gender and diet charts show what kind of users are joining; engagement trends show whether users are actually tracking their health; and alerts highlight the next operational action—such as users to win back, plans nearing expiry, content that needs review, or active programs that have never been assigned.”

## 8. Safe statements vs statements to avoid

| Safe to say | Avoid saying |
| --- | --- |
| “User Goal Distribution shows why newly registered users joined.” | “It shows whether users achieved their goal.” |
| “Fitzone chart currently shows assignment/adoption activity.” | “It shows workout completion rate.” |
| “Zero Enrollment means active, mature programs never assigned to anyone.” | “It means every program with zero current users.” |
| “Missed Logs means no record was logged in that tracker.” | “The user never opened the app.” |
| “Abandoned Checkouts is an unpaid follow-up queue.” | “Every listed user definitely started checkout.” |
