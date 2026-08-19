# Real Estate Mobile Application

A production-grade cross-platform real estate mobile application built with React Native, Expo, and modern mobile architecture patterns.

## Overview

This is a full-featured real estate discovery and management platform for iOS and Android. The application allows users to browse property listings, search across multiple criteria, manage saved properties, and (for administrative users) create and manage property listings. The architecture demonstrates professional-grade patterns for authentication, state management, data persistence, and mobile navigation.

**Key Technical Distinction**: This application integrates Clerk for passwordless/multi-factor authentication and uses Clerk's JWT tokens to establish authenticated Supabase database access via row-level security (RLS). This approach eliminates the need for custom token management and creates a seamless authenticated data layer.

**Real-World Problem**: Property discovery applications must handle real-time search across property attributes (title, location, price, type), maintain user-specific saved listings independently of app state, and enforce role-based access for admin property management—all while maintaining clean separation between authentication, state management, and data access layers.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                          │
│                   (Expo Framework)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
   │  Screens  │  │ Components │  │   Hooks    │
   │ (Routing) │  │ (UI Layer) │  │(Data Sync) │
   └────┬──────┘  └──────┬─────┘  └─────┬──────┘
        │                │              │
        └────────────┬───┴──────────────┘
                     │
        ┌────────────▼────────────┐
        │  Zustand Store          │
        │ (Filter/User State)     │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────────────┐
        │   useSupabase Hook              │
        │  (Clerk JWT ↔ Supabase Auth)   │
        └────────────┬────────────────────┘
                     │
        ┌────────────▼────────────────────┐
        │      Supabase Client            │
        │  (PostgreSQL + RLS Policies)    │
        └────────────┬────────────────────┘
                     │
        ┌────────────▼────────────────────┐
        │   Clerk Authentication          │
        │   (JWT Token Provider)          │
        └────────────────────────────────┘

Data Flow: Authentication
┌──────────────┐
│   User       │
│   Opens App  │
└────────┬─────┘
         │
    ┌────▼────────────────────┐
    │ AuthLayout checks        │
    │ Clerk auth status        │
    └────┬───────────────┬─────┘
         │ Not signed in │ Signed in
         │               │
    ┌────▼──────┐   ┌────▼──────────────┐
    │ Redirect  │   │ useUserSync hook   │
    │ to        │   │ Queries users      │
    │ sign-in   │   │ table or creates   │
    └───────────┘   └────┬───────────────┘
                         │
                    ┌────▼──────────────┐
                    │ Reads is_admin     │
                    │ Sets in Zustand    │
                    │ App ready          │
                    └───────────────────┘
