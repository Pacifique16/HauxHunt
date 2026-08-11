# FlatMat — Integrated Roommate Discovery & Connection Experience

Design and implement a modern, friendly, clean mobile experience for **FlatMat**, a roommate discovery and connection feature that helps people find compatible flatmates who are interested in the same apartments and housing opportunities.

FlatMat should combine the **discovery mechanics of modern matching apps**—such as swipeable cards, discovery feeds, save/pass actions, and connection requests—with the **trust, privacy, and community feel of a housing platform**.

The most important requirement is that FlatMat must feel like a **natural extension of the existing application**, not a separate app or duplicate feature system.

---

# 1. IMPORTANT: INTEGRATE WITH THE EXISTING APP

This feature is being implemented inside an **already existing mobile application**.

The application already contains features such as apartments/properties, users, profiles, navigation, messaging, authentication, and other existing functionality.

Before designing or implementing FlatMat, **inspect the existing application and understand its current architecture and design system**.

### Do not rebuild existing functionality.

Use this principle:

> **Reuse → Extend → Adapt → Connect → Only Create When Necessary**

If a feature already exists, use it.

If it partially exists, extend it.

Only create something new when the existing application genuinely does not have the required functionality.

---

## Existing Apartments / Properties

The application already has an **Apartment/Property feature**.

Do NOT create:

* A second apartment system
* A separate FlatMat property database
* A duplicate apartment listing page
* A separate property detail system
* A new property navigation section simply for FlatMat

Instead, integrate FlatMat into the **existing apartment experience**.

For example, if an existing apartment detail page already contains:

* Property photos
* Address
* Rent
* Bedrooms
* Amenities
* Description
* Existing actions

keep all of that.

Then add a FlatMat layer such as:

### People interested in this apartment

Show people who are interested in the same apartment and may be looking for a flatmate.

The existing apartment remains the **source of truth**.

FlatMat becomes the social/roommate discovery layer around it.

The relationship should look like:

**Existing Apartment**

↓

**People interested in this apartment**

↓

**Shared interests & lifestyle information**

↓

**Connection request**

↓

**Approval**

↓

**Profile unlocked**

↓

**Chat**

---

# 2. USE THE EXISTING DESIGN SYSTEM

FlatMat must visually belong to the existing application.

Before creating new UI, inspect and reuse the application's:

* Colors
* Typography
* Font sizes
* Spacing
* Border radius
* Cards
* Shadows/elevation
* Buttons
* Icons
* Avatars
* Badges
* Chips/tags
* Tabs
* Bottom navigation
* Headers
* Modals
* Bottom sheets
* Chat components
* Animations
* Existing design tokens

### Do not introduce a completely new visual language.

The suggested FlatMat aesthetic is only a **design direction**, not a requirement to replace the existing app's colors.

If the existing app uses different colors, use the existing colors.

If the existing app already has a primary brand color, use it.

If the existing app already has established card and button styles, reuse them.

If the existing app already has a navigation system, integrate FlatMat into it.

FlatMat should look as though it was designed as part of the original application from the beginning.

---

# 3. DO NOT DUPLICATE EXISTING COMPONENTS

Before creating a component, determine whether an equivalent already exists.

For example:

If the application already has an `ApartmentCard`, extend or reuse it rather than creating a completely separate FlatMat apartment card.

If the application already has an `Avatar`, extend it to support locked/unlocked states.

If the application already has a `ProfileCard`, adapt it for FlatMat.

If the application already has a `ChatHeader`, extend it to support the privacy states.

If the application already has messaging, use the existing messaging infrastructure.

Avoid creating parallel versions of functionality that already exists.

---

# 4. CORE FLATMAT CONCEPT

FlatMat helps users discover people who may be good flatmates based on **practical shared housing preferences**, not romantic matching.

FlatMat should help users understand:

* Who is interested in the same apartment
* Whether their budgets are compatible
* Whether their move-in timing is similar
* Whether they share interests
* Whether their lifestyles could work together
* Whether their housing preferences align
* Whether they want similar living arrangements

---

# 5. NO DATING-STYLE COMPATIBILITY PERCENTAGE

Do **not** use a numerical compatibility score such as:

* "94% Match"
* "87% Compatible"
* "92% Match"

