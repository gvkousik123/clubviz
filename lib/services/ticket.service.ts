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
                `/ticket/club-tickets/${ticketId}`
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
                `/ticket/club-tickets/by-number/${ticketNumber}`
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
                `/ticket/club-tickets/${ticketId}/validate?validatedBy=${validatedBy}`,
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
                `/ticket/club-tickets/${ticketId}/cancel`,
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
                `/ticket/club-tickets/user/${userId}`
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
                `/ticket/club-tickets/clubs/${clubId}/time-slots?date=${date}`
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
            console.log('🔵 TicketService: Sending POST request to /ticket/club-tickets/no-event');
            console.log('🔵 Request data:', JSON.stringify(bookingData, null, 2));

            // Remove eventId if present for no-event tickets
            const { ...payload } = bookingData;

            const response = await api.post<ApiResponse<any>>(
                '/ticket/club-tickets/no-event',
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
            clubName: string;
            userId: string;
            userEmail: string;
            userName: string;
            userPhone: string;
            bookingDate: string; // YYYY-MM-DD
            arrivalTime: {
                hour: number;
                minute: number;
                second: number;
                nano: number;
            };
            guestCount: number;
            offerId?: string;
            occasion?: string;
            floorPreference?: string;
            orderId?: string; // Payment order ID for linking
            currency: string;
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        ticketNumber: string;
        status: string;
        totalAmount: number;
        currency: string;
    }>> {
        try {
            const response = await api.post<ApiResponse<any>>(
                '/ticket/club-tickets',
                bookingData
            );
            return handleApiResponse(response);
        } catch (error) {
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
            eventId: string; // REQUIRED for event tickets
            clubId: string;
            clubName: string;
            userId: string;
            userEmail: string;
            userName: string;
            userPhone: string;
            bookingDate: string; // YYYY-MM-DD
            arrivalTime: string; // HH:mm:ss (24-hour format)
            maleCount: number; // Required for event tickets
            femaleCount: number; // Required for event tickets
            coupleCount: number; // Required for event tickets
            ticketDescription?: string;
            offerId?: string | null;
            occasion?: string;
            floorPreference?: string;
            orderId?: string; // Payment order ID for linking
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
            console.log('🔵 Request data:', JSON.stringify(ticketData, null, 2));

            const response = await api.post<ApiResponse<any>>(
                '/ticket/club-tickets',
                ticketData
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
            eventId: string;
            clubId?: string;
            clubName?: string;
            userId?: string;
            userEmail: string;
            userName: string;
            userPhone: string;
            bookingDate?: string;
            arrivalTime?: string;
            guestCount?: number;
            maleCount: number;
            femaleCount: number;
            coupleCount: number;
            ticketDescription?: string;
            currency?: string;
            orderId: string; // REQUIRED - links to payment order
            offerId?: string | null;
            occasion?: string;
            floorPreference?: string;
        }
    ): Promise<ApiResponse<any>> {
        try {
            // Build complete ticket data with defaults for missing fields
            const completeTicketData = {
                eventId: ticketData.eventId,
                clubId: ticketData.clubId || 'UNKNOWN',
                clubName: ticketData.clubName || 'Club',
                userId: ticketData.userId || 'ANONYMOUS',
                userEmail: ticketData.userEmail,
                userName: ticketData.userName,
                userPhone: ticketData.userPhone,
                bookingDate: ticketData.bookingDate || new Date().toISOString().split('T')[0],
                arrivalTime: ticketData.arrivalTime || '18:00:00',
                guestCount: ticketData.guestCount !== undefined ? ticketData.guestCount : (ticketData.maleCount + ticketData.femaleCount + (ticketData.coupleCount * 2)),
                maleCount: ticketData.maleCount,
                femaleCount: ticketData.femaleCount,
                coupleCount: ticketData.coupleCount,
                ticketDescription: ticketData.ticketDescription || 'Event ticket booking',
                currency: ticketData.currency || 'INR',
                orderId: ticketData.orderId,
                offerId: ticketData.offerId || null,
                occasion: ticketData.occasion || 'Event',
                floorPreference: ticketData.floorPreference || 'Main Floor'
            };

            console.log('🔵 Creating event ticket with orderId (pre-payment):', ticketData.orderId);
            console.log('🔵 Complete ticket data being sent:', JSON.stringify(completeTicketData, null, 2));

            const response = await api.post<any>(
                '/ticket/club-tickets/event',
                completeTicketData
            );
            console.log('✅ Event ticket created (pending payment):', response.data);

            // API returns { status: "success", message: "...", timestamp: "..." }
            // Convert to standard ApiResponse format
            const result = response.data;
            return {
                success: result.status === 'success',
                data: result,
                message: result.message || 'Ticket created successfully'
            };
        } catch (error) {
            console.error('❌ Event ticket creation error:', error);
            throw new Error(handleApiError(error));
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
            userEmail: string;
            userName: string;
            userPhone: string;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            orderId: string; // REQUIRED - links to payment order
            offerId?: string | null;
            occasion?: string;
            floorPreference?: string;
        }
    ): Promise<ApiResponse<any>> {
        try {
            console.log('🔵 Creating club ticket with orderId (pre-payment):', ticketData.orderId);
            const response = await api.post<any>(
                '/ticket/club-tickets/no-event',
                ticketData
            );
            console.log('✅ Club ticket created (pending payment):', response.data);

            // API returns { status: "success", message: "...", timestamp: "..." }
            // Convert to standard ApiResponse format
            const result = response.data;
            return {
                success: result.status === 'success',
                data: result,
                message: result.message || 'Ticket created successfully'
            };
        } catch (error) {
            console.error('❌ Club ticket creation error:', error);
            throw new Error(handleApiError(error));
        }
    }
}

// Export singleton instance for convenience
export const ticketService = TicketService;
