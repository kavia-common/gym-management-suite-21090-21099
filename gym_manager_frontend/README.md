# Gym Manager Frontend (Ocean Professional)

This project is a modern, lightweight React application for the Gym Manager suite with a clean, responsive UI and minimal dependencies.

## Key Capabilities
- Lightweight React + vanilla CSS (no heavy UI frameworks)
- Dashboard-centric layout with side navigation
- Modules: Dashboard, Memberships, Classes, Trainers, Bookings, Settings, Portals (Member, Trainer)
- Supabase integration scaffolded (auth, data hooks)
- Feature flag system for phased delivery

## Getting Started

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open http://localhost:3000 in your browser.

### `npm test`
Runs the tests in CI (non-interactive) mode.

### `npm run build`
Builds the app for production to the `build` folder.

## Phased Delivery Plan

Use feature flags to ship iteratively while keeping a single code line. Suggested phases:

1. Phase 1: Core shell and auth
   - dashboard
2. Phase 2: Core admin modules
   - memberships, classes
3. Phase 3: Directory and scheduling
   - trainers, bookings
4. Phase 4: Self-service portals
   - memberPortal, trainerPortal
5. Phase 5: Enhancements, analytics, program builder (future)

You can enable/disable modules per environment using environment variables at build time.

## Feature Flags

Feature flags are defined in `src/config/features.js`. Each flag can be toggled via environment variables:

- REACT_APP_FEATURE_DASHBOARD
- REACT_APP_FEATURE_MEMBERSHIPS
- REACT_APP_FEATURE_CLASSES
- REACT_APP_FEATURE_TRAINERS
- REACT_APP_FEATURE_BOOKINGS
- REACT_APP_FEATURE_MEMBERPORTAL
- REACT_APP_FEATURE_TRAINERPORTAL

Accepted values: true, false, 1, 0, yes, no, on, off (case-insensitive).

Defaults (can be changed in `features.js`):
- dashboard: true
- memberships: true
- classes: true
- trainers: true
- bookings: true
- memberPortal: true
- trainerPortal: true

### Using feature flags in code

Import the flags and conditionally render modules:

```js
import { features } from '../config/features';

// Example in a component:
{features.memberships && <Memberships />}
```

For routing or navigation, you can check flags before including routes or links:

```js
import { features } from '../config/features';
// e.g., only push an item if features.bookings is true
```

### Example: toggling flags for a build

On Unix-like shells:
```
REACT_APP_FEATURE_TRAINERS=false REACT_APP_FEATURE_MEMBERPORTAL=false npm start
```

Or add to a `.env` file (not committed to source control):
```
REACT_APP_FEATURE_TRAINERS=false
REACT_APP_FEATURE_MEMBERPORTAL=false
```

Note: CRA only exposes env vars prefixed with `REACT_APP_`.

## Environment Variables

Supabase client requires:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Set these in your environment or `.env` file before running the app.

## Customization

- Colors and theme variables: `src/theme/global.css`
- Common components: `src/components/common/*`
- Layout shell: `src/components/layout/*`

## Learn More

- React: https://reactjs.org/
- CRA docs (code splitting, bundle analysis, PWA, advanced config, deployment, troubleshooting) are available on the official site.
