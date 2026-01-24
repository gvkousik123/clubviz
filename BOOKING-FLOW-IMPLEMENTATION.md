# Booking Flow Integration - Implementation Complete ✅

## Overview
Successfully integrated the complete booking flow with payment processing and ticket generation for both **Scenario 1 (No Event/Restaurant Mode)** and **Scenario 2 (Event Scheduled/DJ Night)**.

---

## ✅ Completed Implementations

### 1. **API Integration** 
#### Added to `lib/services/club.service.ts`:
- **`getTimeSlots(clubId, { date, guests })`**
  - Fetches available time slots with event and offer information
  - Returns: `hasEvent`, `eventDetails`, `timeSlots[]` with offers
  - Handles both scenarios (with/without event)

#### Added to `lib/services/ticket.service.ts`:
- **`createClubTicket(bookingData)`**
  - Creates booking ticket after successful payment
  - Generates QR code
  - Includes: booking details, pricing, customer info, payment details
  - Returns: ticket with QR code and all booking information

---

### 2. **Slot Selection Screen** (`app/booking/slot/page.tsx`)
**Changes:**
- ✅ Integrated with `getTimeSlots()` API
- ✅ Fetches time slots dynamically based on date and guest count
- ✅ Displays event information banner when event exists
- ✅ Shows offers for each time slot
- ✅ Calculates entry fee for events (Scenario 2)
- ✅ Saves booking data to `sessionStorage` for next steps
- ✅ Loading states and error handling

**Key Features:**
```tsx
// Fetches time slots when date or guests change
useEffect(() => {
  if (selectedDate !== null && clubId) {
    fetchTimeSlots();
  }
}, [selectedDate, guestCount, clubId]);

// Saves booking data for subsequent screens
sessionStorage.setItem('bookingData', JSON.stringify({
  clubId,
  guestCount,
  selectedDate,
  selectedTime,
  selectedOffer,
  hasEvent,
  eventDetails
}));
```

**UI Enhancements:**
- 🎵 Event banner showing event title and entry fee
- 🎟️ Dynamic offer cards with discount details
- ⏰ Time slots show available offer count
- 🔄 Loading state while fetching slots

---

### 3. **Payment Integration** (`app/notifyPayment/page.tsx`)
**Changes:**
- ✅ Added ticket creation after successful payment
- ✅ Retrieves booking data from `sessionStorage`
- ✅ Calculates pricing (entry fee + offer discount)
- ✅ Calls `createClubTicket()` API
- ✅ Navigates to confirmation with `ticketId`
- ✅ Clears booking data after ticket creation

**Flow:**
```
Payment Success → Create Ticket → Get Ticket ID → Navigate to Confirmation
```

**Pricing Logic:**
```tsx
const entryFee = hasEvent 
  ? (eventDetails.entryFeePerGuest * guestCount) 
  : 0;

const offerDiscount = selectedOffer 
  ? (type === 'PERCENTAGE' 
      ? (entryFee * discount / 100) 
      : discount)
  : 0;

const totalAmount = entryFee - offerDiscount;
```

---

### 4. **Confirmation Screen** (`app/booking/confirmation/page.tsx`)
**Changes:**
- ✅ Fetches ticket details using `ticketId` from URL
- ✅ Displays dynamic ticket data from API
- ✅ Shows QR code from ticket
- ✅ Displays all booking details
- ✅ Shows event details (if event exists)
- ✅ Displays pricing breakdown
- ✅ Loading and error states

**Dynamic Data Display:**
- Customer details (name, mobile, email)
- Booking details (date, time, guests, table)
- Event details (title, entry fee) - conditional
- Pricing (entry fee, discount, total)
- QR code for venue entry
- Reservation ID

---

## 📊 User Flows

### **Scenario 1: No Event (Restaurant Mode)**
```
1. User selects club
2. Clicks "Reserve your spot"
3. Enters guest count & date
   → API: GET /clubs/{clubId}/time-slots
   → Response: { hasEvent: false, entryFee: 0, timeSlots: [...] }
4. Selects arrival time
5. Views offers for selected time
6. Reviews booking (Entry Fee: ₹0)
7. Proceeds to payment (if any charges)
8. Payment Success → Create Ticket
   → API: POST /club-tickets
9. Shows confirmation with QR code
```

### **Scenario 2: Event Scheduled (DJ Night)**
```
1. User selects club
2. Clicks "Reserve your spot" / "Book Now"
3. Enters guest count & date
   → API: GET /clubs/{clubId}/time-slots
   → Response: { hasEvent: true, entryFee: 500, eventDetails: {...}, timeSlots: [...] }
4. Sees event banner: "DJ Night - Entry: ₹500 per person"
5. Selects arrival time
6. Views offers: "20% off"
7. Reviews booking:
   - Entry Fee: ₹500 × 2 = ₹1000
   - Offer: 20% off = -₹200
   - Total: ₹800
8. Proceeds to payment (₹800)
9. Payment Success → Create Ticket
   → API: POST /club-tickets (includes eventId)
10. Shows confirmation with:
    - QR code
    - Event details
    - Pricing breakdown
```

