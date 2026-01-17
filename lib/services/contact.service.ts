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
    submitBusinessEnquiry: async (data: BusinessEnquiryRequest): Promise<ApiResponse<void>> => {
        try {
            const response = await api.post('/contact-form/contact/clubwiz_business', data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Submit user rating and feedback
    submitRatingFeedback: async (data: RatingFeedbackRequest): Promise<ApiResponse<RatingFeedbackResponse>> => {
        try {
            const response = await api.post('/contact-form/contact/rating-feedback', data);
            // The API returns a direct object for success instead of standard wrapper sometimes,
            // but assuming consistent wrapper based on other services unless proven otherwise.
            // If the response is the direct object: { status, message, timestamp }
            if (response.data && response.data.status) {
                return {
                    success: true,
                    message: response.data.message,
                    data: response.data
                };
            }
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Submit customer support message
    submitCustomerSupport: async (data: CustomerSupportRequest): Promise<ApiResponse<void>> => {
        try {
            const response = await api.post('/contact-form/contact/customer_support', data);
            return handleApiResponse(response);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
