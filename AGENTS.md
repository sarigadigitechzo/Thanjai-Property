# AGENTS.md — Thanjai Property

## 1. Project Overview
**Thanjai Property** is a premium, client-side real estate web application and administrative Operating System (OS) designed for luxury real estate properties, residential plots, independent houses, commercial spaces, and agricultural farmlands across Tamil Nadu (Thanjavur, Trichy, Madurai, Chennai, Coimbatore, Kumbakonam). 

The platform serves two primary interfaces:
1. **Public Web Application (`index.html`)**: A 5-page SPA (`Home`, `Our Story`, `Discover Properties`, `The Blog`, `Contact Us`) featuring dynamic property showcase cards, location selectors, category carousels, property detail modals, search engines, favorite listings, and inquiry booking forms.
2. **Administrative CRM Dashboard OS (`dashboard.html`)**: An administrative operating system containing modules for **Properties Inventory CRUD**, **CRM Pipeline Kanban**, **Lead Details**, **Site Visit Scheduling**, **Partner Network**, **AI Operating Agent**, **WhatsApp Logs**, **Website Images Manager**, and **Audit Logs**.

The system runs locally via Vite dev server at:
- **Public Website**: `http://localhost:5173/`
- **Admin Dashboard**: `http://localhost:5173/dashboard.html`
- **Login Portal**: `http://localhost:5173/login.html`

---

## 2. Technology Stack