```

## Key Features

### User Experience

- **Property Discovery**: Browse featured and recommended properties on home screen
- **Advanced Search**: Real-time search by property title and city
- **Multi-Criteria Filtering**: Filter by property type, bedrooms, and price range
- **Property Details**: View complete property information with image gallery, location, and contact options
- **Saved Properties**: Persist user-specific saved properties via Supabase
- **Profile Management**: User profile with Clerk-managed identity

### Authentication & Authorization

**Authentication**: Powered by Clerk with support for email/password and multiple authentication methods. After initial authentication, the application:

1. Reads Clerk's authenticated user identity via `useAuth()` hook
2. Syncs user profile to Supabase `users` table via `useUserSync()` hook
3. Extracts `is_admin` flag from Supabase and stores in Zustand

**Authorization**: Admin-only features are gated at the UI level:

- Property creation form is conditionally rendered based on `useUserStore().isAdmin`
- Property delete and "mark sold" actions check admin status
- Non-admin users cannot access these operations

**Note**: UI-level authorization is implemented. Backend RLS policies are not verified in the current codebase; production deployment should implement Supabase Row-Level Security to prevent unauthorized direct database access.

### Property Management

- **Create** (Admin Only): Admins can create properties with multiple images, location details, and featured flag
- **Read**: All authenticated users can search and browse properties
- **Update** (Admin Only): Admins can update property details and mark properties as sold
- **Delete** (Admin Only): Admins can remove properties

### Data & Backend

**Supabase Integration**: All property data and user-specific operations are persisted in Supabase PostgreSQL database. The `useSupabase()` hook provides an authenticated client that:

- Wraps the Supabase anon key client
- Attaches Clerk's JWT token as the `accessToken`
- Enables RLS policies to identify the authenticated user

**Key Tables**:

- `users`: Clerk-managed user identities synced to Supabase
- `properties`: Property listings with full details
- `saved_properties`: User-specific saved property records (linked via `user_clerk_id` and `property_id`)

## Tech Stack

| Layer                  | Technology                     | Purpose                                              |
| ---------------------- | ------------------------------ | ---------------------------------------------------- |
| **Mobile Framework**   | React Native 0.81.5            | Cross-platform iOS/Android runtime                   |
| **Build/Runtime**      | Expo 54.0                      | Development server, native module access, EAS builds |
| **Language**           | TypeScript 5.9                 | Type safety across codebase                          |
| **Navigation**         | Expo Router 6.0                | File-based routing, native tab support, typed routes |
| **Authentication**     | Clerk 4.3                      | Passwordless auth, JWT token management              |
| **Backend / Database** | Supabase 2.112                 | PostgreSQL with RLS, real-time subscriptions         |
| **State Management**   | Zustand 5.0                    | Lightweight global state (filters, admin flag)       |
| **Styling**            | NativeWind 4.2                 | Tailwind CSS for React Native                        |
| **Icons**              | Expo Vector Icons              | Material Community + Ionicons                        |
| **Image Picker**       | Expo Image Picker 17.0         | Native image selection from library/camera           |
| **Location**           | Expo Location 19.0             | Geolocation and reverse geocoding                    |
| **Image Viewing**      | react-native-image-viewing 0.2 | Full-screen image gallery                            |
| **Maps**               | react-native-maps 1.29         | Native map rendering (installed, not actively used)  |
| **Blur Effect**        | expo-blur 15.0                 | Glassmorphic UI elements                             |
| **Storage**            | Expo Secure Store 15.0         | Secure token persistence                             |

## Project Structure

```
app/
├── _layout.tsx                 # Root layout with ClerkProvider
├── (auth)/
│   ├── _layout.tsx            # Auth guard, redirects to sign-in if unauthenticated
│   ├── sign-in.tsx            # Sign-in screen (UI currently commented)
│   └── sign-up.tsx            # Sign-up screen (UI currently commented)
├── (root)/
│   ├── _layout.tsx            # Protected root layout with user sync
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab navigator with custom glassmorphic tab bar
│   │   ├── index.tsx          # Home: featured + recommended properties
│   │   ├── search.tsx         # Search: title/city search with filters
│   │   ├── create.tsx         # Create: property form (admin only)
│   │   ├── saved.tsx          # Saved: user-specific saved properties
│   │   └── profile.tsx        # Profile: user profile management
│   └── property/
│       └── [id].tsx           # Dynamic property detail screen
│
components/
├── PropertyCard.tsx           # Reusable property list item (horizontal layout)
├── FeaturedCard.tsx           # Featured property carousel card
└── FilterModal.tsx            # Filter modal UI component
│
hooks/
├── useSupabase.ts            # Authenticated Supabase client hook
├── useUserSync.ts            # Clerk → Supabase user sync hook
└── useSavedProperty.ts       # Saved property state + toggle hook
│
store/
├── filterStore.ts            # Zustand: search, type, bedrooms, price filters
└── userStore.ts              # Zustand: admin flag
│
lib/
├── supabase.ts               # Supabase client initialization (anon + authenticated)
└── utils.ts                  # Utility functions (price formatting, etc.)
│
types/
└── index.ts                  # TypeScript interfaces (Property type)
```

## Authentication Flow

### Initial App Load

1. **Root Layout** (`app/_layout.tsx`):
   - Initializes Clerk provider with publishable key
   - Wraps entire app with authentication context

2. **Protected Root Layout** (`app/(root)/_layout.tsx`):
   - Checks `useAuth().isSignedIn` and `isLoaded`
   - Redirects unsigned-in users to `/sign-in`
   - If authenticated, calls `useUserSync()` hook
   - Returns `<Slot />` to render child routes

3. **User Sync Hook** (`hooks/useUserSync.ts`):
   - Reads Clerk's authenticated user via `useAuth()` hook
   - Creates authenticated Supabase client via `useSupabase()` hook
   - Queries `users` table where `clerk_id` matches current user
   - If user exists: reads `is_admin` flag, updates Zustand store
   - If user doesn't exist: inserts new user record with profile data from Clerk
   - Sets admin flag in Zustand store via `useUserStore().setIsAdmin()`

### Authenticated Data Access

Every subsequent Supabase query uses the authenticated client:

```typescript
const authSupabase = useSupabase();
const { data } = await authSupabase
  .from("users")
  .select("*")
  .eq("clerk_id", userId);
```

The `useSupabase()` hook:

- Retrieves Clerk's JWT via `useAuth().getToken()`
- Passes it to Supabase as `accessToken`
- Supabase verifies the JWT and identifies the user
- RLS policies enforce row-level access control

### Sign Out

The `useAuth().signOut()` method:

- Clears Clerk session tokens
- Application redirect to `/sign-in` is triggered
- Zustand state is reset
- All Supabase queries fail until re-authentication

## Database Design

**Schema Overview** (inferred from application queries and TypeScript types):

```
users
├── id (UUID, primary key)
├── clerk_id (TEXT, unique, foreign key to Clerk)
├── email (TEXT)
├── first_name (TEXT)
├── last_name (TEXT)
├── avatar_url (TEXT)
├── is_admin (BOOLEAN, default false)
└── created_at (TIMESTAMP)

properties
├── id (UUID, primary key)
├── title (TEXT)
├── description (TEXT)
├── price (NUMERIC)
├── type (TEXT: 'apartment'|'house'|'villa'|'studio')
├── bedrooms (INTEGER)
├── bathrooms (INTEGER)
├── area_sqft (INTEGER)
├── address (TEXT)
├── city (TEXT)
├── latitude (NUMERIC)
├── longitude (NUMERIC)
├── images (JSONB array of URLs)
├── is_featured (BOOLEAN, default false)
├── is_sold (BOOLEAN, default false)
└── created_at (TIMESTAMP)

saved_properties
├── id (UUID, primary key)
├── user_clerk_id (TEXT, references users.clerk_id)
├── property_id (UUID, foreign key to properties)
└── created_at (TIMESTAMP)
```

**Why This Structure**:

- **users table**: Bridges Clerk authentication identity with application-specific user metadata
- **properties table**: Centralized property catalog with search/filter attributes
- **saved_properties table**: Denormalized user-property relationship enables efficient queries like "all properties saved by user X"
- **clerk_id reference**: RLS policies can identify the authenticated user and enforce user-specific access

**Design Note**: The `saved_properties` table links users by `clerk_id` rather than internal user ID, creating a direct relationship between Clerk authentication and Supabase data ownership.

## Data Flow

### Property Discovery (Home Screen)

```
HomeScreen renders
  ↓