---

## 🔧 Data Flow

### **SessionStorage Keys:**
```typescript
// After slot selection (slot/page.tsx)
sessionStorage.setItem('bookingData', JSON.stringify({
  clubId: string,
  guestCount: number,
  selectedDate: string,        // YYYY-MM-DD
  selectedTime: string,         // "18:30 PM"
  selectedOffer: object | null,
  hasEvent: boolean,
  eventDetails: object | null
}));

// After table selection (table-selection/page.tsx)
sessionStorage.setItem('tableSelection', JSON.stringify({
  tableId: string,
  tableNumber: string,
  floorNumber: string,
  notes: string
}));

// After form (form/page.tsx)
sessionStorage.setItem('customerDetails', JSON.stringify({
  name: string,
  email: string,
  phone: string,
  mobile: string,
  username: string
}));
```

### **API Request/Response:**

#### `GET /clubs/{clubId}/time-slots?date=2026-01-25&guests=2`
```json
{
  "success": true,
  "data": {
    "clubId": "club-123",
    "date": "2026-01-25",
    "hasEvent": true,
    "eventDetails": {
      "eventId": "event-456",
      "eventTitle": "DJ Night with Chill Vibes",
      "entryFee": 500,
      "entryFeePerGuest": 500,
      "description": "Techno & Bollytech night"
    },
    "timeSlots": [
      {
        "time": "18:30 PM",
        "available": true,
        "offerCount": 1,
        "offers": [
          {
            "offerId": "offer-1",
            "title": "20% off on total bill",
            "discount": 20,
            "type": "PERCENTAGE",
            "minBill": 1000
          }
        ]
      }
    ]
  }
}
```

#### `POST /club-tickets`
**Request:**
```json
{
  "clubId": "club-123",
  "eventId": "event-456",
  "bookingDate": "2026-01-25",
  "arrivalTime": "18:30 PM",
  "guestCount": 2,
  "tableNumber": "TG-03",
  "floorNumber": "Ground Floor",
  "notes": "Birthday",
  "selectedOffer": {
    "offerId": "offer-1",
    "title": "20% off",
    "discount": 20,
    "type": "PERCENTAGE"
  },
  "pricing": {
    "entryFee": 1000,
    "offerDiscount": 200,
    "totalAmount": 800
  },
  "customerDetails": {
    "username": "david",
    "email": "david@test.com",
    "mobile": "+91 9XXXX9XXXX",
    "name": "David Simon"
  },
  "paymentDetails": {
    "orderId": "order_123",
    "paymentSessionId": "session_456",
    "cfOrderId": "cf_789",
    "paymentStatus": "SUCCESS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "ticket-789",
    "bookingId": "booking-123",
    "reservationId": "BO-290",
    "qrCode": "https://api.qrserver.com/v1/...",
    "qrCodeUrl": "https://...",
    "clubDetails": {
      "clubId": "club-123",
      "clubName": "Dabo Club & Kitchen",
      "address": "6, New Manish Nagar, Nagpur",
      "contactPhone": "+91 XXXXXXXXXX"
    },
    "eventDetails": {
      "eventId": "event-456",
      "eventTitle": "DJ Night",
      "entryFee": 500
    },
    "bookingDetails": {
      "bookingDate": "2026-01-25",
      "arrivalTime": "18:30 PM",
      "guestCount": 2,
      "tableNumber": "TG-03",
      "floorNumber": "Ground Floor",
      "notes": "Birthday"
    },
    "pricing": {
      "entryFee": 1000,
      "offerDiscount": 200,
      "totalAmount": 800
    },
    "customerDetails": {
      "name": "David Simon",
      "email": "david@test.com",
      "mobile": "+91 9XXXX9XXXX"
    }
  }
}
```

---

## 🎨 UI/UX Improvements

### **Slot Selection Page:**
1. **Event Banner** - Shows when event exists
   - Event title
   - Entry fee per person
   - Gradient teal background with border

2. **Time Slots** - Dynamic from API
   - Shows offer count per slot
   - Disabled state for unavailable slots
   - Selected state with border

3. **Offer Cards** - Dynamic based on selected time
   - Offer title and description
   - Discount percentage/amount
   - Minimum bill requirement (if any)
   - Radio selection UI
   - Discount icon decoration

### **Confirmation Page:**
1. **QR Code** - From API
2. **Reservation ID** - Dynamic
3. **Two-column Grid** - Booking details
4. **Event Section** - Conditional (only if event exists)
5. **Pricing Breakdown** - Shows entry fee, discount, total
6. **Loading State** - Spinner while fetching ticket
7. **Error Handling** - Fallback if ticket not found

