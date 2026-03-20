'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Loader2, Star } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { ContactService } from '@/lib/services/contact.service';
import { useToast } from '@/hooks/use-toast';

export default function TicketDetailPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.ticketId as string;
    const { toast } = useToast();

    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            setLoading(true);
            try {
                const response = await ContactService.getTicketDetail(ticketId);
                if (response.success && response.data) {
                    setTicket(response.data);
                } else {
                    toast({ title: 'Error', description: 'Ticket not found', variant: 'destructive' });
                    router.push('/contact');
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                toast({ title: 'Error', description: 'Failed to load ticket details', variant: 'destructive' });
                router.push('/contact');
            } finally {
                setLoading(false);
            }
        };

        if (ticketId) {
            fetchTicket();
        }
    }, [ticketId, router, toast]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#031414] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#14FFEC] animate-spin" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen w-full bg-[#031414]">
                <PageHeader title="TICKET NOT FOUND" />
                <div className="flex items-center justify-center h-96">
                    <button
                        onClick={() => router.push('/contact')}
                        className="text-[#14FFEC] hover:underline font-semibold"
                    >
                        ← Back to Contact
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden relative">
            <PageHeader title="TICKET DETAILS" />

            <div className="px-6 py-6 pb-20 pt-[15vh]">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/contact')}
                        className="flex items-center gap-2 text-[#14FFEC] hover:text-[#14FFEC]/80 mb-6 font-semibold transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Support
                    </button>

                    {/* Ticket Header */}
                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6 mb-6">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-white text-3xl font-bold mb-2">{ticket.name || ticket.username || 'Support Ticket'}</h1>
                                {ticket.id && (
                                    <div className="text-xs text-[#9D9C9C] font-mono">Ticket ID: {ticket.id}</div>
                                )}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#14FFEC] bg-[#14FFEC]/10 px-3 py-1 rounded-full">
                                {ticket.type || 'SUPPORT'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {ticket.status && (
                                <div>
                                    <label className="text-xs text-[#9D9C9C] mb-1 block font-semibold">Status</label>
                                    <p className="text-white text-sm capitalize">{ticket.status}</p>
                                </div>
                            )}
                            {ticket.createdAt && (
                                <div>
                                    <label className="text-xs text-[#9D9C9C] mb-1 block font-semibold">Submitted</label>
                                    <p className="text-white text-sm">
                                        {new Date(ticket.createdAt).toLocaleString('en-IN', { 
                                            day: '2-digit', 
                                            month: 'short', 
                                            year: 'numeric', 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                            )}
                            {ticket.email && (
                                <div className="col-span-2">
                                    <label className="text-xs text-[#9D9C9C] mb-1 block font-semibold">Email</label>
                                    <p className="text-white text-sm break-all">{ticket.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ticket Message/Feedback */}
                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6 mb-6">
                        <label className="text-sm text-[#9D9C9C] mb-3 block font-semibold">
                            {ticket.type === 'FEEDBACK' ? 'Feedback' : 'Message'}
                        </label>
                        <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                            {ticket.message || ticket.feedback || 'N/A'}
                        </p>
                    </div>

                    {/* Feedback Rating if applicable */}
                    {ticket.rating && (
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Rating</label>
                                    <div className="flex gap-2 mt-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star
                                                key={s}
                                                className="w-5 h-5"
                                                fill={ticket.rating >= s ? '#14FFEC' : 'none'}
                                                color={ticket.rating >= s ? '#14FFEC' : '#9D9C9C'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[#14FFEC]">{ticket.rating}</p>
                                    <p className="text-xs text-[#9D9C9C]">out of 5</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review */}
                    {ticket.review && (
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6 mb-6">
                            <label className="text-sm text-[#9D9C9C] mb-3 block font-semibold">Review</label>
                            <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                                {ticket.review}
                            </p>
                        </div>
                    )}

                    {/* Media Link */}
                    {ticket.photoOrVideo && ticket.photoOrVideo !== 'https' && (
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6 mb-6">
                            <label className="text-sm text-[#9D9C9C] mb-3 block font-semibold">Media Link</label>
                            <a
                                href={ticket.photoOrVideo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#14FFEC] hover:text-[#14FFEC]/80 text-sm break-all underline transition"
                            >
                                {ticket.photoOrVideo}
                            </a>
                        </div>
                    )}

                    {/* Support Response */}
                    {ticket.response && (
                        <div className="bg-[#14FFEC]/5 border border-[#14FFEC]/30 rounded-2xl p-6 mb-6">
                            <label className="text-sm text-[#14FFEC] mb-3 block font-semibold uppercase tracking-wide">Response from Support Team</label>
                            <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                                {ticket.response}
                            </p>
                        </div>
                    )}

                    {!ticket.response && (
                        <div className="bg-[#0D1F1F]/50 border border-[#0C898B]/30 rounded-2xl p-6 text-center mb-6">
                            <p className="text-[#9D9C9C] text-sm">
                                Our support team is working on your request. You'll receive a response soon.
                            </p>
                        </div>
                    )}

                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/contact')}
                        className="w-full bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-black font-bold py-3 rounded-xl hover:brightness-110 transition mt-6"
                    >
                        Back to Support
                    </button>
                </div>
            </div>
        </div>
    );
}
