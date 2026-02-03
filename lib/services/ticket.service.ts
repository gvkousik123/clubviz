import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

// ============================================================================
// TICKET TYPES
// ============================================================================

/**
 * Platform types for sharing tickets
 */
export type SharePlatform = 'email' | 'sms' | 'whatsapp' | 'facebook' | 'twitter';

/**
 * Share ticket request
 */
export interface ShareTicketRequest {
    platform: string;
    recipientEmail?: string;
    recipientPhone?: string;
    message?: string;
}

/**
 * Cancel ticket request
 */
export interface CancelTicketRequest {
    reason: string;
    additionalNotes?: string;
}

/**
 * Ticket confirmation email request
 */
export interface TicketConfirmationEmailRequest {
    to: string;
    ticketNumber: string;
    clubName: string;
    userName: string;
    bookingDate: string;
    arrivalTime: string;
    guestCount: number;
    totalAmount: number;
    qrCode: string;
    eventTitle: string;
}

/**
 * Validate QR code request
 */
export interface ValidateQRRequest {
    qrCode: string;
    validatedBy: string;
    location: string;
}

/**
 * Ticket details response
 */
export interface TicketDetails {
    ticketId: string;
    ticketNumber: string;
    qrCode: string;
    clubId: string;
    clubName: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    bookingDate: string;
    arrivalTime: string;
    guestCount?: number; // For no-event tickets
    maleCount?: number; // For event tickets
    femaleCount?: number; // For event tickets
    coupleCount?: number; // For event tickets
    eventId: string | null;
    eventTitle: string | null;
    hasEvent: boolean;
    entryFee: number;
    offerTitle: string | null;
    offerDescription: string | null;
    offerDiscount: number;
    totalAmount: number;
    currency: string | null;
    occasion?: string;
    floorPreference?: string;
    status: 'ACTIVE' | 'CANCELLED';
    isValidated: boolean;
    validatedAt: string | null;
    createdAt: string;
    cancellationReason: string | null;
    cancelledAt: string | null;
}

/**
 * QR validation response
 */
export interface QRValidationResponse {
    isValid: boolean;
    ticketId?: string;
    ticketNumber?: string;
    eventTitle?: string;
    ticketType?: string;
    holderName?: string;
    status?: string;
    message: string;
}

// ============================================================================
// TICKET SERVICE
// ============================================================================

/**
 * Ticket Service
 * Handles all ticket-related operations including sharing, cancellation,
 * QR validation, and ticket downloads
 * 
 * Base URL: https://clubwiz.in/ticket
 */
export class TicketService {
    // Base path for ticket endpoints
    private static readonly TICKET_BASE = '/ticket';

