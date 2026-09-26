**Trimify Admin Panel**

**Complete Work Report**

Project: Trimify Admin Panel

Document purpose: To explain the screens and features available in the admin panel.

**Contents**

1. Overview
2. Login and Password Recovery
3. Dashboard
4. Sub Admin Management
5. User Management
6. Program Management
7. Fitzone Management
8. Data Management
9. Blog Management
10. Subscription, Subscribers, and Transactions
11. Notification Management
12. Content Management
13. Admin Account and Security
14. Common Features
15. Summary

**1. Overview**

The Trimify Admin Panel is a single place to manage the main parts of the platform. It includes users, health programs, diet plans, workouts, food data, subscriptions, payments, blogs, FAQs, website content, notifications, and admin accounts.

The panel is built to make daily work simpler. An admin can check important numbers, update content, manage records, and take follow-up actions from the relevant section.

The panel is divided into separate sections so that each type of work stays in the right place. For example, user information is available in User Management, program content is available in Program Management, and payment information is available in Subscription.

The main sections available in the panel are:

- Login and Password Recovery
- Dashboard
- Sub Admin Management
- User Management
- Program Management
- Fitzone Management
- Data Management
- Blog Management
- Subscription
- Notification Management
- Content Management
- Admin Account

Why this structure is useful:

- Each type of work has its own section, so information does not get mixed up.
- It reduces the time needed to find a user, payment, program, or content record.
- It gives a clear flow for daily work: check the dashboard, open the required section, update the record, and review the result.

**2. Login and Password Recovery**

This is the entry point of the admin panel.

Available features:

- Login with email and password
- Forgot-password flow
- Email verification code (OTP)
- New-password setup after verification
- Protected admin screens after login

How it is used:

- Authorised admin users can securely access the panel.
- A forgotten password can be reset through email verification.

Why this feature is included:

- Login keeps the admin panel protected from unauthorised access.
- Password recovery avoids delays when an admin cannot access the account.
- OTP verification adds an extra check before a password is changed.
- Protected routes make sure that panel pages cannot be opened without a valid login.

Screen flow:

1. Enter email address and password on the login screen.
2. Open the dashboard after successful login.
3. If the password is forgotten, select the forgot-password option.
4. Enter the email address and complete the verification-code step.
5. Set a new password and log in again.

Screenshot to include:

- Login screen
- Forgot Password screen

**3. Dashboard**

The Dashboard is the first screen after login. It gives a quick picture of platform activity without opening every section one by one.

Date filters available:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- Last 90 Days
- This Month
- Last Month
- Custom Date Range

Summary cards available:

- Revenue: Total successful payment amount for the selected period
- Total Programs: Programs created during the selected period
- Total Blogs: Blogs created during the selected period
- Fitzone Sessions: Fitzone sessions created during the selected period
- Missed Step Goals: Users who did not log steps in the selected period
- Missed Diet Logs: Users who did not log food/diet in the selected period
- Missed Water Logs: Users who did not log water in the selected period
- Expiring Soon: Active subscriptions that will expire soon

The main cards can show whether a value has increased or decreased compared with the previous similar period.

How the date filter works:

- Select a ready-made range such as Last 7 Days or Last 30 Days for quick reporting.
- Select Custom Date Range when a specific start date and end date are needed.
- Dashboard cards and charts refresh according to the selected period where applicable.
- Some live follow-up items, such as expiring subscriptions, can continue to show the current status because they are based on present action needs.

Alerts and follow-up items available:

- Ghosting Users: Users with no recent health activity
- Content Stagnation: Programs or content that have not been updated recently
- Zero Enrollment: Active programs that have not been assigned to any user
- Quick action links to open the related section

Charts and lists available:

- New-user goal distribution
- New-user gender distribution
- Vegetarian, non-vegetarian, and unspecified preference split
- Signup-to-paid conversion funnel
- Paid users, unpaid users, conversion rate, and drop-off rate
- Daily Active Users trend
- Fitzone user-assignment trend
- Program enrolment/assignment chart
- Recent joined users list
- Unpaid-user follow-up list
- Loading state, empty state, and last-updated indicator

