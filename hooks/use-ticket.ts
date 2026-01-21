import { useState, useEffect } from 'react';
import { TicketService, TicketDetails, ShareTicketRequest, CancelTicketRequest } from '@/lib/services/ticket.service';
import { useToast } from './use-toast';

/**
 * Custom hook for ticket management operations
 * Handles fetching ticket details, sharing, canceling, and downloading
 */
export function useTicket(ticketId: string | null) {
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch ticket details
    const fetchTicketDetails = async () => {
        if (!ticketId) {
            setError('No ticket ID provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await TicketService.getTicketDetails(ticketId);
            if (response.success && response.data) {
                setTicket(response.data);
            } else {
                setError(response.message || 'Failed to fetch ticket details');
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to fetch ticket details',
                    variant: 'destructive',
                });
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch ticket details';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Share ticket
    const shareTicket = async (shareData: ShareTicketRequest) => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'No ticket ID provided',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await TicketService.shareTicket(ticketId, shareData);
            if (response.success) {
                toast({
                    title: 'Success',
                    description: response.message || 'Ticket shared successfully',
                    variant: 'default',
                });
                return response.data;
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to share ticket',
                    variant: 'destructive',
                });
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to share ticket',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Cancel ticket
    const cancelTicket = async (cancelData: CancelTicketRequest) => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'No ticket ID provided',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await TicketService.cancelTicket(ticketId, cancelData);
            if (response.success) {
                toast({
                    title: 'Success',
                    description: response.message || 'Ticket cancelled successfully',
                    variant: 'default',
                });
                // Refresh ticket details to show updated status
                await fetchTicketDetails();
                return response.data;
            } else {
                toast({
                    title: 'Error',
                    description: response.message || 'Failed to cancel ticket',
                    variant: 'destructive',
                });
            }
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to cancel ticket',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Download ticket PDF
    const downloadTicket = async () => {
        if (!ticketId) {
            toast({
                title: 'Error',
                description: 'No ticket ID provided',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            await TicketService.downloadAndSaveTicketPDF(ticketId);
            toast({
                title: 'Success',
                description: 'Ticket downloaded successfully',
                variant: 'default',
            });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Failed to download ticket',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch ticket details on mount
    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    return {
        ticket,
        loading,
        error,
        fetchTicketDetails,
        shareTicket,
        cancelTicket,
        downloadTicket,
    };
}
