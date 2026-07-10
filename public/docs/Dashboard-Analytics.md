# Trimify Admin — Dashboard Analytics Specification

> **Version:** 1.0.0 &nbsp;|&nbsp; **Last Updated:** 2026-07-10 &nbsp;|&nbsp; **Based on:** `APIs.md` & `APIs2.md`

---

## Table of Contents

1. [Dashboard Overview](#1-dashboard-overview)
2. [Target Users](#2-target-users)
3. [Dashboard Layout](#3-dashboard-layout)
4. [KPI Cards](#4-kpi-cards)
5. [Charts & Analytics](#5-charts--analytics)
6. [Dashboard Widgets](#6-dashboard-widgets)
7. [Filters & Time Controls](#7-filters--time-controls)
8. [Analytics & Business Insights](#8-analytics--business-insights)
9. [API Mapping](#9-api-mapping)
10. [Future Enhancements](#10-future-enhancements)
11. [UI/UX Recommendations](#11-uiux-recommendations)
12. [Technical Recommendations](#12-technical-recommendations)

---

## 1. Dashboard Overview

### Purpose

The **Trimify Admin Dashboard** is the central command hub for all administrators managing the Trimify health & fitness platform. It provides a real-time, at-a-glance view of the platform's operational health, content ecosystem, user activity, and financial performance — all without requiring the admin to navigate through individual management screens.

### Why Analytics Matter

An admin dashboard without analytics is just a navigation menu. Analytics transform raw data into **actionable intelligence**:

- Spot user growth trends before they plateau.
- Identify which content categories (blogs, programs, fiitzones) are growing.
- Track transaction revenue and subscription adoption.
- Detect imbalances — e.g., too many inactive content records or SubAdmins.
- Enable data-driven decisions rather than guesswork.

### What an Admin Should Understand at a Glance

Upon loading the dashboard, the admin should immediately answer:

| Question | Answered By |
|---|---|
| How many users are on the platform? | Users Count KPI |
| How many sub-admins are managing the system? | SubAdmin Count KPI |
| How many programs are active? | Programs Count KPI |
| How many blogs have been published? | Blog Count KPI |
| How many Fitzone sessions are live? | Fitzone Sessions KPI |
| What's the latest transaction activity? | Transactions Widget |
| Which sub-admins were added recently? | SubAdmin Widget |
| Are there pending inactive content items? | Status Distribution Chart |
| How are users growing month over month? | User Growth Chart *(Future)* |

---

## 2. Target Users

| Role | Dashboard Access Level | Primary Interests |
|---|---|---|
| **Super Admin / Admin** | Full access — all KPIs, charts, widgets, financial data | Platform health, user growth, revenue |
| **Sub-Admin (Manager)** | Limited — assigned users, programs, fitzone data | Content management, user assignments |
| **Content Manager** | Content-focused — blogs, programs, FAQs, CMS pages | Publishing trends, content status |

> **Note:** Role-based dashboard views should be considered a future enhancement; the current API does not expose role-based filtering on dashboard endpoints.

---

## 3. Dashboard Layout

The dashboard is structured in **7 logical sections**, arranged top-to-bottom with responsive grid behavior.

```
+---------------------------------------------------------------------+
|  SECTION 1 — Welcome Header                                          |
|  Admin name, current date/time, quick logout / profile actions       |
+---------------------------------------------------------------------+
|  SECTION 2 — KPI Cards (Horizontal scrollable row)                   |
|  [ Users ] [ SubAdmins ] [ Blogs ] [ Programs ] [ Fitzone Sessions ] |
+-----------------------------------+---------------------------------+
|  SECTION 3 — Charts & Analytics   |  SECTION 4 — Recent Activity     |
|  Primary charts (left, 2/3 width) |  Right sidebar (1/3 width)       |
|  - Content Distribution Donut     |  - Recent Transactions           |
|  - Status Overview Bar Chart      |  - Recently Added SubAdmins      |
+-----------------------------------+---------------------------------+
|  SECTION 5 — Latest Records (3-column grid)                          |
|  [ Recent Blogs ] [ Recent Programs ] [ Recent Fitzone Sessions ]    |
+---------------------------------------------------------------------+
|  SECTION 6 — Quick Actions                                           |
|  Add Blog | Add Program | Add Fitzone | Add SubAdmin | Send Notif.   |
+---------------------------------------------------------------------+
|  SECTION 7 — Performance Insights (Subscription & Transactions)      |
|  Subscription Plans Overview | Recent Transactions Table             |
+---------------------------------------------------------------------+
```

### Section Descriptions

| # | Section | Purpose |
|---|---|---|
| 1 | **Welcome Header** | Personalizes the experience; shows admin name, role, current time, and quick-access shortcuts |
| 2 | **KPI Cards** | Instant numeric summary of platform-wide counts — highest information density in minimal space |
| 3 | **Charts & Analytics** | Visual representation of data distributions and status breakdowns for trend awareness |
| 4 | **Recent Activity** | Scrollable feeds of the most recent records (transactions, sub-admins) for operational monitoring |
| 5 | **Latest Records** | Three-column content preview showing latest blogs, programs, and fitzone sessions |
| 6 | **Quick Actions** | One-click navigation shortcuts to frequently used create/add operations |
| 7 | **Performance Insights** | Financial and subscription data for revenue tracking |

---

## 4. KPI Cards

KPI Cards are the most prominent dashboard element — they communicate total counts immediately on load.

---

### KPI-01 · Total Registered Users

| Attribute | Value |
|---|---|
| **KPI Name** | Total Users |
| **Description** | Total number of application users registered on the Trimify platform |
| **Data Source API** | `GET /admin/userscount` → `usersCount` |
| **Fallback API** | `GET /admin/users` → `pagination.total` |
| **Refresh Strategy** | On page load; manual refresh button |
| **Icon Recommendation** | UsersIcon / PeopleRounded |
| **Color Theme** | Blue / Indigo |
| **Priority** | High |

**Why it matters:** Users are the core asset of the platform. Tracking total users shows overall platform reach and adoption.

---

### KPI-02 · Total Sub-Admins

| Attribute | Value |
|---|---|
| **KPI Name** | Total Sub-Admins |
| **Description** | Number of sub-administrators currently managing the platform under the main admin |
| **Data Source API** | `GET /admin/dashboard` → `subadminCount` |
| **Fallback API** | `GET /admin/view-subadmin` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | AdminPanelSettingsRounded |
| **Color Theme** | Purple / Violet |
| **Priority** | High |

**Why it matters:** Knowing how many sub-admins are active helps the super admin track delegation and system access.

---

### KPI-03 · Total Blog Posts

| Attribute | Value |
|---|---|
| **KPI Name** | Total Blogs |
| **Description** | Total number of blog posts created and stored on the platform |
| **Data Source API** | `GET /admin/blog` → `count` |
| **Fallback API** | `GET /admin/view-blog` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | ArticleRounded |
| **Color Theme** | Green / Emerald |
| **Priority** | High |

**Why it matters:** Blogs drive user engagement. Knowing total count helps content managers track publishing velocity.

---

### KPI-04 · Total Programs

| Attribute | Value |
|---|---|
| **KPI Name** | Total Programs |
| **Description** | Total number of health and fitness programs available on the platform |
| **Data Source API** | `GET /admin/manageprogram` → `count` |
| **Fallback API** | `GET /admin/view-programs` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | FitnessCenterRounded |
| **Color Theme** | Orange / Amber |
| **Priority** | High |

**Why it matters:** Programs are the primary product offering. Total count indicates service depth.

---

### KPI-05 · Total Fitzone Sessions

| Attribute | Value |
|---|---|
| **KPI Name** | Fitzone Sessions |
| **Description** | Total number of workout sessions created across all Fitzone entries |
| **Data Source API** | `GET /admin/fitzonesession` → `count` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | BoltRounded / DirectionsRunRounded |
| **Color Theme** | Red / Rose |
| **Priority** | High |

**Why it matters:** Sessions define the granular workout content. High session counts indicate a rich content library.

---

### KPI-06 · Total Fitzone Entries

| Attribute | Value |
|---|---|
| **KPI Name** | Total Fitzone Zones |
| **Description** | Total number of Fitzone entries (workout zones) available |
| **Data Source API** | `GET /admin/view-fitzone` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | SportsGymnasticsRounded |
| **Color Theme** | Teal / Cyan |
| **Priority** | Medium |

---

### KPI-07 · Total FAQs

| Attribute | Value |
|---|---|
| **KPI Name** | Total FAQs |
| **Description** | Total number of FAQ entries in the knowledge base |
| **Data Source API** | `GET /admin/view-faqs` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | HelpRounded |
| **Color Theme** | Yellow / Sunflower |
| **Priority** | Medium |

**Why it matters:** FAQs reduce support load. Tracking growth shows how well the knowledge base is maintained.

---

### KPI-08 · Total Blog Categories

| Attribute | Value |
|---|---|
| **KPI Name** | Blog Categories |
| **Description** | Total number of blog category taxonomies |
| **Data Source API** | `GET /admin/get-blogcategories` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | LabelRounded |
| **Color Theme** | Slate / Gray |
| **Priority** | Low |

---

### KPI-09 · Total Nutrition / Meal Records

| Attribute | Value |
|---|---|
| **KPI Name** | Nutrition Records |
| **Description** | Total number of nutrition/meal records in the diet database |
| **Data Source API** | `GET /admin/nutrition` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | RestaurantMenuRounded |
| **Color Theme** | Lime / Chartreuse |
| **Priority** | Medium |

**Why it matters:** The nutrition database powers diet plans. A larger database means more diverse meal planning options.

---

### KPI-10 · Total Transactions

| Attribute | Value |
|---|---|
| **KPI Name** | Total Transactions |
| **Description** | Total number of payment transactions processed on the platform |
| **Data Source API** | `GET /admin/transactions` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | PaymentsRounded |
| **Color Theme** | Gold / Amber |
| **Priority** | High |

**Why it matters:** Transactions represent revenue events. Total count indicates business activity volume.

---

### KPI-11 · Total Subscription Plans

| Attribute | Value |
|---|---|
| **KPI Name** | Subscription Plans |
| **Description** | Number of subscription plan tiers available to users |
| **Data Source API** | `GET /admin/subscription` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | StarRounded |
| **Color Theme** | Purple / Magenta |
| **Priority** | Medium |

---

### KPI-12 · Total Notifications Sent

| Attribute | Value |
|---|---|
| **KPI Name** | Notifications Sent |
| **Description** | Total push notifications dispatched to users by the admin |
| **Data Source API** | `GET /admin/get-notification` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | NotificationsRounded |
| **Color Theme** | Sky / Light Blue |
| **Priority** | Low |

---

### KPI-13 · Active vs. Inactive Sub-Admins

| Attribute | Value |
|---|---|
| **KPI Name** | Active Sub-Admins |
| **Description** | Count of sub-admins with `status: "Active"` vs. `status: "Inactive"` |
| **Data Source API** | `GET /admin/view-subadmin` → filter `subAdmins[].status` |
| **Refresh Strategy** | On page load (client-side filter from list response) |
| **Icon Recommendation** | CheckCircleRounded |
| **Color Theme** | Green for Active, Red for Inactive |
| **Priority** | Medium |

**Why it matters:** Inactive sub-admins may represent security risks or unused seats. Monitoring active/inactive ratio ensures clean access control.

---

### KPI-14 · CMS Pages Count

| Attribute | Value |
|---|---|
| **KPI Name** | CMS Pages |
| **Description** | Total number of CMS static pages (e.g., Terms, Privacy Policy) |
| **Data Source API** | `GET /admin/get_pages` → `pagination.total` |
| **Refresh Strategy** | On page load |
| **Icon Recommendation** | DescriptionRounded |
| **Color Theme** | Neutral / Gray |
| **Priority** | Low |

---

## 5. Charts & Analytics

Charts transform numeric KPIs into visual patterns that reveal trends, distributions, and anomalies.

---

### Chart-01 · Content Distribution — Doughnut Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Doughnut Chart |
| **Purpose** | Show the proportional distribution of all content types on the platform |
| **Data Source** | Multiple dashboard count APIs |
| **Segments** | Blogs, Programs, Fitzone Zones, FAQs, CMS Pages, Nutrition Records |
| **Interaction** | Hover tooltip showing exact count and percentage; click to navigate to that module |
| **Position** | Top-left of charts section |
| **Library Suggestion** | Chart.js / Recharts / ApexCharts |

**Data Source Mapping:**

| Segment | API | Field |
|---|---|---|
| Blogs | `GET /admin/blog` | `count` |
| Programs | `GET /admin/manageprogram` | `count` |
| Fitzone Zones | `GET /admin/view-fitzone` | `pagination.total` |
| FAQs | `GET /admin/view-faqs` | `pagination.total` |
| CMS Pages | `GET /admin/get_pages` | `pagination.total` |
| Nutrition Records | `GET /admin/nutrition` | `pagination.total` |

**Why it's useful:** Instantly shows which content type dominates the platform and helps identify under-represented areas.

---

### Chart-02 · Sub-Admin Status Distribution — Horizontal Bar Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Horizontal Bar Chart / Stacked Bar |
| **Purpose** | Visualize the ratio of Active vs. Inactive sub-admins |
| **Data Source** | `GET /admin/view-subadmin` → iterate `subAdmins[].status` |
| **X-Axis** | Count |
| **Y-Axis** | Status Category (Active, Inactive) |
| **Interaction** | Hover tooltip with exact count |
| **Color Coding** | Active = Green, Inactive = Red |

**Why it's useful:** Quickly identifies the operational health of sub-admin accounts.

---

### Chart-03 · Blog Visibility Status — Pie Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Pie Chart |
| **Purpose** | Show the split between Public and Private blog posts |
| **Data Source** | `GET /admin/view-blog` → iterate `blogs[].visibility_status` |
| **Segments** | Public, Private |
| **Interaction** | Hover tooltip; click to filter blog list |
| **Color Coding** | Public = Teal, Private = Slate |

**Why it's useful:** Content managers need to know how much content is publicly available vs. kept private.

---

### Chart-04 · Blog Active vs. Inactive — Doughnut Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Doughnut Chart |
| **Purpose** | Show published (Active) vs. unpublished (Inactive) blog posts |
| **Data Source** | `GET /admin/view-blog` → iterate `blogs[].status` |
| **Segments** | Active, Inactive |
| **Interaction** | Hover for count and percentage |
| **Color Coding** | Active = Emerald, Inactive = Amber |

---

### Chart-05 · Program Status Overview — Stacked Bar Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Stacked Bar Chart |
| **Purpose** | Show Active vs. Inactive programs, and whether unapproved foods are visible |
| **Data Source** | `GET /admin/view-programs` → iterate `programs[].status` and `programs[].is_approve_nonapproved_foods_show` |
| **X-Axis** | Status Category |
| **Y-Axis** | Count |
| **Interaction** | Hover tooltip with breakdown |

**Why it's useful:** Health programs are core products — understanding how many are live vs. inactive matters greatly.

---

### Chart-06 · Meal Type Distribution — Polar Area Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Polar Area Chart |
| **Purpose** | Show the distribution of nutrition records by meal type (Breakfast, Lunch, Dinner, Snack, etc.) |
| **Data Source** | `GET /admin/nutrition` → iterate `nutrition[].Meal_Type` |
| **Segments** | One per unique `Meal_Type` |
| **Interaction** | Hover for count per type |
| **Color Coding** | Distinct colors per meal type |

**Why it's useful:** Diet plan creators benefit from seeing which meal types are well-stocked vs. underrepresented in the nutrition database.

---

### Chart-07 · FAQ Status Distribution — Bar Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Vertical Bar Chart |
| **Purpose** | Show Active vs. Inactive FAQ entries |
| **Data Source** | `GET /admin/view-faqs` → iterate `faqs[].status` |
| **X-Axis** | Status (Active, Inactive) |
| **Y-Axis** | Count |
| **Interaction** | Hover tooltip |

---

### Chart-08 · Transaction Amount Over Time — Area Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Area Chart (timeline) |
| **Purpose** | Show transaction amounts plotted over time |
| **Data Source** | `GET /admin/transactions` → `transactions[].amount` and `transactions[].created_at` |
| **X-Axis** | Date (`created_at`) |
| **Y-Axis** | Amount (numeric, currency) |
| **Time Filters** | Last 7 Days, Last 30 Days, This Month, This Year |
| **Interaction** | Hover tooltip showing transaction ID, amount, user, plan |
| **Limitation** | The API does not support date-range filtering; client-side filtering required on the paginated result set |

**Why it's useful:** Revenue trend visualization is critical for business health assessment.

---

### Chart-09 · Revenue by Subscription Plan — Doughnut Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Doughnut Chart |
| **Purpose** | Show how revenue is distributed across subscription plans |
| **Data Source** | `GET /admin/transactions` → group by `plan.name`, sum `amount` |
| **Segments** | One slice per subscription plan |
| **Interaction** | Hover to see plan name, transaction count, total amount |

---

### Chart-10 · Fitzone Session Status — Horizontal Bar Chart

| Attribute | Value |
|---|---|
| **Chart Type** | Horizontal Bar Chart |
| **Purpose** | Show Active vs. Inactive Fitzone sessions per Fitzone zone |
| **Data Source** | `GET /admin/view-fitzone` + `GET /admin/fitzone-session/{id}` per zone |
| **X-Axis** | Session count |
| **Y-Axis** | Fitzone name |
| **Interaction** | Click on bar to drill into that Fitzone's sessions |

---

## 6. Dashboard Widgets

Widgets are live-updating mini-panels that display the most recent or most important records.

---

### Widget-01 · Recent Transactions

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/transactions` |
| **Records Shown** | Latest 5–10 transactions |
| **Sort Order** | `created_at` DESC (most recent first) |
| **Fields Displayed** | `transaction_id`, `user.name`, `plan.name`, `amount`, `status`, `created_at` |
| **Status Badges** | `Success` = Green badge, `Failed` = Red badge, `Pending` = Yellow badge |
| **"View All" Link** | Navigates to full Transactions Management page |
| **Pagination** | No — shows fixed number with "View All" |
| **Invoice Action** | Click to open `invoice_url` in a new tab |

**Why it's useful:** Financial activity needs immediate visibility. Admins can spot failed transactions and take action quickly.

---

### Widget-02 · Recently Added Sub-Admins

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/dashboard` → `subadmin[]` or `GET /admin/view-subadmin` sorted by `created_at` |
| **Records Shown** | Latest 5 sub-admins |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | `name`, `email`, `designation`, `hospital`, `status`, `created_at` |
| **Status Indicator** | Active = green dot, Inactive = gray dot |
| **"View All" Link** | Navigates to Sub-Admin Management page |

---

### Widget-03 · Recent Blog Posts

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/view-blog` |
| **Records Shown** | Latest 5 blog posts |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | Blog thumbnail (`image`), `title`, `category.title`, `status`, `visibility_status`, `created_at` |
| **Status Badges** | Active/Inactive, Public/Private |
| **"View All" Link** | Navigates to Blog Management page |
| **Quick Actions** | Toggle visibility, Edit link |

---

### Widget-04 · Recent Programs

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/view-programs` |
| **Records Shown** | Latest 5 programs |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | Program thumbnail (`image`), `title`, `duration`, `status`, `created_at` |
| **"View All" Link** | Navigates to Program Management page |
| **Quick Actions** | Edit, Toggle status |

---

### Widget-05 · Recent Nutrition Records

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/nutrition` |
| **Records Shown** | Latest 5 nutrition records |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | `Meal_title`, `Meal_Type`, `Meal_Calories_In_gm`, `Meal_Status` |
| **"View All" Link** | Navigates to Nutrition Management page |

---

### Widget-06 · Recent FAQs

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/view-faqs` |
| **Records Shown** | Latest 5 FAQs |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | `question` (truncated to 80 chars), `status` |
| **"View All" Link** | Navigates to FAQ Management page |

---

### Widget-07 · Recent Notifications Sent

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/get-notification` |
| **Records Shown** | Latest 5 notifications |
| **Sort Order** | `created_at` DESC |
| **Fields Displayed** | `title`, `message` (truncated), `created_at` |
| **"View All" Link** | Navigates to Notification Management page |
| **Quick Action** | "Send New Notification" button |

---

### Widget-08 · Subscription Plans Summary

| Attribute | Value |
|---|---|
| **Data Source** | `GET /admin/subscription` |
| **Records Shown** | All plans (typically small set) |
| **Fields Displayed** | `price`, `features` (truncated), `created_at` |
| **Quick Action** | Edit plan price/features button |
| **"View All" Link** | Navigates to Subscription Management page |

---

## 7. Filters & Time Controls

### Global Dashboard Filters

Time filters should appear at the top of the charts section and affect all widgets and charts simultaneously.

| Filter Label | Description | Equivalent Date Range |
|---|---|---|
| **Today** | Records created today only | `start: today 00:00`, `end: now` |
| **Yesterday** | Records from the previous calendar day | `start: yesterday 00:00`, `end: yesterday 23:59` |
| **Last 7 Days** | Rolling 7-day window | `start: now - 7 days`, `end: now` |
| **Last 30 Days** | Rolling 30-day window | `start: now - 30 days`, `end: now` |
| **This Month** | From the 1st of the current month | `start: month start`, `end: now` |
| **Last Month** | Full previous calendar month | `start: prev month start`, `end: prev month end` |
| **Last Quarter** | Last 3 calendar months | `start: 3 months ago`, `end: now` |
| **This Year** | From January 1st of the current year | `start: year start`, `end: now` |
| **Custom Range** | User-selectable date range picker | User defined |

### Filter Implementation Strategy

> **Important Limitation:** The current Trimify Admin API does **not** support date-range filtering parameters on any list endpoint. All filtering must be performed **client-side** on the paginated dataset.

**Recommended Approach:**

1. On initial dashboard load, fetch the full paginated dataset for each entity (up to `pagination.last_page` pages).
2. Store results in a client-side cache (Redux store or React Context).
3. Apply time filter as a client-side filter function on `created_at` timestamps.
4. Re-render charts and widgets based on the filtered dataset.

**Impact of Filters:**

- KPI card counts update to reflect filtered totals.
- All charts re-render with filtered data.
- Widgets show only records within the selected time window.

> Server-side date filtering is listed as a **Future Enhancement** in Section 10.

---

## 8. Analytics & Business Insights

### 8.1 Currently Supported Insights (From Existing APIs)

#### Platform Content Summary
- **What:** Total count of each content type (blogs, programs, fitzone, FAQs, nutrition)
- **How:** Combine responses from `GET /admin/blog`, `GET /admin/manageprogram`, `GET /admin/fitzonesession`
- **Presented As:** KPI cards + content distribution doughnut chart

#### Sub-Admin Active/Inactive Split
- **What:** How many sub-admins are currently active vs. deactivated
- **How:** `GET /admin/view-subadmin` → count by `status` field
- **Presented As:** Active/Inactive ratio bar chart + KPI sub-cards

#### Blog Public vs. Private Ratio
- **What:** What proportion of blog posts are publicly visible
- **How:** `GET /admin/view-blog` → count by `visibility_status`
- **Presented As:** Pie chart (Public/Private split)

#### Program Active vs. Inactive
- **What:** How many programs are currently live
- **How:** `GET /admin/view-programs` → count by `status`
- **Presented As:** Status bar chart

#### Nutrition Meal Type Breakdown
- **What:** Which meal types (Breakfast, Lunch, Dinner, Snack) are most represented
- **How:** `GET /admin/nutrition` → group by `Meal_Type`
- **Presented As:** Polar area chart

#### Transaction Revenue by Plan
- **What:** Which subscription plan generates the most revenue
- **How:** `GET /admin/transactions` → group by `plan.name`, sum `amount`
- **Presented As:** Doughnut chart + total revenue figure

#### Assigned Users per Program
- **What:** Which programs have the most assigned users
- **How:** `GET /admin/view-programassigneduser/{id}` per program → count `users.length`
- **Limitation:** Requires one API call per program — may be slow with many programs
- **Presented As:** Horizontal bar chart (Top N programs by user count)

---

### 8.2 **FUTURE ENHANCEMENT** — Analytics Not Currently Supported

The following insights require new backend endpoints or modifications to existing ones:

| Insight | Why Not Supported | Required Backend Change |
|---|---|---|
| **User Registration Growth Chart** | No date-grouped user count endpoint | Add `GET /admin/users/growth?period=monthly` |
| **Month-over-Month User Growth %** | No historical user count endpoint | Same as above |
| **Blog Publishing Frequency** | No date-grouped blog count | Add `GET /admin/blogs/trend?period=weekly` |
| **Most Active Sub-Admin** | No action log or sub-admin activity tracking | Add activity logging endpoint |
| **New Users This Month** | No date-filtered user count | Add `from`/`to` params to `/admin/userscount` |
| **Revenue This Month** | No date-filtered transaction amount | Add `from`/`to` params to `/admin/transactions` |
| **Transaction Success Rate** | No aggregated status count | Add `GET /admin/transactions/summary` |
| **Most Popular Fitzone** | No session enrollment count | Add enrollment tracking |
| **Highest Performing Blog** | No view/read count on blogs | Add view analytics to blog model |
| **Content Publishing Velocity** | No time-series data | Add `created_at` grouping to APIs |
| **Week-over-Week Trends** | No time-grouped endpoints | Add aggregation endpoints |

---

## 9. API Mapping

Complete mapping of every dashboard component to its required API endpoint.

| Dashboard Component | Required API | HTTP Method | Response Field | Purpose |
|---|---|---|---|---|
| Total Users KPI | `/admin/userscount` | GET | `usersCount` | Total registered user count |
| Total Sub-Admins KPI | `/admin/dashboard` | GET | `subadminCount` | Total sub-admin count |
| Total Blogs KPI | `/admin/blog` | GET | `count` | Total blog post count |
| Total Programs KPI | `/admin/manageprogram` | GET | `count` | Total program count |
| Total Fitzone Sessions KPI | `/admin/fitzonesession` | GET | `count` | Total fitzone session count |
| Total Fitzone Zones KPI | `/admin/view-fitzone` | GET | `pagination.total` | Total fitzone zone count |
| Total FAQs KPI | `/admin/view-faqs` | GET | `pagination.total` | Total FAQ count |
| Total Blog Categories KPI | `/admin/get-blogcategories` | GET | `pagination.total` | Total blog category count |
| Total Nutrition Records KPI | `/admin/nutrition` | GET | `pagination.total` | Total meal record count |
| Total Transactions KPI | `/admin/transactions` | GET | `pagination.total` | Total transaction count |
| Total Subscription Plans KPI | `/admin/subscription` | GET | `pagination.total` | Plan count |
| Total Notifications KPI | `/admin/get-notification` | GET | `pagination.total` | Total notifications sent |
| CMS Pages KPI | `/admin/get_pages` | GET | `pagination.total` | Static page count |
| Content Distribution Chart | Multiple count APIs | GET | Various `count` fields | All content type distribution |
| Sub-Admin Status Chart | `/admin/view-subadmin` | GET | `subAdmins[].status` | Active/Inactive sub-admin split |
| Blog Visibility Chart | `/admin/view-blog` | GET | `blogs[].visibility_status` | Public/Private blog split |
| Blog Status Chart | `/admin/view-blog` | GET | `blogs[].status` | Active/Inactive blog split |
| Program Status Chart | `/admin/view-programs` | GET | `programs[].status` | Active/Inactive program split |
| Meal Type Distribution Chart | `/admin/nutrition` | GET | `nutrition[].Meal_Type` | Meal type breakdown |
| Transaction Revenue Chart | `/admin/transactions` | GET | `transactions[].amount` + `plan.name` | Revenue by plan |
| Fitzone Session Status Chart | `/admin/view-fitzone` + `/admin/fitzone-session/{id}` | GET | `sessions[].status` | Session status per zone |
| Recent Transactions Widget | `/admin/transactions` | GET | `transactions[]` (last 10) | Latest transaction feed |
| Recent Sub-Admins Widget | `/admin/dashboard` | GET | `subadmin[]` | Recently added sub-admins |
| Recent Blogs Widget | `/admin/view-blog` | GET | `blogs[]` (last 5) | Latest blog posts |
| Recent Programs Widget | `/admin/view-programs` | GET | `programs[]` (last 5) | Latest programs |
| Recent Nutrition Widget | `/admin/nutrition` | GET | `nutrition[]` (last 5) | Latest meal records |
| Recent FAQs Widget | `/admin/view-faqs` | GET | `faqs[]` (last 5) | Latest FAQ entries |
| Recent Notifications Widget | `/admin/get-notification` | GET | `notification[]` (last 5) | Recent notifications sent |
| Subscription Plans Widget | `/admin/subscription` | GET | `plans[]` | All subscription plans |
| Users Assigned to Program | `/admin/view-programassigneduser/{id}` | GET | `users[]` | Users per program |
| Welcome Header — Admin Name | Auth context / token payload | — | Admin name | Personalized greeting |
| Quick Action — Add Blog | `/admin/add-blog` | POST | — | Create blog shortcut |
| Quick Action — Add Program | `/admin/add-program` | POST | — | Create program shortcut |
| Quick Action — Add Fitzone | `/admin/add-fitzone` | POST | — | Create fitzone shortcut |
| Quick Action — Add SubAdmin | `/admin/add-subadmin` | POST | — | Create sub-admin shortcut |
| Quick Action — Send Notification | `/admin/add-notification` | POST | — | Push notification shortcut |
| Food Categories (Programs) | `/admin/get-foodcategories` | GET | `pagination.total` | Food category count |
| Diet Plan Meals | `/admin/get-dietmeal/{id}` | GET | `diet_meals[]` | Meals per program day |

---

## 10. Future Enhancements

The following features would significantly enhance the dashboard but require backend support not currently available in the API. These are clearly separated from the current implementation.

---

### 10.1 Real-Time Dashboard

| Feature | Description | Technology Required |
|---|---|---|
| **Live KPI Updates** | KPIs update in real-time without page refresh | WebSocket / Server-Sent Events |
| **Live Notification Feed** | New notifications appear instantly in widget | WebSocket + push events |
| **Real-time User Registrations** | Ticker showing new user sign-ups as they happen | WebSocket |

---

### 10.2 Date-Range Filtered APIs

These require new query parameter support on existing endpoints:

| Feature | Required Endpoint Enhancement | Parameters Needed |
|---|---|---|
| Users by registration date | `GET /admin/userscount` | `from`, `to` |
| Blogs by creation date | `GET /admin/blog` | `from`, `to` |
| Transactions by date | `GET /admin/transactions` | `from`, `to` |
| Revenue by period | New: `GET /admin/transactions/revenue` | `period=monthly` |

---

### 10.3 New Analytics Endpoints Needed

| Feature | Required New Endpoint | Response Shape |
|---|---|---|
| User growth trend | `GET /admin/analytics/user-growth` | `{ months: [], counts: [] }` |
| Monthly blog publishing | `GET /admin/analytics/blog-trend` | `{ weeks: [], counts: [] }` |
| Transaction success rate | `GET /admin/analytics/transaction-summary` | `{ success: N, failed: N, pending: N }` |
| Revenue summary | `GET /admin/analytics/revenue` | `{ total: N, this_month: N, last_month: N }` |
| Top programs by users | `GET /admin/analytics/top-programs` | `[{ program_id, title, user_count }]` |

---

### 10.4 Reporting Features

| Feature | Description |
|---|---|
| **PDF Export** | Export dashboard snapshot as PDF report |
| **Excel/CSV Export** | Download KPI data and transaction history as spreadsheet |
| **Scheduled Reports** | Automated weekly/monthly reports generated automatically |
| **Email Reports** | Admin receives summary report at configured schedule |

---

### 10.5 Audit & Activity Logs

| Feature | Description |
|---|---|
| **Admin Audit Log** | Track all admin actions (created/updated/deleted records) |
| **Sub-Admin Activity** | See which sub-admin performed which action and when |
| **Login History** | Track successful and failed login attempts per admin |
| **Content Change History** | See revision history for blogs, programs, CMS pages |

---

### 10.6 Advanced Analytics

| Feature | Description |
|---|---|
| **User Engagement Metrics** | Track app usage — sessions per user, active days |
| **Geographic Analytics** | Where are users located? (requires user location data) |
| **Device & Platform Analytics** | iOS vs. Android split (requires device metadata) |
| **Search Analytics** | What are users searching for? (requires search log API) |
| **Content Performance Scores** | Rank blogs and programs by user engagement |
| **Heatmaps** | Admin panel usage heatmaps to understand most-used features |
| **Cohort Analysis** | Track user retention by registration cohort |
| **Churn Rate Tracking** | Identify users who stopped using the platform |

---

### 10.7 Notifications & Alerts

| Feature | Description |
|---|---|
| **Threshold Alerts** | Alert when user count drops below a threshold |
| **Failed Transaction Alerts** | Immediate notification of failed payments |
| **Content Moderation Alerts** | Flag inactive content not updated in X days |
| **Low Nutrition Database Alert** | Warn when nutrition records fall below minimum count |

---

## 11. UI/UX Recommendations

### 11.1 Layout & Grid System

```
Desktop (>=1280px):  12-column grid, KPI cards in 6 columns (2 per row x 3 rows)
Tablet  (>=768px):   8-column grid,  KPI cards in 4 columns (2 per row x 4 rows)
Mobile  (<768px):    4-column grid,  KPI cards stacked (1 per row)
```

### 11.2 KPI Card Design

Each KPI card should follow this visual structure:

```
+--------------------------------+
|  [Gradient Background]          |
|  Icon (top-left, 24px)         |
|  Metric Name (14px, semi-bold) |
|  ----------------------------  |
|  1,247           [+12%]        |
|  (36px, bold)    (trend badge) |
|  ----------------------------  |
|  View All ->  (12px, link)     |
+--------------------------------+
```

**Recommended Design Tokens:**

| Token | Value |
|---|---|
| Border radius | `16px` |
| Box shadow | `0 4px 24px rgba(0,0,0,0.08)` |
| Users card gradient | `linear-gradient(135deg, #6366f1, #8b5cf6)` |
| Blogs card gradient | `linear-gradient(135deg, #10b981, #34d399)` |
| Programs card gradient | `linear-gradient(135deg, #f59e0b, #fbbf24)` |
| Transactions card gradient | `linear-gradient(135deg, #f43f5e, #fb7185)` |
| Fitzone card gradient | `linear-gradient(135deg, #0ea5e9, #38bdf8)` |

### 11.3 Color System

| Element | Light Mode | Dark Mode |
|---|---|---|
| Background | `#f8fafc` | `#0f172a` |
| Card Surface | `#ffffff` | `#1e293b` |
| Border | `#e2e8f0` | `#334155` |
| Primary Text | `#0f172a` | `#f1f5f9` |
| Secondary Text | `#64748b` | `#94a3b8` |
| Success | `#22c55e` | `#4ade80` |
| Warning | `#f59e0b` | `#fbbf24` |
| Danger | `#ef4444` | `#f87171` |
| Primary Accent | `#6366f1` | `#818cf8` |

### 11.4 Chart Styling

- **Fonts:** Use `Inter` or `Outfit` (Google Fonts) for all chart labels
- **Grid lines:** Very light — `rgba(0,0,0,0.05)` on light mode, `rgba(255,255,255,0.05)` on dark
- **Animations:** Chart entrance animations on initial load (600ms ease-in-out)
- **Tooltips:** Rounded corners, subtle shadow, show all relevant data fields
- **Legend:** Below chart, horizontal layout, clickable to toggle segments
- **Responsive:** Charts must resize with the container using `maintainAspectRatio: false`

### 11.5 Loading States (Skeleton)

Every dashboard component must implement a skeleton loading state:

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
```

- Show skeletons while API calls are in-flight
- Replace skeletons with real data atomically (no flickering)
- Each KPI card, chart, and widget needs its own skeleton variant

### 11.6 Empty States

When a widget or chart has no data to display:

```
+--------------------------------+
|                                |
|     [Empty State Illustration] |
|   No records found yet.        |
|  Start by adding your first    |
|         [Create Blog]          |
|                                |
+--------------------------------+
```

Requirements:
- Include an icon or simple illustration
- Provide a clear, friendly message
- Include a direct call-to-action button
- Never show a blank white box

### 11.7 Error States

When an API call fails:

```
+--------------------------------+
|   [!] Failed to load data      |
|  Could not reach the server.   |
|         [Try Again]            |
+--------------------------------+
```

Requirements:
- Always show a "Try Again" button that retries the failed request
- Log raw errors to console in development only
- Use amber/orange styling for non-critical errors, red for critical failures
- Never expose raw server error messages to end users

### 11.8 Micro-Animations

| Interaction | Animation |
|---|---|
| KPI card hover | Scale `1.02`, shadow increase, 150ms ease |
| Number loading | Count-up animation from 0 to final value (800ms) |
| Chart segments | Sequential reveal on load (staggered 50ms per segment) |
| Widget row hover | Left border color flash, subtle background lighten |
| Quick action button | Icon rotate + scale on hover |
| Active status badge | Subtle pulse animation |
| Page transition | Fade-in on component mount |

### 11.9 Accessibility

- All interactive elements must have `aria-label` attributes
- Color alone must never be the only differentiator (pair with icons/text labels)
- Keyboard navigable — all quick actions accessible via `Tab` key
- Charts must include descriptive `<title>` and `<desc>` elements for screen readers
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text (WCAG 2.1 AA)
- Focus indicators must be clearly visible (not removed via `outline: none` without replacement)

### 11.10 Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| Mobile (`< 640px`) | Single-column layout; charts become simplified bar charts |
| Tablet (`640px – 1024px`) | Two-column KPI grid; charts stack vertically |
| Desktop (`1024px – 1280px`) | Three-column KPIs; side-by-side charts and sidebar |
| Wide (`> 1280px`) | Four–six column KPI grid; full side-by-side layout |

---

## 12. Technical Recommendations

### 12.1 API Fetching Strategy — Parallel Requests

All dashboard KPI and chart data should be fetched simultaneously on page load:

```javascript
// Use Promise.allSettled so one failure doesn't block all data
const results = await Promise.allSettled([
  api.get('/admin/dashboard'),           // subadminCount
  api.get('/admin/userscount'),          // usersCount
  api.get('/admin/blog'),                // blog count
  api.get('/admin/manageprogram'),       // program count
  api.get('/admin/fitzonesession'),      // fitzone session count
  api.get('/admin/view-fitzone'),        // fitzone list + total
  api.get('/admin/view-faqs'),           // faq list + total
  api.get('/admin/get-blogcategories'), // blog categories
  api.get('/admin/nutrition'),           // nutrition records
  api.get('/admin/transactions'),        // transactions
  api.get('/admin/subscription'),        // subscription plans
  api.get('/admin/get-notification'),    // notifications
  api.get('/admin/get_pages'),           // CMS pages
  api.get('/admin/view-blog'),           // blog list for charts
  api.get('/admin/view-programs'),       // program list for charts
  api.get('/admin/view-subadmin'),       // sub-admin list for charts
]);
```

**Why `allSettled` instead of `all`:** If one API fails (e.g., transactions returns 500), the rest of the dashboard still loads successfully.

---

### 12.2 Caching Strategy

| Data Type | Cache Duration | Invalidation Trigger |
|---|---|---|
| KPI counts (users, blogs, etc.) | 5 minutes | Manual refresh, or navigation back to dashboard |
| Chart data (status distributions) | 5 minutes | Same as above |
| Widget data (recent records) | 2 minutes | Manual refresh |
| Static data (plans, categories) | 30 minutes | Create/Edit/Delete action in that module |

**Recommended Tools:**

- **TanStack Query (React Query):** Built-in caching, background refetch, stale-while-revalidate pattern
- **SWR:** Lightweight alternative with similar caching capabilities
- **RTK Query (Redux Toolkit):** Best if already using Redux for global state

```javascript
// TanStack Query example for KPI caching
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['dashboard-users-count'],
  queryFn: () => api.get('/admin/userscount'),
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
});
```

---

### 12.3 State Management Shape

Recommended Redux/Context state structure:

```
dashboardState: {
  kpis: {
    usersCount: number | null,
    subadminCount: number | null,
    blogCount: number | null,
    programCount: number | null,
    fitzoneSessionCount: number | null,
    faqCount: number | null,
    transactionCount: number | null,
    notificationCount: number | null,
  },
  charts: {
    contentDistribution: { label: string, count: number }[],
    subadminStatus: { active: number, inactive: number },
    blogStatus: { active: number, inactive: number },
    blogVisibility: { public: number, private: number },
    programStatus: { active: number, inactive: number },
    mealTypeDistribution: { type: string, count: number }[],
    transactionRevenue: { plan: string, total: number }[],
  },
  widgets: {
    recentTransactions: Transaction[],
    recentSubadmins: SubAdmin[],
    recentBlogs: Blog[],
    recentPrograms: Program[],
    recentNotifications: Notification[],
    subscriptionPlans: Plan[],
  },
  filters: {
    activeFilter: 'today' | 'last7days' | 'last30days' | 'thisMonth' | 'custom',
    customRange: { from: string | null, to: string | null },
  },
  loading: {
    kpis: boolean,
    charts: boolean,
    widgets: boolean,
  },
  errors: {
    kpis: string | null,
    charts: string | null,
    widgets: string | null,
  }
}
```

---

### 12.4 Error Handling

```javascript
// Recommended global error interceptor pattern
const handleApiError = (error, component) => {
  if (error.status === 401) {
    // Token expired — redirect to login
    clearAuthToken();
    router.push('/login');
    return;
  }
  if (error.status === 403) {
    toast.error('You do not have permission to view this data.');
    return;
  }
  if (error.status === 500) {
    console.error(`Dashboard [${component}] server error:`, error);
    showErrorState(component, 'Unable to load data. Please try again.');
    return;
  }
  showErrorState(component, 'An unexpected error occurred.');
};
```

---

### 12.5 Performance Optimization

| Optimization | Implementation |
|---|---|
| **Code Splitting** | Lazy load chart components: `const Chart = React.lazy(() => import('./ChartComponent'))` |
| **Virtualization** | For long widget lists, use `react-window` or `react-virtual` |
| **Memoization** | Wrap chart data transforms in `useMemo`; wrap callbacks in `useCallback` |
| **Debounce** | Debounce filter changes by 300ms before re-computing chart data |
| **Image Optimization** | Lazy load blog/program thumbnails with `loading="lazy"` |
| **Bundle Analysis** | Use `webpack-bundle-analyzer` to ensure chart library tree-shaking works |
| **Intersection Observer** | Only load below-fold widgets when they scroll into view |

---

### 12.6 Pagination Strategy for Widgets

For widgets needing to show "latest N" records from a paginated endpoint:

```javascript
// Fetch first page (50 items), sort DESC, take first N
const getLatestRecords = (data, count = 5) =>
  [...data]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, count);
```

> **Note:** API default page size is 50. For datasets larger than 50 records, you may need to fetch multiple pages, or the API should support `sort` and `limit` query parameters (see Future Enhancements).

---

### 12.7 Security Considerations

- **Never log Bearer tokens** in component state or developer console
- **Token refresh:** Intercept `401` responses globally and redirect to login
- **HTTPS only:** All API calls must use HTTPS in production
- **HTML sanitization:** Any HTML content from CMS pages (`description` field) must be sanitized before rendering — use `DOMPurify` to prevent XSS
- **Rate limiting:** Add exponential backoff for repeated failed API calls
- **Token storage:** Prefer `httpOnly` cookies over `localStorage` for token storage

---

### 12.8 Testing Recommendations

| Test Type | Tool | Coverage Target |
|---|---|---|
| Unit Tests | Jest + React Testing Library | KPI calculations, filter logic, data transformations |
| Component Tests | React Testing Library | Chart rendering, widget display, empty/error states |
| Integration Tests | Cypress / Playwright | Full dashboard load, filter interactions, click-throughs |
| API Mocking | MSW (Mock Service Worker) | All dashboard API endpoints mocked for test environment |
| Accessibility | axe-core / jest-axe | All dashboard components pass WCAG 2.1 AA |
| Performance | Lighthouse CI | Dashboard initial load < 3s on 3G connection |

---

### 12.9 Recommended Technology Stack

| Category | Recommended Choice | Rationale |
|---|---|---|
| **Charts** | ApexCharts or Recharts | Rich chart types, React-native, good documentation |
| **State Management** | TanStack Query + Zustand | Query caching + lightweight global state |
| **Data Fetching** | Axios with interceptors | Global 401 handling, request/response transforms |
| **Icons** | Lucide React or MUI Icons | Consistent, tree-shakeable icon set |
| **Animations** | Framer Motion | Smooth micro-animations for dashboard elements |
| **Skeleton Loaders** | react-loading-skeleton | Pre-built skeleton components |
| **Date Handling** | date-fns | Lightweight, tree-shakeable date utilities |
| **Styling** | CSS Modules or Styled Components | Scoped styles, no framework dependency |

---

## Appendix A — Dashboard API Priority Order

| Priority | API Endpoint | Used For | Criticality |
|---|---|---|---|
| 1st | `GET /admin/dashboard` | Sub-admin count + sub-admin list | Critical |
| 1st | `GET /admin/userscount` | Total user count | Critical |
| 1st | `GET /admin/blog` | Blog count | Critical |
| 1st | `GET /admin/manageprogram` | Program count | Critical |
| 1st | `GET /admin/fitzonesession` | Fitzone session count | Critical |
| 2nd | `GET /admin/transactions` | Transaction count + recent widget | High |
| 2nd | `GET /admin/view-blog` | Blog list for charts + widget | High |
| 2nd | `GET /admin/view-programs` | Program list for charts + widget | High |
| 2nd | `GET /admin/view-subadmin` | SubAdmin list for charts + widget | High |
| 3rd | `GET /admin/nutrition` | Nutrition count + meal type chart | Medium |
| 3rd | `GET /admin/view-fitzone` | Fitzone list + session chart | Medium |
| 3rd | `GET /admin/view-faqs` | FAQ count + recent widget | Medium |
| 3rd | `GET /admin/subscription` | Subscription plans widget | Medium |
| 4th | `GET /admin/get-notification` | Notification count + recent widget | Low |
| 4th | `GET /admin/get_pages` | CMS page count | Low |
| 4th | `GET /admin/get-blogcategories` | Blog category count | Low |

---

## Appendix B — Quick Reference: Dashboard Endpoint Cheat Sheet

```
Base URL: https://apibackend.trimify.com.au/api
Auth: Authorization: Bearer {token}

# Count Endpoints (Priority 1 — fetch first)
GET /admin/dashboard          --> subadminCount, subadmin[]
GET /admin/userscount         --> usersCount, users[]
GET /admin/blog               --> count (total blog posts)
GET /admin/manageprogram      --> count (total programs)
GET /admin/fitzonesession     --> count (total fitzone sessions)

# List Endpoints (for charts, widgets, and pagination.total counts)
GET /admin/view-blog          --> blogs[], pagination.total
GET /admin/view-programs      --> programs[], pagination.total
GET /admin/view-subadmin      --> subAdmins[], pagination.total
GET /admin/view-fitzone       --> fitzones[], pagination.total
GET /admin/view-faqs          --> faqs[], pagination.total
GET /admin/nutrition          --> nutrition[], pagination.total
GET /admin/transactions       --> transactions[], pagination.total
GET /admin/subscription       --> plans[], pagination.total
GET /admin/get-notification   --> notification[], pagination.total
GET /admin/get_pages          --> Cms[], pagination.total
GET /admin/get-blogcategories --> blogs[] (categories), pagination.total

# Per-Record Lookup (for drilldown widgets)
GET /admin/view-programassigneduser/{id} --> users[] (users assigned to program)
GET /admin/fitzone-session/{id}          --> sessions[] (sessions per fitzone)
```

---

*Specification generated based on `APIs.md` and `APIs2.md` — Trimify Admin Dashboard Analytics v1.0.0*
*Document Status: Ready for Implementation Review*