What each dashboard area helps to check:

- Revenue cards help check the amount received from successful payments.
- Missed-log cards help find users who are not recording steps, food, or water.
- Expiring Soon helps find subscriptions that may need renewal follow-up.
- Goal and food-preference charts help understand the type of newly registered users.
- The conversion funnel shows how many new users became paid users.
- The activity chart helps check whether users are using the health-tracking features.
- Program and Fitzone charts help check content assignment activity.
- Recent-user and unpaid-user lists provide a ready list for review.

How it is used:

- Quickly check revenue and payment activity.
- Check whether users are active or missing health logs.
- See subscriptions that need follow-up.
- See which program or content needs attention.

Suggested dashboard review order:

1. Select the required date range.
2. Check revenue and new-content cards.
3. Check missed health logs and subscription-expiry cards.
4. Open any alert that needs action.
5. Review user, conversion, and content charts.
6. Review recent users and unpaid users at the bottom of the dashboard.

Why the Dashboard is important:

- Important data is placed on one screen, so there is no need to open multiple sections for a basic review.
- Revenue data is included to check payment performance for a selected period.
- Missed step, diet, and water data is included to identify users who may not be using health-tracking features.
- Expiring subscription data is included so renewals can be checked before a plan ends.
- Alerts are included to bring attention to inactive users, old content, and programs that are not being assigned.
- User charts are included to understand new-user interests and preferences.
- Conversion data is included to compare new registrations with paid subscriptions.
- Trend charts are included to show change over time instead of only showing one total number.

Screenshots to include:

- Full Dashboard
- Alerts section
- Charts section
- Follow-up table

**4. Sub Admin Management**

This section is used to manage additional admin accounts.

Available features:

- View the sub-admin list
- Add a new sub-admin
- Edit sub-admin details
- Maintain sub-admin account records

How it is used:

- More than one authorised person can work in the panel.
- Sub-admin accounts remain organised in one section.

Screen flow:

1. Open the Sub Admin Management list.
2. Review the existing sub-admin accounts.
3. Use Add Sub Admin to create a new record.
4. Use Edit when account details need to be changed.
5. Return to the list to review the updated record.

Why this feature is included:

- It allows work to be shared between authorised admin accounts.
- Separate sub-admin records make it easier to keep access organised.
- Add and edit options make it possible to keep account information current.

Screenshots to include:

- Sub Admin List
- Add Sub Admin screen
- Edit Sub Admin screen

**5. User Management**

This section contains the main user list and detailed user profiles.

User list features:

- View all users in a table
- Search users using available user details
- Use filters to find the required users
- Pagination for large user lists
- Open an individual user profile

Details available from the user list:

- The list gives a quick starting view of available user records.
- Search helps locate a user without going through every page of the list.
- Filters help focus on the group that needs review.
- Pagination keeps a large number of records easy to browse.
- Opening a profile gives access to detailed user information and actions.

User profile information available:

- Overview: Basic profile summary
- Account: Personal and account information
- Health: Health-related information
- Health Activity: Logged health activity
- Activity: Recent activity timeline
- Programs: Programs assigned to the user
- Transactions: Payment and transaction history
- Settings: User-related settings and actions
- Contact details
- Goals and nutrition details
- Engagement details
- Subscription details
- Recent login details
- Security details

Extra actions available:

- Add or edit Fitzone assignment for a user
- Send a notification from the user profile
- Review subscription information
- Review transaction information

What can be checked in a user profile:

- Basic account and contact information
- Health-related information and health goals
- Recent health and app activity
- Programs assigned to the user
- Fitzone assignment details
- Subscription status and plan details
- Payment and transaction history
- Recent login and security-related information

Suggested user-review flow:

1. Search or filter for the required user.
2. Open the user profile.
3. Start from Overview and Account to confirm basic information.
4. Check Health, Health Activity, and Activity to review engagement.
5. Check Programs and Fitzone details to review assigned content.
6. Check Subscription and Transactions for plan and payment information.
7. Use notification or assignment actions when follow-up is needed.

