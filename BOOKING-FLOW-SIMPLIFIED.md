# Booking Flow - Simplified Implementation ✅

## Overview
The booking flow has been **simplified** based on the actual data structure:
- **Events**: Already have fixed date/time - user just sees them
- **Clubs**: User picks date + time for restaurant reservation
- **Offers**: Already have existing APIs
- **No need for separate time-slots API**

---

## Flow Architecture

### **Scenario 1: Restaurant Booking (No Event)**
```
1. User selects Club
2. Picks Date (from calendar)
3. Picks Time (from 18:00 PM - 23:30 PM)
4. Selects Guest Count
5. Chooses Offer (optional)
   ↓
6. Review Booking
7. Payment → Ticket Creation
```

### **Scenario 2: Event Booking (DJ Night)**
```
1. User selects Event
   - Event Date: Already shown (fixed)
   - Event Time: Already shown (fixed)
   - Entry Fee: Already shown
   ↓
2. Selects Guest Count
3. Review Booking
4. Payment → Ticket Creation
```

---

## Updated Components

### **1. Slot Selection Page** - `app/booking/slot/page.tsx`
**Behavior:**
- ✅ **For Events**: Shows fixed date/time from event details
  - User just selects guest count
  - No date/time picker needed
  - Shows entry fee from event

- ✅ **For Clubs**: Shows date picker + time picker
  - User selects date from calendar (21 days)
  - User selects time from list (18:00 - 23:30)
  - User selects guest count
  - Shows available offers for selected time

**Data Flow:**
```typescript
// From URL params
const eventData = searchParams.get('eventData');  // If event
const isEvent = eventData ? true : false;

// Save to sessionStorage
sessionStorage.setItem('bookingData', JSON.stringify({
  clubId,
  guestCount,
  selectedDate,      // For restaurants
  selectedTime,      // For restaurants
  isEvent,
  eventDetails       // For events
}));
```

### **2. Payment Handler** - `app/notifyPayment/page.tsx`
**Changes:**
- ✅ Creates ticket after successful payment
- ✅ Uses `isEvent` flag to determine pricing
- ✅ Calculates: `entryFee = isEvent ? (eventFee × guests) : 0`
- ✅ Passes all booking data to `createClubTicket()`

**Entry Fee Calculation:**
```typescript
const entryFee = bookingData.isEvent 
  ? (bookingData.eventDetails?.entryFee || 0) * bookingData.guestCount 
  : 0;

// Example:
// Event: ₹500 × 2 guests = ₹1000
// Club: ₹0
```

### **3. Confirmation Page** - `app/booking/confirmation/page.tsx`
**Features:**
- ✅ Displays QR code
- ✅ Shows booking details
- ✅ Shows event info (if event exists)
- ✅ Shows pricing breakdown
- ✅ Fetches ticket from API using `ticketId`

---

## SessionStorage Structure

```typescript
bookingData = {
  clubId: string,              // Club ID
  guestCount: number,          // 1-10
  selectedDate: string,        // YYYY-MM-DD (restaurant only)
  selectedTime: string,        // "18:30 PM" (restaurant only)
  selectedOffer: string | null, // Offer ID (restaurant only)
  isEvent: boolean,            // true if event, false if restaurant
  eventDetails: {              // Only if isEvent = true
    eventId: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    entryFee: number,
    clubName: string
  }
}

tableSelection = {
  tableId: string,
  tableNumber: string,
  floorNumber: string,
  notes: string
}

customerDetails = {
  name: string,
  email: string,
  phone: string,
  mobile: string
}
```

---

## API Endpoints Used

> **Note**: The application uses two sets of ticket APIs:
> - **Club Tickets API** (`/club-tickets/*`) - NEW APIs for club bookings (documented below)
> - **Legacy Ticket API** (`/ticket/tickets/*`) - Used for sharing, QR validation, and downloads

### **1. Create Club Ticket** (After Payment)
```
POST /club-tickets

Request:
{
  clubId: string
  clubName: string
  userId: string
  userEmail: string
  userName: string
  userPhone: string
  bookingDate: "YYYY-MM-DD"
  arrivalTime: {
    hour: number
    minute: number
    second: number
    nano: number
  }
  guestCount: number
  offerId?: string
  occasion?: string
  floorPreference?: string
  currency: string
}

Response (Success):
{
  ticketId: string
  ticketNumber: string
  status: "BOOKED"
  totalAmount: number
  currency: string
}

Response (Error):
{
  status: "error"
  message: string
}
```

### **2. Get Ticket Details** (On Confirmation)
```
GET /club-tickets/{ticketId}

Response (Success):
{
  ticketId: string
  ticketNumber: string
  clubId: string
  userId: string
  bookingDate: "YYYY-MM-DD"
  arrivalTime: "HH:mm:ss"
  guestCount: number
  status: "BOOKED | VALIDATED | CANCELLED"
}

Response (Error):
{
  status: "error"
  message: "Ticket not found"
}
```

---

## Additional Ticket APIs

### **3. Get Ticket by Ticket Number**
```
GET /club-tickets/by-number/{ticketNumber}

Example: GET /club-tickets/by-number/BQ-290

Response (Success):
{
  ticketId: string
  ticketNumber: string
  clubId: string
  userId: string
  bookingDate: "YYYY-MM-DD"
  arrivalTime: "HH:mm:ss"
  guestCount: number
  status: "BOOKED | VALIDATED | CANCELLED"
}
```

