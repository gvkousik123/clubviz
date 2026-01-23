# Cashfree Payment Gateway Integration Guide

## Overview
Complete payment integration with Cashfree payment gateway for ticket booking and event payments. Includes order creation, payment session management, and webhook notifications.

---

## Architecture Flow

```
User Action → Create Order → Get Session ID → Redirect to Cashfree → Payment → Webhook Notify → Status Page
```

### Detailed Flow:

1. **User initiates payment** (clicks "Pay Now")
2. **Frontend calls** `POST /gateway/create-order` with amount and customer details
3. **Backend creates order** in database and with Cashfree
4. **Backend returns** `{ order_id, payment_session_id, cf_order_id }`
5. **Frontend redirects** to Cashfree with `payment_session_id`
6. **User completes payment** on Cashfree platform
7. **Cashfree notifies backend** via webhook
8. **Backend updates** order status in database
9. **Frontend polls** for payment status or reads from localStorage
10. **User sees** success/failure page at `/notifyPayment`

---

## Files Created/Updated

### 1. **Payment Gateway Service**
**File**: `lib/services/payment-gateway.service.ts`

**Purpose**: Core service for all payment operations

**Key Methods**:
```typescript
// Create payment order
createOrder(data: CreatePaymentOrderRequest): Promise<ApiResponse<CreatePaymentOrderResponse>>

// Get payment status
getPaymentStatus(orderId: string): Promise<ApiResponse<PaymentStatusResponse>>

// Handle webhook notifications
handleWebhookNotification(notification: PaymentNotification): Promise<void>

// Poll for payment status
pollPaymentStatus(orderId: string, maxAttempts?: number, intervalMs?: number): Promise<PaymentStatusResponse>

// Get/Clear stored notifications
getStoredNotification(orderId: string): PaymentNotification | null
clearNotification(orderId: string): void
```

**Types**:
```typescript
interface CreatePaymentOrderRequest {
  amount: number
  currency: string
  customer_username: string
  customer_email: string
  customer_mobile: string
}

interface CreatePaymentOrderResponse {
  order_id: string
  payment_session_id: string
  cf_order_id: string
}

interface PaymentNotification {
  order_id: string
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING'
  payment_amount: number
  payment_currency: string
  payment_time?: string
  payment_message?: string
}

interface PaymentStatusResponse {
  order_id: string
  cf_order_id: string
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED'
  payment_session_id: string
  order_amount: number
  order_currency: string
  customer_details: {
    customer_id: string
    customer_email: string
    customer_phone: string
  }
  payments?: Array<{
    payment_status: string
    payment_amount: number
    payment_time: string
    payment_method: string
  }>
}
```

---

### 2. **Payment Processing Page**
**File**: `app/payment/process/page.tsx`

**Purpose**: Handle payment initialization and redirect to Cashfree

**Flow**:
1. Receives payment data from URL params
2. Calls `createOrder()` API
3. Stores order details in localStorage
4. Initializes Cashfree SDK
5. Opens Cashfree checkout modal/redirect

**URL Parameters**:
- `amount` - Payment amount
- `username` - Customer username
- `email` - Customer email
- `mobile` - Customer mobile number

**Features**:
- Loading states with animations
- Error handling
- Cashfree SDK integration
- Automatic redirect handling

---

### 3. **Payment Notification/Callback Page**
**File**: `app/notifyPayment/page.tsx`

**Purpose**: Handle Cashfree redirect and show payment status

**Flow**:
1. Receives `order_id` from URL params
2. Checks localStorage for payment notification
3. Polls payment status API if no notification
4. Shows success/failed/pending UI
5. Redirects to appropriate page

**URL Parameters**:
- `order_id` - Order ID to check status

**Features**:
- Payment status polling (60 attempts, 3s interval)
- Success/Failed/Pending states
- Payment details display
- Redirect buttons

---

### 4. **Payment Hook**
**File**: `hooks/use-payment.ts`

**Purpose**: React hook for payment management

**Functions**:
```typescript
// Initiate payment flow
initiatePayment(paymentData: CreatePaymentOrderRequest): Promise<boolean>

// Check payment status
checkPaymentStatus(orderId: string): Promise<PaymentStatusResponse | null>

// Quick payment helper
quickPay(amount: number, userDetails: {...}): Promise<boolean>
```

**Usage**:
```tsx
const { initiatePayment, loading, error } = usePayment();

const handlePay = async () => {
  await initiatePayment({
    amount: 1000,
    currency: 'INR',
    customer_username: 'user123',
    customer_email: 'user@example.com',
    customer_mobile: '9876543210'
  });
};
```

---

### 5. **Example Payment Page**
**File**: `app/payment/example/page.tsx`

**Purpose**: Test payment integration

**Features**:
- Form inputs for all required fields
- Live API endpoint preview
- Payment initiation button
- Usage instructions

**Access**: Navigate to `/payment/example`