Why this section is important:

- User data is kept in one detailed profile so the admin does not need to search in different sections for basic information.
- Health and activity information is included to understand whether a user is using the app features.
- Program and Fitzone information is included to check what content has been assigned to a user.
- Subscription and transaction information is included to check the user's plan and payment history.
- Recent login and security information is included to help review account-related activity.
- Profile-level actions are included so follow-up can be done for one user directly from the same screen.

How it is used:

- Check a user's complete information in one place.
- Check health activity, assigned content, subscription status, and payments.
- Take user-specific actions when needed.

Screenshots to include:

- User List
- User Overview
- User Programs
- User Transactions

**6. Program Management**

This section is used to create and maintain wellness programs.

Program features:

- View the program list
- Add a new program
- Edit an existing program
- Open program details
- Edit the program introduction and details
- View users assigned to a program

Food and diet plan features inside a program:

- Add food categories
- Edit food categories
- Add and manage food items under a category
- Manage the food part of a program
- View diet plans
- Add a diet plan
- Edit a diet plan

Program structure:

1. Program: The main wellness program record.
2. Introduction and details: The program description and main information.
3. Food categories: Groups used to organise program food content.
4. Food items: Individual food items inside a category.
5. Diet plans: Diet-related plans created for the program.
6. Assigned users: Users who are linked with the program.

How it is used:

- Create and update wellness programs.
- Keep food categories, food items, and diet plans connected to the correct program.
- Review which users are assigned to a program.

Suggested program-management flow:

1. Open the Program List.
2. Add a new program or open an existing one.
3. Update the introduction and program details.
4. Add food categories if required.
5. Add food items under the correct category.
6. Add or update diet plans.
7. Review program-user assignments.

Why this section is important:

- Programs are kept separate so wellness content can be managed in an organised way.
- Program details and introduction are included to maintain the main information shown for each program.
- Food categories are included to divide food content into clear groups.
- Food items are included under categories so the diet content stays easy to understand and update.
- Diet plans are included to build structured meal-related content for each program.
- Assigned-user information is included to check whether a program is being used by users.

Screenshots to include:

- Program List
- Program Details
- Food Categories
- Food Items
- Diet Plan screen

**7. Fitzone Management**

Fitzone is the workout and fitness-content section.

Fitzone features:

- View the Fitzone list
- Add a new Fitzone
- Edit Fitzone details
- Open detailed Fitzone information
- Edit Fitzone introduction and details
- Select and assign users where required

Category and workout-session features:

- View Fitzone categories
- Add a category
- Edit a category
- View workout sessions
- Add a workout session
- Edit a workout session

Fitzone structure:

1. Fitzone: The main fitness-content record.
2. Category: A group of related workouts inside a Fitzone.
3. Session: An individual workout session inside a category.

How it is used:

- Workout content is kept in a clear order: Fitzone, category, and session.
- New workout content can be added and existing content can be updated easily.

Suggested Fitzone-management flow:

1. Open the Fitzone List.
2. Add a new Fitzone or open an existing one.
3. Update the introduction and main details.
4. Create or update workout categories.
5. Add or update sessions under the correct category.
6. Use user-assignment options when required.

Why this section is important:

- Fitness content needs its own structure because one workout library can contain many categories and sessions.
- Fitzone is used as the main fitness-content area.
- Categories are included to group similar workout sessions together.
- Sessions are included as the individual workout content that users can receive.
- User assignment is included so the correct fitness content can be linked with the required users.

Screenshots to include:

- Fitzone List
- Fitzone Details
- Category screen
- Session screen

**8. Data Management**

This section is used for food and nutrition data.

Nutrition Food features:

- View nutrition food records
- Add a new nutrition record
- Edit an existing nutrition record
- Search and manage food data through the listing screen

AI Food Upload features:

- Upload food data through the AI food workflow
- Enter or update the food name
- Use an image prompt panel where needed
- View the upload/result details
- Regenerate food information when required
- Check the processing status through the upload flow

Details of the AI food-upload flow:

