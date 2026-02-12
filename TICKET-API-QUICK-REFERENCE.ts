// ============================================================================
// TICKET MANAGEMENT API - QUICK REFERENCE
// ============================================================================
// Base URL: https://clubwiz.in/ticket
// All endpoints require authentication unless specified otherwise
// ============================================================================

import { TicketService } from '@/lib/services/ticket.service';

// ============================================================================
// 1. SHARE TICKET
// ============================================================================
// Endpoint: POST /ticket/tickets/{ticketId}/share
// Description: Share ticket via email, SMS, or other platforms

const shareTicketExample = async () => {
    const ticketId = 'ticket_123';

    // Share via email
    const emailShare = await TicketService.shareTicket(ticketId, {
        platform: 'email',
        recipientEmail: 'friend@example.com',
        message: 'Check out my ticket for this amazing event!'
    });

    // Share via SMS
    const smsShare = await TicketService.shareTicket(ticketId, {
        platform: 'sms',
        recipientPhone: '+919876543210',
        message: 'Hey! Here\'s my ticket info.'
    });

    // Share via WhatsApp
    const whatsappShare = await TicketService.shareTicket(ticketId, {
        platform: 'whatsapp',
        recipientPhone: '+919876543210',
        message: 'Check this out!'
    });

    // Response format:
    // {
    //   success: true,
    //   message: 'Ticket shared successfully',
    //   data: {
    //     message: 'Ticket shared successfully',
    //     shareUrl?: 'https://clubwiz.in/ticket/view?ticketId=...'
    //   }
    // }
};

// ============================================================================
// 2. CANCEL TICKET
// ============================================================================
// Endpoint: POST /ticket/tickets/{ticketId}/cancel
// Description: Cancel a ticket with a reason

const cancelTicketExample = async () => {
    const ticketId = 'ticket_123';

    const result = await TicketService.cancelTicket(ticketId, {
        reason: 'Unable to attend',
        additionalNotes: 'Family emergency came up'
    });

    // Response format:
    // {
    //   success: true,
    //   message: 'Ticket cancelled successfully',
    //   data: {
    //     message: 'Ticket cancelled successfully',
    //     refundAmount?: 1500,
    //     refundStatus?: 'PROCESSING'
    //   }
    // }
};

// ============================================================================
// 3. VALIDATE QR CODE
// ============================================================================
// Endpoint: POST /ticket/tickets/validate-qr
// Description: Validate ticket QR code at venue entrance (Admin/Entry Point)

const validateQRExample = async () => {
    const result = await TicketService.validateQRCode({
        qrCode: 'QR_CODE_DATA_HERE',
        validatedBy: 'security_guard_123',
        location: 'Main Entrance Gate A'
    });

    // Response format:
    // {
    //   success: true,
    //   data: {
    //     isValid: true,
    //     ticketId: 'ticket_123',
    //     ticketNumber: 'TKT-2025-001',
    //     eventTitle: 'EDM Night 2025',
    //     ticketType: 'VIP',
    //     holderName: 'John Doe',
    //     status: 'ACTIVE',
    //     message: 'Valid ticket - Entry allowed'
    //   }
    // }

    // Invalid ticket response:
    // {
    //   success: false,
    //   data: {
    //     isValid: false,
    //     message: 'Invalid ticket - Already used or cancelled'
    //   }
    // }
};

// ============================================================================
// 4. GET TICKET DETAILS
// ============================================================================
// Endpoint: GET /ticket/tickets/{ticketId}
// Description: Retrieve complete ticket information by ticket ID

const getTicketDetailsExample = async () => {
    const ticketId = 'ticket_123';

    const result = await TicketService.getTicketDetails(ticketId);

    // Response format:
    // {
    //   success: true,
    //   data: {
    //     ticketId: 'ticket_123',
    //     bookingId: 'booking_456',
    //     eventId: 'event_789',
    //     eventTitle: 'EDM Night 2025',
    //     eventDate: '2026-01-25T21:00:00Z',
    //     ticketType: 'VIP',
    //     ticketNumber: 'TKT-2025-001',
    //     qrCode: 'data:image/png;base64,...',
    //     status: 'ACTIVE', // ACTIVE | USED | CANCELLED | EXPIRED
    //     purchaseDate: '2026-01-20T10:30:00Z',
    //     price: 1500,
    //     venue: {
    //       name: 'DABO Nightclub',
    //       address: 'Airport Road, Nagpur'
    //     },
    //     userDetails: {
    //       name: 'John Doe',
    //       email: 'john@example.com',
    //       phone: '+919876543210'
    //     }
    //   }
    // }
};

