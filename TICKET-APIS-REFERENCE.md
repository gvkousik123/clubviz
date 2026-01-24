# Ticket APIs Reference - Complete Guide

## Base URL
```
https://clubwiz.in/ticket
```

## Authentication
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`
- Required for all protected endpoints

---

## Response Conventions

### Success Response
- On success, response body contains **pure JSON data** without status or statusCode
- HTTP status code: 200, 201

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```
- HTTP status code: 400, 404, 500, etc.

---

## Club Tickets API

### 1. Get Ticket by Ticket Number
**Retrieve ticket information using ticket number**

```
GET /club-tickets/by-number/{ticketNumber}
```

**Example:**
```
GET /club-tickets/by-number/BQ-290
```

**Path Parameters:**
- `ticketNumber` (string) - Ticket number (e.g., BQ-290)

**Success Response:**
```json
{
  "ticketId": "string",
  "ticketNumber": "string",
  "clubId": "string",
  "userId": "string",
  "bookingDate": "YYYY-MM-DD",
  "arrivalTime": "HH:mm:ss",
  "guestCount": 2,
  "status": "BOOKED"
}
```

**Status Values:**
- `BOOKED` - Ticket is active and confirmed
- `VALIDATED` - User has checked in at the club
- `CANCELLED` - Ticket has been cancelled

**Error Response:**
```json
{
  "status": "error",
  "message": "Ticket not found"
}
```

---

### 2. Create Club Ticket
**Book a ticket for a club visit. Automatically checks if event exists and applies entry fee.**

```
POST /club-tickets
```

**Request Body:**
```json
{
  "clubId": "string",
  "clubName": "string",
  "userId": "string",
  "userEmail": "string",
  "userName": "string",
  "userPhone": "string",
  "bookingDate": "YYYY-MM-DD",
  "arrivalTime": {
    "hour": 18,
    "minute": 30,
    "second": 0,
    "nano": 0
  },
  "guestCount": 2,
  "offerId": "string (optional)",
  "occasion": "string (optional)",
  "floorPreference": "string (optional)",
  "currency": "INR"
}
```

**Field Details:**
- `clubId` (required) - Unique club identifier
- `clubName` (required) - Name of the club
- `userId` (required) - User's unique identifier
- `userEmail` (required) - User's email address
- `userName` (required) - User's full name
- `userPhone` (required) - User's phone number
- `bookingDate` (required) - Date in YYYY-MM-DD format
- `arrivalTime` (required) - Time object with hour (0-23), minute, second, nano
- `guestCount` (required) - Number of guests (minimum 1)
- `offerId` (optional) - Offer ID if applying a discount
- `occasion` (optional) - Special occasion (Birthday, Anniversary, etc.)
- `floorPreference` (optional) - Preferred floor (Ground Floor, First Floor, etc.)
- `currency` (required) - Currency code (INR, USD, etc.)

**Success Response:**
```json
{
  "ticketId": "ticket-789",
  "ticketNumber": "BQ-290",
  "status": "BOOKED",
  "totalAmount": 800,
  "currency": "INR"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid booking data"
}
```

---

### 3. Validate Ticket
**Mark ticket as validated when user arrives at the club (staff use)**

```
POST /club-tickets/{ticketId}/validate
```

**Path Parameters:**
- `ticketId` (string) - Ticket ID to validate

**Query Parameters:**
- `validatedBy` (string) - Staff member ID who is validating the ticket

**Example:**
```
POST /club-tickets/ticket-789/validate?validatedBy=staff-123
```

**Success Response:**
```json
{
  "ticketId": "ticket-789",
  "status": "VALIDATED",
  "validatedAt": "2026-01-24T18:30:00Z",
  "validatedBy": "staff-123"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Ticket not found or already validated"
}
```

---

### 4. Cancel Ticket
**Cancel a club ticket with a reason**

```
POST /club-tickets/{ticketId}/cancel
```

**Path Parameters:**
- `ticketId` (string) - Ticket ID to cancel

**Request Body:**
```json
{
  "reason": "Cannot attend",
  "additionalNotes": "Family emergency"
}
```

**Field Details:**
- `reason` (required) - Reason for cancellation
- `additionalNotes` (optional) - Additional notes about cancellation

**Success Response:**
```json
{
  "ticketId": "ticket-789",
  "status": "CANCELLED",
  "cancelledAt": "2026-01-24T15:30:00Z"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Ticket cannot be cancelled"
}
```

---

### 5. Get Ticket Details by Ticket ID
**Retrieve complete club ticket information by ticket ID**

```
GET /club-tickets/{ticketId}
```

**Path Parameters:**
- `ticketId` (string) - Ticket ID

**Example:**
```
GET /club-tickets/ticket-789
```

**Success Response:**
```json
{
  "ticketId": "ticket-789",
  "ticketNumber": "BQ-290",
  "clubId": "club-123",
  "userId": "user-456",
  "bookingDate": "2026-01-25",
  "arrivalTime": "18:30:00",
  "guestCount": 2,
  "status": "BOOKED"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Ticket not found"
}
```

---

### 6. Get Tickets by User
**Retrieve all club tickets for a specific user**

```
GET /club-tickets/user/{userId}
```

**Path Parameters:**
- `userId` (string) - User ID

**Example:**
```
GET /club-tickets/user/user-456
```