---

### 6. **Layout Update**
**File**: `app/layout.tsx`

**Change**: Added Cashfree SDK script

```tsx
<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
```

---

## API Endpoints Required

### 1. Create Payment Order
```
POST /gateway/create-order
```

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "amount": 1000.00,
  "currency": "INR",
  "customer_username": "kaushikbaurasi123-881",
  "customer_email": "kaushikbaurasi123@gmail.com",
  "customer_mobile": "9876543210"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "order_id": "clubwiz-e098e35e-016b-43e3-8e4b-45e285f500b2",
    "payment_session_id": "session_WzlnWQhtY0dnoqWzpOb63SUyrlzGIsLvf0JdyfH5FOopT9Q7tihcDt_h_k1BMdW4XZWeuZWMlUkwYokr7wksmD3aQNOIcsvgPrPiaeWSNhHmG0PCF02n1nxPTQEApaymentpayment",
    "cf_order_id": "2203627916"
  }
}
```

**Backend Implementation**:
1. Validate JWT token
2. Create order in database
3. Call Cashfree API to create order
4. Store `payment_session_id` and `cf_order_id`
5. Return order details

---

### 2. Get Payment Status
```
GET /gateway/payment-status/{orderId}
```

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "order_id": "clubwiz-e098e35e-016b-43e3-8e4b-45e285f500b2",
    "cf_order_id": "2203627916",
    "order_status": "PAID",
    "payment_session_id": "session_...",
    "order_amount": 1000.00,
    "order_currency": "INR",
    "customer_details": {
      "customer_id": "user123",
      "customer_email": "user@example.com",
      "customer_phone": "9876543210"
    },
    "payments": [
      {
        "payment_status": "SUCCESS",
        "payment_amount": 1000.00,
        "payment_time": "2026-01-24T10:30:00Z",
        "payment_method": "UPI"
      }
    ]
  }
}
```

**Backend Implementation**:
1. Validate JWT token
2. Fetch order from database
3. Optionally verify with Cashfree API
4. Return order status

---

### 3. Webhook Notification Endpoint
```
POST /gateway/webhook
```

**Purpose**: Receive payment notifications from Cashfree

**Request Body** (from Cashfree):
```json
{
  "data": {
    "order": {
      "order_id": "clubwiz-e098e35e-016b-43e3-8e4b-45e285f500b2",
      "order_amount": 1000.00,
      "order_currency": "INR",
      "order_status": "PAID"
    },
    "payment": {
      "cf_payment_id": "12376123",
      "payment_status": "SUCCESS",
      "payment_amount": 1000.00,
      "payment_time": "2026-01-24T10:30:00Z",
      "payment_method": {
        "upi": {
          "channel": "link",
          "upi_id": "success@upi"
        }
      }
    },
    "customer_details": {
      "customer_phone": "9876543210",
      "customer_email": "user@example.com"
    }
  },
  "event_time": "2026-01-24T10:30:00Z",
  "type": "PAYMENT_SUCCESS_WEBHOOK"
}
```

**Backend Implementation**:
1. Verify webhook signature (Cashfree provides signature in headers)
2. Extract order_id and payment_status
3. Update order in database
4. Send confirmation email/SMS
5. Return 200 OK

**Security**: Verify webhook signature using Cashfree secret key

---

## Integration Steps

### Step 1: Backend Setup

1. **Create `/gateway/create-order` endpoint**:
   - Accept payment details
   - Create order in database
   - Call Cashfree API to create order
   - Return session ID

2. **Create `/gateway/payment-status/{orderId}` endpoint**:
   - Fetch order from database
   - Return order status

3. **Create `/gateway/webhook` endpoint**:
   - Receive Cashfree notifications
   - Verify signature
   - Update order status

### Step 2: Frontend Integration

**In your booking/ticket page**:

```tsx
import { usePayment } from '@/hooks/use-payment';
import { useAuth } from '@/hooks/use-auth'; // Or however you get user details

function BookingPage() {
  const { initiatePayment, loading } = usePayment();
  const { user } = useAuth();

  const handleBooking = async () => {
    // Get booking details
    const totalAmount = calculateTotal(); // Your calculation
    
    // Initiate payment
    const success = await initiatePayment({
      amount: totalAmount,
      currency: 'INR',
      customer_username: user.username,
      customer_email: user.email,
      customer_mobile: user.mobile
    });
    
    // User will be redirected to /payment/process
    // Then to Cashfree
    // Then back to /notifyPayment
  };

  return (
    <button onClick={handleBooking} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
```

### Step 3: Test Payment Flow

1. Navigate to `/payment/example`
2. Enter test amount (e.g., 1000)
3. Fill in customer details
4. Click "Proceed to Payment"
5. You'll be redirected to `/payment/process`
6. Then to Cashfree (sandbox mode)
7. Complete test payment
8. Get redirected to `/notifyPayment`

---