### **4. Validate Ticket** (Staff Use)
```
POST /club-tickets/{ticketId}/validate?validatedBy={staffId}

Response (Success):
{
  ticketId: string
  status: "VALIDATED"
  validatedAt: "ISO_DATETIME"
  validatedBy: string
}
```

### **5. Cancel Ticket**
```
POST /club-tickets/{ticketId}/cancel

Request:
{
  reason: string
  additionalNotes?: string
}

Response (Success):
{
  ticketId: string
  status: "CANCELLED"
  cancelledAt: "ISO_DATETIME"
}
```

### **6. Get User Tickets**
```
GET /club-tickets/user/{userId}

Response (Success):
[
  {
    ticketId: string
    ticketNumber: string
    clubName: string
    bookingDate: "YYYY-MM-DD"
    status: "BOOKED | VALIDATED | CANCELLED"
  }
]
```

### **7. Get Available Time Slots**
```
GET /club-tickets/clubs/{clubId}/time-slots?date=YYYY-MM-DD

Response (Success):
{
  timeSlots: [
    {
      time: "HH:mm:ss"
      availableOffers: number
      isAvailable: boolean
    }
  ]
}
```

---

## Key Features

### **Restaurant Mode (Scenario 1)**
- Date picker: Select from 21 days
- Time picker: 18:00 - 23:30 (12 slots)
- Dynamic offers: Show offers for selected time
- Entry fee: ₹0
- Calculation: Offer discount only

### **Event Mode (Scenario 2)**
- Fixed date & time: From event details
- Entry fee: From event (₹500, ₹1000, etc.)
- Guest multiplier: Entry fee × guest count
- Calculation: Entry fee - offer discount
- Shows event banner with all details

---

## Pricing Calculation

```typescript
// Restaurant Mode
entryFee = 0
offerDiscount = selectedOffer?.discount || 0
total = 0 - offerDiscount = -offerDiscount (if no entry fee, offer gives discount on bill)

// Event Mode
entryFee = eventFee × guestCount
         = 500 × 2 = ₹1000
offerDiscount = entryFee × 0.20 = ₹200  (for 20% offer)
total = 1000 - 200 = ₹800

// Alternative Offer (Fixed Amount)
offerDiscount = ₹200 (fixed)
total = 1000 - 200 = ₹800
```

---

## Complete Booking Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           USER SELECTS CLUB/EVENT               │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
    EVENT                       RESTAURANT
        │                           │
┌───────▼─────────────┐    ┌───────▼──────────┐
│ Show Event Details: │    │ Show Calendar:   │
│ - Date (fixed)      │    │ - Pick Date      │
│ - Time (fixed)      │    │ - Pick Time      │
│ - Entry Fee         │    │ - Pick Guests    │
│ - Guest Selector    │    │ - Show Offers    │
└───────┬─────────────┘    └───────┬──────────┘
        │                          │
        └────────────┬─────────────┘
                     │
        ┌────────────▼──────────────┐
        │   REVIEW BOOKING          │
        │ - Date/Time               │
        │ - Guests                  │
        │ - Offers                  │
        │ - Total Price             │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │   PAYMENT PAGE            │
        │ (Cashfree Gateway)        │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │ PAYMENT SUCCESS HANDLER   │
        │ POST /club-tickets        │
        │ Create Ticket with QR     │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │  CONFIRMATION PAGE        │
        │ - QR Code                 │
        │ - Booking Details         │
        │ - Event Info (if event)   │
        │ - Pricing                 │
        └───────────────────────────┘
```

---

## No API Calls Needed For:

- ❌ `GET /clubs/{clubId}/time-slots` - **Removed** (not needed)
  - Restaurants: Use static time slots
  - Events: Use event's fixed date/time

- ✅ **Already Available & Used:**
  - Event details (fetched elsewhere)
  - Offer APIs (existing)
  - Payment gateway (Cashfree)
  - Ticket creation `POST /club-tickets`
  - Ticket retrieval `GET /club-tickets/{ticketId}`
  - Ticket by number `GET /club-tickets/by-number/{ticketNumber}`
  - User tickets `GET /club-tickets/user/{userId}`
  - Validate ticket `POST /club-tickets/{ticketId}/validate`
  - Cancel ticket `POST /club-tickets/{ticketId}/cancel`
  - Time slots `GET /club-tickets/clubs/{clubId}/time-slots`

---

## Implementation Summary

| Component | Change | Status |
|-----------|--------|--------|
| **Slot Page** | Simplified - no API calls | ✅ Done |
| **Payment Handler** | Uses `isEvent` flag for pricing | ✅ Done |
| **Confirmation Page** | Dynamic ticket display | ✅ Done |
| **Club Service** | Removed `getTimeSlots()` | ✅ Done |
| **Ticket Service** | `createClubTicket()` ready | ✅ Ready |

---

## Testing Checklist

### **Restaurant Booking:**
- [ ] Select club
- [ ] Pick date from calendar
- [ ] Pick time (18:00 - 23:30)
- [ ] Select guests (1-10)
- [ ] Select offer
- [ ] Review booking
- [ ] Complete payment
- [ ] Verify ticket shows no event details
- [ ] Verify QR code displayed

### **Event Booking:**
- [ ] Select event
- [ ] See fixed date & time
- [ ] See entry fee
- [ ] Select guests (1-10)
- [ ] Review booking (entry fee × guests)
- [ ] Complete payment
- [ ] Verify ticket shows event details
- [ ] Verify QR code displayed
- [ ] Verify correct pricing

---

## Clean & Simple! 🎉

No complex time-slot API needed. Events have fixed date/time, restaurants use simple pickers.
