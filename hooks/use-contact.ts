import { useState } from 'react';
import { ContactService, BusinessEnquiryRequest, RatingFeedbackRequest, CustomerSupportRequest } from '@/lib/services/contact.service';
import { useToast } from './use-toast';

export function useContact() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const submitBusinessEnquiry = async (data: BusinessEnquiryRequest) => {
        setLoading(true);
        try {
            const response = await ContactService.submitBusinessEnquiry(data);
            if (response.success) {
                toast({
                    title: 'Enquiry Submitted',
                    description: response.message || 'We will get back to you soon.',
                });
                return true;
            } else {
                toast({
                    title: 'Submission Failed',
                    description: response.message || 'Please try again later.',
                    variant: 'destructive',
                });
                return false;
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong.',
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitReview = async (data: RatingFeedbackRequest) => {
        setLoading(true);
        try {
            const response = await ContactService.submitRatingFeedback(data);
            if (response.success) {
                toast({
                    title: 'Thank You!',
                    description: 'Your feedback has been submitted.',
                });
                return true;
            } else {
                toast({
                    title: 'Submission Failed',
                    description: response.message,
                    variant: 'destructive',
                });
                return false;
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitSupportRequest = async (data: CustomerSupportRequest) => {
        setLoading(true);
        try {
            const response = await ContactService.submitCustomerSupport(data);
            if (response.success) {
                toast({
                    title: 'Request Sent',
                    description: 'Our support team will contact you shortly.',
                });
                return true;
            } else {
                toast({
                    title: 'Submission Failed',
                    description: response.message,
                    variant: 'destructive',
                });
                return false;
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        submitBusinessEnquiry,
        submitReview,
        submitSupportRequest
    };
}
