# Trimify Admin Panel Frontend - Knowledge Transfer (KT) Overview Document

## Document Metadata
- **Project Name**: Trimify Admin Panel Frontend
- **Repository Location**: c:\new-trimify-front-admin\trimify-admin
- **Package Name**: dmin_dashboard
- **Target Audience**: Incoming Frontend / Fullstack Developers & Technical Leads
- **Document Version**: 1.0.0
- **Verification Level**: All configuration, stack, architecture, and module references verified against codebase source files [AI VERIFIED].

---

## 1. Executive Summary & Purpose

The **Trimify Admin Panel Frontend** is a single-page web application (SPA) built to serve as the main administration control center for the Trimify health, fitness, and nutrition platform.

### Core Capabilities:
- **User & Sub-Admin Management**: View user details, toggle statuses, assign sub-admin granular roles and permissions.
- **Subscription & Transaction Tracking**: Monitor subscription plans, active subscribers, payment transaction logs, and revenue metrics.
- **Fitness & Fitzone Management**: Manage gym locations with Leaflet interactive maps, create and assign workout programs and fitness content.
- **AI Food Dataset Management**: Upload, review, tag, and manage food dataset images used by the AI Food Scanner model.
- **Content Management System (CMS)**: Create dynamic landing pages, legal terms, privacy policies, blogs, and FAQ knowledge bases.
- **System Monitoring**: Admin overview dashboard with interactive data visualization charts.

---

## 2. Technology Stack & Framework Inventory

| Layer / Functional Domain | Technology / Package | Version | Purpose & Implementation Role | Verification Source |
|---|---|---|---|---|
| Core Web Framework | **React** | ^19.2.0 | Declarative UI component construction | package.json [AI VERIFIED] |
| Build Tooling & Server | **Vite** | ^7.2.4 | Ultra-fast HMR dev server & Rollup production bundler | package.json [AI VERIFIED] |
| Client-Side Routing | **React Router DOM** | ^7.2.0 | SPA routing with chunk lazy loading (Suspense) | package.json [AI VERIFIED] |
| Global State Engine | **Redux Toolkit (RTK)** | ^2.5.1 | Centralized state management | package.json [AI VERIFIED] |
| State Persistence | **Redux Persist** | ^6.0.0 | Persists global state to localStorage (Key: oot) | package.json [AI VERIFIED] |
| Styling Framework | **Tailwind CSS** | ^3.4.17 | Utility-first responsive styling system | package.json [AI VERIFIED] |
| UI Component Primitives | **Radix UI / shadcn/ui** | Custom | Unstyled accessible primitives & customized components | components.json [AI VERIFIED] |
| Dynamic Motion | **Framer Motion & GSAP** | ^12.4.7 / ^3.12.7 | Page transition effects, UI micro-interactions, canvas | package.json [AI VERIFIED] |
| Rich Text Editing | **TinyMCE & Quill** | ^8.0.0 / ^2.0.3 | Multi-mode rich HTML content creation for CMS & Blogs | package.json [AI VERIFIED] |
| Data Analytics & Charts | **Recharts & Chart.js** | ^2.15.1 / ^4.4.8 | Revenue, traffic, subscriber, and usage charts | package.json [AI VERIFIED] |
| Form Validation | **React Hook Form + Zod** | ^7.54.2 / ^3.24.2 | Schema-based client form state and error handling | package.json [AI VERIFIED] |
| Table Management | **TanStack React Table** | ^8.21.2 | High-performance sorting, filtering, and pagination | package.json [AI VERIFIED] |
| Interactive Maps | **Leaflet + react-leaflet** | ^1.9.4 / ^5.0.0 | Geographical map view for Fitzone gym locations | package.json [AI VERIFIED] |
| Drag & Drop Layout | **dnd-kit** | ^6.3.1 | Drag-and-drop element reordering | package.json [AI VERIFIED] |
| HTML Sanitization | **DOMPurify** | ^3.2.4 | Prevents XSS attacks when rendering CMS/Blog HTML | package.json [AI VERIFIED] |
| HTTP Transport Layer | **Axios** | ^1.7.9 | Request execution wrapper (piConnector) | package.json [AI VERIFIED] |
| Notification Toasts | **Sonner** | ^2.0.1 | Non-intrusive toast messages | package.json [AI VERIFIED] |

