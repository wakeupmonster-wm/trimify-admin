# Trimify Admin Panel — Design & QA Review (Hinglish Version)

## Cross-cutting issues (Har screen pe repeat hone wale issues)

- ✅ **CC-1 🟡 Chip component inconsistent hai:**
  - **Solution:** Ek single chip component banayein jo KAM (Keen As Mustard) se match kare (jisme left icon, hover-lift, selected state aur correct colors ho) aur use har jagah reuse karein.
- ✅ **CC-2 🟡 Heading/subheading type sizes KAM ke comparison me chhote hain:**
  - **Solution:** Type scale ko globally fix karein, na ki har screen pe alag-alag.
- ✅ **CC-3 🟡 Section/heading spacing KAM se jyada tight hai:**
  - **Solution:** Spacing tokens ko globally fix karein.
- **CC-4 🔴 Chart/data-viz me sirf primary blue color ke shades use hue hain:**
  - **Solution:** Ek accent color palette banayein. Primary color ko rare banayein (D-11 dekhein).
- ✅ **CC-5 🟡 Tables me email aur phone icons missing hain:**
  - **Solution:** Har table me jahan email/phone hai, wahan KAM ki tarah icons add karein.
- **CC-6 🔴 Dummy/placeholder data (jaise John Doe, Priya Sharma) abhi bhi visible hai:**
  - **Solution:** Har jagah dummy data ko real data se replace karein.
- ✅ **CC-7 🔴 Dashboards aur tables me data static hai aur filters se change nahi hota:**
  - **Solution:** Date-range aur filter selection ko backend data ya dynamic logic ke sath wire karein taaki dashboard react kare.
- ✅ **CC-8 🔴 Form me validation nahi hai (empty submit ho rahe hain):**
  - **Solution:** Har required field pe validation lagayein aur empty submit hone par error show karein.
- ✅ **CC-9 🔵 Button ke hover styles theek nahi hain:**
  - **Solution:** Ek proper button system banayein (DM-04 dekhein).

## 1. Global Layout & Left Sidebar

- ✅ **G-01 🔵 Trimify logo bahut bada hai:**
  - **Solution:** Logo size ko 20-30% kam karein.
- ✅ **G-02 🔴 Top-right me "admin view" duplicate hai:**
  - **Solution:** Is option ko remove karein kyunki ye already bottom-left me hai.
- ✅ **G-03 🟡 Left menu me "Management" section heading missing hai:**
  - **Solution:** "Management" heading ko menu me add karein.
- ✅ **G-04 🟡 Left-menu chip/highlight sizes KAM se match nahi karte:**
  - **Solution:** Menu headings aur icons ki sizing ko KAM ke barabar karein.
- ✅ **G-05 🟡 Left menu me top spacing missing hai:**
  - **Solution:** Top spacing add karein taaki KAM se match ho sake.
- ✅ **G-06 🟡 Left-menu ki overall size chhoti lag rahi hai:**
  - **Solution:** Ise thoda bada karke KAM ki parity me layein.

## 2. Dashboard

- ✅ **D-01 🟡 Cards/chips me section heading missing hai:**
  - **Solution:** "Today at a glance..." jaise heading add karein.
- ✅ **D-02 🟡 Chip style me unwanted borders hain:**
  - **Solution:** KAM style ke chips use karein (CC-1 ko follow karein).
- ✅ **D-03 🟡 Cards se % increase/decrease indicator missing hai:**
  - **Solution:** Cards ke top-right pe KAM ki tarah chip indicators add karein.
- ✅ **D-04 🟡 Alert section aur cards ke beech spacing kam hai:**
  - **Solution:** Spacing ko badhayein taaki KAM se match kare.
- ✅⏳ **D-05 🔴 User Goal Distribution chart me colors same/primary blue hain:**
  - **Solution:** Accent colors use karein taaki categories (Weight Loss, Gain Muscle, etc.) alag se dikhein.
- ✅⏳ **D-06 🔴 Gender group chart me colors identical hain:**
  - **Solution:** Male / Female / Other ko visually distinct colors dein.
- ✅⏳ **D-07 🔴 Veg/Non-veg chart colors galat hain:**
  - **Solution:** Non-veg ko red, Veg ko green, aur Unspecified ko grey color assign karein.