---

## 🔍 Key Features

### **Entry Fee Calculation (Scenario 2):**
```typescript
// In notifyPayment/page.tsx
const entryFee = hasEvent 
  ? (eventDetails.entryFeePerGuest * guestCount) 
  : 0;

// Example: 
// Event: ₹500 per person × 2 guests = ₹1000
```

### **Offer Discount Calculation:**
```typescript
const offerDiscount = selectedOffer 
  ? (selectedOffer.type === 'PERCENTAGE' 
      ? (entryFee * selectedOffer.discount / 100)
      : selectedOffer.discount)
  : 0;

// Example:
// 20% off on ₹1000 = ₹200
```

### **Total Amount:**
```typescript
const totalAmount = entryFee - offerDiscount;

// Example:
// ₹1000 - ₹200 = ₹800
```

---

## 📝 Files Modified

1. ✅ **lib/services/club.service.ts** - Added `getTimeSlots()` API
2. ✅ **lib/services/ticket.service.ts** - Added `createClubTicket()` API
3. ✅ **app/booking/slot/page.tsx** - Integrated time-slots API, event display
4. ✅ **app/notifyPayment/page.tsx** - Added ticket creation after payment
5. ✅ **app/booking/confirmation/page.tsx** - Dynamic ticket display

---

## 🚀 Testing Checklist

### **Scenario 1: No Event (Restaurant Mode)**
- [ ] Select club without event
- [ ] Choose date and guests
- [ ] Verify time slots load from API
- [ ] Verify no event banner shown
- [ ] Verify entry fee = ₹0
- [ ] Select time and offer
- [ ] Complete payment
- [ ] Verify ticket created without event details
- [ ] Verify QR code displayed

### **Scenario 2: Event Scheduled**
- [ ] Select club with event
- [ ] Choose date and guests
- [ ] Verify event banner shown with entry fee
- [ ] Verify time slots load with offers
- [ ] Select time and offer
- [ ] Verify pricing: Entry fee × guests - offer discount
- [ ] Complete payment
- [ ] Verify ticket created with event details
- [ ] Verify pricing breakdown shown
- [ ] Verify QR code displayed

---

## 🎯 Next Steps (Backend Requirements)

### **Backend APIs to Implement:**

1. **`GET /clubs/{clubId}/time-slots`**
   - Query params: `date` (YYYY-MM-DD), `guests` (number)
   - Check if event exists for the date
   - Return available time slots
   - Include offers for each slot
   - Calculate entry fee if event exists

2. **`POST /club-tickets`**
   - Accept booking data, payment details, customer info
   - Create booking record in database
   - Generate QR code using library (qrcode, etc.)
   - Upload QR image to storage (S3/Cloudinary)
   - Send confirmation email with ticket
   - Send SMS with booking details
   - Return ticket details with QR code URL

### **Database Schema (Suggested):**

**bookings table:**
- id (primary key)
- club_id (foreign key)
- event_id (foreign key, nullable)
- booking_date
- arrival_time
- guest_count
- table_id (nullable)
- table_number (nullable)
- floor_number (nullable)
- notes (nullable)
- entry_fee
- offer_discount
- total_amount
- status (CONFIRMED, CANCELLED, COMPLETED)
- qr_code_url
- reservation_id
- customer_name
- customer_email
- customer_mobile
- payment_order_id
- payment_status
- created_at
- updated_at

---

## 📧 Email/SMS Template (Backend)

### **Email:**
```
Subject: Booking Confirmation - [Club Name]

Hi [Customer Name],

Your booking has been confirmed!

Reservation ID: [BO-XXX]
Club: [Club Name]
Date: [Date]
Time: [Time]
Guests: [X]
Table: [Table Number]

[If Event]
Event: [Event Title]
Entry Fee: ₹[Amount]

Total Paid: ₹[Amount]

[QR Code Image]

Show this QR code at the entrance.

See you there!
```

### **SMS:**
```
Your booking at [Club Name] is confirmed!
Reservation: [BO-XXX]
Date: [Date] | Time: [Time]
Guests: [X]
[If Event] Entry: ₹[Amount]
Total: ₹[Amount]
Check email for QR code.
```

---

## ✨ Summary

**All booking flow screens and APIs are now integrated!** 

The implementation properly handles both scenarios:
- ✅ **Scenario 1**: Restaurant mode (no event, no entry fee)
- ✅ **Scenario 2**: Event mode (DJ night, entry fee applied)

The flow seamlessly integrates:
- ✅ Time slot selection with event/offer data
- ✅ Entry fee calculation
- ✅ Payment processing
- ✅ Ticket generation with QR code
- ✅ Dynamic confirmation display

**Backend APIs needed:**
- `GET /clubs/{clubId}/time-slots`
- `POST /club-tickets`

Once these backend APIs are implemented, the complete booking flow will be fully functional! 🎉