    /**
     * Share ticket via email, SMS, or other platforms
     * POST /ticket/tickets/{ticketId}/share
     * 
     * @param ticketId - The ticket ID to share
     * @param shareData - Share details (platform, recipient, message)
     * @returns Success response with share confirmation
     */
    static async shareTicket(
        ticketId: string,
        shareData: ShareTicketRequest
    ): Promise<ApiResponse<{ message: string; shareUrl?: string }>> {
        try {
            const response = await api.post<ApiResponse<{ message: string; shareUrl?: string }>>(
                `${this.TICKET_BASE}/tickets/${ticketId}/share`,
                shareData
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Cancel a ticket with a reason
     * POST /ticket/tickets/{ticketId}/cancel
     * 
     * @param ticketId - The ticket ID to cancel
     * @param cancelData - Cancellation reason and notes
     * @returns Success response with cancellation confirmation
     */
    static async cancelTicket(
        ticketId: string,
        cancelData: CancelTicketRequest
    ): Promise<ApiResponse<{ message: string; refundAmount?: number; refundStatus?: string }>> {
        try {
            const response = await api.post<ApiResponse<{ message: string; refundAmount?: number; refundStatus?: string }>>(
                `${this.TICKET_BASE}/tickets/${ticketId}/cancel`,
                cancelData
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Validate ticket QR code at venue entrance
     * POST /ticket/tickets/validate-qr
     * 
     * @param validationData - QR code, validator, and location details
     * @returns Validation result with ticket information
     */
    static async validateQRCode(
        validationData: ValidateQRRequest
    ): Promise<ApiResponse<QRValidationResponse>> {
        try {
            const response = await api.post<ApiResponse<QRValidationResponse>>(
                `${this.TICKET_BASE}/tickets/validate-qr`,
                validationData
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get ticket details by ticket ID
     * GET /club-tickets/{ticketId}
     * 
     * @param ticketId - The ticket ID to retrieve
     * @returns Complete ticket information
     */
    static async getTicketDetails(ticketId: string): Promise<ApiResponse<TicketDetails>> {
        try {
            const response = await api.get<ApiResponse<TicketDetails>>(
                `/club-tickets/${ticketId}`
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
    /**
     * Get ticket by ticket number
     * GET /club-tickets/by-number/{ticketNumber}
     * 
     * @param ticketNumber - The ticket number (e.g., BQ-290)
     * @returns Ticket information
     */
    static async getTicketByNumber(
        ticketNumber: string
    ): Promise<ApiResponse<{
        ticketId: string;
        ticketNumber: string;
        clubId: string;
        userId: string;
        bookingDate: string;
        arrivalTime: string;
        guestCount: number;
        status: 'BOOKED' | 'VALIDATED' | 'CANCELLED';
    }>> {
        try {
            const response = await api.get<ApiResponse<any>>(
                `/club-tickets/by-number/${ticketNumber}`
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Validate a ticket (staff use)
     * POST /club-tickets/{ticketId}/validate
     * 
     * @param ticketId - The ticket ID to validate
     * @param validatedBy - Staff member ID who validated the ticket
     * @returns Validation confirmation
     */
    static async validateTicket(
        ticketId: string,
        validatedBy: string
    ): Promise<ApiResponse<{
        ticketId: string;
        status: string;
        validatedAt: string;
        validatedBy: string;
    }>> {
        try {
            const response = await api.post<ApiResponse<any>>(
                `/club-tickets/${ticketId}/validate?validatedBy=${validatedBy}`,
                {}
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Cancel a club ticket
     * POST /club-tickets/{ticketId}/cancel
     * 
     * @param ticketId - The ticket ID to cancel
     * @param cancelData - Cancellation reason and notes
     * @returns Cancellation confirmation
     */
    static async cancelClubTicket(
        ticketId: string,
        cancelData: {
            reason: string;
            additionalNotes?: string;
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        status: string;
        cancelledAt: string;
    }>> {
        try {
            const response = await api.post<ApiResponse<any>>(
                `/club-tickets/${ticketId}/cancel`,
                cancelData
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get all tickets for a user
     * GET /club-tickets/user/{userId}
     * 
     * @param userId - The user ID
     * @returns List of user's tickets
     */
    static async getUserTickets(
        userId: string
    ): Promise<ApiResponse<Array<{
        ticketId: string;
        ticketNumber: string;
        clubName: string;
        bookingDate: string;
        status: 'BOOKED' | 'VALIDATED' | 'CANCELLED';
    }>>> {
        try {
            const response = await api.get<ApiResponse<any>>(
                `${this.TICKET_BASE}/club-tickets/user/${userId}`
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get available time slots for a club on a specific date
     * GET /club-tickets/clubs/{clubId}/time-slots
     * 
     * @param clubId - The club ID
     * @param date - The date in YYYY-MM-DD format
     * @returns Available time slots with offer information
     */
    static async getAvailableTimeSlots(
        clubId: string,
        date: string
    ): Promise<ApiResponse<{
        timeSlots: Array<{
            time: string;
            availableOffers: number;
            isAvailable: boolean;
        }>;
    }>> {
        try {
            const response = await api.get<ApiResponse<any>>(
                `${this.TICKET_BASE}/club-tickets/clubs/${clubId}/time-slots?date=${date}`
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
    /**
     * Download ticket as PDF file
     * GET /ticket/tickets/{ticketId}/download
     * 
     * @param ticketId - The ticket ID to download
     * @returns PDF blob or download URL
     */
    static async downloadTicketPDF(ticketId: string): Promise<Blob> {
        try {
            const response = await api.get(
                `${this.TICKET_BASE}/tickets/${ticketId}/download`,
                {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf, */*',
                    },
                }
            );

            // Return the blob directly for download
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Helper method to trigger PDF download in browser
     * 
     * @param ticketId - The ticket ID to download
     * @param filename - Optional filename for the download (default: ticket-{ticketId}.pdf)
     */
    static async downloadAndSaveTicketPDF(
        ticketId: string,
        filename?: string
    ): Promise<void> {
        try {
            const blob = await this.downloadTicketPDF(ticketId);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `ticket-${ticketId}.pdf`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Create a no-event club booking ticket
     * POST /club-tickets/no-event
     * 
     * Creates a booking ticket for regular club visits without any event
     * Entry fee is zero for no-event bookings
     * NOTE: Does NOT include eventId field, uses guestCount only
     * 
     * @param bookingData - Complete booking information
     * @returns Created ticket with ticket number and QR code
     */
    static async createNoEventClubTicket(
        bookingData: {
            clubId: string;
            clubName: string;
            userId: string;
            userEmail: string;
            userName: string;
            userPhone: string;
            bookingDate: string; // YYYY-MM-DD
            arrivalTime: string; // HH:mm:ss (24-hour format)
            guestCount: number; // REQUIRED - total number of guests
            offerId?: string | null;
            occasion?: string;
            floorPreference?: string;
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        ticketNumber: string;
        qrCode: string;
        clubId: string;
        clubName: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        bookingDate: string;
        arrivalTime: string;
        guestCount: number;
        eventTitle: string | null;
        hasEvent: boolean;
        entryFee: number;
        offerTitle: string | null;
        offerDescription: string | null;
        offerDiscount: number;
        totalAmount: number;
        currency: string | null;
        occasion: string;
        floorPreference: string;
        status: string;
        isValidated: boolean;
        validatedAt: string | null;
        createdAt: string;
        cancellationReason: string | null;
        cancelledAt: string | null;
    }>> {
        try {
            console.log('🔵 TicketService: Sending POST request to /club-tickets (no-event)');
            console.log('🔵 Request data:', JSON.stringify(bookingData, null, 2));

            // Remove eventId if present for no-event tickets
            const { ...payload } = bookingData;

            const response = await api.post<ApiResponse<any>>(
                `${this.TICKET_BASE}/club-tickets/event`,
                payload
            );

            console.log('🟢 TicketService: Success response:', response.data);
            return handleApiResponse(response);
        } catch (error: any) {
            console.error('🔴 TicketService: Error caught:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                fullError: error
            });
            throw error; // Throw original error to preserve response data
        }
    }

    /**
     * Create a club booking ticket
     * POST /club-tickets
     * 
     * Creates a booking ticket with:
     * - Booking details (club, date, time, guests)
     * - User information
     * - Payment orderId for linking
     * - Generates ticket number and QR code
     * 
     * @param bookingData - Complete booking information including orderId
     * @returns Created ticket with ticket number and total amount
     */
    static async createClubTicket(
        bookingData: {
            clubId: string;
            userId: string;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            currency: string;
            orderId: string;
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        ticketNumber: string;
        status: string;
        totalAmount: number;
        currency: string;
    }>> {
        try {
            console.log('🔵 TicketService: Creating CLUB ticket (no event)');

            // Build payload with ONLY the fields specified in API docs
            const payload = {
                clubId: bookingData.clubId,
                userId: bookingData.userId,
                bookingDate: bookingData.bookingDate,
                arrivalTime: bookingData.arrivalTime,
                guestCount: bookingData.guestCount,
                currency: bookingData.currency,
                orderId: bookingData.orderId
            };

            console.log('🔵 Club Ticket Payload:', JSON.stringify(payload, null, 2));

            const response = await api.post<ApiResponse<any>>(
                `${this.TICKET_BASE}/club-tickets`,
                payload
            );

            console.log('🟢 TicketService: Club ticket created successfully:', response.data);
            return handleApiResponse(response);
        } catch (error) {
            console.error('🔴 TicketService: Club ticket creation error:', error);
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Create an event ticket booking
     * POST /club-tickets/event
     * 
     * Creates a ticket for an event with:
     * - Event ID (REQUIRED)
     * - Club details
     * - Guest count breakdown (maleCount, femaleCount, coupleCount)
     * - User contact information
     * - Payment orderId for linking
     * - Offer details
     * 
     * @param ticketData - Complete event ticket booking information including orderId
     * @returns Created ticket with ticket number, QR code, and details
     */
    static async createEventTicket(
        ticketData: {
            userId: string;
            eventId: string;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            maleCount: number;
            femaleCount: number;
            coupleCount: number;
            currency: string;
            orderId: string;
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        ticketNumber: string;
        qrCode: string;
        clubId: string;
        clubName: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        bookingDate: string;
        arrivalTime: string;
        maleCount: number;
        femaleCount: number;
        coupleCount: number;
        eventId: string | null;
        eventTitle: string | null;
        hasEvent: boolean;
        entryFee: number;
        offerTitle: string | null;
        offerDescription: string | null;
        offerDiscount: number;
        totalAmount: number;
        currency: string | null;
        occasion: string;
        floorPreference: string;
        status: string;
        isValidated: boolean;
        validatedAt: string | null;
        createdAt: string;
        cancellationReason: string | null;
        cancelledAt: string | null;
    }>> {
        try {
            console.log('🔵 TicketService: Creating EVENT ticket with eventId:', ticketData.eventId);

            // Build payload with ONLY the fields specified in API docs
            const payload = {
                userId: ticketData.userId,
                eventId: ticketData.eventId,
                bookingDate: ticketData.bookingDate,
                arrivalTime: ticketData.arrivalTime,
                guestCount: ticketData.guestCount,
                maleCount: ticketData.maleCount,
                femaleCount: ticketData.femaleCount,
                coupleCount: ticketData.coupleCount,
                currency: ticketData.currency,
                orderId: ticketData.orderId
            };

            console.log('🔵 Event Ticket Payload:', JSON.stringify(payload, null, 2));
            console.log('🔵 Calling endpoint: /ticket/club-tickets/event');

            const response = await api.post<ApiResponse<any>>(
                `${this.TICKET_BASE}/club-tickets/event`,
                payload
            );

            console.log('🟢 TicketService: Event ticket created successfully:', response.data);
            return handleApiResponse(response);
        } catch (error: any) {
            console.error('🔴 TicketService: Event ticket creation error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
            });
            throw error;
        }
    }

    /**
     * Create event ticket for pre-payment flow
     * POST /club-tickets/event
     * 
     * This is called BEFORE payment, with orderId from payment order creation.
     * The ticket is created in pending state and will be activated after payment.
     * 
     * @param ticketData - Event ticket data with orderId (some fields optional with defaults)
     * @returns Created ticket response
     */
    static async createEventTicketWithOrder(
        ticketData: {
            userId: string;
            eventId: string;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            maleCount: number;
            femaleCount: number;
            coupleCount: number;
            currency: string;
            orderId: string;
        }
    ): Promise<ApiResponse<any>> {
        try {
            // Build payload with ONLY the required fields per API spec
            const payload = {
                userId: ticketData.userId,
                eventId: ticketData.eventId,
                bookingDate: ticketData.bookingDate,
                arrivalTime: ticketData.arrivalTime,
                guestCount: ticketData.guestCount,
                maleCount: ticketData.maleCount,
                femaleCount: ticketData.femaleCount,
                coupleCount: ticketData.coupleCount,
                currency: ticketData.currency,
                orderId: ticketData.orderId
            };

            console.log('🔵 Creating EVENT ticket with orderId:', ticketData.orderId);
            console.log('📤 Event Ticket Payload:', JSON.stringify(payload, null, 2));
            console.log('🔵 Calling endpoint: /ticket/club-tickets/event');

            const response = await api.post<any>(
                `${this.TICKET_BASE}/club-tickets/event`,
                payload
            );
            console.log('✅ Event ticket created successfully:', response.data);

            // API returns { status: "success", message: "...", timestamp: "..." }
            // Convert to standard ApiResponse format
            const result = response.data;
            return {
                success: result.status === 'success',
                data: result,
                message: result.message || 'Event ticket created successfully'
            };
        } catch (error: any) {
            console.error('❌ Event ticket creation error:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url,
                data: error.response?.data
            });
            throw error;
        }
    }

    /**
     * Create club ticket for pre-payment flow
     * POST /club-tickets/no-event
     * 
     * This is called BEFORE payment, with orderId from payment order creation.
     * The ticket is created in pending state and will be activated after payment.
     * 
     * @param ticketData - Club ticket data with orderId
     * @returns Created ticket response
     */
    static async createClubTicketWithOrder(
        ticketData: {
            clubId: string;
            userId: string;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            currency: string;
            orderId: string;
        }
    ): Promise<ApiResponse<any>> {
        try {
            console.log('🔵 Creating CLUB ticket (no event) with orderId:', ticketData.orderId);

            // Build payload with ONLY the required fields per API spec
            const payload = {
                clubId: ticketData.clubId,
                userId: ticketData.userId,
                bookingDate: ticketData.bookingDate,
                arrivalTime: ticketData.arrivalTime,
                guestCount: ticketData.guestCount,
                currency: ticketData.currency,
                orderId: ticketData.orderId
            };

            console.log('📤 Club Ticket Payload:', JSON.stringify(payload, null, 2));
            console.log('🔵 Calling endpoint: /ticket/club-tickets/no-event');

            const response = await api.post<any>(
                `${this.TICKET_BASE}/club-tickets/no-event`,
                payload
            );
            console.log('✅ Club ticket created successfully:', response.data);

            // API returns { status: "success", message: "...", timestamp: "..." }
            // Convert to standard ApiResponse format
            const result = response.data;
            return {
                success: result.status === 'success',
                data: result,
                message: result.message || 'Club ticket created successfully'
            };
        } catch (error) {
            console.error('❌ Club ticket creation error:', error);
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Send ticket confirmation email after successful ticket generation
     * POST /ticket/email/ticket-confirmation
     * 
     * @param emailData - Ticket details for email confirmation
     * @returns Success response confirming email sent
     */
    static async sendTicketConfirmationEmail(
        emailData: TicketConfirmationEmailRequest
    ): Promise<ApiResponse<{ message: string }>> {
        try {
            console.log('📧 Sending ticket confirmation email:', emailData.to);
            const response = await api.post<ApiResponse<{ message: string }>>(
                `${this.TICKET_BASE}/email/ticket-confirmation`,
                emailData
            );
            console.log('✅ Confirmation email sent successfully');
            return handleApiResponse(response);
        } catch (error) {
            console.error('❌ Error sending confirmation email:', error);
            // Don't throw error - email failure shouldn't break ticket generation
            return {
                success: false,
                data: null,
                message: handleApiError(error)
            };
        }
    }
}

// Export singleton instance for convenience
export const ticketService = TicketService;
