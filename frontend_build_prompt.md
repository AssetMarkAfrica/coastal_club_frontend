# Estrella del Mar — Full Frontend Build Prompt for Lovable

## Project Overview

Build the complete frontend for **Estrella del Mar**, a premium private members' club management platform. The frontend is a React SPA that communicates with a Django REST Framework backend via JWT-authenticated API calls.

**Key constraints:**
- React + TypeScript
- Redux Toolkit for all global state
- Axios with JWT interceptors for all API calls
- React Router v6 for navigation
- Tailwind CSS for styling
- The UI must look **lavish, grand, and unmistakably premium** — think five-star hotel meets exclusive private club. Use deep navy (`#1E3A5F`), rich gold (`#D4AF37`), champagne whites (`#F8F1DF`), and warm cream backgrounds. Every surface, button, and card must feel expensive.

---

## Design System & Theme

### Color Palette

```
--color-navy:           #1E3A5F   (primary brand, headers, footers, nav)
--color-navy-deep:      #10243F   (darker navy for depth)
--color-gold:           #D4AF37   (primary accent — CTAs, highlights, icons)
--color-gold-light:     #F1E0A6   (subtle gold tint for backgrounds)
--color-gold-muted:     #B7922B   (secondary gold, hover states)
--color-cream:          #F8F1DF   (page background)
--color-cream-dark:     #EDE3CC   (card borders, dividers)
--color-white:          #FFFFFF
--color-text-primary:   #1A1A1A
--color-text-secondary: #4A4A4A
--color-text-muted:     #6B7280
--color-success:        #0F766E
--color-warning:        #B45309
--color-danger:         #B42318
--color-info:           #185FA5
```

### Typography

- **Headings**: `Cormorant Garamond` or `Playfair Display` (Google Fonts) — editorial, high-end serif
- **Body / UI**: `Inter` — clean, modern sans-serif
- Heading sizes: H1 = 48px, H2 = 36px, H3 = 28px, H4 = 22px, H5 = 18px
- Body: 16px, line-height 1.7
- Small/label: 13px, letter-spacing 0.08em, UPPERCASE for section labels

### Aesthetic Rules

- Gold hairline borders (`1px solid rgba(212,175,55,0.3)`) on all cards
- Subtle gold shimmer on hover for interactive elements (use CSS transition on box-shadow or border-color)
- Navy gradient header bars: `linear-gradient(135deg, #10243F 0%, #1E3A5F 100%)`
- Cream background on all pages: `#F8F1DF`
- Cards: white background, `border: 1px solid rgba(212,175,55,0.25)`, `border-radius: 12px`, `box-shadow: 0 4px 24px rgba(30,58,95,0.08)`
- Gold dividers between sections: `1px solid rgba(212,175,55,0.4)`
- All primary buttons: navy background, gold text, gold border — on hover: gold background, navy text
- All secondary buttons: transparent, gold border, gold text — on hover: gold fill at 10% opacity

### Component Conventions

- Input fields: cream background, navy border on focus, gold focus ring (`outline: 2px solid rgba(212,175,55,0.6)`)
- Badges/pills: status-coded with soft backgrounds and dark text
- Tables: striped with `#F8F1DF` and white, gold bottom border on header row
- Loading skeletons: animated shimmer in cream tones
- Toast notifications: top-right, dark navy with gold left border accent
- Modal overlays: dark navy tint (`rgba(16,36,63,0.7)`) backdrop

---

## Tech Stack & Architecture

### Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5",
  "react-router-dom": "^6",
  "@reduxjs/toolkit": "^2",
  "react-redux": "^9",
  "axios": "^1",
  "tailwindcss": "^3",
  "react-hot-toast": "^2",
  "react-hook-form": "^7",
  "zod": "^3",
  "@hookform/resolvers": "^3",
  "date-fns": "^3",
  "lucide-react": "^0.383.0",
  "clsx": "^2",
  "tailwind-merge": "^2"
}
```

### Project Structure

```
src/
├── api/
│   ├── axiosClient.ts          # Axios instance + interceptors
│   └── endpoints.ts            # All API endpoint constants
├── app/
│   ├── store.ts                # Redux store configuration
│   └── hooks.ts                # Typed useAppDispatch / useAppSelector
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authApi.ts
│   │   └── components/
│   ├── memberships/
│   │   ├── membershipSlice.ts
│   │   ├── membershipApi.ts
│   │   └── components/
│   ├── cards/
│   │   ├── cardSlice.ts
│   │   ├── cardApi.ts
│   │   └── components/
│   ├── notifications/
│   │   ├── notificationSlice.ts
│   │   ├── notificationApi.ts
│   │   └── components/
│   └── profiles/
│       ├── profileSlice.ts
│       ├── profileApi.ts
│       └── components/
├── components/
│   ├── ui/                     # Reusable primitives: Button, Input, Badge, Modal, etc.
│   ├── layout/                 # AppShell, Sidebar, TopBar, PageHeader
│   └── shared/                 # LoadingSpinner, EmptyState, ErrorBoundary
├── pages/
│   ├── auth/
│   ├── member/
│   └── admin/
├── routes/
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx
│   └── AppRouter.tsx
├── hooks/                      # Custom hooks
├── types/                      # All TypeScript interfaces and enums
├── utils/                      # formatCurrency, formatDate, cn(), etc.
└── constants/                  # API base URL, tier names, etc.
```

---

## API Layer

### Axios Client (`src/api/axiosClient.ts`)

Create a single Axios instance used everywhere. Implement full JWT interceptor logic:

```typescript
import axios from 'axios';
import { store } from '../app/store';
import { setTokens, clearAuth } from '../features/auth/authSlice';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:81',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// REQUEST INTERCEPTOR — attach access token to every request
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — handle 401, auto-refresh, retry
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = store.getState().auth.refreshToken;

      if (!refreshToken) {
        store.dispatch(clearAuth());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:81'}/api/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        const newAccess = data.access;
        store.dispatch(setTokens({ accessToken: newAccess, refreshToken: data.refresh || refreshToken }));
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearAuth());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
```

### API Endpoints (`src/api/endpoints.ts`)

```typescript
export const API = {
  AUTH: {
    REGISTER:          '/api/auth/register/',
    LOGIN:             '/api/auth/login/',
    LOGOUT:            '/api/auth/logout/',
    REFRESH:           '/api/auth/token/refresh/',
    ME:                '/api/auth/me/',
    GOOGLE_AUTHORIZE:  '/api/auth/google/',
    GOOGLE_CALLBACK:   '/api/auth/google/callback/',
  },
  PROFILE: {
    ME:                '/api/profile/me/',
  },
  MEMBERSHIPS: {
    PLANS:             '/api/memberships/plans/',
    APPLICATIONS:      '/api/memberships/applications/',
    VERIFY_APP_FEE:    '/api/memberships/applications/verify/',
    CHECKOUT:          '/api/memberships/checkout/',
    VERIFY:            '/api/memberships/verify/',
    MY_SUBSCRIPTION:   '/api/memberships/me/',
    MAINTENANCE_FEE_CHECKOUT: '/api/memberships/maintenance-fee/checkout/',
    MAINTENANCE_FEE_VERIFY:   '/api/memberships/maintenance-fee/verify/',
    CONTRACT_ME:       '/api/memberships/contracts/me/',
    CONTRACT_ACCEPT:   (id: string) => `/api/memberships/contracts/${id}/accept/`,
    ADMIN: {
      APPLICATIONS:    '/api/memberships/admin/applications/',
      APPROVE:         '/api/memberships/admin/applications/approve/',
      APPROVE_BULK:    '/api/memberships/admin/applications/approve/bulk/',
      REJECT:          '/api/memberships/admin/applications/reject/',
      REJECT_BULK:     '/api/memberships/admin/applications/reject/bulk/',
    },
  },
  CARDS: {
    ME:                '/api/cards/me/',
    SCAN:              '/api/cards/scan/',
  },
  NOTIFICATIONS: {
    LIST:              '/api/notifications/',
    UNREAD_COUNT:      '/api/notifications/unread-count/',
    MARK_READ:         (id: string) => `/api/notifications/${id}/read/`,
    MARK_ALL_READ:     '/api/notifications/read-all/',
  },
};
```

---

## Redux Store

### Store (`src/app/store.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import membershipReducer from '../features/memberships/membershipSlice';
import cardReducer from '../features/cards/cardSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import profileReducer from '../features/profiles/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    membership: membershipReducer,
    card: cardReducer,
    notifications: notificationReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice (`src/features/auth/authSlice.ts`)

State shape:
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

Actions: `setTokens`, `setUser`, `clearAuth`, `setLoading`, `setError`

Persist `accessToken` and `refreshToken` to `localStorage` on every change. On app boot, rehydrate from `localStorage`.

### Membership Slice

State shape:
```typescript
interface MembershipState {
  plans: MembershipPlan[];
  subscription: Subscription | null;
  applications: MembershipApplication[];
  contract: MembershipContract | null;
  adminApplications: MembershipApplication[];
  isLoading: boolean;
  error: string | null;
}
```

### Notification Slice

