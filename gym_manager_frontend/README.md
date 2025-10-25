# Gym Manager Frontend (Ocean Professional)

A modern, lightweight React app for the Gym Manager suite. Clean, responsive UI with minimal deps, Supabase auth/data integration, routing, state via Zustand, and feature-flagged modules.

## Quick start

1) Install dependencies
- From this folder:
  - npm install

2) Configure environment
- Copy .env.example to .env and fill in your Supabase project credentials:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

3) Run the app
- npm start
- Open http://localhost:3000

4) Run tests
- npm test
- For CI mode: npm run test:ci

5) Build for production
- npm run build

## Environment variables

Required:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Optional feature flags (override defaults from src/config/features.js):
- REACT_APP_FEATURE_DASHBOARD
- REACT_APP_FEATURE_MEMBERSHIPS
- REACT_APP_FEATURE_CLASSES
- REACT_APP_FEATURE_TRAINERS
- REACT_APP_FEATURE_BOOKINGS
- REACT_APP_FEATURE_MEMBERPORTAL
- REACT_APP_FEATURE_TRAINERPORTAL

Accepted: true, false, 1, 0, yes, no, on, off (case-insensitive).

Example:
- REACT_APP_FEATURE_TRAINERS=false REACT_APP_FEATURE_MEMBERPORTAL=false npm start

## Scripts

- npm start
  - Start development server (CRA)
- npm run build
  - Build production bundle into build/
- npm test
  - Run tests in non-watch mode
- npm run test:ci
  - Run tests in CI=true non-interactive mode
- npm run lint
  - Lint JS/JSX with ESLint (fails on warnings)
- npm run format
  - Format source files with Prettier

Note: You may need to install Prettier and ESLint globally or as dev dependencies depending on your workflow.

## Project structure (module map)

- src/
  - App.js: Router and route wiring
  - routes/
    - index.js: AuthProvider, useAuth, ProtectedRoute
  - lib/
    - supabaseClient.js: Supabase singleton (uses REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)
  - store/ (Zustand)
    - authStore.js: auth/session state + Supabase-backed actions
    - uiStore.js: UI state (sidebar, theme, toasts)
    - membershipsStore.js, classesStore.js, trainersStore.js, bookingsStore.js: scaffolds
  - data/ (Data access layer for Supabase tables)
    - membershipsApi.js, classesApi.js, trainersApi.js, bookingsApi.js, profilesApi.js
    - __tests__/membershipsApi.test.js
  - hooks/ (Feature/Entity hooks)
    - useMembers.js, useClasses.js, useTrainers.js, useBookings.js, useProfile.js
  - components/
    - common/: Badge, Button, Card, DataTable, Input, Loader, Modal, Select, Snackbar, StatsGrid, Table
    - layout/: Shell, Sidebar, Topbar
    - portals/member/: MyMembership, MyBookings, MySchedule
    - portals/trainer/: MyClasses, AttendanceList
  - pages/
    - Dashboard.jsx, Memberships.jsx, Classes.jsx, Trainers.jsx, Bookings.jsx, Settings.jsx
    - auth/: SignIn.jsx, SignUp.jsx, ForgotPassword.jsx, ResetPassword.jsx
    - portals/: MemberPortal.jsx, TrainerPortal.jsx, RoleRedirect.jsx
  - config/
    - features.js: Feature flags with env overrides
  - theme/
    - colors.js, global.css
  - __tests__/
    - auth.test.jsx, routing.test.jsx
  - testUtils/
    - renderWithProviders.jsx, supabaseMock.js
  - index.js, index.css, App.css, setupTests.js

## Feature flags usage

Import and conditionally render:
- import { features } from '../config/features';
- Example: {features.memberships && <Memberships />}

## Notes

- CRA only exposes env vars prefixed with REACT_APP_.
- Do not commit your .env. Use .env.example as a template.

## Phased delivery (suggested)

1) Phase 1: Core shell and auth (dashboard)
2) Phase 2: Admin modules (memberships, classes)
3) Phase 3: Directory/scheduling (trainers, bookings)
4) Phase 4: Self-service portals (member, trainer)
5) Phase 5: Enhancements, analytics, program builder (future)

## Learn more

- React: https://reactjs.org/
- Create React App docs: https://create-react-app.dev
