# ClubViz App - Screen Flow Documentation

## Overview
ClubViz is a nightlife and club discovery app with event booking capabilities. The app follows a mobile-first design approach with a dark theme and vibrant purple/pink gradient accents.

## User Journey Map

### 1. Onboarding & Authentication Flow
```
intro.png → login page.png → login page (1).png → mobile verification.png → HOME PAGE.jpg
```

**Flow Description:**
- **Intro Screen**: Welcome/splash screen introducing the app
- **Login Page**: Primary authentication screen with sign-in options
- **Login Page (1)**: Alternative login method or registration
- **Mobile Verification**: OTP verification for phone-based authentication
- **Home Page**: Main dashboard after successful authentication

### 2. Main Navigation Structure

#### Primary Navigation (Bottom Tab Bar/Hamburger Menu)
Based on the design screens, the app has the following main sections:

1. **Home** (`HOME PAGE.jpg`, `HOME PAGE (1).jpg`, `HOME PAGE (2).jpg`)
2. **Clubs** (`club list.png`, `venue list.png`)
3. **Events** (`event booking.png`, `event booking (1).png`)
4. **Profile** (`edit profile.png`)
5. **Favorites** (`fav clubs.png`, `fav events.png`)

#### Hamburger Menu (`hamburger menu.png`)
- Profile Settings
- Favorites
- Contact Us
- Other app settings

### 3. Home Screen Flow
```
HOME PAGE.jpg ↔ HOME PAGE (1).jpg ↔ HOME PAGE (2).jpg
       ↓
   (Search/Filter)
       ↓
   filter.png
```

**Features:**
- Hero section with featured events/clubs
- Search functionality
- Location-based filtering
- Quick access to popular venues
- Story-like promotional content

### 4. Club/Venue Discovery Flow
```
HOME PAGE → club list.png → venue list.png → gallery.png → gallery (1).png
                                    ↓
                              See review.png
                                    ↓
                              write Reviews.png
```

**Flow Description:**
- **Club List**: Grid/list view of available clubs
- **Venue List**: Detailed venue listings with filters
- **Gallery**: Photo gallery of club interiors/events
- **Reviews**: User ratings and review system

### 5. Event Booking Flow
```
HOME PAGE → event booking.png → event booking (1).png → event pre booking details.png
                                                              ↓
                                                    event pre booking details (1).png
                                                              ↓
                                                       payment overlay.png
                                                              ↓
                                                   ticket confirm loading.png
                                                              ↓
                                                        event ticket.png
```

**Detailed Booking Process:**
1. **Event Discovery**: Browse events from home or clubs
2. **Event Details**: View event information, timing, pricing
3. **Pre-booking Details**: Select tickets, add guest information
4. **Payment**: Secure payment processing
5. **Confirmation**: Loading state during payment processing
6. **Ticket**: Digital ticket with QR code/details

### 6. Booking Management Flow
```
event ticket.png → booking.jpg → booking (1).jpg → booking (2).jpg → booking (3).jpg
                      ↓                                                      ↓
               ticket cancel.png ← cancel confirmation.png ← [Cancel Option]
```

**Features:**
- View active bookings
- Ticket management
- Cancellation process with confirmation
- Booking history

### 7. Communication & Support Flow
```
Contact us.png → Contact us (1).png → Contact us (2).png
                        ↓
              event contact confirmation.png
```

**Support Features:**
- Multiple contact methods
- Event-specific support
- Confirmation of support requests

### 8. Content & Social Features
```
Story.png → story (1).png → story (2).png
              ↓
    dabo.png (Featured content/promotions)
```

**Social Elements:**
- Story-like content for promotions
- Featured club/event content
- Social sharing capabilities

### 9. User Profile & Favorites
```
edit profile.png ↔ fav clubs.png ↔ fav events.png
```

**Profile Features:**
- Personal information management
- Favorite clubs tracking
- Favorite events management
- Booking history

### 10. Error Handling
```
error page.png
```
- Graceful error handling
- User-friendly error messages
- Recovery options

## Navigation Patterns

### Primary Navigation
1. **Bottom Tab Bar**: Main sections (Home, Clubs, Events, Profile, Favorites)
2. **Hamburger Menu**: Secondary features and settings
3. **Search Bar**: Global search functionality
4. **Back Navigation**: Consistent back button placement

### Secondary Navigation
1. **Cards**: Tap to navigate to details
2. **Lists**: Scroll and tap for selections
3. **Filters**: Overlay/modal style filters
4. **CTAs**: Primary action buttons for booking/confirmation

## Screen Categories

### Core Functionality Screens
- **Discovery**: HOME PAGE variations, club list, venue list
- **Booking**: event booking, pre-booking details, payment
- **Management**: booking management, ticket viewing
- **Profile**: edit profile, favorites

### Supporting Screens
- **Authentication**: intro, login, verification
- **Communication**: contact us variations
- **Content**: stories, gallery, reviews
- **Utility**: filter, error page, loading states

## Key Design Patterns

### Visual Hierarchy
1. **Hero Sections**: Large visual elements with gradients
2. **Card-based Layout**: Consistent card components for content
3. **List Views**: Clean, scannable list interfaces
4. **Modal Overlays**: Payment, confirmation, filter interfaces

### Interaction Patterns
1. **Tap**: Primary interaction method
2. **Swipe**: Gallery navigation, story progression
3. **Pull to Refresh**: Content updates
4. **Long Press**: Secondary actions

### Feedback Mechanisms
1. **Loading States**: Progress indicators during actions
2. **Confirmations**: Clear confirmation screens
3. **Error States**: Helpful error messaging
4. **Success States**: Ticket confirmations, booking success

## Technical Navigation Implementation

### Route Structure (Suggested)
```
/
├── auth/
│   ├── intro
│   ├── login
│   └── verify
├── home/
├── clubs/
│   ├── list
│   ├── [id]
│   └── gallery/[id]
├── events/
│   ├── [id]
│   ├── booking/[id]
│   └── ticket/[id]
├── profile/
│   ├── edit
│   ├── favorites/
│   │   ├── clubs
│   │   └── events
│   └── bookings/
├── contact/
└── error
```

### State Management Considerations
- User authentication state
- Booking cart/session state
- Favorites and preferences
- Location and filter preferences
- Navigation history for back button functionality

This flow documentation provides a comprehensive overview of how users navigate through the ClubViz app, ensuring a smooth and intuitive user experience across all features and functionalities.