# Ticket Booking Flow Analysis & Missing Integration

## Current Status Analysis (Based on Screenshots)

### ✅ **EXISTING**: Files & Components Found

1. **Booking Flow Pages**:
   - `/app/booking/page.tsx` - Booking list
   - `/app/booking/slot/page.tsx` - Time slot selection (Step 3)
   - `/app/booking/table-selection/page.tsx` - Table selection
   - `/app/booking/review-booking/page.tsx` - Review before payment
   - `/app/booking/final-review/page.tsx` - Final review
   - `/app/booking/confirmation/page.tsx` - Booking confirmation

2. **Services**:
   - `BookingService` - Handles table bookings
   - `TicketService` - Ticket operations (share, cancel, validate QR)
   - `EventService` - Event operations
   - `ClubService` - Club operations

3. **Ticket APIs** (Already Implemented):
   - ✅ `POST /ticket/tickets/{ticketId}/share`
   - ✅ `POST /ticket/tickets/{ticketId}/cancel`
   - ✅ `POST /ticket/tickets/validate-qr`
   - ✅ `GET /ticket/tickets/{ticketId}`
   - ✅ `GET /ticket/tickets/{ticketId}/download`

---

## ❌ **MISSING**: Critical APIs & Integration

### 🔴 **CRITICAL MISSING APIs**

#### 1. **Time Slots API** (For Step 3)
```
GET /clubs/{clubId}/time-slots?date={date}&guests={guestCount}
```

**Purpose**: Get available time slots with event/offer information

**Expected Response**:
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
        "time": "18:00 PM",
        "available": true,
        "offerCount": 0,
        "offers": []
      },
      {
        "time": "18:30 PM",
        "available": true,
        "offerCount": 1,
        "offers": [
          {
            "offerId": "offer-1",
            "title": "20% off on total bill 19:00 PM",
            "discount": 20,
            "type": "PERCENTAGE",
            "minBill": 1000,
            "validFrom": "18:30 PM",
            "validUntil": "19:00 PM"
          }
        ]
      },
      {
        "time": "19:00 PM",
        "available": true,
        "offerCount": 2,
        "offers": [...]
      }
    ]
  }
}
```

**Scenario Handling**:
- **No Event (Restaurant Mode)**: `hasEvent: false`, `entryFee: 0`
- **Event Scheduled**: `hasEvent: true`, `entryFee: 500`, includes event details

---

#### 2. **Create Club Ticket Booking API** (For Step 6)
```
POST /club-tickets
```

**Purpose**: Create ticket/booking after payment

**Request Body**:
```json
{
  "clubId": "club-123",
  "eventId": "event-456",  // Optional - only if hasEvent=true
  "bookingDate": "2026-01-25",
  "arrivalTime": "18:30 PM",
  "guestCount": 2,
  "selectedOffer": {
    "offerId": "offer-1",
    "title": "20% off on total bill 19:00 PM",
    "discount": 20
  },
  "pricing": {
    "entryFee": 1000,        // 500 × 2 guests
    "offerDiscount": 200,    // 20% of 1000
    "totalAmount": 800,
    "currency": "INR"
  },
  "customerDetails": {
    "username": "user123",
    "email": "user@example.com",
    "mobile": "9876543210",
    "fullName": "John Doe"
  },
  "paymentDetails": {
    "orderId": "clubwiz-payment-123",
    "paymentSessionId": "session_xyz...",
    "cfOrderId": "2203627916",
    "paymentStatus": "SUCCESS"
  },
  "specialRequests": "Window seat preferred",
  "occasion": "Birthday celebration"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "ticketId": "ticket-789",
    "bookingId": "booking-101",
    "qrCode": "data:image/png;base64,iVBORw0KG...",
    "qrCodeUrl": "https://clubwiz.in/qr/ticket-789.png",
    "ticketNumber": "CLB-20260125-789",
    "status": "CONFIRMED",
    "bookingDetails": {
      "clubName": "DABO CLUB & KITCHEN",
      "venue": "Mangalmurti complex, Dharampeth, Nagpur",
      "date": "2026-01-25",
      "arrivalTime": "18:30 PM",
      "guestCount": 2,
      "tableNumber": "T-12",  // If table assigned
      "occasion": "Birthday celebration",
      "hasEvent": true,
      "eventTitle": "DJ Night with Chill Vibes",
      "entryFee": 1000,
      "offerApplied": "20% off on total bill",
      "discount": 200,
      "totalPaid": 800
    },
    "customerDetails": {
      "name": "John Doe",
      "email": "user@example.com",
      "mobile": "9876543210"
    },
    "emailSent": true,
    "smsSent": true
  }
}
```

---

### 📋 **Flow Integration Requirements**

## Scenario 1: No Event (Restaurant Mode)

### Current Flow vs. Expected Flow

| Step | Screenshot | Current Implementation | Missing/Required |
|------|-----------|----------------------|-----------------|
| **1** | User selects club | ✅ `/clubs/{clubId}` | ✅ Working |
| **2** | Shows "Reserve your spot" | ✅ Static UI | ✅ Working |
| **3** | Enter guests & select date | ✅ UI exists | ❌ **Need `/clubs/{clubId}/time-slots` API** |
| **4** | Select arrival time | ✅ UI in `/booking/slot` | ❌ **Need to call time-slots API** |
| **5** | Shows offers for time | ✅ UI exists | ❌ **Need offer data from time-slots response** |
| **6** | Review booking | ✅ `/booking/review-booking` | ✅ Working |
| **7** | **PAYMENT** | ✅ `/payment/process` | ✅ **Just integrated!** |
| **8** | **Create Ticket** | ❌ **MISSING** | ❌ **Need `POST /club-tickets`** |
| **9** | Show QR code | ✅ `/booking/confirmation` | ⚠️ **Need ticket data from API** |


### API Call Sequence:
```
1. GET /clubs/{clubId} → Club details
2. GET /clubs/{clubId}/time-slots?date=2026-01-25&guests=2
   Response: { hasEvent: false, entryFee: 0, timeSlots: [...] }