fetchProperties() called on focus
  ↓
supabase.from("properties")
  .select("*")
  .eq("is_featured", true)  ← featured properties
  ↓
FlatList renders featured carousel
  ↓
User taps PropertyCard
  ↓
router.push(`/(root)/property/${id}`)
  ↓
PropertyDetailScreen loads and fetches full details
```

### Search & Filter (Search Screen)

```
User types in search input
  ↓
useFilterStore().setSearch(value)
  ↓
Zustand store updated
  ↓
Search screen useEffect dependency triggers
  ↓
fetchResults() builds dynamic query:
  - if search: .or(`title.ilike.%, city.ilike.%`)
  - if type: .eq("type", value)
  - if bedrooms: .eq("bedrooms", value)
  - if minPrice: .gte("price", value)
  - if maxPrice: .lte("price", value)
  ↓
FlatList updates with filtered results
```

### Save Property (Property Detail Screen)

```
User taps heart icon
  ↓
useSavedProperty().toggleSave() called
  ↓
checkIfSaved() query:
  authSupabase
    .from("saved_properties")
    .select("id")
    .eq("user_clerk_id", userId)
    .eq("property_id", propertyId)
  ↓
If exists: DELETE from saved_properties
If not exists: INSERT into saved_properties
  ↓
State updated, UI reflects change
  ↓
Saved tab auto-refreshes via useFocusEffect()
```

### Create Property (Admin Only)

```
Admin user navigates to Create tab
  ↓
useUserStore().isAdmin check passes, form displayed
  ↓
User fills form:
  - title, description, price, type
  - bedrooms, bathrooms, area_sqft
  - address, city, latitude, longitude
  - picks images from device
  ↓
handleSubmit() called
  ↓
Images uploaded to Supabase Storage (or embedded as base64)
  ↓
authSupabase.from("properties")
    .insert({ title, price, type, ... })
    .select()
  ↓
Success: router.replace("/(root)/(tabs)")
  ↓
Home screen refreshes, new property visible
```

## Search & Filtering

**Real-Time Search**: User input updates Zustand filter store, which triggers `useEffect` dependency, re-executing the Supabase query.

**Supported Filters**:

- **Search**: Matches property `title` or `city` (case-insensitive via `ilike`)
- **Type**: Exact match on property type (apartment, house, villa, studio)
- **Bedrooms**: Exact match on bedroom count
- **Min Price**: `gte` (greater than or equal)
- **Max Price**: `lte` (less than or equal)

**Filter Store** (`store/filterStore.ts`):

```typescript
interface FilterState {
  search: string;
  type: PropertyType | null;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  // ... setters + resetFilters()
}
```

All setters trigger re-renders of dependent screens.

**Why Zustand**: Filter state is used across multiple screens (home has a filter shortcut, search screen displays active filters). Zustand allows filter persistence without prop drilling while keeping the store lightweight.

## State Management

### Filter Store

Manages property search and filtering state:

```typescript
useFilterStore()
  .search // Text search query
  .type // Property type filter
  .bedrooms // Bedroom count filter
  .minPrice // Minimum price filter
  .maxPrice // Maximum price filter
  .resetFilters(); // Clear all filters
```

Used by:

- `(root)/(tabs)/search.tsx` - Main search interface
- `(root)/(tabs)/index.tsx` - Home screen filter shortcut
- Dependency trigger for query re-execution

### User Store

Manages authenticated user state:

```typescript
useUserStore()
  .isAdmin // Whether current user is admin
  .setIsAdmin(); // Set by useUserSync hook
```

Used by:

- `(root)/(tabs)/create.tsx` - Conditionally render admin form
- `(root)/property/[id].tsx` - Show delete/mark-sold buttons for admins
- Determines role-based UI visibility

**Why Not Redux/Context**: These stores are small and don't require middleware or complex async actions. Zustand provides a minimal API without boilerplate.

## Navigation

### Architecture: Expo Router with Native Tabs

The application uses **Expo Router's file-based routing** with **native bottom tab navigation** managed by React Navigation's Bottom Tab Navigator.

```
File Structure          Route Path
────────────────       ──────────
(auth)/
  _layout.tsx         /sign-in, /sign-up
  sign-in.tsx         /sign-in
  sign-up.tsx         /sign-up

(root)/
  _layout.tsx         / (protected, redirects if unauthenticated)
  (tabs)/
    _layout.tsx       / (tab navigator)
    index.tsx         / (home)
    search.tsx        /search
    create.tsx        /create
    saved.tsx         /saved
    profile.tsx       /profile
  property/
    [id].tsx          /property/[id]