---

## 3. Architecture & Repository Organization

`
trimify-admin/
├── scripts/
│   └── copy-tinymce.cjs          # Automation script to populate TinyMCE assets into public/
├── src/
│   ├── app/
│   │   ├── routes/               # Application router definitions & lazy-loaded view routes
│   │   └── store/                # Redux Toolkit store setup & redux-persist wrapper
│   ├── components/               # Cross-cutting UI components (Navbar, Sidebar, Theme Provider)
│   ├── hooks/                    # Reusable React hooks (theme context, auth listeners)
│   ├── modules/                  # Feature-encapsulated modular business logic (18 modules)
│   ├── services/
│   │   ├── api-endpoints/        # Centralized REST API path definitions per domain module
│   │   └── axios/                # Axios instance wrapper (piConnector) with interceptors
│   ├── styles/                   # Global CSS imports, Tailwind directives, theme variables
│   ├── utils/                    # Shared helper functions, formatting, validation rules
│   ├── App.jsx                   # Root layout component, router provider, theme wrapper
│   └── main.jsx                  # Entry file (Redux Provider, PersistGate, Error boundaries)
├── vite.config.js                # Vite config (path aliases '@' -> 'src/', dev server proxy)
├── deploy-cyberpanel.yml         # CI/CD staging deployment workflow definition
└── components.json               # shadcn/ui configuration profile
`

---

## 4. Module Inventory & Functional Scope

The frontend codebase is partitioned into **18 distinct modules** located under src/modules/:

| Module Directory | Primary Responsibility & Features |
|---|---|
| uthentication | Login page, OTP code verification, password recovery, session handling. |
| dashboard | Executive metrics overview, quick analytics, subscriber growth charts. |
| userManagement | End-user directory, profile inspection, user status toggles (Active/Suspended). |
| subAdmin | Sub-admin list, role permissions assignment matrix, account creation. |
| subscriptionManagement | Subscription tier configurations, active plan tracking, subscriber lists. |
| 	ransactionManagement | Payment history tables, transaction search, billing status, invoice view. |
| itzoneManagement | Gym locations directory, location map pins (Leaflet), facility details. |
| manageProgram | Fitness program builder, workout routines, exercise video catalog links. |
| dataManagement | Master data registries, category lookups, platform configuration keys. |
| iFoodUpload | Food image upload portal for AI training, food item metadata tagging. |
| logSection | Article editor (TinyMCE), blog category management, publishing status. |
| cmsManagement | Dynamic legal pages (Terms & Conditions, Privacy Policy), landing page content. |
| 
otificationManage | Broadcast push notifications dispatch, scheduled message alerts log. |
| aqManagement | Knowledge base Q&A creation, FAQ categories, display ordering. |
| ccountSettings | Current logged-in admin profile settings, password rotation. |
| ccounts | Sub-admin / Staff account credentials overview. |
| settings | System-wide settings & platform-level configuration parameters. |
| 
ot-found | 404 Route handling view for invalid paths. |

---

## 5. Architectural Patterns & Gotchas

1. **State Hydration Lifecycle**:
   - src/main.jsx initializes Redux with edux-persist (localStorage key: oot).
   - UI rendering is deferred until <PersistGate> completes state rehydration.

2. **Chunk Preload Failure Guard**:
   - src/main.jsx includes an automated listener for ite:preloadError.
   - If a new deployment invalidates stale script bundle hashes while a user is active, the app catches the error and executes a single hard browser reload per session (ite-preload-error-reloaded).

3. **TinyMCE Static Asset Pipeline**:
   - TinyMCE requires static assets (skins, themes, icons).
   - A postinstall hook (
ode scripts/copy-tinymce.cjs) copies assets from 
ode_modules/tinymce into public/tinymce/ automatically after 
pm install.

4. **Dev Server Proxy Note**:
   - ite.config.js defines a dev proxy rule forwarding /api to https://api.matchatfirstswipe.com.au (legacy dev endpoint). Production and staging deployments use direct full API URLs to the Admin Backend (dminbackend.trimify.com.au).

---

## 6. Development Workflow

`ash
# 1. Install dependencies (triggers TinyMCE postinstall asset copy)
npm install

# 2. Start local development server (Vite HMR)
npm run dev

# 3. Production build generation
npm run build
# Output target: dist/
`