3. User selects time & offer
4. Navigate to /payment/process with booking details
5. POST /gateway/create-order → Payment
6. After payment success → POST /club-tickets → Create booking
7. Show ticket with QR code
```

---

## Scenario 2: Event Scheduled (DJ Night)

### Flow Differences

| Step | Screenshot | API Call | Response Key Difference |
|------|-----------|----------|------------------------|
| **1** | User selects club | `GET /clubs/{clubId}` | Club details |
| **2** | Shows "Now Playing: DJ Name" | - | UI shows event info |
| **3** | Enter guests & date | `GET /clubs/{clubId}/time-slots` | `hasEvent: true, entryFee: 500` |
| **4** | Select time | - | Shows "18:30 PM - 1 Offer" |
| **5** | Review with entry fee | - | Shows: Entry ₹1000 (500×2), Offer -₹200, Total ₹800 |
| **6** | **PAYMENT** | `POST /gateway/create-order` | Pay ₹800 |
| **7** | **Create Ticket** | `POST /club-tickets` | Include eventId in request |
| **8** | Show QR | - | Ticket with event details |

### Key Difference:
- **Entry Fee Calculation**: `entryFee × guestCount`
- **Include `eventId`** in `/club-tickets` request
- **Ticket shows event name**: "DJ Night with Chill Vibes"

---

## 🔧 **Implementation Checklist**

### Backend APIs Needed:

- [ ] **`GET /clubs/{clubId}/time-slots`**
  - Accept query params: `date`, `guests`
  - Return: `hasEvent`, `entryFee`, `eventDetails`, `timeSlots[]` with offers
  
- [ ] **`POST /club-tickets`**
  - Accept: booking details, payment info, customer details
  - Create: Booking record, Generate QR code
  - Return: ticket details with QR
  - Send: Email & SMS confirmation

### Frontend Integration Needed:

#### 1. **Update `/app/booking/slot/page.tsx`**

**Current State**: Hardcoded time slots
**Required**: Call time-slots API

```tsx
// Add API call
const fetchTimeSlots = async () => {
  const response = await fetch(
    `/api/clubs/${clubId}/time-slots?date=${selectedDate}&guests=${guestCount}`
  );
  const data = await response.json();
  
  setHasEvent(data.hasEvent);
  setEntryFee(data.eventDetails?.entryFee || 0);
  setTimeSlots(data.timeSlots);
};
```

#### 2. **Update Booking Flow to Include Entry Fee**

Currently missing entry fee calculation in:
- `/app/booking/review-booking/page.tsx`
- Payment amount calculation

**Required**:
```tsx
const calculateTotal = () => {
  const entryFeeTotal = hasEvent ? (entryFee * guestCount) : 0;
  const offerDiscount = selectedOffer?.discount || 0;
  return entryFeeTotal - offerDiscount;
};
```

#### 3. **Create Ticket After Payment**

In `/app/notifyPayment/page.tsx`, after payment success:

```tsx
// After payment verified as SUCCESS
const createTicket = async () => {
  const ticketResponse = await fetch('/api/club-tickets', {
    method: 'POST',
    body: JSON.stringify({
      clubId,
      eventId: hasEvent ? eventId : null,
      bookingDate,
      arrivalTime,
      guestCount,
      selectedOffer,
      pricing: {
        entryFee: entryFeeTotal,
        offerDiscount,
        totalAmount: paymentAmount
      },
      customerDetails: {
        username,
        email,
        mobile
      },
      paymentDetails: {
        orderId,
        paymentSessionId,
        cfOrderId,
        paymentStatus: 'SUCCESS'
      }
    })
  });
  
  const ticket = await ticketResponse.json();
  
  // Navigate to confirmation with ticket
  router.push(`/booking/confirmation?ticketId=${ticket.data.ticketId}`);
};
```

#### 4. **Show Ticket with QR Code**

Update `/app/booking/confirmation/page.tsx`:

```tsx
const [ticket, setTicket] = useState(null);

