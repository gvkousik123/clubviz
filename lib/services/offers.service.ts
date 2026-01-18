import { apiClient } from '../api-client';

export interface ClubOffer {
    id?: string;
    clubId?: string;
    title: string;
    description: string;
    offerType: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT' | 'BUY_ONE_GET_ONE' | 'FREE_ENTRY' | 'OTHER';
    discountPercentage?: number;
    discountAmount?: number;
    promoCode?: string;
    minimumBill?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface CreateOfferRequest {
    title: string;
    description: string;
    offerType: string;
    discountPercentage?: number;
    discountAmount?: number;
    promoCode?: string;
    minimumBill?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface UpdateOfferRequest extends CreateOfferRequest { }

export class OffersService {
    private static readonly BASE_URL = '/pricing-offers';

    /**
     * Get all offers for a specific club (Public - available to all users)
     */
    static async getClubOffers(clubId: string): Promise<{ success: boolean; data: ClubOffer[] }> {
        try {
            const response = await apiClient.get(`${this.BASE_URL}/clubs/${clubId}/offers`);
            return {
                success: true,
                data: response.data || []
            };
        } catch (error: any) {
            console.error('Error fetching club offers:', error);
            throw error;
        }
    }

    /**
     * Create a new offer for a club (Admin/SuperAdmin only)
     */
    static async createOffer(clubId: string, offerData: CreateOfferRequest): Promise<{ success: boolean; data: ClubOffer }> {
        try {
            const response = await apiClient.post(`${this.BASE_URL}/clubs/${clubId}/offers`, offerData);
            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    /**
     * Update an existing offer (Admin/SuperAdmin only)
     */
    static async updateOffer(clubId: string, offerId: string, offerData: UpdateOfferRequest): Promise<{ success: boolean; data: ClubOffer }> {
        try {
            const response = await apiClient.put(`${this.BASE_URL}/clubs/${clubId}/offers/${offerId}`, offerData);
            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.error('Error updating offer:', error);
            throw error;
        }
    }

    /**
     * Delete an offer (Admin/SuperAdmin only)
     */
    static async deleteOffer(clubId: string, offerId: string): Promise<{ success: boolean }> {
        try {
            await apiClient.delete(`${this.BASE_URL}/clubs/${clubId}/offers/${offerId}`);
            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error deleting offer:', error);
            throw error;
        }
    }
}