1. Start a food upload.
2. Enter the food name and related input details.
3. Add image-prompt details when needed.
4. Wait for the food-processing result.
5. Open the result-detail screen to review the information.
6. Use regenerate if the information needs to be generated again.

How it is used:

- Maintain the food database from one place.
- Process and review AI food data before it is used in the platform.

Suggested nutrition-management flow:

1. Use Nutrition Food to check or update existing food records.
2. Use Add Nutrition to create a manual food record.
3. Use AI Food Upload when food information is being processed through the AI workflow.
4. Review the result before using the food information further.

Why this section is important:

- Nutrition data is needed to maintain the food information used in the platform.
- Add and edit options are included because food values and records may need updates over time.
- Search is included because a food database can grow large and records must be found quickly.
- AI Food Upload is included to support a faster food-data processing flow.
- Result review and regenerate options are included so the generated food information can be checked before use.

Screenshots to include:

- Nutrition Food List
- Add Nutrition form
- AI Food Upload
- AI Food Detail screen

**9. Blog Management**

This section is used to maintain blogs shown in the platform.

Category features:

- View blog categories
- Add a category
- Edit a category

Blog features:

- View blog posts
- Add a new blog post
- Edit an existing blog post
- Connect blog posts with the required category

Suggested blog-management flow:

1. Create a category first if a required category is not available.
2. Open Manage Blogs.
3. Add a new post or open an existing post for editing.
4. Select the correct category and update the post information.
5. Return to the blog list to review the record.

Why this section is important:

- Blog content is included to share useful health, wellness, and platform-related information.
- Categories are included to keep blog posts organised and easier to browse.
- Add and edit options are included so content can be maintained without changing application code.

How it is used:

- Blog content can be added and updated without changing application code.

Screenshots to include:

- Blog Category List
- Blog List
- Add/Edit Blog screen

**10. Subscription, Subscribers, and Transactions**

This section brings subscription and payment information together.

Subscription dashboard features:

- Subscription overview cards
- Revenue trend chart
- Subscriber growth chart
- Plan distribution chart
- Top-selling plans
- Recent transaction list

Plan features:

- View subscription plans
- Edit subscription-plan details

Subscriber features:

- View subscriber list
- Search and filter subscriber records
- Upgrade a subscriber plan
- Revoke a subscriber when required
- Export subscriber data as a CSV file

Transaction features:

- View transaction list
- Search and filter transactions
- Revoke a transaction when required
- Export transaction data as a CSV file

What can be checked in this section:

- Revenue movement over time
- Number of subscribers and subscriber growth
- Which plans are selling more
- Recent payment records
- Subscriber plan changes
- Transaction records that need review

Suggested subscription-review flow:

1. Open the Subscription Dashboard for the main overview.
2. Review revenue, growth, plan distribution, and recent transactions.
3. Open Plans to review or edit plan details.
4. Open Subscribers to search, filter, upgrade, revoke, or export subscriber data.
5. Open Transactions to search, filter, revoke, or export transaction data.

Why this section is important:

- Subscription plans are included because paid access needs to be managed clearly.
- Subscriber data is included to see who is using a paid plan and what plan they have.
- Transaction data is included to review payment records and payment activity.
- Revenue and growth charts are included to show changes over time.
- Plan distribution and top-selling-plan data are included to understand which plans are being selected more often.
- Upgrade and revoke actions are included to manage plan changes and account situations when needed.
- CSV export is included so records can be used outside the panel for reporting or review.

How it is used:

- Review subscription plans and subscriber records.
- Check revenue movement and recent payments.
- Export subscriber or transaction information when required.

Screenshots to include:

- Subscription Dashboard
- Plans
- Subscribers
- Transactions

**11. Notification Management**

This section is used for notification campaigns and notification tracking.

Available features:

- Create and manage notification campaigns
- View campaign history
- View campaign delivery logs
- Check notification-related records

How it is used:

- Send reminders, updates, and engagement messages.
- Check what was sent through campaign history and delivery logs.

Suggested notification flow:

