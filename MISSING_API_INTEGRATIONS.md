# Missing API Integrations & Enhancements

Based on the analysis of the current project structure (`lib/services`, `hooks`, and `app` pages), the following API integrations appear to be missing or incomplete. This document outlines the gaps between the current implementation and a fully functional production flow for both Users and Admins.

## 1. Event Ticketing & Booking (User Side)
**Current Status:**  
- `EventService` allows fetching events, ticket types, and checking availability.
- `BookingService` exists but is primarily tailored for **Table/Club Bookings** (time slots, guest counts).

**Missing APIs:**
- **Purchase Tickets:** An endpoint to book specific event tickets (e.g., `POST /events/{eventId}/book` or `/tickets/purchase`).
    - *Needs:* Payload dealing with `TicketType` selection (e.g., "2 VIP", "1 Regular"), not just "guest count".
- **My Tickets:** An endpoint to retrieve purchased tickets specifically (distinct from generic "bookings").
    - *Needs:* `GET /user/tickets` or filter `GET /user/bookings?type=EVENT`.
- **Ticket QR/Validation:** Backend support for generating and validating QR codes for entry.

## 2. Club Admin - Booking Management
**Current Status:**  
- `BookingService` includes `getUserBookings` (for the customer).
- There is **no method** for a Club Admin to view all bookings for their specific club.

**Missing APIs:**
- **Get Club Bookings:** `GET /clubs/{clubId}/bookings`
    - *Needs:* Filters for Date, Status (Confirmed/Pending/Cancelled), and Type (Table vs Event).
- **Manage Booking Action:** `POST /clubs/{clubId}/bookings/{bookingId}/{approve|reject}`
    - *Note:* `BookingService` has `confirmBooking` but it might be user-facing (payment confirmation). Admin often needs manual oversight for specific high-value tables.

## 3. Club Admin - Analytics & Dashboard
**Current Status:**  
- `SuperAdminService` provides global `AdminStats`.
- `StoryService` provides `StoryStats`.
- `EventService` has no specific analytics endpoints visible in the service file.

**Missing APIs:**
- **Club Dashboard Stats:** `GET /clubs/{clubId}/stats`
    - *Needs:* Revenue today/week, Total check-ins, Upcoming booking counts, event ticket sales summary.
- **Event Analytics:** `GET /events/{eventId}/analytics`
    - *Needs:* Tickets sold vs Capacity, Revenue per ticket type, Gender ratio (if tracked).

## 4. Reviews & Ratings system
**Current Status:**  
- `SearchService` references `rating` and `reviewCount` in search results.
- `ContactService` has a `review` field (likely for "Contact Us" messages).
- **No dedicated Review Service** found for submitting or listing club/event reviews.

**Missing APIs:**
- **Submit Review:** `POST /clubs/{clubId}/reviews` or `POST /events/{eventId}/reviews`.
- **List Reviews:** `GET /clubs/{clubId}/reviews`.
- **Admin Reply:** `POST /reviews/{reviewId}/reply` (for Club Owners).

## 5. User - Waitlist Management
**Current Status:**  
- `BookingService` handles availability but not waitlisting when full.

**Missing APIs:**
- **Join Waitlist:** `POST /clubs/{clubId}/waitlist` (when tables are full).
- **Waitlist Status:** `GET /user/waitlist`.

## 6. Advanced Filters & Search
**Current Status:**  
- `SearchService` and `ClubService` supports basic category/location filtering.

**Enhancements Needed:**
- **Filter by Amenities/Vibe:** If backend supports tagging (e.g., "Rooftop", "Techno"), these endpoints need to be exposed and integrated into the filter UI.

## Summary of Action Items
| Priority | Feature | Description |
| :--- | :--- | :--- |
| **High** | **Event Booking** | Implement `purchaseTicket` flow to allow users to buy event tickets. |
| **High** | **Club Admin Bookings** | Create `getClubBookings` to let admins see their schedule. |
| **Medium** | **Club Stats** | Implement `getClubStats` for the Admin Dashboard. |
| **Medium** | **Reviews** | Implement standard CRUD for User Reviews. |
| **Low** | **Waitlist** | Add waitlist capabilities for fully booked nights. |