State shape:
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}
```

Poll unread count every 60 seconds when authenticated.

### Card Slice

State shape:
```typescript
interface CardState {
  card: MemberCard | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## TypeScript Types (`src/types/index.ts`)

```typescript
export type UserRole = 'member' | 'admin';
export type AuthProvider = 'email' | 'google';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  auth_provider: AuthProvider;
  role: UserRole;
  profile: UserProfile | null;
  created_at: string;
}

export interface UserProfile {
  gender: string;
  date_of_birth: string | null;
  age: number | null;
  phone_number: string;
  nationality: string;
  occupation: string;
  id_type: string;
  id_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region_state: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bio: string;
  is_profile_complete: boolean;
  missing_required_fields: string[];
  created_at: string;
  updated_at: string;
}

export type MembershipTier = 'social' | 'sports' | 'premier' | 'corporate';

export interface MembershipPlanBenefit {
  id: number;
  benefit_type: 'standard' | 'festive';
  title: string;
  description: string;
  festive_name: string;
  festive_start_date: string | null;
  festive_end_date: string | null;
  sort_order: number;
  is_active: boolean;
  is_currently_available: boolean;
}

export interface MembershipPlan {
  id: number;
  tier: MembershipTier;
  name: string;
  annual_fee_pesewas: number;
  club_maintenance_fee_pesewas: number;
  signup_bonus_spend_credit_pesewas: number;
  initiation_fee_pesewas: number;
  fb_minimum_pesewas: number;
  points_multiplier: string;
  guest_passes_per_visit: number;
  benefits: MembershipPlanBenefit[];
}

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'suspended' | 'cancelled';
export type MaintenanceFeeStatus = 'paid' | 'unpaid' | 'bonus_active';

export interface Subscription {
  id: string;
  plan: MembershipPlan;
  status: SubscriptionStatus;
  is_active: boolean;
  billing_cycle: 'annual';
  current_period_start: string | null;
  current_period_end: string | null;
  fb_spend_this_month_pesewas: number;
  monthly_spend_credit_pesewas: number;
  spend_credit_remaining_pesewas: number;
  maintenance_fee_due_pesewas: number;
  maintenance_fee_status: MaintenanceFeeStatus;
  is_maintenance_fee_paid_current_month: boolean;
  is_signup_bonus_active: boolean;
  signup_bonus_expires_on: string | null;
  maintenance_fee_paid_through_month: string | null;
  maintenance_fee_paid_at: string | null;
  created_at: string;
}

export type ApplicationStatus = 'pending_fee' | 'pending_review' | 'approved' | 'rejected';

export interface MembershipApplication {
  id: string;
  applicant: User;
  plan: MembershipPlan;
  status: ApplicationStatus;
  contract_id: string | null;
  contract_status: string | null;
  application_fee_reference: string;
  application_fee_paid_at: string | null;
  approved_at: string | null;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipContract {
  id: string;
  application: string;
  plan: MembershipPlan;
  status: 'pending' | 'accepted';
  contract_version: string;
  content: string;
  currency: string;
  application_fee_paid_pesewas: string;
  initiation_fee_pesewas: string;
  annual_fee_pesewas: string;
  total_due_now_pesewas: string;
  monthly_maintenance_fee_pesewas: string;
  paystack_reference: string;
  payment_authorization_url: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
  accepted_club_rules: boolean;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberCard {
  id: string;
  member_number: string;
  member_name: string;
  tier: MembershipTier;
  plan_name: string;
  status: 'active' | 'suspended';
  maintenance_fee_status: MaintenanceFeeStatus;
  maintenance_fee_due_pesewas: number;
  is_maintenance_fee_paid_current_month: boolean;
  is_signup_bonus_active: boolean;
  signup_bonus_expires_on: string | null;
  monthly_spend_credit_pesewas: number;
  spend_credit_remaining_pesewas: number;
  qr_image_url: string | null;
  issued_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'GENERAL' | 'MEMBERSHIP' | 'MAINTENANCE' | 'EVENT' | 'SECURITY';
  metadata: Record<string, any>;
  is_read: boolean;
  timestamp: string;
}
```

---

## Utility Functions (`src/utils/index.ts`)

```typescript
// Format pesewas (integer) to "GHc X.XX"
export const formatCurrency = (pesewas: number): string => {
  return `GHc ${(pesewas / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Tier display names
export const tierLabel: Record<string, string> = {
  social: 'Social',
  sports: 'Sports',
  premier: 'Premier',
  corporate: 'Corporate',
};

// cn() for conditional Tailwind classes
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Parse API error message from AxiosError
export const parseApiError = (error: any): string => {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    'An unexpected error occurred.'
  );
};
```

---

## Routing (`src/routes/AppRouter.tsx`)

```
Route map:

PUBLIC (no auth required):
  /login
  /register
  /google/callback
  /cards/scan?token=...       <- public QR scan result page
  /plans                      <- public membership plans listing

PROTECTED (authenticated members):
  /                           <- redirects based on role
  /dashboard                  <- member dashboard
  /membership                 <- my subscription details
  /membership/apply           <- apply for membership (plan selection)
  /membership/apply/verify    <- verify application fee payment
  /membership/contract        <- view and accept contract
  /membership/checkout        <- payment checkout (redirect to Paystack)
  /membership/verify          <- verify subscription payment
  /membership/maintenance     <- pay monthly maintenance fee
  /card                       <- my digital member card
  /notifications              <- all notifications list
  /profile                    <- profile management
  /settings                   <- account settings

ADMIN ONLY:
  /admin                      <- admin dashboard
  /admin/applications         <- manage all applications
  /admin/applications/:id     <- single application detail
```

**ProtectedRoute.tsx**: Checks `isAuthenticated` from Redux. If false, redirects to `/login`. On mount, attempts to rehydrate auth from localStorage before deciding.

**AdminRoute.tsx**: Checks `user.role === 'admin'`. If not admin, redirects to `/dashboard`.

---

## Pages

---

### Auth Pages

#### Login Page (`/login`)

A full-page split layout:

**Left panel (50% width on desktop, hidden on mobile):**
- Full-height navy gradient background: `linear-gradient(160deg, #10243F 0%, #1E3A5F 60%, #2A4F7A 100%)`
- Centered content: Estrella del Mar logo (Playfair Display, 42px, gold), ornamental gold divider line, italic tagline in cream ("Where Excellence Meets Distinction"), bottom-left small gold crest/monogram graphic using CSS
- Subtle repeating geometric pattern overlay in navy (very low opacity)

**Right panel (50% width on desktop, full width on mobile):**
- Cream background `#F8F1DF`
- Centered form card: white background, gold border, 48px padding, 12px border-radius
- "Welcome Back" heading in Playfair Display
- "Sign in to your membership portal" subtitle in muted text
- Email input, Password input (with show/hide toggle)
- "Sign In" primary button (full width, navy/gold)
- Gold divider with "or" text
- "Continue with Google" button (white, gold border, Google SVG icon)
- Link to register page
- Error message in red below form

On success: dispatch setTokens + setUser to Redux, persist to localStorage, redirect based on role.

#### Register Page (`/register`)

Same split layout as login. Form fields:
- Full Name
- Email
- Password (with live strength indicator bar: weak=red, fair=amber, strong=green)
- Confirm Password
- Role: styled dropdown/select — "Member" (default) or "Admin"

On success: dispatch tokens + user, redirect to `/dashboard`.

#### Google Callback Page (`/google/callback`)

On mount: extract `?code=` from URL params, POST to `/api/auth/google/callback/` with `{ code }`, dispatch tokens + user to Redux, redirect based on role. Full-screen loading state with centered Estrella del Mar logo and gold spinner animation.

---

### Layout Components

#### AppShell (`src/components/layout/AppShell.tsx`)

Wraps all authenticated pages. Composed of:
- Sidebar (fixed, 260px wide on desktop)
- Main content area (flex-1, cream background, overflow-y-auto)
- TopBar (sticky, 64px height)

On mobile: sidebar hidden, TopBar shows hamburger menu that opens sidebar as a full-height drawer from the left with navy overlay backdrop.

#### Sidebar

**Design:**
- Background: `#10243F` (deep navy)
- Logo section at top: Estrella del Mar in Playfair Display gold, small ornamental gold rule below, 24px padding
- Navigation items: each item has a Lucide icon (20px, gold-muted) + label (Inter 14px, cream/80)
- Active state: `background: rgba(212,175,55,0.12)`, `border-left: 3px solid #D4AF37`, gold icon and text
- Hover state: `background: rgba(212,175,55,0.07)`, slightly brighter text
- Navigation items separated into groups with thin gold dividers
- Bottom section: user avatar (40px circle), user name (Playfair Display), role badge (gold pill for admin, navy pill for member), logout button

**Member nav items (with Lucide icons):**
- Dashboard — `LayoutDashboard`
- My Membership — `Crown`
- My Card — `CreditCard`
- Notifications — `Bell` (with unread count badge in gold)
- Profile — `User`
- Settings — `Settings`

**Admin nav items:**
- Admin Dashboard — `LayoutDashboard`
- Applications — `FileCheck` (with pending count badge in amber)
- Settings — `Settings`

#### TopBar

- Background: white, `border-bottom: 1px solid rgba(212,175,55,0.2)`, 64px height
- Left: page title (Playfair Display, 20px, navy)
- Right: notification bell (Lucide `Bell`, 22px) with unread count badge, user avatar circle with dropdown (Profile, Settings, Logout)

---

### Member Pages

#### Member Dashboard (`/dashboard`)

**Welcome Banner:**
Full-width card with navy gradient background, gold border. Grid: left side has "Welcome back, [Name]" (Playfair Display 32px, white), membership tier badge (gold pill), plan name subtitle. Right side: "Member Since [date]", "Valid Until [date]", membership status badge. If no active subscription, this area instead shows a CTA card: "Begin Your Membership Journey" with an "Apply Now" button.

**Stats Row — 4 metric cards:**
All white background, 4px gold top border, `box-shadow: 0 4px 20px rgba(30,58,95,0.07)`:
1. Spend Credit Remaining — gold number, small progress bar (gold fill on cream track) showing remaining vs total
2. Monthly Dues — badge showing "Bonus Active", "Paid", or "Unpaid" status
3. Membership Valid Until — date in navy
4. Guest Passes — number in gold

**Quick Actions grid (2x2 on mobile, 4x1 on desktop):**
Each action is a card with a large Lucide icon (gold, 28px), bold label, arrow icon. Hover: card lifts slightly, gold border brightens.
- View My Card
- Pay Maintenance Fee
- Update Profile
- View Subscription

**Recent Notifications (last 5):**
Compact list. Each item: colored dot (by notification type), title in navy, message truncated to 1 line, relative timestamp. Unread items have slightly darker background. "View All" link at bottom.

**Current Plan Benefits:**
Display all benefits from the active plan. Two columns: standard benefits (always visible) as gold checkmark list items, festive benefits (if any) in a separate section with calendar date badge showing if currently active (green "Active Now" label) or upcoming.

---

#### My Membership Page (`/membership`)

Fetch from `/api/memberships/me/`.

**Plan header card:** navy gradient, gold border. Left: plan name (Playfair Display 28px, white), tier badge, status badge. Right: billing cycle, creation date.

**Financial summary card:**
4-cell grid:
- Annual Fee
- Initiation Fee (from contract, displayed as informational)
- Monthly Maintenance Fee
- Total Spend Credit This Month

**Membership period card:**
Visual horizontal timeline bar from `current_period_start` to `current_period_end`. Gold filled to represent time elapsed. Labels: start date, today marker (gold dot), end date.

**Maintenance Fee card:**
Shows current month status. Three states:
1. `is_signup_bonus_active`: gold banner "Signup Bonus Active — no maintenance fee required until [date]"
2. `is_maintenance_fee_paid_current_month`: green banner "Maintenance fee paid for [Month Year]", spend credit amount
3. Unpaid + bonus expired: amber warning card showing amount due, "Pay Now" button

**Spend Credit card:**
Progress bar (gold) showing `spend_credit_remaining_pesewas` of `monthly_spend_credit_pesewas`. Labels: spent amount, remaining amount.

---

#### Apply for Membership Page (`/membership/apply`)

**Profile completion check:** On page load, if `user.profile.is_profile_complete === false`, show a full-width amber warning banner at the top listing the `missing_required_fields` (formatted nicely) with a "Complete Profile" button. Disable plan selection cards while profile is incomplete.

**Page heading:** "Choose Your Membership" in Playfair Display 36px, centered.

**Plan cards grid (responsive: 1 col mobile, 2 col tablet, 4 col desktop):**

Each plan card:
- Navy gradient top header section (80px): tier name in Playfair Display gold
- "Most Popular" gold badge overlay on Premier plan (top-right corner)
- White card body:
  - Annual fee (large, 32px, gold, Playfair Display)
  - "per year" label in muted text
  - Gold divider
  - Initiation fee row
  - Monthly maintenance fee row
  - Signup bonus credit row (gold chip if > 0)
  - Guest passes per visit
  - Gold divider
  - Benefits list with gold checkmark icons
  - "Apply for [Tier]" button (full width, primary style) at bottom

**Application fee confirmation modal (opens after plan selection):**
- Modal header: "Confirm Application"
- Application fee amount prominently displayed
- Plan selected (name + tier badge)
- Optional callback URL input with helper text
- Terms note: "A non-refundable application fee of GHc X.XX is required to process your application"
- "Proceed to Payment" button + "Cancel" link

On confirmation: POST to `/api/memberships/applications/`, redirect to Paystack URL.

---

#### Verify Application Fee Page (`/membership/apply/verify`)

Show:
- Reference number in a code chip
- Current status: "Awaiting Payment Verification" with clock icon
- Large "Verify Payment" primary button
- Helper text: "Clicked the payment link? Return here to verify your payment"

On verify success: animated success state — gold checkmark, "Application Under Review" heading, message about 48-hour review window. Auto-redirect to `/dashboard` after 5 seconds.

On failure: red error card with retry button.

---

#### My Contract Page (`/membership/contract`)

Fetch from `/api/memberships/contracts/me/`.

If no contract: show empty state with "Your contract will appear here once your application is approved."

**Contract viewer:**
- Premium styled parchment-like card: cream background, gold border, subtle texture
- Contract header: "Estrella del Mar MEMBERSHIP AGREEMENT" in Playfair Display, version and date
- Member name and plan prominently displayed
- **Financial summary table** (bordered, gold header row): Application Fee Paid, Initiation Fee, Annual Fee, Total Due Now, Monthly Maintenance Fee
- Contract text body in Inter 15px with 1.8 line height, divided into labeled sections
- Gold divider between sections

**Acceptance section (pinned to bottom or below contract):**
Three checkboxes (all must be checked to enable acceptance):
- "I have read and agree to the Terms of Service"
- "I have read and agree to the Privacy Policy"
- "I agree to abide by the Club Rules and Conduct Requirements"

"Accept Contract & Proceed to Payment" button — disabled until all three are checked, full width, large (48px height), primary style.

On acceptance: POST to `/api/memberships/contracts/{id}/accept/`, receive `payment_authorization_url`, redirect to Paystack.

---

#### Payment Verify Page (`/membership/verify`)

On mount: extract `?reference=` from URL, call `/api/memberships/verify/?reference=...`.

Loading state: centered gold spinner, "Verifying your payment..." text.

Success state: animated gold checkmark (scale in), "Membership Activated!" in Playfair Display, confetti or gold particle burst effect, updated subscription details (plan name, tier, valid until). "Go to My Dashboard" button. Auto-redirect in 5 seconds.

Failure state: red X icon, error message, "Try Again" and "Contact Support" buttons.

---

#### Maintenance Fee Page (`/membership/maintenance`)

Show current subscription and maintenance fee details. Call POST to `/api/memberships/maintenance-fee/checkout/` to initiate payment. After returning from Paystack, call GET `/api/memberships/maintenance-fee/verify/?reference=...`.

Show updated spend credit on success with a green confirmation card.

---

#### My Card Page (`/card`)

Fetch from `/api/cards/me/`.

**Digital card component (realistic card proportions: ~340px x 214px, responsive):**

Front face:
- Background: navy gradient with subtle diagonal gold lines pattern overlay
- Top-left: "Estrella del Mar" in Playfair Display, 13px, gold, letter-spacing wide
- Middle: member name in large Playfair Display white
- Bottom-left: "CC" monogram logo
- Bottom-right: tier badge in gold
- Right edge: member number vertically aligned
- Gold embossed border (1.5px solid rgba(212,175,55,0.6))

Back face (toggle with "Show QR" button):
- White background
- QR code centered (use `<img>` with `qr_image_url`)
- "Scan to Verify Membership" label in navy
- Member number below

**Flip animation:** CSS 3D transform `rotateY(180deg)` transition on click of "Show QR Code" / "Show Card" toggle button.

**Status section below card:**
- Card status badge (Active/Suspended)
- Maintenance fee status with icon
- Signup bonus countdown if active
- Spend credit remaining (progress bar)

---

#### Public QR Scan Page (`/cards/scan`)

Fully public. No auth, no layout wrapper — standalone minimal page.

On mount: extract `?token=` from URL, call GET `/api/cards/scan/?token=...`.

Loading state: centered spinner on white background.

**Verified result:**
- Full-screen centered layout, white background
- Estrella del Mar logo at top (navy text, small)
- Large gold animated checkmark (SVG or CSS, ~80px)
- "VERIFIED" in large Playfair Display green
- "Active Member" subtitle
- Divider
- Member name (large)
- Member number
- Tier badge
- "Valid Until [date]"
- Maintenance fee status

**Not Verified result:**
- Same layout but large red X icon
- "NOT VERIFIED" in red
- "Membership Inactive" subtitle
- Member name and number still shown
- Reason indicator if possible

---

#### Notifications Page (`/notifications`)

Fetch from `/api/notifications/`.

**Page header:** "Notifications" title + "Mark All as Read" button (ghost style, right-aligned).

**Notification list:**
Each item is a card row:
- Left: colored icon circle (by notification_type):
  - MEMBERSHIP: navy/gold crown icon
  - MAINTENANCE: gold wallet icon
  - SECURITY: blue shield icon
  - EVENT: green calendar icon
  - GENERAL: gray bell icon
- Center: title (bold if unread, regular if read), message (2 lines, truncated), relative timestamp
- Right: unread gold dot if `is_read === false`
- Click item: mark as read, subtle fade to read state

Empty state: centered bell icon, "No notifications yet" text.

---

#### Profile Page (`/profile`)

Fetch from `/api/profile/me/`. PATCH on save.

**Profile completion bar at top:**
Cream card with label "Profile Completion", large progress bar (gold fill), percentage text. Below: list of `missing_required_fields` as gold chips if any are missing.

**Profile sections (each in its own card):**

1. Personal Information — gender (select), date_of_birth (date input), phone_number, nationality, occupation
2. Identification — id_type (select: National ID, Passport, Driver's License, etc.), id_number
3. Address — address_line1, address_line2, city, region_state, postal_code, country
4. Emergency Contact — emergency_contact_name, emergency_contact_phone
5. About — bio (textarea)

Each section has a "Save Changes" button that patches only that section's fields. Show inline success confirmation ("Saved ✓") after successful PATCH.

---

### Admin Pages

#### Admin Dashboard (`/admin`)

Stats row (3 cards):
- Total Applications (number)
- Pending Review (highlighted in amber if > 0)
- Active Members

Recent applications table (last 10): columns — Name, Email, Plan, Status, Applied, Actions (Approve / Reject quick action buttons).

---

#### Admin Applications Page (`/admin/applications`)

Fetch from `/api/memberships/admin/applications/`.

**Filter tabs:** All | Pending Review | Approved | Rejected (with count badges)

**Search bar:** filter by name or email client-side.

**Bulk action bar** (appears when any checkbox selected, sticky below filter bar):
- "X applications selected"
- "Approve Selected" green button
- "Reject Selected" red button

**Applications table (DataTable component):**
Columns:
- Checkbox (select row)
- Applicant (avatar + name + email stacked)
- Plan Tier (badge)
- Status (StatusBadge component)
- Contract Status (badge or dash)
- Applied Date
- Actions: "Approve" (green button), "Reject" (red ghost button), "View" (link icon)

**Approve single application modal:**
- Application summary (applicant name, plan, date applied)
- Callback URL input (optional, labelled "Contract payment callback URL")
- Admin notes textarea (optional)
- "Approve & Generate Contract" button (navy/gold)

**Reject single application modal:**
- Application summary
- Admin notes textarea (**required** — enforce client-side validation with error message)
- "Confirm Rejection" button (red)
- Cancel link

**Bulk approve confirmation dialog:**
- "You are about to approve [N] applications"
- Callback URL input (applied to all)
- "Confirm Bulk Approval" button

**Bulk reject confirmation dialog:**
- "You are about to reject [N] applications"
- Admin notes (optional, applied to all)
- "Confirm Bulk Rejection" button (red)

---

#### Admin Application Detail Page (`/admin/applications/:id`)

Show full details:

**Applicant card:** avatar, name, email, role badge, profile data (phone, address, nationality, occupation, ID type/number, emergency contact)

**Application summary:** plan, status, dates, admin notes

**Application timeline** (vertical stepper):
1. Application Submitted
2. Fee Paid (with timestamp)
3. Under Admin Review
4. Approved / Rejected (with admin name and timestamp)
5. Contract Sent (if applicable)
6. Contract Accepted (if applicable)
7. Payment Received (if applicable)
8. Membership Active (if applicable)

Each step: gold circle with check/clock/X icon, label, timestamp.

**Actions section** (only if `status === 'pending_review'`): Approve and Reject buttons.

---

## Forms & Validation

Use `react-hook-form` + `zod` for all forms.

### Login Schema
```typescript
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
```

### Register Schema
```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['member', 'admin']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});
```

### Profile Schema
All profile fields. `date_of_birth` validated: must not be in the future, must be a valid date. `phone_number` basic format validation.

### Contract Acceptance Schema
```typescript
const contractAcceptSchema = z.object({
  accept_terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms of Service' }) }),
  accept_privacy: z.literal(true, { errorMap: () => ({ message: 'You must accept the Privacy Policy' }) }),
  accept_club_rules: z.literal(true, { errorMap: () => ({ message: 'You must accept the Club Rules' }) }),
});
```

---

## UI Components Library (`src/components/ui/`)

### Button
```
variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
sizes: 'sm' | 'md' | 'lg'
props: isLoading (shows spinner + disables), disabled, leftIcon, rightIcon, fullWidth
```
- Primary: `bg-[#1E3A5F] text-[#D4AF37] border border-[#D4AF37]` — hover: `bg-[#D4AF37] text-[#1E3A5F]`
- Secondary: `bg-transparent text-[#D4AF37] border border-[#D4AF37]` — hover: `bg-[#D4AF37]/10`
- Ghost: `bg-transparent text-[#D4AF37] border-none` — hover: `bg-[#D4AF37]/10`
- Danger: `bg-[#B42318] text-white border-none` — hover: darker red
- All: `transition-all duration-200`, `border-radius: 8px`, `font-weight: 500`

### Input
- Base: `bg-[#F8F1DF] border border-[#EDE3CC] rounded-lg px-4 py-3 text-[#1A1A1A] placeholder-[#9CA3AF]`
- Focus: `border-[#1E3A5F] outline-none ring-2 ring-[#D4AF37]/40`
- Error: `border-[#B42318] ring-2 ring-[#B42318]/30`
- Error message: small red text below input

### Select
Same styling as Input. Custom gold chevron-down icon replacing browser default.

### Modal
- Backdrop: `bg-[#10243F]/70 backdrop-blur-sm`
- Modal box: white background, `border: 1px solid rgba(212,175,55,0.3)`, `border-radius: 12px`, max-width `560px`
- Header: navy gradient with gold bottom border, padding 20px 24px
- Body: padding 24px
- Footer: `border-top: 1px solid rgba(212,175,55,0.2)`, padding 16px 24px, flex row end
- Smooth scale-in + fade-in animation on open
- Close X button in header (top-right, gold icon)

### Badge / StatusBadge
Small rounded pills (4px radius), 12px font, 500 weight:
- `active`: `bg-green-50 text-green-800 border border-green-200`
- `pending` / `pending_fee` / `pending_review`: `bg-amber-50 text-amber-800 border border-amber-200`
- `approved`: `bg-teal-50 text-teal-800 border border-teal-200`
- `rejected` / `suspended` / `cancelled` / `expired`: `bg-red-50 text-red-800 border border-red-200`
- `gold` (tier/plan badges): `bg-[#F1E0A6] text-[#7A5C00] border border-[#D4AF37]/40`
- `navy`: `bg-[#1E3A5F]/10 text-[#1E3A5F] border border-[#1E3A5F]/20`

### Card
```
variants: 'default' | 'highlighted' | 'navy'
```
- Default: `bg-white border border-[#D4AF37]/25 rounded-xl shadow-[0_4px_24px_rgba(30,58,95,0.08)]`
- Highlighted: same + `border-t-4 border-t-[#D4AF37]`
- Navy: `bg-gradient-to-br from-[#10243F] to-[#1E3A5F] text-white border border-[#D4AF37]/30`

### LoadingSpinner
Circular CSS animation in gold (`border-color: #D4AF37`). Sizes: sm (16px), md (24px), lg (40px). Full-page variant: centered on cream background with club logo above.

### ProgressBar
- Track: `bg-[#EDE3CC] rounded-full h-2`
- Fill: `bg-[#D4AF37] rounded-full transition-all duration-700`
- Label above: left (category), right (percentage)

### EmptyState
Centered vertically. Large Lucide icon (48px, gold-muted). H3 heading in navy. Subtext in muted. Optional CTA button.

### DataTable
- Container: white card with gold border
- Header row: `bg-[#1E3A5F]`, gold text, 13px uppercase letter-spacing
- Body rows: alternating `bg-white` / `bg-[#F8F1DF]`
- Row hover: `bg-[#F1E0A6]/30` transition
- Bottom border on each row: `1px solid rgba(212,175,55,0.1)`
- Checkbox column for bulk selection
- Sticky header

### Skeleton
```
bg-gradient-to-r from-[#EDE3CC] via-[#F8F1DF] to-[#EDE3CC]
background-size: 200% 100%
animation: shimmer 1.5s infinite
```

### Divider
`<hr>` styled: `border: none; border-top: 1px solid rgba(212,175,55,0.35); margin: 1.5rem 0`

### Avatar
40px circle. If `avatar_url`: `<img>` with object-cover. If no image: initials (first + last name initial) on `bg-[#1E3A5F]` background with gold text.

### PageHeader
Used at the top of every authenticated page:
- Left: page title (Playfair Display, 28px, navy)
- Optional subtitle (muted, 15px)
- Right: optional action button(s)
- Gold bottom border below

---

## Error Handling

All API calls use the `parseApiError` utility. Surface errors via:

1. **Form errors**: inline below the relevant field via react-hook-form
2. **Page-level errors**: full-width error card at top of page with retry option
3. **Toast notifications** via react-hot-toast:
   - Success: white bg, gold left border (4px), green checkmark icon
   - Error: white bg, red left border (4px), red X icon
   - Position: top-right, 400ms enter animation

---

## Payment Flow

All Paystack payments use `window.location.href = authorization_url` to redirect (not a new tab).

**Full membership flow:**
```
Step 1: /membership/apply
  → Select plan → Confirm application fee modal
  → POST /api/memberships/applications/
  → window.location.href = authorization_url (application fee payment)

Step 2: Return to /membership/apply/verify?reference=...
  → GET /api/memberships/applications/verify/?reference=...
  → Show "Under Admin Review" confirmation

Step 3: [Admin approves in /admin/applications]
  → User receives notification

Step 4: /membership/contract
  → GET /api/memberships/contracts/me/
  → User reads + checks all 3 agreements
  → POST /api/memberships/contracts/{id}/accept/
  → window.location.href = payment_authorization_url (initiation + annual fee)

Step 5: Return to /membership/verify?reference=...
  → GET /api/memberships/verify/?reference=...
  → Membership activated! Redirect to /dashboard
```

---

## Responsive Design

- Mobile (< 768px): sidebar hidden, bottom nav or hamburger drawer, cards stack vertically, reduced padding (16px)
- Tablet (768px–1024px): compact sidebar (64px wide, icons only, hover tooltip labels), 2-column grid layouts
- Desktop (> 1024px): full sidebar (260px), multi-column grids

---

## Animations & Micro-interactions

- Page enter transition: `opacity: 0 → 1` + `translateY(8px → 0)` over 200ms
- Card hover: `transform: translateY(-3px)`, gold border color transition to full opacity
- Button hover: gold border brightens, background transitions over 150ms
- Button active/press: `transform: scale(0.97)` over 80ms
- Success states: SVG checkmark draws in with stroke animation (300ms), then scale bounce
- Loading skeleton: shimmer pulse at 1.5s
- Notification badge: pulse animation (scale 1 → 1.2 → 1, 2s infinite) when count > 0
- Digital card flip: CSS `transform: rotateY(180deg)` with `transform-style: preserve-3d`, 600ms ease

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:81
VITE_APP_NAME=Estrella del Mar
```

---

## Additional Implementation Notes

1. **Club name in UI**: Use "Estrella del Mar" everywhere in the frontend. The name "Estrella Del Mar Club" appears only in the contract content (which comes from the backend as a string) — do not change or re-label it.

2. **Currency display**: The API returns formatted strings like "GHc500.00" for contract fee fields. Raw pesewa integers (e.g. on the Subscription model) should be formatted with `formatCurrency(pesewas)`.

3. **Token persistence**: On every `setTokens` dispatch, write to `localStorage`. On `clearAuth`, remove from `localStorage`. On app boot (in a top-level component or store middleware), read from localStorage and dispatch `setTokens` + `setUser` to rehydrate state before any route rendering decisions are made.

4. **Admin gate**: The admin portal (`/admin/*`) is completely separate from the member portal. Admins should be redirected away from member routes like `/dashboard`, `/card`, etc. to `/admin`. Members should be redirected away from `/admin/*` to `/dashboard`.

5. **Profile completion gate**: On the `/membership/apply` page, check `user.profile?.is_profile_complete`. If false, show a blocking banner and disable plan selection. The banner lists the `missing_required_fields` with human-readable labels and a direct link to `/profile`.

6. **Paystack redirect**: Always use `window.location.href` for Paystack payment links. Do not use `window.open()` or React Router navigation.

7. **Admin notes required on rejection**: Enforce this in the UI even though the backend technically accepts an empty string. Show a validation error "Admin notes are required when rejecting an application" if the field is blank.

8. **Bulk operation confirmation**: Always show a confirmation modal/dialog before calling bulk approve or reject endpoints. The modal must state the exact count of applications being actioned and list a preview (applicant names) if count is ≤ 5.

9. **Notification polling**: Use `setInterval` in a custom hook `useNotificationPolling` that fires every 60 seconds while the user is authenticated. On each tick, dispatch a `fetchUnreadCount` action that calls `/api/notifications/unread-count/` and updates `notificationSlice.unreadCount`. Clear the interval on logout or component unmount.

10. **QR scan page**: The `/cards/scan` page is public. It must work with no Redux state, no auth token, no layout wrapper. It is a standalone page used by club staff on mobile devices to verify member access. Keep it visually clean and optimized for quick scan confirmation.