- ✅ **D-08 🟡 Total Sign-up (100%) blue color me hai:**
  - **Solution:** Distinct highlight color use karein.
- ✅⏳ **D-09 🔴 Conversion funnel me "98% decrease" meaningless hai:**
  - **Solution:** Ye chip wahan se remove karein.
- ✅⏳ **D-10 🟡 "Not paid yet" / drop-off-rate numbers me color legible nahi hai:**
  - **Solution:** Better readability wala color use karein.
- **D-11 🔴 Chart accent-colour palette approval ke liye pending hai:**
  - **Solution:** Palette banayein, mockup create karein aur Rajat se approve karwayein phir apply karein.
- ✅ **D-12 🔵 Recent-joined-user table me serial number missing hai:**
  - **Solution:** Table ki left me serial number column add karein.
- ✅ **D-13 🔴 Revenue aur User data static hai aur update nahi hota:**
  - **Solution:** Inhe real data aur filters ke sath connect karein (CC-7).

## 3. Sub-Admin Page

- ✅ **SA-01 🟡 Top chips KAM se match nahi hote:**
  - **Solution:** Left icon, hover-lift, aur selected state add karein (CC-1).
- ✅ **SA-02 🔴 "Total Sub-Admin" card tap karne pe filter nahi hota:**
  - **Solution:** "Total Sub-Admin" card se tap-to-filter behavior hi remove kar dein.
- ✅ **SA-03 🟡 Table column order galat hai:**
  - **Solution:** Columns ko iss order me set karein: Serial → Username → Email ID → Hospital/Clinic → Designation → Role → Status → Country → Created At → Action.
- ✅ **SA-04 🟡 Designation field me proper chip design nahi hai:**
  - **Solution:** Jaise "Active Plan" ka green premium style chip hai, wahi style Designation (Manager, Dental, QA) ke liye use karein.

## 4. User Management

- ✅ **UM-01 🟡 Same chip design issue hai:**
  - **Solution:** Isko CC-1 ke according fix karein.
- ✅ **UM-02 🟡 Column order change karna hai:**
  - **Solution:** Order: Serial → Username → Email Address → Contact Number → Active Plan → Added By → Status → Started → Expired → Action set karein.
- ✅ **UM-03 🔴 Contact Number heading me extra "dots" hain:**
  - **Solution:** Un dots ko remove karein.
- ✅ **UM-04 🟡 Table me User ID dikh rahi hai:**
  - **Solution:** User ID wale column ko table se hata dein.
- ✅ **UM-05 🟡 Email/Contact me icons nahi hain:**
  - **Solution:** CC-5 ke hisaab se icons add karein.

## 5. Program Management

- ✅ **PM-01 🟡 Har section me chip issue hai:**
  - **Solution:** CC-1 ke rules ke according chip design theek karein.
- ✅ **PM-02 🟡 "View User" aur "Open Program" buttons primary color ke karan achhe nahi lag rahe:**
  - **Solution:** Inhe KAM ke KYC-verification "View Doc" button style me change karein.
- ✅ **PM-03 🟡 "View User" tab ka table structure alag hai:**
  - **Solution:** User Management (Section 4) wale table ki column ordering yaha bhi apply karein.
- ✅ **PM-04 🟡 Yaha ke table me email/phone icons nahi hain:**
  - **Solution:** Icons add karein (CC-5).

## 6. Managed Program → Food Category / Add Food Item

- ✅ **FC-01 🔴 Food-category images broken dikh rahi hain:**
  - **Solution:** Images ko properly visible banane ke liye image links fix karein.
- ✅ **FC-02 🔵 Heading aur radio options (Approve/Non-approve) me space kam hai:**
  - **Solution:** Spacing thodi badha dein.
- ✅ **FC-03 Search field:** Fine, no change required.

## 7. Fit Zone

- ✅ **FZ-01 🟡 Description multi-line me aa raha hai:**
  - **Solution:** List view me description ko single line me truncate (elipsis ke sath) karke dikhayein.
- ✅ **FZ-02 🔴 Edit Fit Zone me broken banner dikh raha hai:**
  - **Solution:** Puraane KAM admin panel wala banner use karein.
- ✅ **FZ-03 🔵 Add-Fit-Zone icon context se match nahi karta:**
  - **Solution:** Dumbbell ya workout icon use karein. Har jagah context ke according icons hone chahiye.