1. Open Notification Management.
2. Create or review a notification campaign.
3. Check campaign history for previous campaigns.
4. Open delivery logs to review delivery information.

Why this section is important:

- Notifications are included to send reminders, updates, and engagement messages to users.
- Campaigns are included so communication can be organised instead of sending messages one by one.
- Campaign history is included to check what has already been sent.
- Delivery logs are included to review the delivery result of a campaign.

Screenshots to include:

- Notification Campaign screen
- Campaign History
- Delivery Logs

**12. Content Management**

Content Management includes FAQ and CMS pages.

FAQ Management features:

- View FAQ records
- Add FAQ content
- Edit FAQ content
- Maintain frequently asked questions in one place

CMS Management features:

- Open the CMS management screen
- Update the About Us page
- Update the Privacy Policy page
- Update the Terms and Conditions page

Suggested content-management flow:

1. Open FAQ Management to add, update, or review frequently asked questions.
2. Open CMS Management for website-content pages.
3. Select About Us, Privacy Policy, or Terms and Conditions.
4. Update the required content and save the changes.

Why this section is important:

- FAQs are included to keep common questions and answers available in one place.
- CMS pages are included because About Us, Privacy Policy, and Terms and Conditions may need content updates.
- This section reduces dependency on code changes for normal website-content updates.

How it is used:

- Update common website information from the panel.
- Small content updates do not need application-code changes.

Screenshots to include:

- FAQ List/Form
- CMS page screen

**13. Admin Account and Security**

This section is for the logged-in admin account.

Available features:

- View admin profile information
- Update name
- Update email address
- Update password
- View and manage security credentials
- Update profile details through the edit dialog

How it is used:

- Keep account details current.
- Update login security details when needed.

Suggested account-settings flow:

1. Open the Admin Account page.
2. Review the current profile details.
3. Update name or email when required.
4. Update the password through the password section.
5. Review security credentials and save the required changes.

Why this section is important:

- Profile details are included so the admin account information can stay correct.
- Email update is included because the login or communication email may change.
- Password update is included to maintain account security.
- Security details are included to keep account-related access information in one place.

Screenshots to include:

- Admin Account page
- Password/Security screen

**14. Common Features Across the Panel**

The following features are used across many sections of the panel:

- Search
- Filters
- List and table views
- Pagination
- Add and edit forms
- Detail pages
- Status badges
- Confirmation dialogs for sensitive actions
- Loading states while data is being fetched
- Empty states when no data is available
- Error handling for failed requests
- Responsive layout for different screen sizes

These common features make the panel easier to use:

- Search and filters reduce the time needed to find records.
- Pagination keeps large lists organised.
- Add and edit forms provide a clear way to maintain data.
- Status badges show the current state of a record at a glance.
- Confirmation dialogs help prevent accidental sensitive actions.
- Loading, empty, and error states make it clear what is happening on the screen.

Why these common features are important:

- Search, filters, and pagination make large data lists easier to use.
- Forms make data entry and updates more consistent.
- Status badges make important record states easier to notice.
- Confirmation dialogs reduce the chance of accidental changes.
- Loading, empty, and error states give clear feedback while the panel is working with data.
- Responsive layout helps the panel stay usable on different screen sizes.

**15. Summary**

The Trimify Admin Panel now covers the main daily work needed to run the platform:

- User records and user activity
- Health programs, diets, foods, and workouts
- Nutrition data and AI food processing
- Subscriptions, subscribers, and transactions
- Revenue, trends, and follow-up information
- Blogs, FAQs, and website pages
- Notification campaigns
- Admin accounts and access-related actions

The panel keeps these tasks in organised sections, so information is easier to find and updates can be made from one system.

This report can be used as the base document for a Notion page, PDF report, or presentation. Add the real screenshot below each relevant section to make the final document complete.

**How to use this report in Notion, PDF, or a presentation**

For each section, keep this simple order:

1. Screen name
2. Screenshot
3. Features available on that screen
4. One short line explaining how the screen is used

Use only real screenshots from the live panel. Keep the same heading style throughout the document.