FlatMat should not feel like a dating application.

Instead, show **specific compatibility signals** that are useful for deciding whether someone could be a good flatmate.

Examples:

* Shared interests
* Similar budget
* Same preferred location
* Similar move-in timeframe
* Non-smoker
* Pet-friendly
* Quiet home preference
* Social lifestyle
* Work/study schedule
* Cleanliness preferences
* Similar housing preferences

The goal is to answer:

> **"Would we work well as flatmates?"**

rather than:

> **"What percentage match are we?"**

---

# 6. CRITICAL SECURITY & PRIVACY SYSTEM

Privacy is a core part of the FlatMat experience.

For security reasons, **profile images and full names must NOT be revealed by default**.

Before a connection has been accepted, users must remain anonymized.

## Locked Profile State

Before approval:

* Never reveal the real profile image.
* Never reveal the user's full real name.
* Use a generic, high-quality silhouette/avatar.
* Show an anonymized name such as:

  * "Alex M."
  * "Jamie K."
  * "Hidden Name"
* Display a clear **Locked Profile** badge or lock icon.
* Keep the user's identity visually protected throughout the application.

The privacy state must be consistent across:

* Discovery
* Apartment pages
* Interested-flatmate lists
* Profiles
* Matches/connections
* Chat
* Notifications
* Search
* Saved users

Do not accidentally expose real identity information in any of these areas.

---

# 7. ACCEPTED / UNLOCKED STATE

Once the connection has been accepted:

* Reveal the real profile image.
* Reveal the real name.
* Display a prominent blue verified checkmark if the user is verified.
* Replace the generic avatar with the real profile photo.
* Update the relevant UI dynamically.

Example:

### Locked

> 🔒 Alex M.
> 26 years old
> 🎵 Music · 🏃 Running · ☕ Coffee
> Budget matches
> Moving in September

### Accepted

> [Real profile photo]
> Alex Morgan ✓
> 26 years old
> 🎵 Music · 🏃 Running · ☕ Coffee
> Budget matches
> Moving in September

The transition should feel smooth and intentional.

The locked and unlocked versions should be the **same profile component with different privacy states**, not two unrelated designs.

---

# 8. CONNECTION STATES

The application should consistently support these states:

### Locked

Identity is hidden.

`🔒 Alex M.`

### Connection Requested

A connection request has been sent.

`Pending`

Identity remains protected.

### Connection Received

The other person has requested a connection.

Show clear actions:

* Accept
* Decline

### Accepted

The connection is approved.

Reveal:

* Real photo
* Real name
* Verified badge
* Appropriate profile information

### Declined / Disconnected

Return to the appropriate privacy-safe state.

These states must remain consistent across the entire FlatMat experience.

---

# 9. SCREEN 1 — DISCOVERY / FLATMATE FEED

Create a card-based discovery experience showing potential flatmates who are interested in the same property or housing opportunity.

The interaction can use swipeable cards inspired by modern discovery applications.

However, the experience should feel like **housing/community discovery**, not dating.

## Card Content

Each card can include:

* Privacy-aware avatar
* Locked Profile badge when applicable
* Anonymized name before approval
* Real name after approval
* Age
* Shared interests
* Lifestyle preferences
* Housing preferences
* Budget information
* Move-in timeframe
* Other relevant roommate information

Example:

### Locked Card

> 🔒 Alex M.
> 26 years old
>
> 🎵 Music
> 🏃 Running
> ☕ Coffee
>
> Budget matches
> Moving in September
> Non-smoker
> Prefers a quiet home

### Unlocked Card

> [Real photo]
> Alex Morgan ✓
> 26 years old
>
> 🎵 Music
> 🏃 Running
> ☕ Coffee
>
> Budget matches
> Moving in September
> Non-smoker
> Prefers a quiet home

---

## Card Actions

Provide intuitive actions such as:

* **Pass**
* **Save**
* **Connect**
* **Chat**, when permitted

Use the existing application's button and icon components wherever possible.

Demonstrate different states across the interface where useful:

1. Locked profile
2. Connection pending
3. Connection received
4. Accepted/unlocked profile
5. Saved profile

---

# 10. SCREEN 2 — EXISTING APARTMENT + FLATMAT HUB

