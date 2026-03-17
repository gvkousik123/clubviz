import { api, handleApiResponse, handleApiError } from '../api-client';
import { ApiResponse } from '../api-types';

export interface BusinessEnquiryRequest {
    name: string;
    contactNumber: string;
    instagramLink?: string;
    whatsAppLink?: string;
    message: string;
}

export interface RatingFeedbackRequest {
    username: string;
    rating: number;
    review: string;
    feedback?: string;
    photoOrVideo?: string;
    clubId?: string; // optional club identifier for contextual reviews
}

export interface CustomerSupportRequest {
    name: string;
    email: string;
    message: string;
}

export interface RatingFeedbackResponse {
    status: string;
    message: string;
    timestamp: string;
}

export const ContactService = {
    // Submit business enquiry to ClubWiz
    submitBusinessEnquiry: async (data: BusinessEnquiryRequest): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post('/contact-form/contact/clubwiz_business', data);
            const result = response.data;
            // If response status is 200-299, consider it success even if body is empty
            if (result.status === 'success' || result.success || response.status < 300) {
                return {
                    success: true,
                    message: result.message || 'Success',
                    data: result
                };
            }
            return handleApiResponse(response);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || handleApiError(error);
            throw new Error(errorMessage);
        }
    },

    // Submit user rating and feedback
    submitRatingFeedback: async (data: RatingFeedbackRequest): Promise<ApiResponse<RatingFeedbackResponse>> => {
        try {
            const response = await api.post('/contact-form/contact/rating_feedback', data);
            const result = response.data;
            // If response status is 200-299, consider it success even if body is empty
            if (result.status === 'success' || result.success || response.status < 300) {
                return {
                    success: true,
                    message: result.message || 'Success',
                    data: result
                };
            }
            return handleApiResponse(response);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || handleApiError(error);
            throw new Error(errorMessage);
        }
    },

    // Submit customer support message
    submitCustomerSupport: async (data: CustomerSupportRequest): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post('/contact-form/contact/customer_support', data);
            const result = response.data;
            // If response status is 200-299, consider it success even if body is empty
            if (result.status === 'success' || result.success || response.status < 300) {
                return {
                    success: true,
                    message: result.message || 'Success',
                    data: result
                };
            }
            return handleApiResponse(response);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || handleApiError(error);
            throw new Error(errorMessage);
        }
    },

    // Get all support tickets submitted by the current user
    // GET /contact-form/contact/tickets/user
    getUserSupportTickets: async (): Promise<ApiResponse<any[]>> => {
        try {
            const response = await api.get('/contact-form/contact/tickets/user');
            const result = response.data;
            if (Array.isArray(result)) {
                return { success: true, data: result };
            }
            return handleApiResponse(response);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || handleApiError(error);
            throw new Error(errorMessage);
        }
    }
};