## 8. Data Management (Foods)

- ✅ **DM-01 🔵 Table theek hai:**
  - **Solution:** No changes needed.
- ✅ **DM-02 🔴 Table entry pe click karne pe kuch open nahi hota:**
  - **Solution:** Clickable banayein, taaki row click karne pe us item ka edit page open ho jaye.
- ✅ **DM-03 🟡 "Add Food" aur "Upload Food" sirf hover pe primary ho rahe hain:**
  - **Solution:** Inko default primary set karein, aur hover pe alag style show karein.
- ✅ **DM-04 🔵 Button design page ki requirement hai (Deliverable 2):**
  - **Solution:** Sare existing buttons ko ek HTML page pe compile karein aur har ek ke 3-4 naye variations banake Rajat se approve karwayein.

## 9. Add Food Form

- ✅ **AF-01 🔴 Form empty submit ho jata hai, validations missing hain:**
  - **Solution:** Food Title, Image URL, Protein etc. required fields pe validation lagayein. Empty submit rok ke error msg show karein.
- ✅ **AF-02 🔵 "Meal Serving" aur buttons ke beech me ek extra divider hai:**
  - **Solution:** Us divider ko remove karein.

## 10. AI Food Upload

- ✅ **AIF-01 🟡 Status chips ki design incorrect hai:**
  - **Solution:** CC-1 rule ke hisaab se chips fix karein.
- ✅ **AIF-02 🔴 Duplicate handling missing hai:**
  - **Solution:** Jab generated image pehle se ho, toh 2 options dein: Ya to update karein, ya phir us existing ko delete karein.
- ✅ **AIF-03 🔴 Generated item ko delete karne ka option nahi hai:**
  - **Solution:** "Delete generated" ka button add karein taaki irrelevant images reject ki jaa sakein.
- ✅ **AIF-04 🔵 UI layout ulta hai (Photo left, content right):**
  - **Solution:** Isko reverse karein: Content left me, aur Photo right me rakhein.

## 11. Blog Management → Manage Category

- ✅ **BC-01 🟡 Heading/subheading sizes bohot chote hain:**
  - **Solution:** Inka size badha kar KAM panel se match karein (CC-2).
- ✅ **BC-02 🔵 Icon upload UI intuitive nahi hai:**
  - **Solution:** Heading ko "Category Icon" rename karein. Agar icon hai toh cross (remove/re-upload) button dein.

## 12. Blog Management → Manage Blog

- ✅ **BB-01 🟡 Same heading/subheading size issue:**
  - **Solution:** Sizes ko theek karein.
- ✅ **BB-02 🟡 "Replace feature image" UI problem hai:**
  - **Solution:** Same as BC-02, ise redesign karein.
- ✅ **BB-03 🔴 Text editor me dev placeholder ("press ⌘0 for help") show ho raha hai:**
  - **Solution:** Ye placeholder text UI se hata dein.
- ✅ **BB-04 🔵 Editor ki height bahut kam hai:**
  - **Solution:** Text editor ke content area ki height double (2x) karein.

## 13. Subscription Management

- ✅ **SM-01 🟡 Dashboard issues:**
  - **Solution:** Section 2 ke saare fixes yaha bhi apply karein.
- **SM-02 Products:** Fine, no change.
- ✅ **SM-03 🔴 "inconsistent state" text dikh raha hai (Priya Sharma row):**
  - **Solution:** Is warning/text ko immediately remove karein.
- ✅ **SM-04 🟡 Subscribers column order galat hai:**
  - **Solution:** Order karein: Serial → Subscriber Name → Email → Plan → Status → Started → Expired → Action. Sath hi email icon add karein.
- ✅ **SM-05 🔴 Transactions me row tap karne pe redirect ho raha hai:**
  - **Solution:** Row-tap behavior hata dein kyunki "View User" ka option Action column me already hai.

## ✅ 14. Privacy Content Management

- **Solution:** No issues here.

## 15. Notification Management

- ✅ **NM-01 🟡 Email/message history table me minor issues hain:**
  - **Solution:** KAM se match karne ke liye tables ko clean up karein.
- ✅ **NM-02 🟡 Campaign-history overview card match nahi kar raha:**
  - **Solution:** Is card ka style KAM ki tarah banayein.