Integrate FlatMat directly into the application's existing Apartment/Property experience.

Do not create a separate property feature.

The existing apartment page should remain recognizable and preserve its existing information.

Add a FlatMat section such as:

## People interested in this apartment

Show a horizontal scroll of people interested in the apartment.

Each person should use the privacy-aware profile tile.

### Locked Tile

* Generic avatar
* Lock icon
* Anonymized name
* Shared interests
* Relevant housing information

### Unlocked Tile

* Real profile photo
* Real name
* Blue verified checkmark
* Shared interests
* Relevant housing information

Example:

> **People interested**
>
> 🔒 Alex M.
> 🔒 Jamie K.
> [Photo] Sam Morgan ✓

Tapping a person opens their privacy-aware profile.

---

# 11. SCREEN 3 — CONNECTIONS

If the existing app already has a Matches or Connections area, integrate FlatMat into it.

Do not automatically create a new navigation destination if an existing one can support this experience.

Use terminology such as:

* Connections
* Potential Flatmates
* Interested Flatmates
* Connection Requests
* People Interested

Avoid overly dating-oriented terminology.

The connections screen can show:

* Pending requests
* Incoming requests
* Accepted connections
* Saved flatmates
* Recently connected people

Respect the privacy state in every section.

---

# 12. SCREEN 4 — EXISTING CHAT / REAL-TIME MESSAGING

If the application already has chat or messaging functionality, **reuse it**.

Do not build an unrelated FlatMat messaging system.

Extend the existing messaging experience to support FlatMat privacy states.

## Locked Chat

Before connection approval:

Show:

* Generic avatar
* Lock icon
* Anonymized name
* "Locked Chat"
* "Pending Approval"

Example:

> 🔒 Alex M.
> Locked Chat · Pending Approval

The user's real identity must remain hidden.

## Active Chat

After the connection is accepted:

Show:

* Real profile photo
* Real name
* Blue verified checkmark
* Online status
* Existing chat interface

Example:

> [Photo] Alex Morgan ✓
> ● Online

Use the application's existing:

* Message bubbles
* Composer
* Timestamps
* Online indicators
* Attachments
* Chat actions

where available.

---

# 13. SCREEN 5 — USER PROFILE & SETTINGS

Use the application's existing profile system.

Do not create a separate FlatMat identity.

Extend the existing user profile with FlatMat-specific information such as:

* Lifestyle preferences
* Budget range
* Preferred locations
* Cleanliness preference
* Bio
* Interests
* Housing preferences
* Move-in timeframe
* Roommate preferences

---

# 14. "HOW OTHERS SEE ME" PRIVACY PREVIEW

Add a section allowing users to understand how their profile appears to other people.

### Before Connection

Show:

* Generic avatar
* Anonymized name
* Lock badge
* Limited permitted profile information

### After Connection

Show:

* Real profile photo
* Real name
* Blue verified checkmark
* Full permitted profile information

This should make the privacy model transparent to users.

---

# 15. EXISTING NAVIGATION

Do not automatically replace or redesign the application's navigation.

First inspect what already exists.

If the application already has:

* Home
* Apartments
* Messages
* Profile

integrate FlatMat into those destinations where appropriate.

For example:

### Apartments

Existing apartment

→ People interested

→ Flatmate profiles

→ Connection

### Messages

Existing conversations

→ FlatMat connection requests

→ Pending/active conversations

### Profile

Existing profile

→ FlatMat preferences

→ Privacy settings

→ "How others see me"

Only introduce a dedicated **Matches/Connections** navigation item if the existing information architecture genuinely requires it.

---

# 16. EXISTING DATA & BACKEND

Before creating new data models, inspect the existing application architecture.

Reuse existing entities such as:

* Users
* Apartments
* Properties
* Listings
* Profiles
* Images
* Favorites
* Messages
* Conversations
* Authentication

Only introduce new FlatMat-specific data where necessary.

Potential new concepts include:

* Connection requests
* Connection status
* Roommate preferences
* Shared interests
* Privacy state

These should be integrated into the existing architecture rather than creating a parallel FlatMat backend.

---

# 17. COMPONENT ARCHITECTURE

Create reusable components only where they do not already exist.

