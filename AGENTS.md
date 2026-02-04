# Calendario Laboral - AI Agent Guide

## Project Overview

**Calendario Laboral** is a platform for publishing and negotiating work shifts between colleagues, organized by company and province. It provides a monthly calendar view where users can publish shift offers, negotiate terms through a built-in chat, and manage their profile preferences.

The application is currently in a prototype/MVP state with mock data and simulated API calls. The interface is in Spanish.

## Technology Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Runtime**: Node.js with npm workspaces
- **Frontend**: React 18.3.1, TypeScript 5.9.3
- **Styling**: Custom CSS (no CSS framework)
- **Architecture**: Single-page application with client-side navigation

## Project Structure

```
CalendarioLaboral/
├── package.json              # Root workspace configuration
├── README.md                 # Basic project info
├── apps/
│   └── web/                  # Next.js web application
│       ├── app/              # Next.js App Router
│       │   ├── layout.tsx    # Root layout (metadata, HTML structure)
│       │   ├── page.tsx      # Main page component (SPA logic)
│       │   └── globals.css   # Global styles with CSS variables
│       ├── components/       # React components
│       │   ├── Calendar.tsx          # Monthly calendar grid
│       │   ├── OfferList.tsx         # Day's offers list
│       │   ├── OfferForm.tsx         # Create offer form
│       │   ├── NegotiationPanel.tsx  # Chat for negotiations
│       │   ├── Sidebar.tsx           # Navigation sidebar
│       │   ├── AuthCard.tsx          # Login/logout UI
│       │   ├── CompanySelector.tsx   # Company selection/creation
│       │   ├── DepartmentsFilter.tsx # Department filter chips
│       │   └── NotificationPreferences.tsx # Notification settings
│       ├── types.ts          # TypeScript type definitions
│       ├── next.config.js    # Next.js configuration
│       ├── tsconfig.json     # TypeScript configuration
│       └── package.json      # App dependencies
└── node_modules/
```

## Build and Development Commands

All commands should be run from the project root:

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Create production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

The project uses npm workspaces, so these commands delegate to the `apps/web` workspace using the `-w` flag.

## Application Architecture

### State Management
- Uses React hooks (`useState`, `useEffect`, `useMemo`) for state management
- No external state management library (Redux, Zustand, etc.)
- Main state is centralized in `page.tsx` and passed down to components

### Data Flow
- Currently uses **mock data** with simulated async functions
- Example: `fetchOffersMock()` in `page.tsx` simulates API latency (300ms)
- Data is stored in local component state, not persisted

### Navigation
- Client-side routing using state-based navigation (not Next.js routing)
- `currentPath` state switches between `/calendario` and `/perfil` views
- Single-page application behavior within the main page

### Key Types (from `types.ts`)

```typescript
OfferSummary      # Display representation of an offer
Offer             # Full offer with form fields
UserProfile       # User with companies, departments, notifications
Company           # Company with province
Department        # Department linked to company
NegotiationMessage # Chat message in negotiation
NotificationPreferences # Email, push, in-app settings
```

## Component Guidelines

### Component Conventions
- All components are functional components with TypeScript props
- Props interfaces are defined inline using JSDoc-style type annotations
- Components use named exports (`export function ComponentName`)
- Event handlers are passed as callback props from parent

### Styling Conventions
- Uses CSS custom properties (variables) defined in `:root`
- Key CSS variables: `--bg`, `--surface`, `--primary`, `--text`, `--muted`
- Utility classes: `.panel`, `.grid`, `.button`, `.button.primary`
- Components use BEM-like naming for specific classes

### Accessibility
- Calendar has ARIA attributes: `role="grid"`, `aria-label`, `aria-pressed`
- Buttons have `aria-label` where text is not descriptive
- Semantic HTML: `<aside>`, `<nav>`, `<main>`, `<article>`

## Development Notes

### Mock Authentication
- Auth is fully mocked in `AuthCard.tsx`
- Clicking "Continuar con Google" creates a mock user
- No real authentication provider implemented

### Mock Companies & Departments
- Companies and departments are hardcoded in `page.tsx` state
- Provinces list is defined in `CompanySelector.tsx`
- Creating a new company uses browser `prompt()` dialogs

### Calendar Logic
- Calendar displays current month with navigation
- Offers are displayed as "pills" on calendar days
- Maximum 2 pills shown per day, excess shows "+N más"
- Days are calculated dynamically based on month/year

### Offer Types
Offers display badges with these types:
- "Nueva" (New) - Default blue
- "Alta demanda" (High demand) - Orange/warning
- "Aceptación rápida" (Quick acceptance) - Green/success

## Testing Strategy

**Current state**: No tests are configured.

If adding tests:
- Use Jest + React Testing Library (standard for Next.js)
- Mock data functions should be extracted for testability
- Component tests should focus on user interactions

## Future Considerations

### Backend Integration Points
The following are currently mocked and need real API integration:

1. **Authentication**: Replace mock login with real auth provider (Auth0, Firebase Auth, etc.)
2. **Offers API**: `fetchOffersMock()` → real fetch to `/api/offers`
3. **User Profile**: Hardcoded user → `/api/user/profile`
4. **Companies/Departments**: Hardcoded lists → `/api/companies`, `/api/departments`
5. **Negotiation Messages**: Local state → WebSocket or polling to `/api/messages`

### Database Schema (Suggested)
Based on current types, entities needed:
- Users (authentication, profile)
- Companies (name, province)
- Departments (name, company_id)
- Offers (date, description, amount, status, owner_id, department_id)
- NegotiationMessages (offer_id, author_id, text, created_at)
- UserCompanies (user_id, company_id) - many-to-many
- UserDepartments (user_id, department_id) - many-to-many

## Code Style Guidelines

### TypeScript
- Strict mode enabled in `tsconfig.json`
- Prefer explicit types over `any`
- Use `type` for object definitions (not `interface`)

### Naming Conventions
- Components: PascalCase (`OfferCard.tsx`)
- Functions: camelCase (`handlePublish`)
- Types: PascalCase (`OfferSummary`)
- CSS classes: kebab-case (`.offer-card`)

### File Organization
- One component per file (except very small related components)
- Types in dedicated `types.ts` file
- Styles in `globals.css` (no CSS modules currently)

## Security Considerations

**Current limitations to address before production:**

1. No authentication validation - all auth is mocked
2. No input sanitization on form fields
3. No CSRF protection for future API calls
4. No rate limiting on offer creation
5. Company creation uses `prompt()` - not secure or accessible

## Deployment

Standard Next.js deployment options:
- **Vercel** (recommended): Zero-config deployment
- **Node.js server**: `npm run build && npm run start`
- **Static export**: Would need configuration changes (uses client-side features)

The app uses Next.js default server-side rendering for the initial load, but all interactions are client-side.