// ============================================================================
// 5. DOWNLOAD TICKET PDF
// ============================================================================
// Endpoint: GET /ticket/tickets/{ticketId}/download
// Description: Download ticket as PDF file

const downloadTicketExample = async () => {
    const ticketId = 'ticket_123';

    // Method 1: Auto-download to user's device
    await TicketService.downloadAndSaveTicketPDF(ticketId);

    // Method 2: Get blob for custom handling
    const pdfBlob = await TicketService.downloadTicketPDF(ticketId);
    // Do something with the blob...

    // Method 3: With custom filename
    await TicketService.downloadAndSaveTicketPDF(
        ticketId,
        'my-event-ticket-2025.pdf'
    );
};

// ============================================================================
// INTEGRATION WITH REACT COMPONENTS
// ============================================================================

// Using the custom hook
import { useTicket } from '@/hooks/use-ticket';

// Example component usage (for reference - this is a .ts file, not .tsx)
/*
function TicketComponent({ ticketId }: { ticketId: string }) {
  const {
    ticket,           // Ticket details
    loading,          // Loading state
    error,            // Error message
    fetchTicketDetails, // Re-fetch ticket
    shareTicket,      // Share ticket
    cancelTicket,     // Cancel ticket
    downloadTicket,   // Download ticket PDF
  } = useTicket(ticketId);

  // Automatically fetches ticket on mount
  // All methods handle loading states and show toasts
  
  // In your JSX:
  // {loading && <p>Loading...</p>}
  // {error && <p>Error: {error}</p>}
  // {ticket && (
  //   <div>
  //     <h1>{ticket.eventTitle}</h1>
  //     <button onClick={downloadTicket}>Download</button>
  //     <button onClick={() => shareTicket({ platform: 'email' })}>Share</button>
  //     <button onClick={() => cancelTicket({ reason: 'Cannot attend' })}>Cancel</button>
  //   </div>
  // )}
}
*/

// ============================================================================
// TYPICAL USER FLOWS
// ============================================================================

// Flow 1: After booking completion
// 1. User books ticket → receives ticketId
// 2. Navigate to /ticket/complete?ticketId=xxx
// 3. Show success + Download/Share/View buttons
// 4. User can download PDF or view ticket details

// Flow 2: View existing ticket
// 1. Navigate to /ticket/view?ticketId=xxx
// 2. Fetch and display ticket details
// 3. Show QR code, event details, ticket info
// 4. Provide Download/Share/Cancel actions

// Flow 3: Cancel ticket
// 1. User clicks Cancel on ticket view
// 2. Navigate to /ticket/cancel?ticketId=xxx
// 3. User selects reason and confirms
// 4. Call cancelTicket API
// 5. Navigate to /ticket/cancelled success page

// Flow 4: Entry validation (Admin/Security)
// 1. Scan ticket QR code at entrance
// 2. Call validateQRCode with QR data
// 3. Check response for validity
// 4. Allow/deny entry based on status

// ============================================================================
// ERROR HANDLING
// ============================================================================

// All API calls follow standard error response format:
// {
//   success: false,
//   message: 'Error message here',
//   error: 'Detailed error info'
// }

// Common error scenarios:
// - 401: Unauthorized (no auth token)
// - 404: Ticket not found
// - 400: Invalid request data
// - 500: Server error

// The TicketService and useTicket hook automatically handle these
// and show appropriate toast notifications

// ============================================================================
// NOTES
// ============================================================================

// 1. All ticket operations require authentication (Bearer token)
// 2. QR codes are base64 encoded image strings
// 3. Ticket status flow: ACTIVE → USED or CANCELLED
// 4. Expired tickets automatically change to EXPIRED status
// 5. PDF downloads return binary blob data
// 6. Share functionality supports multiple platforms
// 7. Cancellation may include refund info based on timing
// 8. QR validation is typically used by venue staff/admin

// ============================================================================
// SECURITY CONSIDERATIONS
// ============================================================================

// 1. Always validate ticketId before API calls
// 2. QR codes should be unique and cryptographically secure
// 3. Validate user ownership before showing ticket details
// 4. QR validation should check ticket status and prevent double-entry
// 5. Share operations should respect user privacy settings
// 6. Download operations should verify user permissions

export const TICKET_API_REFERENCE = 'See above examples for usage';
