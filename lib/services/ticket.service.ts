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
    bookingId: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    ticketType: string;
    ticketNumber: string;
    qrCode: string;
    status: 'ACTIVE' | 'USED' | 'CANCELLED' | 'EXPIRED';
    purchaseDate: string;
    price: number;
    venue: {
        name: string;
        address: string;
    };
    userDetails: {
        name: string;
        email: string;
        phone: string;
    };
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
     * GET /ticket/tickets/{ticketId}
     * 
     * @param ticketId - The ticket ID to retrieve
     * @returns Complete ticket information
     */
    static async getTicketDetails(ticketId: string): Promise<ApiResponse<TicketDetails>> {
        try {
            const response = await api.get<ApiResponse<TicketDetails>>(
                `${this.TICKET_BASE}/tickets/${ticketId}`
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
     * Create a club booking ticket
     * POST /club-tickets
     * 
     * Creates a booking ticket with:
     * - Booking details (club, event, date, time, guests)
     * - Pricing information (entry fee, offers, total)
     * - Customer details
     * - Payment information
     * - Generates QR code
     * - Sends email/SMS confirmation
     * 
     * @param bookingData - Complete booking information
     * @returns Created ticket with QR code and details
     */
    static async createClubTicket(
        bookingData: {
            clubId: string;
            eventId?: string | null;
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            tableId?: string;
            tableNumber?: string;
            floorNumber?: string;
            notes?: string;
            selectedOffer?: {
                offerId: string;
                title: string;
                discount: number;
                type: 'PERCENTAGE' | 'FIXED';
            };
            pricing: {
                entryFee: number;
                offerDiscount: number;
                totalAmount: number;
            };
            customerDetails: {
                username: string;
                email: string;
                mobile: string;
                name?: string;
            };
            paymentDetails: {
                orderId: string;
                paymentSessionId: string;
                cfOrderId: string;
                paymentStatus: string;
            };
        }
    ): Promise<ApiResponse<{
        ticketId: string;
        bookingId: string;
        reservationId: string;
        qrCode: string;
        qrCodeUrl: string;
        clubDetails: {
            clubId: string;
            clubName: string;
            address: string;
            contactPhone: string;
        };
        eventDetails?: {
            eventId: string;
            eventTitle: string;
            entryFee: number;
        };
        bookingDetails: {
            bookingDate: string;
            arrivalTime: string;
            guestCount: number;
            tableNumber?: string;
            floorNumber?: string;
            notes?: string;
        };
        pricing: {
            entryFee: number;
            offerDiscount: number;
            totalAmount: number;
        };
        customerDetails: {
            name: string;
            email: string;
            mobile: string;
        };
    }>> {
        try {
            const response = await api.post<ApiResponse<any>>(
                '/club-tickets',
                bookingData
            );
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

// Export singleton instance for convenience
export const ticketService = TicketService;