### Frontend Architecture
- **HTML Standard**: HTML5 (Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<form>`). Multi-page entry configuration (`index.html`, `dashboard.html`, `login.html`).
- **Styling / CSS**: Vanilla CSS3 with CSS custom properties (variables), Flexbox, Grid layout, glassmorphism overlays (`backdrop-filter`), animations (`@keyframes pageFadeIn`, `@keyframes slideUp`), and custom styling modules (`style.css`, `dashboard.css`, `kanban.css`, `properties.css`, `visits.css`, `partners.css`, `ai-agent.css`, `whatsapp.css`, `login.css`). No utility frameworks (Tailwind/Bootstrap) are used.
- **JavaScript System**: Vanilla ES6+ JavaScript modules (`type="module"`), native DOM manipulation, event delegation, and reactive custom event dispatchers (`CustomEvent`).
- **Icons & Typography**:
  - **Typography**: Google Fonts — `DM Serif Display`, `Plus Jakarta Sans`, `Manrope`, `Inter`.
  - **Icons**: RemixIcon v4.2.0 (`https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css`).
  - **Maps**: Leaflet.js v1.9.4 CDN (`https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` and `leaflet.css`) for interactive pinpoint map location selection.
- **Build Tooling**: Vite v8.2.0 (`vite.config.js`) configured with Rollup multi-page inputs (`index.html`, `login.html`, `dashboard.html`) and custom Vite server plugin (`admin-link-logger`).

### Backend Architecture
- **Server Implementation**: 100% Serverless / Client-Side Architecture. No Node.js Express server, Python Flask/Django, PHP, or Java backend exists.
- **Development Server**: Vite development server handles static asset serving and ES module bundling.

### Database & Storage Architecture
- **Database System**: Client-side Web Storage (`localStorage`) operating as a persistent key-value document store.
- **Key Schemas**:
  - `thanjai_properties`: Master array of property listing objects (CRUD operations).
  - `thanjai_site_images`: Key-value map for dynamic static website banner/image replacements.
  - `thanjai_audit_logs`: Immutable administrative audit trail log items.
  - `thanjai_property_favorites`: Array of saved property IDs.

### Authentication & Authorization
- **Auth Provider**: Client-side session simulator via `login.html` and `login.js`.
- **User Roles**: `Super Admin` (Aishwarya R.), `Sales Manager`, `Sales Executive`, `Property Staff`, `Partner User`.

---

## 3. Project Structure

```
Thanjai-Property-main/
├── index.html                  # Public website entry point SPA
├── dashboard.html              # Admin CRM Operating System workspace
├── login.html                  # Workspace login page
├── package.json                # npm dependencies (vite ^8.2.0)
├── vite.config.js              # Vite multi-page build configuration
├── public/                     # Static assets & brand logos
│   └── thanjai-official-new.png
└── src/
    ├── style.css               # Public website design system & responsive rules
    ├── dashboard.css           # Admin OS layout & sidebar styling
    ├── properties.css          # Property inventory specific styles
    ├── kanban.css              # CRM pipeline kanban board styles
    ├── visits.css              # Site visit calendar & schedule styles
    ├── partners.css            # Partner network directory styles
    ├── ai-agent.css            # AI operating agent workspace styles
    ├── whatsapp.css            # WhatsApp log transcript styles
    ├── login.css               # Login page layout styles
    ├── main.js                 # Public website router, state, & event coordinator
    ├── dashboard.js            # Admin OS view router, notification & layout manager
    ├── login.js                # Login form & demo login pre-fill handler
    ├── components/             # Public UI components
    │   ├── Navbar.js
    │   ├── Hero.js
    │   ├── ExploreSection.js
    │   ├── HomePropertyShowcase.js
    │   ├── LocationExplorer.js
    │   ├── CategoryCarousel.js
    │   ├── LuxuryTransition.js
    │   ├── BlogSection.js
    │   ├── PostPropertyCTA.js
    │   ├── HomeContactBanner.js
    │   ├── Footer.js
    │   ├── MobileBottomNav.js
    │   ├── PropertyDetailModal.js
    │   ├── PostPropertyModal.js
    │   └── ScheduleVisitModal.js
    ├── views/                  # Public website pages
    │   ├── OurStoryView.js     # Page 2: History, Patta legal title, District plots
    │   ├── DiscoverView.js     # Page 3: Property search, multi-filters, detail view
    │   ├── BlogView.js         # Page 4: Articles & property guides
    │   └── ContactView.js      # Page 5: Contact form & advisory desk
    ├── crm-views/              # Admin OS CRM modules
    │   ├── DashboardView.js    # KPI statistics & sales analytics
    │   ├── LeadsView.js        # Kanban lead pipeline management
    │   ├── LeadDetailView.js    # Single lead timeline, notes & property matching
    │   ├── PropertiesView.js   # Full-page Property Inventory CRUD & Leaflet map
    │   ├── SiteVisitsView.js   # Site visit appointment scheduler
    │   ├── PartnersView.js     # Partner network & commission directory
    │   ├── AIAgentView.js      # AI operating agent prompt simulator
    │   ├── WhatsAppLogView.js  # WhatsApp inquiry chat logs
    │   ├── WebsiteImagesView.js# Dynamic website image asset catalog manager
    │   ├── AuditLogView.js     # Administrative audit trail viewer
    │   └── HowToUseView.js     # System user guide
    ├── utils/                  # Stores & event handlers
    │   ├── propertiesStore.js  # Property storage CRUD operations
    │   ├── siteImagesStore.js  # Website image catalog & audit logging
    │   ├── favorites.js        # Favorite property bookmarking
    │   └── toast.js            # Floating notification toasts
    └── data/                   # Default datasets
        ├── properties.js       # Master default property portfolio
        ├── blog.js             # Article catalog
        ├── categories.js       # Property categories
        ├── locations.js        # Tamil Nadu location cards
        └── agents.js           # Real estate specialists dataset
```

---

## 4. Application Architecture

The application uses an Event-Driven Reactive Architecture connecting UI views with local stores via Custom DOM Events:

```
[User Action / Form Submit]
       │
       ▼
[View Handler (PropertiesView.js / DiscoverView.js)]
       │
       ▼
[Store Action (addProperty / updateSiteImage / toggleFavorite)]
       │
  ┌────┴─────────────────────────┐
  ▼                              ▼
[localStorage Sync]    [addAuditLog()]
  │
  ▼
[Dispatch CustomEvent ('propertiesUpdated' / 'siteImagesUpdated' / 'favoritesUpdated')]
  │
  ▼
[Global Event Listeners (main.js / dashboard.js)]
  │
  ▼
[Reactive Re-render (renderApp() / refreshPropertiesView())]
```

---

## 5. Frontend Architecture

### Public Website Routing (`main.js`)
- **Route Detection**: `parseCurrentRoute()` parses path (`window.location.pathname`) and hash (`window.location.hash`).
- **Supported Routes**:
  - `home` (`/` or `#home`): Main homepage showcasing Hero, Explore, Property Showcase, Location Explorer, Category Carousel, Luxury Transition, Blog, and CTA sections.
  - `our-story` (`/our-story` or `#our-story`): History since 2009, legal Patta title assurance, and district plots presence.
  - `discover` (`/discover` or `#discover`): Search engine, category/location/purpose multi-filters, and full property detail view.
  - `blog` (`/blog` or `/journal` or `#blog`): Property guides, RERA checklists, and architectural perspectives.
  - `contact` (`/contact` or `#contact`): Advisory desk contact form.

---

## 6. Dashboard Architecture (`dashboard.html` & `dashboard.js`)

The Admin OS is rendered inside `dashboard.html` with dynamic view injection into `#os-content`:

### Navigation Hash Router
- `#dashboard` → `renderDashboardView()`
- `#leads` → `renderLeadsView()`
- `#lead/:id` → `renderLeadDetailView(id)`
- `#properties` → `renderPropertiesView()` (Full-page inline form & list view)
- `#visits` → `renderSiteVisitsView()`
- `#partners` → `renderPartnersView()`
- `#ai` → `renderAIAgentView()`
- `#whatsapp` → `renderWhatsAppLogView()`
- `#images` → `renderWebsiteImagesView()`
- `#audit` → `renderAuditLogView()`

---

## 7. Backend Architecture

- **Static Assets Serving**: Served directly via Vite.
- **Client-Side Data Persistence**: No external API endpoints or database connections required.

---

## 8. API Architecture (Internal Store Interface)

### Properties Store Interface (`src/utils/propertiesStore.js`)
- `getProperties()`: Returns all active properties.
- `getPropertyById(id)`: Returns specific property by ID.
- `addProperty(data)`: Normalizes and prepends new property record to `localStorage`, logs audit event, dispatches `propertiesUpdated`.
- `updateProperty(id, fields)`: Updates property fields in `localStorage`, logs audit event, dispatches `propertiesUpdated`.
- `deleteProperty(id)`: Removes property by ID, logs audit event, dispatches `propertiesUpdated`.
- `resetPropertiesToDefault()`: Restores initial seed property portfolio.

### Website Images Store Interface (`src/utils/siteImagesStore.js`)
- `getAllSiteImages()`: Returns complete image catalog merged with user overrides.
- `getSiteImage(key)`: Returns active image URL for a given asset key.
- `updateSiteImage(key, newUrl)`: Overrides image asset URL, logs to audit trail, dispatches `siteImagesUpdated`.
- `resetSiteImage(key)`: Restores single image to default factory URL.
- `resetAllSiteImages()`: Restores all site images to defaults.
- `getAuditLogs()`: Returns administrative audit trail logs.
- `addAuditLog(entry)`: Appends new immutable entry to audit log array.

---

## 9. Database Architecture (Web Storage Schemas)

### Property Record Schema
```typescript
interface PropertyRecord {
  id: string;              // e.g. "TP-2001"
  title: string;           // Property title
  type: string;            // Apartment | Villa | Townhouse | Penthouse | Studio | Plot | Office | Retail | Warehouse | Other
  category: string;        // villas | houses | apartments | plots | agricultural | commercial
  categoryRaw: string;     // Sale | Rent | Lease | Commercial | Residential
  categoryLabel: string;   // e.g. "Luxury Villa"
  purpose: 'buy' | 'rent'; // Buy or Rent
  price: number;           // Numeric price in INR
  priceFormatted: string;  // Formatted price string (e.g. "₹ 1.35 Crore")
  location: string;        // e.g. "Medical College Road, Thanjavur"
  district: string;        // e.g. "Thanjavur"
  address: string;         // Street address
  size: string;            // e.g. "2,600 Sq.Ft" or "6.5 Acres"
  bedrooms: number | null; // Bedrooms count (shown for residential types only)
  bathrooms: number | null;// Bathrooms count (shown for residential types only)
  furnishing: string;      // Fully Furnished | Semi-Furnished | Unfurnished | Not specified
  status: string;          // Available | Booked | Sold | Rented | Inactive
  availability: string;    // Available | Booked | Sold | Rented | Inactive
  latitude: string;        // GPS Latitude
  longitude: string;       // GPS Longitude
  videoUrl: string;        // YouTube or uploaded video file URL
  ownerName: string;       // Owner or company name
  ownerPhone: string;      // Contact phone number
  listedBy: string;        // Listing admin/specialist name
  images: string[];        // Array of photo URLs
  description: string;     // Detailed description
  features: string[];      // Array of amenity strings
  createdAt: string;       // ISO Timestamp
}
```

---

## 10. Authentication & Authorization

- **Demo Workspace Credentials**:
  - `admin@realrest.example` (Super Admin / Password: `Admin@1234`)
  - `manager@realrest.example` (Sales Manager)
  - `kavitha@realrest.example` (Sales Executive)
  - `arun@realrest.example` (Sales Executive)
  - `priya@realrest.example` (Property Staff)
  - `senthil@chennaiprime.example` (Partner User)

---

## 11. Storage & Uploads

- **Client-Side File Reading**: Image files (`image/*`) and Video files (`video/*`) are processed locally using `FileReader.readAsDataURL()`.
- **Data Encoding**: Uploaded files are converted into base64 Data URLs or standard image URLs.
- **Image Deletion**: Uploaded image galleries in the Add/Edit Property form include red delete buttons (`.delete-uploaded-img-btn`) to remove uploaded items before saving.
- **Image Fit & Aspect Ratio Normalization**: CSS enforces `object-fit: cover; object-position: center;` across all cards to prevent image distortion.

---

## 12. Property Management System

- **Full-Page Inline Add/Edit Form**: Replaces popup modal overlay with a full page view in `#os-content`.
- **Dynamic Specs Field Visibility**: Bedrooms, Bathrooms, and Furnishing fields are displayed ONLY for residential structures (`Apartment`, `Villa`, `Townhouse`, `Penthouse`, `Studio`) and hidden for land (`Plot`) and commercial properties.
- **Leaflet Interactive Map Pinpoint**: Includes an interactive OpenStreetMap widget that allows admins to click or drag a marker pin to capture precise `latitude` and `longitude`.
- **Filtered CSV Export**: `exportFilteredPropertiesToCSV()` exports ONLY the properties matching active search and dropdown filter parameters.

---

## 13. Routing & URLs

### Public Pages
- `http://localhost:5173/` (Home Page)
- `http://localhost:5173/#our-story` (Our Story Page)
- `http://localhost:5173/#discover` (Discover Properties Page)
- `http://localhost:5173/#blog` (The Blog Page)
- `http://localhost:5173/#contact` (Contact Us Page)

### Admin Workspace Pages
- `http://localhost:5173/dashboard.html#dashboard`
- `http://localhost:5173/dashboard.html#leads`
- `http://localhost:5173/dashboard.html#lead/:id`
- `http://localhost:5173/dashboard.html#properties`
- `http://localhost:5173/dashboard.html#visits`
- `http://localhost:5173/dashboard.html#partners`
- `http://localhost:5173/dashboard.html#ai`
- `http://localhost:5173/dashboard.html#whatsapp`
- `http://localhost:5173/dashboard.html#images`
- `http://localhost:5173/dashboard.html#audit`

---

## 14. SEO Architecture

- Dynamic Title & Meta Description update logic in `updateSeoMetadata()` in `main.js`.
- Semantic HTML tags (`<h1>`, `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Google Fonts preconnect links and alt tags on all structural images.

---

## 15. Responsive Design Rules

CSS breakpoints enforced in `src/style.css` and `src/dashboard.css`:
- **Mobile Extra Small (375px & 414px)**: Single column layouts, mobile bottom navigation bar (`.mobile-bottom-nav`), responsive hamburger/drawer navigation.
- **Tablet (768px & 1024px)**: Two-column grid layouts for property cards, wrapped filter bars, collapsible sidebar navigation.
- **Desktop (1200px+)**: Multi-column property grid (3-4 columns), fixed floating sidebar (`.os-sidebar`), full header toolbar.

---

## 16. Performance Rules

- **Zero Heavy Framework Overhead**: Pure Vanilla JS & CSS ensures sub-500ms build times and instant page rendering.
- **Local Storage Caching**: Initial seed data (`PROPERTIES`, `DEFAULT_SITE_IMAGES`) is cached on first load.
- **Lazy Rendering**: Dynamic component rendering injects HTML snippets only when required.

---

## 17. Security Rules

- **Client-Side Secret Protection**: Never commit or expose secret API keys, credentials, or private user data.
- **Input Sanitization**: All user inputs in forms are trimmed and escaped before rendering to prevent XSS.

---

## 18. AI Agent Guardrails

1. **ALWAYS CREATE IMPLEMENTATION PLAN FIRST**: For every user request or task, the AI agent MUST ALWAYS create and present a detailed Implementation Plan artifact (`implementation_plan.md`) FIRST, explain the proposed changes, and obtain user approval before executing any code changes.
2. **No Unrequested Redesigns**: NEVER replace or redesign the visual identity, color scheme (`#eb5e28` orange accent), or hero section unless requested.
3. **Preserve Code Structure**: Do NOT replace existing modular architecture with monolithic single-file implementations.
4. **No Dummy Stubs**: NEVER comment out working code or return dummy fallback data.
5. **Build Verification**: ALWAYS run `npm run build` after making changes to verify zero compilation or syntax errors.

---

## 19. Protected Functionality

The following key elements must be preserved:

### Key JavaScript Functions & Interfaces
- `getProperties()`, `addProperty()`, `updateProperty()`, `deleteProperty()` in `src/utils/propertiesStore.js`.
- `getSiteImage()`, `updateSiteImage()`, `resetSiteImage()`, `addAuditLog()` in `src/utils/siteImagesStore.js`.
- `filterPropertiesList()`, `exportFilteredPropertiesToCSV()` in `src/crm-views/PropertiesView.js`.
- `renderDiscoverView()`, `filterProperties()` in `src/views/DiscoverView.js`.
- `parseCurrentRoute()`, `updateSeoMetadata()`, `renderApp()` in `src/main.js`.

### Key DOM Element IDs & Classes
- `#os-content`, `#os-app`, `.os-sidebar`, `.nav-item` in `dashboard.html`.
- `#app` in `index.html`.
- `#login-app`, `#login-form` in `login.html`.
- `#open-add-property-form-btn`, `#export-props-csv-btn`, `#prop-admin-form`, `#select-location-map-btn`, `#leaflet-interactive-map` in `PropertiesView.js`.

---

## 20. Git/GitHub Rules

- **NO Unsanctioned Git Operations**: Future AI agents MUST NOT execute `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, or `git reset` unless explicitly authorized by the user.

---

## 21. Development Workflow

1. **Inspect & Research**: Inspect existing files, understand dependencies, and identify affected components.
2. **Create Implementation Plan FIRST**: Write and present a comprehensive `implementation_plan.md` artifact detailing the problem, proposed file changes, and verification plan. Obtain explicit user approval before proceeding.
3. **Execute Edits**: Make minimal, safe, precise code changes.
4. **Verify Build**: Run `npm run build` in shell and verify 0 errors.
5. **Report**: Create `walkthrough.md` and summarize completed work clearly.

---

## 22. Verification Checklist

- [ ] `npm run build` completes with code 0 and 0 errors.
- [ ] Admin Dashboard (`dashboard.html#properties`) loads properly with full-page property form and pinpoint Leaflet map.
- [ ] Filter dropdowns in Admin Inventory correctly list matching properties.
- [ ] Export CSV downloads only currently filtered property listings.
- [ ] Public website (`index.html`) correctly syncs and displays new properties on Home Showcase and Discover pages.

---

## 23. Known Limitations / Technical Debt

- Data persistence relies on browser `localStorage` (clearing browser history or site data resets modifications back to default seed datasets unless exported/backed up).