**Success Response:**
```json
[
  {
    "ticketId": "ticket-789",
    "ticketNumber": "BQ-290",
    "clubName": "Dabo Club & Kitchen",
    "bookingDate": "2026-01-25",
    "status": "BOOKED"
  },
  {
    "ticketId": "ticket-790",
    "ticketNumber": "BQ-291",
    "clubName": "Another Club",
    "bookingDate": "2026-01-26",
    "status": "VALIDATED"
  }
]
```

**Error Response:**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

### 7. Get Available Time Slots
**Get available arrival times for a club on a specific date. Shows if event exists and entry fee.**

```
GET /club-tickets/clubs/{clubId}/time-slots
```

**Path Parameters:**
- `clubId` (string) - Club ID

**Query Parameters:**
- `date` (string) - Date in YYYY-MM-DD format

**Example:**
```
GET /club-tickets/clubs/club-123/time-slots?date=2026-01-25
```

**Success Response:**
```json
{
  "timeSlots": [
    {
      "time": "18:00:00",
      "availableOffers": 3,
      "isAvailable": true
    },
    {
      "time": "18:30:00",
      "availableOffers": 2,
      "isAvailable": true
    },
    {
      "time": "19:00:00",
      "availableOffers": 0,
      "isAvailable": false
    }
  ]
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid club or date"
}
```

---

## Implementation Examples

### TypeScript/JavaScript

#### Create a Club Ticket
```typescript
import { api } from '@/lib/api-client';

const createClubTicket = async () => {
  try {
    const response = await api.post('/club-tickets', {
      clubId: 'club-123',
      clubName: 'Dabo Club & Kitchen',
      userId: 'user-456',
      userEmail: 'user@example.com',
      userName: 'John Doe',
      userPhone: '+919876543210',
      bookingDate: '2026-01-25',
      arrivalTime: {
        hour: 18,
        minute: 30,
        second: 0,
        nano: 0
      },
      guestCount: 2,
      offerId: 'offer-1',
      occasion: 'Birthday',
      floorPreference: 'Ground Floor',
      currency: 'INR'
    });

    console.log('Ticket created:', response.data);
    // { ticketId: 'ticket-789', ticketNumber: 'BQ-290', ... }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Get Ticket by Number
```typescript
const getTicketByNumber = async (ticketNumber: string) => {
  try {
    const response = await api.get(`/club-tickets/by-number/${ticketNumber}`);
    console.log('Ticket:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
getTicketByNumber('BQ-290');
```

#### Validate Ticket
```typescript
const validateTicket = async (ticketId: string, staffId: string) => {
  try {
    const response = await api.post(
      `/club-tickets/${ticketId}/validate?validatedBy=${staffId}`,
      {}
    );
    console.log('Validated:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
validateTicket('ticket-789', 'staff-123');
```

#### Cancel Ticket
```typescript
const cancelTicket = async (ticketId: string, reason: string) => {
  try {
    const response = await api.post(`/club-tickets/${ticketId}/cancel`, {
      reason: reason,
      additionalNotes: 'Optional notes'
    });
    console.log('Cancelled:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
cancelTicket('ticket-789', 'Cannot attend');
```

#### Get User Tickets
```typescript
const getUserTickets = async (userId: string) => {
  try {
    const response = await api.get(`/club-tickets/user/${userId}`);
    console.log('User tickets:', response.data);
    // Array of tickets
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
getUserTickets('user-456');
```

#### Get Available Time Slots
```typescript
const getTimeSlots = async (clubId: string, date: string) => {
  try {
    const response = await api.get(
      `/club-tickets/clubs/${clubId}/time-slots?date=${date}`
    );
    console.log('Time slots:', response.data.timeSlots);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
getTimeSlots('club-123', '2026-01-25');
```

---

## Error Handling

All endpoints follow the same error handling pattern:

```typescript
try {
  const response = await api.post('/club-tickets', data);
  // Handle success
  if (response.data) {
    console.log('Success:', response.data);
  }
} catch (error) {
  // Handle error
  if (error.response?.data?.status === 'error') {
    console.error('API Error:', error.response.data.message);
  } else {
    console.error('Network Error:', error.message);
  }
}
```

---

## Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success - GET requests |
| 201 | Created - POST requests |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Missing/invalid auth token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

---

## Best Practices

1. **Always handle errors** - Check for both success and error responses
2. **Validate input** - Ensure required fields are present before making requests
3. **Use proper authentication** - Include Bearer token in all requests
4. **Check ticket status** - Before performing actions (validate, cancel)
5. **Store ticket IDs** - Save ticketId and ticketNumber for future reference
6. **Time format** - Use proper time object structure for arrivalTime
7. **Date format** - Always use YYYY-MM-DD format for dates

---

## Integration Checklist

- [ ] Set up API client with base URL
- [ ] Configure authentication headers
- [ ] Implement createClubTicket for bookings
- [ ] Implement getTicketDetails for confirmation page
- [ ] Implement getUserTickets for user profile
- [ ] Implement validateTicket for staff scanning
- [ ] Implement cancelTicket for cancellations
- [ ] Add error handling for all endpoints
- [ ] Test with different ticket statuses
- [ ] Handle edge cases (expired tickets, invalid data)

---

## Support

For API issues or questions, contact the backend team or refer to the Swagger documentation at:
```
https://clubwiz.in/ticket/swagger-ui.html
```