Potential FlatMat-specific components include:

* `PrivacyAwareAvatar`
* `LockedProfileBadge`
* `FlatmateCard`
* `InterestTag`
* `ConnectionStatus`
* `ConnectionButton`
* `PrivacyAwareProfile`
* `PrivacyAwareChatHeader`
* `FlatmateInterestTile`

However, first check whether equivalent components already exist and extend those instead.

Follow the existing application's naming conventions, architecture, folder structure, and coding patterns.

---

# 18. VISUAL DIRECTION

The intended FlatMat personality is:

* Warm
* Trustworthy
* Friendly
* Modern
* Clean
* Community-oriented
* Premium but approachable

A reference direction could include:

* Warm backgrounds
* Strong readable text
* Friendly accent colors
* Teal/coral-style accents
* Blue verification states
* Rounded cards
* Soft elevation
* Rounded tags
* Clear touch targets

However:

**Do not hardcode this palette if the existing application already has an established color system.**

The existing application's colors and design tokens take priority.

FlatMat should inherit the visual identity of the existing application.

---

# 19. INTERACTIONS & ANIMATIONS

Where appropriate, support:

* Swipe cards
* Save/unsave
* Pass
* Connection requests
* Accept/decline
* Profile unlock animation
* Locked avatar → real avatar transition
* Anonymized name → real name transition
* Connection success state
* Smooth navigation transitions

Keep animations subtle and consistent with the existing application's motion design.

---

# 20. PRIVACY IS A REAL PRODUCT STATE

The locked/unlocked system must not be treated as a purely visual decoration.

The application should conceptually support:

**Locked → Pending → Accepted → Unlocked**

The UI must reflect the correct state everywhere.

Never show real identity information inside a component that is supposed to be locked.

The privacy behavior should be consistent across:

* Apartment pages
* Discovery cards
* Profiles
* Connections
* Chat
* Notifications
* Search
* Saved users

---

# 21. IMPLEMENTATION APPROACH

Before making changes:

### Step 1 — Inspect

Understand the existing:

* Screens
* Navigation
* Components
* Design system
* Data models
* APIs/services
* Authentication
* Apartment functionality
* Profile functionality
* Messaging functionality

### Step 2 — Map

Identify where FlatMat naturally fits into the existing application.

Create a simple mental mapping:

**Existing feature → FlatMat enhancement**

Examples:

**Apartment detail → Interested flatmates**

**Existing profile → FlatMat roommate preferences**

**Existing messaging → Privacy-aware connection chat**

**Existing navigation → FlatMat entry points**

**Existing user model → Connection/privacy state**

### Step 3 — Reuse

Reuse existing components and infrastructure wherever possible.

### Step 4 — Extend

Add only the FlatMat functionality that is missing.

### Step 5 — Connect

Make sure FlatMat works naturally with the existing apartment, profile, navigation, and messaging features.

### Step 6 — Validate

Check that the final implementation looks and behaves like part of the original application.

---

# 22. FINAL PRODUCT PRINCIPLE

FlatMat should **not feel like another app inside the app**.

It should feel like:

> **"The existing housing app now lets me discover and connect with people who are looking for the same apartment or housing situation."**

The existing application remains the foundation.

FlatMat adds:

**Discovery + Shared Lifestyle Information + Privacy + Connection + Roommate Community**

without replacing or duplicating the application's existing features.

---

# SUCCESS CRITERIA

The implementation is successful when a user can:

1. Browse existing apartments.
2. See people interested in the same apartment.
3. Discover potential flatmates through swipeable/discovery cards.
4. See useful shared lifestyle and housing information.
5. Keep identities protected before connection approval.
6. Send and receive connection requests.
7. Accept a connection.
8. Automatically transition the profile from locked to unlocked.
9. See the real name, photo, and verified badge after approval.
10. Continue the conversation using the application's existing messaging system.
11. Manage roommate preferences from the existing profile/settings experience.
12. Understand exactly what information other users can see.
13. Navigate the experience using the application's existing navigation.
14. Experience FlatMat as a natural extension of the existing application.

### Most important rule:

**Do not rebuild what already exists. Inspect the application first, then integrate FlatMat into the existing features, components, data, navigation, and design system.**
