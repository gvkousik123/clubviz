import { useState, useCallback } from 'react';
import { PricingOfferService, Offer, CreateOfferRequest } from '@/lib/services/pricing-offer.service';
import { useToast } from './use-toast';

export function useOffers(clubId: string) {
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOffers = useCallback(async () => {
        if (!clubId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await PricingOfferService.getClubOffers(clubId);
            console.log('🎁 Offers response:', response);

            if (response && response.data) {
                console.log('✅ Setting offers:', response.data);
                setOffers(Array.isArray(response.data) ? response.data : []);
            } else {
                console.warn('⚠️ No data in response');
                setOffers([]);
                setError('No offers available');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred fetching offers';
            console.error('❌ Fetch offers error:', errorMessage);
            setError(errorMessage);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, [clubId]);

    const createOffer = async (data: CreateOfferRequest) => {
        setLoading(true);
        try {
            const response = await PricingOfferService.createOffer(clubId, data);
            if (response.success) {
                toast({
                    title: 'Offer Created',
                    description: 'The offer has been added successfully.',
                });
                fetchOffers(); // Refresh list
                return true;
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to create offer',
                    variant: 'destructive',
                });
                return false;
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateOffer = async (offerId: string, data: CreateOfferRequest) => {
        setLoading(true);
        try {
            const response = await PricingOfferService.updateOffer(clubId, offerId, data);
            if (response.success) {
                toast({
                    title: 'Offer Updated',
                    description: 'The offer has been updated successfully.',
                });
                fetchOffers();
                return true;
            } else {
                toast({
                    title: 'Error',
                    description: response.message,
                    variant: 'destructive',
                });
                return false;
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteOffer = async (offerId: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;

        setLoading(true);
        try {
            const response = await PricingOfferService.deleteOffer(clubId, offerId);
            if (response.success) {
                toast({
                    title: 'Offer Deleted',
                    description: 'The offer has been removed.',
                });
                setOffers(prev => prev.filter(o => o.id !== offerId));
                return true;
            } else {
                toast({
                    title: 'Error',
                    description: response.message,
                    variant: 'destructive',
                });
                return false;
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        offers,
        loading,
        error,
        fetchOffers,
        createOffer,
        updateOffer,
        deleteOffer
    };
}