- ✅ **NM-03 🟡 Channel chip ("email") ki design kharab hai:**
  - **Solution:** CC-1 rule se chips update karein.

## 16. Account / Settings

- ✅ **AC-01 🔴 User account page pe KAM ke cover image, dummy name aur data hai:**
  - **Solution:** Ye dummy data (John Doe, etc) real data se replace karein (CC-6).
- ✅ **AC-02 🟡 Confirm-password field me kuch issues ho sakte hain:**
  - **Solution:** Review karein aur is field ko fix karein.
- ✅ **AC-03 🟡 "Account Setting" ka option menu me galat jagah hai:**
  - **Solution:** Ise user/account item ke neeche properly align karein.

## ✅ 17. User Detail / View Profile Page

- ✅ **VP-01 🟡 "User Directory / Profile View" breadcrumb missing hai:**
  - **Solution:** Ye breadcrumb top pe add karein.
- ✅ **VP-02 🟡 User ID right side se missing hai:**
  - **Solution:** Breadcrumb ke aage right side pe User ID dikhayein.
- ✅ **VP-03 🔵 Profile picture nahi hai:**
  - **Solution:** Initials wala placeholder laga dein.
- ✅ **VP-04 🟡 Header meta me galat info dikh rahi hai:**
  - **Solution:** Isko KAM jaisa banayein: status (active), plan (free), joined, updated at.
- ✅ **VP-05 🟡 Tab-bar chips achhe nahi lag rahe:**
  - **Solution:** KAM tab-bar style follow karein.
- ✅ **VP-06 🔵 "Overall" cards bohot basic dikh rahe hain:**
  - **Solution:** Inhe redesign karein taaki standard premium/KAM quality ka lage.
- ✅ **VP-07 🔴 Recent Activity me icons alag nahi dikh rahe aur "0 steps logged" entries bhi hain:**
  - **Solution:** Icons me color differentiation dein aur 0-step wale logs ko hide karein.
- ✅ **VP-08 🔵 Fit-Zone Activity me divider hai:**
  - **Solution:** Snapshot aur plan ke beech ka divider remove karein.
- ✅ **VP-09 🔵 Active Program me "Active" chip redundant hai:**
  - **Solution:** Us chip ko hata dein.
- ✅ **VP-10 🔵🔬 Overview basic hai (Research task):**
  - **Solution:** Email, phone jaise account connectivity info dikhayein. Aur kya add kar sakte hain, uski research karke options pehle bhejein.
- ✅ **VP-11 🔵 Health & Goal / Body Measurement / BMI:** Fine.
- ✅ **VP-12 🔵 Daily Target (water, calorie, steps) ka design poor hai:**
  - **Solution:** Naye behtar designs propose karein.
- ✅ **VP-13 🔴 Macro split (protein/carbs/fat) me color blend ho rahe hain:**
  - **Solution:** Accent palette ka use karke inhe visually distinct banayein.
- ✅ **VP-14 🔵 Fitness profile me har section ke baad divider hai:**
  - **Solution:** Ye saare dividers remove karein.
- ✅ **VP-15 🟡 Snapshot card me icon missing hai:**
  - **Solution:** Right side pe icon add karein jaisa pichle design me tha.
- ✅ **VP-16 🔴 Account card → Settings KAM se match nahi karte:**
  - **Solution:** KAM check karke ise puri tarah rework karein.
- ✅ **VP-17 🔴 Transaction and Settings ka design bhi KAM se alag hai:**
  - **Solution:** Ise bhi puri tarah redesign karke KAM standard ka banayein.

## 20 & 21. Definition of Done & QA Checklist

- **Checklist (Kisko kya karna hai?):**
  - **Developers (Frontend/Backend):** Koi bhi screen "done" bolne se pehle har ek screen check karein ki koi dummy data na ho, filters/buttons working ho, forms pe validations hon, aur screens ko KAM panel se directly compare kiya gaya ho.
  - **Rajeev (QA Sign-off):** Har screen physically open karke upar ki list cross-check karein. Bina test kiye "No issues" ka tag dena avoid karein, honesty se sab check karein.
  - **Rule:** Sabse pehle 🔴 [DEFECT] fix honge, fir approvals (D-11, DM-04), uske baad 🟡 [CONSISTENCY] aur end me 🔵 [POLISH]. Koi confusion ho to banane se pehle pooch lein.