useEffect(() => {
  const ticketId = searchParams.get('ticketId');
  if (ticketId) {
    fetchTicket(ticketId);
  }
}, []);

const fetchTicket = async (ticketId) => {
  const response = await TicketService.getTicketDetails(ticketId);
  setTicket(response.data);
};

// Display QR code
<img src={ticket?.qrCode} alt="QR Code" />
```

---

## 🔄 **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    TICKET BOOKING FLOW                      │
└─────────────────────────────────────────────────────────────┘

1. User selects club
   ↓
   GET /clubs/{clubId}
   ↓
2. Click "Reserve your spot" / "Book Now"
   ↓
3. Enter guest count & select date
   ↓
   GET /clubs/{clubId}/time-slots?date=...&guests=...
   ├─ Scenario 1: hasEvent=false → No entry fee
   └─ Scenario 2: hasEvent=true → entryFee=500
   ↓
4. Select arrival time from available slots
   ↓
5. View offers for selected time
   ↓
6. Review booking summary:
   ├─ Scenario 1: Entry Fee: ₹0, Offer: -₹X, Total: -₹X
   └─ Scenario 2: Entry Fee: ₹1000, Offer: -₹200, Total: ₹800
   ↓
7. Proceed to Payment
   ↓
   POST /gateway/create-order
   ↓
8. Redirect to Cashfree
   ↓
9. Complete payment
   ↓
10. Cashfree redirects to /notifyPayment
   ↓
11. Verify payment status
    ↓
12. ✅ Payment SUCCESS → Create Ticket
    ↓
    POST /club-tickets (with payment details)
    ↓
13. Receive ticket with QR code
    ↓
14. Show confirmation page with:
    - QR code
    - Booking details
    - Event info (if applicable)
    - Venue details
    - Contact info
    ↓
15. Send email & SMS confirmation
```

---

## 📊 **Data Flow Summary**

### State to Track Throughout Flow:

```typescript
interface BookingState {
  // Club & Event
  clubId: string;
  clubName: string;
  eventId?: string;
  eventTitle?: string;
  hasEvent: boolean;
  
  // Booking Details
  bookingDate: string;
  arrivalTime: string;
  guestCount: number;
  
  // Pricing
  entryFee: number;          // Per guest
  entryFeeTotal: number;     // entryFee × guestCount
  selectedOffer?: {
    offerId: string;
    title: string;
    discount: number;
  };
  offerDiscount: number;
  totalAmount: number;
  
  // Payment
  orderId?: string;
  paymentSessionId?: string;
  cfOrderId?: string;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  
  // Customer
  username: string;
  email: string;
  mobile: string;
}
```

---

## 🎯 **Next Steps (Priority Order)**

### **HIGH PRIORITY** (Block user flow):

1. **Backend**: Create `GET /clubs/{clubId}/time-slots` endpoint
   - Handle both scenarios (event vs no event)
   - Return offers per time slot
   
2. **Backend**: Create `POST /club-tickets` endpoint
   - Create booking record
   - Generate QR code
   - Send email/SMS
   
3. **Frontend**: Update `/app/booking/slot/page.tsx`
   - Call time-slots API
   - Display offers from API
   - Calculate entry fee
   
4. **Frontend**: Integrate ticket creation after payment
   - Call `/club-tickets` after payment success
   - Store ticket data
   
5. **Frontend**: Update confirmation page
   - Display QR code from API
   - Show all booking details

### **MEDIUM PRIORITY**:

6. Create service method in `lib/services/booking.service.ts`
7. Create hook `use-club-booking.ts`
8. Add error handling for failed bookings
9. Add loading states

### **LOW PRIORITY**:

10. Add booking history page
11. Add email template design
12. Add SMS template
13. Add analytics tracking

---

## 🧪 **Testing Checklist**

### Scenario 1 (No Event):
- [ ] Time slots API returns `hasEvent: false`
- [ ] Entry fee is ₹0
- [ ] Offers still work
- [ ] Payment calculates correctly
- [ ] Ticket created without eventId
- [ ] QR code generated
- [ ] Confirmation email sent

### Scenario 2 (Event):
- [ ] Time slots API returns `hasEvent: true` with eventDetails
- [ ] Entry fee is calculated: `entryFee × guestCount`
- [ ] Offers apply on top of entry fee
- [ ] Payment includes entry fee
- [ ] Ticket includes eventId and event name
- [ ] QR code generated with event info
- [ ] Confirmation email has event details

---

## 📝 **Sample API Responses**

### Time Slots (No Event):
```json
{
  "success": true,
  "data": {
    "clubId": "club-123",
    "date": "2026-01-25",
    "hasEvent": false,
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
            "type": "PERCENTAGE"
          }
        ]
      }
    ]
  }
}
```

### Time Slots (With Event):
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
      "description": "Techno & Bollytech"
    },
    "timeSlots": [...]
  }
}
```

### Create Ticket Success:
```json
{
  "success": true,
  "data": {
    "ticketId": "ticket-789",
    "bookingId": "booking-101",
    "qrCode": "data:image/png;base64...",
    "ticketNumber": "CLB-20260125-789",
    "status": "CONFIRMED",
    "bookingDetails": {...},
    "emailSent": true,
    "smsSent": true
  }
}
```

---

## ✅ **Conclusion**

### Already Implemented:
- ✅ Payment gateway integration (Cashfree)
- ✅ Ticket management APIs (share, cancel, validate, download)
- ✅ Basic booking UI flow

### Missing & Required:
- ❌ `GET /clubs/{clubId}/time-slots` API
- ❌ `POST /club-tickets` API
- ❌ Frontend integration with these APIs
- ❌ Entry fee calculation logic
- ❌ QR code generation & display

### Estimated Work:
- **Backend**: 2-3 days (time-slots + club-tickets endpoints)
- **Frontend**: 1-2 days (integrate APIs, update flows)
- **Testing**: 1 day (both scenarios)
- **Total**: ~5-6 days