## Environment Variables

Add to `.env.local`:

```env
# Cashfree Configuration
NEXT_PUBLIC_CASHFREE_MODE=sandbox  # or 'production'
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key

# Payment URLs (for backend)
CASHFREE_API_URL=https://sandbox.cashfree.com/pg  # or production URL
PAYMENT_WEBHOOK_URL=https://your-domain.com/gateway/webhook
PAYMENT_RETURN_URL=https://your-domain.com/notifyPayment
```

---

## Cashfree Sandbox Testing

### Test Credentials:
- **Mode**: sandbox
- **UPI**: success@upi (for successful payment)
- **UPI**: failure@upi (for failed payment)
- **Cards**: Use Cashfree test cards
- **Wallets**: Use Cashfree test wallets

### Test Payment Flow:
1. Create order with test amount
2. Use test UPI ID: `success@upi`
3. Complete payment
4. Check status at `/notifyPayment`

---

## Payment Status Polling

The `/notifyPayment` page automatically polls for payment status:

- **Max Attempts**: 60 (configurable)
- **Interval**: 3 seconds (configurable)
- **Timeout**: 3 minutes total
- **Fallback**: Shows pending status if timeout

**Polling Strategy**:
1. Check localStorage for notification (instant)
2. If not found, poll API every 3 seconds
3. Stop when status is PAID or EXPIRED
4. Show timeout error after max attempts

---

## Error Handling

### Common Errors:

1. **"Missing payment information"**
   - Ensure all fields are provided
   - Check URL params in `/payment/process`

2. **"Payment gateway not loaded"**
   - Cashfree SDK not loaded
   - Check network connection
   - Verify script tag in layout

3. **"Failed to create payment order"**
   - Backend API error
   - Check API endpoint
   - Verify JWT token

4. **"Payment status polling timeout"**
   - Webhook not received
   - Network issues
   - Check backend webhook endpoint

---

## Security Considerations

1. **JWT Token**: All payment APIs require authentication
2. **Webhook Signature**: Verify Cashfree webhook signatures
3. **Amount Validation**: Backend should validate amounts
4. **HTTPS Only**: All payment flows must use HTTPS
5. **No Sensitive Data**: Don't log payment details

---

## Production Checklist

- [ ] Update `NEXT_PUBLIC_CASHFREE_MODE` to `production`
- [ ] Add production Cashfree credentials
- [ ] Configure production webhook URL
- [ ] Set up SSL/HTTPS
- [ ] Test webhook signature verification
- [ ] Add payment error monitoring
- [ ] Set up email notifications
- [ ] Configure payment retries
- [ ] Add payment analytics
- [ ] Test all payment methods

---

## Usage Example in Booking Flow

```tsx
// In your ticket booking page

import { usePayment } from '@/hooks/use-payment';
import { useProfile } from '@/hooks/use-profile';

function TicketBookingPage() {
  const { initiatePayment, loading } = usePayment();
  const { profile } = useProfile();
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 500;

  const handlePayment = async () => {
    const totalAmount = ticketCount * ticketPrice;
    
    await initiatePayment({
      amount: totalAmount,
      currency: 'INR',
      customer_username: profile.username,
      customer_email: profile.email,
      customer_mobile: profile.mobile
    });
    
    // User will be redirected automatically
  };

  return (
    <div>
      <h1>Book Tickets</h1>
      <p>Price: ₹{ticketPrice} per ticket</p>
      <input 
        type="number" 
        value={ticketCount}
        onChange={(e) => setTicketCount(parseInt(e.target.value))}
      />
      <p>Total: ₹{ticketCount * ticketPrice}</p>
      
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${ticketCount * ticketPrice}`}
      </button>
    </div>
  );
}
```

---

## Troubleshooting

### Payment not initiating
- Check console for errors
- Verify all required fields
- Check JWT token validity
- Test `/gateway/create-order` endpoint directly

### Stuck on payment processing page
- Check Cashfree SDK loaded
- Verify payment_session_id is valid
- Check browser console for errors
- Try in different browser

### Webhook not received
- Verify webhook URL is accessible
- Check Cashfree dashboard for webhook logs
- Verify webhook signature validation
- Check server logs

### Payment status not updating
- Check polling is working
- Verify API endpoint returns correct status
- Check localStorage for notifications
- Manually refresh status page

---

## Additional Resources

- [Cashfree Documentation](https://docs.cashfree.com/)
- [Cashfree Payment Gateway API](https://docs.cashfree.com/reference/pg-new-apis-endpoint)
- [Cashfree Webhooks](https://docs.cashfree.com/reference/webhooks)
- [Cashfree Test Cards](https://docs.cashfree.com/reference/test-data)

---

## Support

For payment integration issues:
1. Check browser console logs
2. Check backend server logs
3. Verify Cashfree dashboard
4. Test with sandbox credentials first
5. Contact Cashfree support for gateway issues