```

**Key Design Decisions**:

- `(auth)` group: Redirect signed-out users to sign-in
- `(root)` group: Protect all routes behind Clerk authentication
- `(tabs)` group: Render native bottom tab navigator
- `property/[id].tsx`: Dynamic route for property details

**Tab Customization**: The default React Navigation tab bar is replaced with a custom `CustomTabBar` component that provides:

- Glassmorphic blur effect (via `expo-blur`)
- Custom icon positioning
- Animated active state
- Mobile-friendly touch targets

**Dynamic Routes**: Property detail screen uses `useLocalSearchParams()` to read the `id` parameter and fetch the specific property.

## Android & iOS Support

### Cross-Platform Architecture

The application is built entirely with React Native and Expo, providing native runtime support for both Android and iOS without platform-specific code branches (except where necessary).

**Key Expo Features Used**:

- **expo-router**: File-based routing with native navigation stacks
- **expo-image-picker**: Native image library/camera access
- **expo-location**: Native geolocation and geocoding
- **expo-blur**: Native iOS/Android blur effect
- **React Navigation Bottom Tabs**: Platform-native tab navigation behavior

### Platform-Specific Behavior

**Android**:

- Edge-to-edge enabled in `app.json` for full-screen immersive experience
- Adaptive icon with foreground, background, and monochrome images
- Predictive back gesture disabled to prevent navigation conflicts

**iOS**:

- Tablet support enabled
- Notch-aware safe area layout
- Native blur effect on tab bar
- Platform-specific tab bar positioning

### Mobile-First Design

All screens use:

- `SafeAreaView` to respect system UI (notches, home indicators)
- Responsive layouts with flexible dimensions
- Touch-optimized button sizes (minimum 44x44pt per Apple guidelines)
- Native `FlatList` for efficient vertical scrolling
- `ScrollView` with keyboard handling for forms

### Responsive Styling

NativeWind (Tailwind for React Native) provides:

- Consistent spacing, typography, and colors across platforms
- Dark mode support via `userInterfaceStyle: "automatic"` in app.json
- Responsive breakpoints (though mobile-first for phone-only app)

## UI / UX Engineering

### Reusable Components

**PropertyCard.tsx**

- Horizontal property listing card (image, info, price, beds, sqft)
- Used across home, search, and saved screens
- Includes integrated save/unsave heart button
- Shows "Sold" badge with reduced opacity
- Consistent shadow and touch feedback

**FeaturedCard.tsx**

- Horizontal carousel card (larger image, full property info)
- Type badge, sold status badge
- Used on home screen featured carousel
- Larger hit target for discoverability

**FilterModal.tsx**

- Modal interface for multi-criteria filtering
- Type selector, bedroom slider, price range inputs
- Centralized filter state (Zustand store)
- Reset and apply actions

### Design System

**Color Palette**:

- Primary: `#2563EB` (blue) - active states, CTAs
- Secondary: `#6B7280` (gray) - secondary text, icons
- Success: `#10B981` (green) - positive actions
- Danger: `#EF4444` (red) - sold status, delete actions
- Background: `#F9FAFB` (light gray) - screen backgrounds

**Typography**:

- Bold 24px: Screen titles
- Bold 16px: Card titles, CTAs
- Regular 14px: Body text
- Regular 12px: Metadata (beds, city, price)

**Spacing**:

- 4px, 8px, 12px, 16px, 20px (base units)
- Padding: 16px horizontal, 12px vertical for cards
- Gap between elements: 8px to 12px

**Shadows**:

- Subtle: elevation 2-3, shadow radius 6-8 (cards)
- Medium: elevation 4-5, shadow radius 12 (modals)
- None on text/interactive elements

### Loading & Empty States

**Loading**:

- `ActivityIndicator` centered on screen while fetching data
- "Pull to refresh" via `useFocusEffect` on tab focus

**Empty States**:

- Saved screen shows empty heart icon + "No saved properties" message
- Search with no results shows "No properties match your criteria"
- Both include CTA button to browse/reset filters

**Error Handling**:

- Failed Supabase queries handled via try/catch in hooks
- Image upload failures show `Alert.alert()` with retry option
- Graceful degradation (empty array fallback)

## Reusable Components

| Component      | Purpose                            | Usage                                     | Engineering Value                                                                                              |
| -------------- | ---------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `PropertyCard` | Horizontal property listing        | Home (recommended), Search, Saved screens | Centralizes property UI logic; ensures consistent presentation across discovery, search, and bookmarking flows |
| `FeaturedCard` | Featured property carousel item    | Home screen featured carousel             | Distinguishes premium listings with larger visual footprint; different interaction model from standard list    |
| `FilterModal`  | Multi-criteria filter UI           | Search screen                             | Separates filter UI from search logic; can be reused for other filtered views                                  |
| `CustomTabBar` | Glassmorphic bottom tab navigation | App-wide tab navigation                   | Replaces default tab bar; provides consistent branding and premium UX across all tab screens                   |

## Security & Access Control

### Implemented

**Authentication Layer**:

- Clerk handles authentication with support for email/password and passwordless methods
- After authentication, Clerk issues a JWT token
- The token is passed to Supabase via the `useSupabase()` hook

**User Identity**:

- `useAuth().userId` from Clerk provides the unique authenticated user identifier
- User profile is synced to Supabase `users` table via `useUserSync()` hook
- Supabase can identify the authenticated user via the JWT token

**Admin Access Control** (UI-level):

- Admin flag is read from `users.is_admin` during user sync
- Stored in Zustand `useUserStore().isAdmin`
- Create tab conditionally renders only for admin users
- Property delete/mark-sold actions check admin flag before displaying

**Saved Properties**:

- Linked to user via `saved_properties.user_clerk_id` (Clerk's user ID)
- Queries filter by authenticated `userId` ensuring users only see their own saved properties

### Important Limitation

**UI-Level Authorization Only**: The current implementation enforces admin access at the UI level (conditional rendering). This is appropriate for mobile apps where the client-side code is shipped, but **does not prevent direct database access if credentials are compromised**.

For production deployment, implement **Supabase Row-Level Security (RLS) policies** such as:

```sql
-- Users can only read their own profile
CREATE POLICY "users_select" ON users
  FOR SELECT USING (auth.uid() = clerk_id);

-- Admins can create properties
CREATE POLICY "properties_insert" ON properties
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE clerk_id = auth.uid() AND is_admin = true)
  );

-- Users can only modify/delete their own saved properties
CREATE POLICY "saved_properties_manage" ON saved_properties
  FOR ALL USING (user_clerk_id = auth.uid());
```

### Secrets Handling

Environment variables are stored in `.env` or Expo secrets and accessed via `process.env.EXPO_PUBLIC_*`:

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
```

These are "public" keys meant for client-side access (Supabase anon key, Clerk publishable key). Sensitive secrets (database passwords, signing keys) are never exposed to the client.

## Error & Loading States

### Loading States

**Property Fetching**:

```typescript
const [loading, setLoading] = useState(true);
// ... fetch data ...
setLoading(false);

// UI displays:
{loading ? <ActivityIndicator /> : <FlatList />}
```

Used on:

- Home screen: featured + recommended properties
- Search results: filtered properties
- Property detail: full property data
- Saved screen: user's saved properties

**Image Upload**:

```typescript
const [uploadingImages, setUploadingImages] = useState(false);
// ... upload images ...
setUploadingImages(false);

// Button disabled during upload
<Button disabled={uploadingImages} />
```

**Form Submission**:

```typescript
const [submitting, setSubmitting] = useState(false);
// Disables submit button and shows spinner during submission
```

### Empty States

**No Saved Properties** (Saved screen):

- Icon: Heart outline
- Message: "No saved properties"
- CTA: "Browse Properties" button → navigates to search

**No Search Results** (Search screen):

- Message: "No properties match your search"
- CTA: Reset filters or refine search

**No Properties** (Home screen):

- Unlikely in real app, but gracefully handled with empty array fallback

### Error Handling

**Failed Queries**:

```typescript
const { data, error } = await authSupabase.from("properties").select("*");
if (error) console.error(error);
// Fallback: setSaved([]) or similar
```

**Image Upload Errors**:

```typescript
Alert.alert("Error", "Failed to upload image. Please try again.");
```

**Permission Errors**:

```typescript
if (!permission.granted) {
  Alert.alert(
    "Permission Required",
    "Please allow access to your photo library.",
  );
}
```

**Authentication Errors**:

- Handled by Clerk SDK and routing layer
- Failed auth redirects to sign-in
- Session expiration is handled automatically

## Performance Considerations

### Rendering Optimization

**FlatList Usage**:

- Vertical scrolling lists (search results, saved properties) use `FlatList` with `keyExtractor` for efficient re-renders
- `removeClippedSubviews={true}` (default) removes off-screen items from memory

**Reusable Components**:

- `PropertyCard` and `FeaturedCard` are extracted to avoid re-creating component instances
- Consistent UI with minimal re-render overhead

**Image Optimization**:

- Property images use `expo-image` (optimized over `Image`) where possible
- `resizeMode="cover"` prevents image layout shifts
- Images are loaded with reduced quality (0.7 on upload) to minimize network payload

### State Management Efficiency

**Zustand Stores**:

- Filter store mutations are granular (e.g., `setSearch()` vs full state replacement)
- Components subscribe only to their needed state via destructuring
- No global re-render on state changes (automatic in Zustand)

**Hook Dependencies**:

- `useEffect` dependencies are minimal:
  ```typescript
  useFocusEffect(useCallback(() => fetchSaved(), [fetchSaved]));
  ```
- Screen focus refresh (`useFocusEffect`) prevents stale data without polling

### Query Optimization

**Index-Friendly Queries**:

- Filter on indexed columns: `is_featured`, `type`, `bedrooms`, `price`
- Search uses `ilike` (efficient full-text search on indexed text columns in PostgreSQL)
- Save check: `select("id")` fetches minimal data

**Lazy Evaluation**:

- Properties are not fetched until screens are focused
- Dynamic route parameters load only the requested property
- No upfront data loading for all properties

## Real-World Engineering Problems Solved

### Problem 1: User-Specific Saved Properties Without Local Persistence

**Challenge**: Users want to save properties and have that list persist across app restarts and devices. Local AsyncStorage can't sync across devices.

**Solution**:

- `useSavedProperty()` hook stores saved state in Supabase `saved_properties` table
- Linked to user via `user_clerk_id` from Clerk JWT
- Saved screen uses `useFocusEffect()` to refresh the list every time tab is focused
- Result: Users can save on iPhone, then open Android and see the same saved properties

**Engineering**: Combines authenticated Supabase queries with focus-based refresh to ensure consistency without polling.

### Problem 2: Role-Based Admin Features Without Backend Role System

**Challenge**: Admin users need exclusive access to property creation and management, but there's no pre-existing role system.

**Solution**:

- `useUserSync()` hook reads `is_admin` flag from Supabase users table on app launch
- Stores in Zustand `useUserStore()` for efficient access across screens
- Create tab conditionally renders only if `isAdmin === true`
- Property detail screen shows delete/mark-sold buttons only for admins
- Result: Simple, UI-level role-based access control with minimal queries

**Engineering**: Leverages Zustand for fast, reactive role checks without re-querying the backend for every screen.

### Problem 3: Real-Time Multi-Criteria Search Without Complex Query Building

**Challenge**: Filtering on multiple criteria (title, city, type, bedrooms, price) requires dynamic query construction. Simple solutions lead to spaghetti code.

**Solution**:

- Zustand `filterStore` centralizes all filter state
- Search screen builds query dynamically, adding clauses only if filters are set:
  ```typescript
  let query = supabase.from("properties").select("*");
  if (search)
    query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
  if (type) query = query.eq("type", type);
  // ... etc
  ```
- `useEffect` dependency on filter state triggers re-queries
- Result: Clean, maintainable filter logic with no manual state synchronization

**Engineering**: Separates filter state (Zustand) from query logic (Supabase), making each independently testable.

### Problem 4: Authenticated Data Access with JWT Tokens

**Challenge**: Supabase queries need to identify the authenticated user to enforce row-level access control, but React Native doesn't have built-in JWT management.

**Solution**:

- Clerk provides JWT via `useAuth().getToken()`
- `useSupabase()` hook wraps Supabase client with custom `accessToken()` function
- Every query automatically includes Clerk's JWT
- Supabase verifies JWT and identifies user for RLS policies
- Result: No manual token plumbing; authenticated queries are identical to public queries

**Engineering**: Eliminates boilerplate by centralizing authentication concern in a single hook.

### Problem 5: Synchronizing App State with Backend User Identity

**Challenge**: Clerk handles authentication, Supabase has user metadata, and app needs admin flag. How to keep these in sync?

**Solution**:

- `useUserSync()` hook runs once on app launch after Clerk auth is ready
- Queries Supabase users table for the authenticated Clerk user
- If exists: reads `is_admin`, updates Zustand
- If not: creates new user record with profile data from Clerk
- Result: App always has current admin status without requiring user to configure anything

**Engineering**: Uses `useEffect` dependency on `useUser()` to trigger sync at exactly the right time, ensuring side effects run in the correct order.

### Problem 6: Handling Image Uploads Without Server Endpoint

**Challenge**: Users select multiple images from device. These must be stored and linked to property records. No backend API for processing.

**Solution**:

- `expo-image-picker` converts images to base64
- Images are stored in property's `images` array (JSONB in Supabase)
- Base64 is sent directly to Supabase in the INSERT/UPDATE query
- Result: No separate image upload step; images are atomic with property creation

**Trade-off**: Base64 encoding increases payload size. Production should use Supabase Storage or a CDN.

## Important Technical Decisions

### Decision: Clerk for Authentication

**Why**: Clerk provides passwordless authentication, multi-factor auth, and enterprise features out of the box. The mobile SDK handles token management, session persistence, and sign-out automatically.

**Alternative Considered**: Firebase Auth would provide similar features but with more boilerplate for Supabase integration.

**Result**: Reduced authentication code from hundreds of lines to a single `ClerkProvider` + `useAuth()` hook usage.

### Decision: Supabase for Backend & Database

**Why**: Supabase PostgreSQL is familiar to full-stack engineers. Row-level security policies provide data isolation without custom authorization logic. Real-time subscriptions (not used here, but available) enable live updates.

**Alternative Considered**: Firebase Realtime Database would be simpler but less flexible for complex queries (multi-criteria search, filtering).

**Result**: Standard SQL queries; familiar data modeling for backend engineers.

### Decision: Zustand for State Management

**Why**: Filter state (search, type, bedrooms, price) is used across multiple screens. Zustand provides lightweight, granular state updates without the boilerplate of Redux or Context API.

**Alternative Considered**: React Context would reduce dependencies but would trigger re-renders of entire app on filter change.

**Result**: Isolated state mutations + efficient component re-renders.

### Decision: Expo Router for Navigation

**Why**: File-based routing is intuitive for mobile developers familiar with Next.js. Native route parameters, typed routes, and dynamic segments eliminate manual route registration.

**Alternative Considered**: React Navigation Stack/Tab Navigator requires manual route setup and linking configuration.

**Result**: Shorter navigation code; typed routes catch routing errors at compile time.

### Decision: NativeWind (Tailwind) for Styling

**Why**: Tailwind's utility-first approach is identical across web and native. No need to learn platform-specific styling APIs. Consistent design system with minimal custom CSS.

**Alternative Considered**: StyleSheet.create() provides native styling but no design system; requires custom utility layers.

**Result**: Rapid UI development with consistent spacing, colors, and typography.

### Decision: UI-Level Admin Authorization

**Why**: Mobile apps can't hide code from users. Conditional rendering is sufficient for UX; backend RLS policies provide data security.

**Alternative Considered**: Custom role-based permission system would add complexity without improving security.

**Result**: Simplicity for MVP; RLS policies can be added later without changing UI code.

### Decision: Clerk JWT + Supabase RLS Integration

**Why**: Clerk's JWT token can be passed to Supabase as an access token. Supabase's JWT verification extracts the `sub` (user ID) claim to identify the user for RLS policies. No additional token management layer needed.

**Alternative Considered**: Custom JWT server or session tokens would require maintaining a separate auth service.

**Result**: Minimal auth infrastructure; secure by default when RLS policies are implemented.

### Decision: FlatList for Property Listings

**Why**: FlatList is optimized for vertical scrolling with thousands of items. Automatic virtualization prevents memory leaks on large lists.

**Alternative Considered**: ScrollView with map would require manual memory management.

**Result**: Smooth scrolling even with 100+ properties.

### Decision: Dynamic Route for Property Details

**Why**: File-based routing `property/[id].tsx` with `useLocalSearchParams()` eliminates manual route registration. Each property gets its own detail view without duplicating component code.

**Alternative Considered**: Single detail screen with manual parameter parsing would require custom linking logic.

**Result**: Type-safe navigation; compiler catches invalid route parameters.

## What I Learned

### React Native Architecture & Patterns

Building this application deepened my understanding of:

- **Separation of Concerns**: Authentication (Clerk) ↔ State Management (Zustand) ↔ Data Access (Supabase) can be kept entirely separate, making each easier to test and replace
- **Hook Composition**: `useSupabase()` → `useUserSync()` → `useAuth()` creates a chain of concerns where each hook depends on the previous one's output
- **Mobile-First State Management**: Global state must be minimal and granular; `filterStore` with individual setters prevents cascading re-renders

### Expo Router & File-Based Routing

- File structure directly maps to app routes; no manual route registration
- Dynamic segments `[id]` eliminate controller/route handler boilerplate
- Typed routes catch navigation errors at compile time
- Native navigation stack is abstracted; React Navigation handles platform differences

### Clerk Authentication Integration

- JWT token management is entirely abstracted; developers only see `useAuth()` hook
- Clerk's JWT can be extended with custom claims (not used here, but powerful for authorization)
- Mobile SDK handles token refresh automatically

### Supabase & Database Design

- Row-level security is vastly underutilized in mobile apps; should be standard practice
- PostgreSQL familiarity transfers directly to Supabase; no new query language to learn
- Joins and relationships in Supabase feel natural to full-stack engineers

### State Synchronization

- `useFocusEffect()` is powerful for screen-specific refreshes without polling
- Zustand mutations should mirror database operations (setters match CRUD operations)
- Separating server state (Supabase) from UI state (Zustand) prevents consistency bugs

### Mobile-Specific Patterns

- `SafeAreaView` is essential; notches and home indicators are real constraints
- Touch targets must be at least 44x44pt; smaller buttons frustrate users
- FlatList virtualization is invisible to users but prevents memory leaks
- Image handling is surprisingly complex; sizing, caching, and compression all matter

### Scalability Insights

The current architecture would support:

- **10,000+ properties**: Queries are indexed; FlatList virtualizes rendering
- **Millions of saved properties**: One user's saved list is queried independently
- **Role-based features**: RLS policies scale to complex permission models
- **Real-time updates**: Supabase subscriptions can be added without changing query code

## Future Improvements

These improvements are **not** currently implemented but represent natural extensions of the architecture:

### Data & Performance

- **Image CDN Optimization**: Replace base64 embedded images with Supabase Storage + CDN URLs
- **Query Pagination**: Add cursor-based pagination to search results (currently loads all matches)
- **Offline Caching**: Implement `@react-native-async-storage/async-storage` to cache properties and enable offline browsing
- **Database Indexing**: Add indexes on `properties(title)`, `properties(city)`, `properties(type)` to accelerate filtered queries
- **Advanced Search**: Full-text search on property descriptions; location-based search using PostGIS

### Features

- **Push Notifications**: Notify users when new properties match their saved searches
- **Property Messaging**: In-app messaging between buyers and sellers (requires new `messages` table)
- **Favorites vs. Saved**: Distinguish between "like" and "save for later"
- **Property Reviews**: Allow users to rate/review properties after viewing
- **Mortgage Calculator**: Integrated financial tool for property pricing
- **Virtual Tours**: 3D property walkthroughs or video tours

### Infrastructure & DevOps

- **Automated Testing**: Unit tests for hooks, integration tests for screens, E2E tests via Detox
- **CI/CD Pipeline**: GitHub Actions for automated builds and EAS deploys
- **Monitoring & Analytics**: Sentry for crash reporting, Mixpanel/Amplitude for user analytics
- **Feature Flags**: Gradual rollout of new features via feature flag service
- **A/B Testing**: Experiment framework for UI/UX decisions

### Authentication & Security

- **Row-Level Security Policies**: Implement comprehensive RLS to enforce backend authorization
- **Rate Limiting**: Protect Supabase endpoints from abuse
- **API Key Rotation**: Automated key rotation for Clerk and Supabase secrets
- **Audit Logging**: Track admin actions (property creation, deletion, marked sold)

### Admin Features

- **Property Analytics**: Dashboard showing views, saves, inquiries per property
- **Bulk Operations**: Create/update multiple properties from CSV
- **Property Management Dashboard**: Admin-specific screen for stats, pending approvals
- **Inquiry System**: Track user inquiries and responses

## Running Locally

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Clerk account and Supabase project (free tier sufficient)
- iOS Simulator (Mac) or Android Emulator (any OS)
- Xcode 15+ (iOS) or Android Studio (Android)

### Setup

1. **Clone repository**

   ```bash
   git clone <repo>
   cd r1_RealEstateApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file** in project root with:

   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=eyJhbGc...
   ```

4. **Start Expo server**

   ```bash
   npm run start
   ```

5. **Open in simulator/device**
   - **Android**: Press `a` in terminal, or `npm run android`
   - **iOS**: Press `i` in terminal, or `npm run ios`
   - **Web**: Press `w` in terminal, or `npm run web`

### Environment Variables

| Variable                            | Purpose                  | Required | Source                                                                        |
| ----------------------------------- | ------------------------ | -------- | ----------------------------------------------------------------------------- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication key | Yes      | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys                     |
| `EXPO_PUBLIC_SUPABASE_URL`          | Supabase project URL     | Yes      | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_KEY`          | Supabase anonymous key   | Yes      | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |

**Note**: These are "public" keys meant for client-side access. Never commit `.env` files to version control; use Expo secrets or GitHub Actions secrets for CI/CD.

## Screens

| Screen          | Route                    | Purpose                       | Features                                                  |
| --------------- | ------------------------ | ----------------------------- | --------------------------------------------------------- |
| Sign In         | `/sign-in`               | User authentication           | Clerk-managed UI (native or custom modal)                 |
| Home            | `/(root)/(tabs)`         | Property discovery            | Featured carousel + recommended list, quick filter access |
| Search          | `/(root)/(tabs)/search`  | Property search & filtering   | Title/city search, type/beds/price filters, results list  |
| Create          | `/(root)/(tabs)/create`  | Property listing (admin only) | Form, image multi-select, location picker, featured flag  |
| Saved           | `/(root)/(tabs)/saved`   | User-saved properties         | List of saved properties, refresh on tab focus            |
| Profile         | `/(root)/(tabs)/profile` | User profile                  | Profile picture, name, email, sign-out button             |
| Property Detail | `/(root)/property/[id]`  | Property information          | Images, description, location map, admin controls         |

## API / Supabase Operations

| Operation                    | Table              | Method                                                                 | Purpose                                      |
| ---------------------------- | ------------------ | ---------------------------------------------------------------------- | -------------------------------------------- |
| Fetch featured properties    | `properties`       | `select(*)` + `eq("is_featured", true)`                                | Home screen featured carousel                |
| Fetch recommended properties | `properties`       | `select(*)` + `eq("is_featured", false)`                               | Home screen recommended list                 |
| Search properties            | `properties`       | `select(*)` + `or()` + filters                                         | Search screen with multi-criteria filtering  |
| Fetch property detail        | `properties`       | `select(*)` + `eq("id", id)`                                           | Property detail screen                       |
| Create property              | `properties`       | `insert({...})`                                                        | Admin property creation                      |
| Update property              | `properties`       | `update({...})` + `eq("id", id)`                                       | Admin property updates (mark sold, etc.)     |
| Delete property              | `properties`       | `delete()` + `eq("id", id)`                                            | Admin property deletion                      |
| Check saved status           | `saved_properties` | `select("id")` + `eq("user_clerk_id", ...)` + `eq("property_id", ...)` | Determine if heart icon should be filled     |
| Save property                | `saved_properties` | `insert({user_clerk_id, property_id})`                                 | User saves property                          |
| Unsave property              | `saved_properties` | `delete()` + `eq("user_clerk_id", ...)` + `eq("property_id", ...)`     | User unsaves property                        |
| Fetch saved properties       | `saved_properties` | `select("*, properties(*)")` + `eq("user_clerk_id", ...)`              | Saved screen list                            |
| Sync user                    | `users`            | `select(*) / insert(...)`                                              | Create or update user profile on first login |
| Fetch user admin status      | `users`            | `select("is_admin")` + `eq("clerk_id", ...)`                           | Check if user is admin                       |

## GitHub Project Highlights

### Why This Project Demonstrates Practical Engineering

- **Integrated Authentication & Database**: Clerk JWT tokens are passed to Supabase, demonstrating real-world auth architecture rather than toy examples
- **Role-Based Access Control**: Admin-only features show how to gate functionality based on user attributes
- **Persistent User State**: Saved properties are persisted to Supabase and refreshed on demand, solving the "state synchronization" problem
- **Multi-Criteria Search**: Dynamic query building demonstrates practical search UX without over-engineering
- **Reusable Component Architecture**: PropertyCard and FeaturedCard are extracted from specific screens, showing scalable component design
- **Mobile-First Navigation**: Expo Router with native tabs shows production-grade navigation patterns for cross-platform apps
- **Separation of Concerns**: Authentication, state management, and data access are kept in separate layers (Clerk, Zustand, Supabase)
- **Real-Time Data Consistency**: useFocusEffect ensures saved properties are refreshed when the Saved tab is revisited
- **Type Safety**: TypeScript types for Property and other entities prevent runtime errors
- **Error & Loading States**: Comprehensive handling of loading spinners, empty states, and error alerts

This project is **not** a tutorial app or a simple CRUD example. It demonstrates professional-grade mobile application architecture suitable for production deployment.

## Screenshots

Screenshots would be located in:

```
screenshots/
├── home.png              # Featured carousel + recommended properties
├── search.png            # Search bar with filter chips
├── property-detail.png   # Property images, info, contact button
├── saved.png             # List of saved properties
├── profile.png           # User profile with sign-out
├── create-property.png   # Property creation form (admin)
└── tab-navigation.png    # Custom glassmorphic tab bar
```

_Screenshots can be added by capturing the running app via iOS Simulator or Android Emulator and placing images in a `screenshots/` folder._

## Demo

Demo videos and live deployment coming soon.

## License

Not specified. See `LICENSE` file if present.

---

## Summary for Developers

This is a **production-style real estate mobile application** that demonstrates:

1. **Professional Authentication**: Clerk OAuth integrated with Supabase RLS-ready backend
2. **Scalable Architecture**: Zustand for UI state, Supabase for app state, Clerk for identity
3. **Real-World Features**: Search, filtering, bookmarking, admin property management
4. **Mobile Engineering**: Cross-platform iOS/Android, native navigation, image handling
5. **Code Organization**: Hooks for data access, components for UI, stores for state, screens for routes

The codebase is ready for production deployment with the addition of Supabase RLS policies and cloud storage for images.
