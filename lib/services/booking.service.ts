import { api, handleApiResponse, handleApiError } from '../api-client';
import {
  ApiResponse,
  BookingRequest,
  Booking,
  PaymentRequest,
  PaymentResponse,
  Table,
  TicketInfo,
  PaginationMeta,
} from '../api-types';

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(bookingData: BookingRequest): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's bookings
   */
  static async getUserBookings(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ bookings: Booking[]; pagination: PaginationMeta }>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (status) {
        params.append('status', status);
      }

      const response = await api.get<ApiResponse<{ bookings: Booking[]; pagination: PaginationMeta }>>(
        `/user/bookings?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(bookingId: string, updates: Partial<BookingRequest>): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.put<ApiResponse<Booking>>(`/bookings/${bookingId}`, updates);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<{ message: string; refundAmount?: number }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string; refundAmount?: number }>>(
        `/bookings/${bookingId}/cancel`,
        { reason }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Confirm booking
   */
  static async confirmBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.post<ApiResponse<Booking>>(`/bookings/${bookingId}/confirm`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get available tables for a club on a specific date/time
   */
  static async getAvailableTables(
    clubId: string,
    dateTime: string,
    guestCount: number
  ): Promise<ApiResponse<Table[]>> {
    try {
      const response = await api.get<ApiResponse<Table[]>>(
        `/clubs/${clubId}/tables/available?dateTime=${dateTime}&guestCount=${guestCount}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Reserve a table temporarily (for booking flow)
   */
  static async reserveTableTemporary(
    tableId: string,
    dateTime: string,
    duration: number = 30 // minutes
  ): Promise<ApiResponse<{ reservationId: string; expiresAt: string }>> {
    try {
      const response = await api.post<ApiResponse<{ reservationId: string; expiresAt: string }>>(
        `/tables/${tableId}/reserve-temp`,
        { dateTime, duration }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Release temporary table reservation
   */
  static async releaseTableReservation(reservationId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<ApiResponse<{ message: string }>>(
        `/reservations/${reservationId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get booking pricing
   */
  static async getBookingPricing(bookingData: Partial<BookingRequest>): Promise<ApiResponse<{
    basePrice: number;
    taxes: number;
    fees: number;
    discount: number;
    totalPrice: number;
    currency: string;
  }>> {
    try {
      const response = await api.post<ApiResponse<{
        basePrice: number;
        taxes: number;
        fees: number;
        discount: number;
        totalPrice: number;
        currency: string;
      }>>('/bookings/pricing', bookingData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Apply promo code
   */
  static async applyPromoCode(
    promoCode: string,
    bookingData: Partial<BookingRequest>
  ): Promise<ApiResponse<{
    isValid: boolean;
    discountAmount: number;
    discountPercentage: number;
    message: string;
  }>> {
    try {
      const response = await api.post<ApiResponse<{
        isValid: boolean;
        discountAmount: number;
        discountPercentage: number;
        message: string;
      }>>('/promos/validate', { promoCode, ...bookingData });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Process payment for booking
   */
  static async processPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.post<ApiResponse<PaymentResponse>>('/payments/process', paymentData);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(
    transactionId: string,
    bookingId: string
  ): Promise<ApiResponse<{ status: string; verified: boolean }>> {
    try {
      const response = await api.post<ApiResponse<{ status: string; verified: boolean }>>(
        '/payments/verify',
        { transactionId, bookingId }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods(): Promise<ApiResponse<{
    methods: Array<{
      id: string;
      name: string;
      type: string;
      isEnabled: boolean;
      fees?: number;
    }>;
  }>> {
    try {
      const response = await api.get<ApiResponse<{
        methods: Array<{
          id: string;
          name: string;
          type: string;
          isEnabled: boolean;
          fees?: number;
        }>;
      }>>('/payments/methods');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Generate ticket/QR code
   */
  static async generateTicket(bookingId: string): Promise<ApiResponse<TicketInfo>> {
    try {
      const response = await api.post<ApiResponse<TicketInfo>>(`/bookings/${bookingId}/ticket`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Download ticket
   */
  static async downloadTicket(bookingId: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await api.get<ApiResponse<{ downloadUrl: string }>>(
        `/bookings/${bookingId}/ticket/download`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Validate ticket/QR code
   */
  static async validateTicket(
    ticketNumber: string,
    qrCode: string
  ): Promise<ApiResponse<{ isValid: boolean; booking?: Booking }>> {
    try {
      const response = await api.post<ApiResponse<{ isValid: boolean; booking?: Booking }>>(
        '/tickets/validate',
        { ticketNumber, qrCode }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Use/redeem ticket
   */
  static async useTicket(ticketNumber: string, qrCode: string): Promise<ApiResponse<{ message: string; usedAt: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string; usedAt: string }>>(
        '/tickets/use',
        { ticketNumber, qrCode }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get upcoming bookings
   */
  static async getUpcomingBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const response = await api.get<ApiResponse<Booking[]>>('/user/bookings/upcoming');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get past bookings
   */
  static async getPastBookings(page: number = 1, limit: number = 10): Promise<ApiResponse<{ bookings: Booking[]; pagination: PaginationMeta }>> {
    try {
      const response = await api.get<ApiResponse<{ bookings: Booking[]; pagination: PaginationMeta }>>(
        `/user/bookings/past?page=${page}&limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get booking history
   */
  static async getBookingHistory(
    bookingId: string
  ): Promise<ApiResponse<Array<{
    action: string;
    timestamp: string;
    details: any;
    user?: string;
  }>>> {
    try {
      const response = await api.get<ApiResponse<Array<{
        action: string;
        timestamp: string;
        details: any;
        user?: string;
      }>>>(`/bookings/${bookingId}/history`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Reschedule booking
   */
  static async rescheduleBooking(
    bookingId: string,
    newDateTime: string
  ): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.put<ApiResponse<Booking>>(
        `/bookings/${bookingId}/reschedule`,
        { newDateTime }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get cancellation policy
   */
  static async getCancellationPolicy(
    clubId: string,
    bookingType: string
  ): Promise<ApiResponse<{
    policy: string;
    refundPercentage: number;
    deadline: string;
    fees: number;
  }>> {
    try {
      const response = await api.get<ApiResponse<{
        policy: string;
        refundPercentage: number;
        deadline: string;
        fees: number;
      }>>(`/clubs/${clubId}/cancellation-policy?type=${bookingType}`);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Request booking refund
   */
  static async requestRefund(
    bookingId: string,
    reason: string
  ): Promise<ApiResponse<{
    refundId: string;
    estimatedAmount: number;
    processingTime: string;
    message: string;
  }>> {
    try {
      const response = await api.post<ApiResponse<{
        refundId: string;
        estimatedAmount: number;
        processingTime: string;
        message: string;
      }>>(`/bookings/${bookingId}/refund`, { reason });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Share booking
   */
  static async shareBooking(
    bookingId: string,
    platform: string
  ): Promise<ApiResponse<{ shareUrl: string }>> {
    try {
      const response = await api.post<ApiResponse<{ shareUrl: string }>>(
        `/bookings/${bookingId}/share`,
        { platform }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Add guests to booking
   */
  static async addGuests(
    bookingId: string,
    guests: Array<{ name: string; phone?: string; email?: string }>
  ): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        `/bookings/${bookingId}/guests`,
        { guests }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove guests from booking
   */
  static async removeGuests(
    bookingId: string,
    guestIds: string[]
  ): Promise<ApiResponse<Booking>> {
    try {
      const response = await api.delete<ApiResponse<Booking>>(
        `/bookings/${bookingId}/guests`,
        { data: { guestIds } }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}