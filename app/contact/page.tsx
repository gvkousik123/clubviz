'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Star } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { useContact } from '@/hooks/use-contact';
import { useToast } from '@/hooks/use-toast';
import { ContactService } from '@/lib/services/contact.service';

export default function ContactUsPage() {
    const router = useRouter();
    const { submitBusinessEnquiry, submitSupportRequest, loading } = useContact();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'support' | 'feedback'>('support');

    // User info state - READ ONLY
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Tickets state
    const [userTickets, setUserTickets] = useState<any[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);

    // Support Form State
    const [supportForm, setSupportForm] = useState({ message: '' });

    // Feedback Form State
    const [feedbackForm, setFeedbackForm] = useState({
        message: ''
    });



    // Business Inquiry Form State
    const [businessForm, setBusinessForm] = useState({
        instagramLink: '',
        message: ''
    });

    const [showBusinessForm, setShowBusinessForm] = useState(false);

    // Get user info on mount
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('clubviz-user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserInfo({
                    name: user.name || user.username || '',
                    email: user.email || '',
                    phone: user.phone || user.phoneNumber || ''
                });
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }, []);

    // Fetch user's support tickets
    useEffect(() => {
        const fetchTickets = async () => {
            setTicketsLoading(true);
            try {
                const response = await ContactService.getUserSupportTickets();
                const tickets = response?.data || [];
                setUserTickets(Array.isArray(tickets) ? tickets : []);
            } catch (error) {
                console.error('Error fetching support tickets:', error);
                setUserTickets([]);
            } finally {
                setTicketsLoading(false);
            }
        };
        fetchTickets();
    }, []);

    // Navigate to ticket detail page
    const handleViewTicketDetail = (ticketId: string) => {
        router.push(`/contact/${ticketId}`);
    };

    // Submit Business Inquiry
    const handleSubmitBusiness = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitBusinessEnquiry({
            name: userInfo.name,
            contactNumber: userInfo.phone,
            instagramLink: businessForm.instagramLink,
            message: businessForm.message
        });
        if (success) {
            setShowBusinessForm(false);
            setBusinessForm({ instagramLink: '', message: '' });
            toast({ title: '✓ Business Enquiry Submitted', description: 'Your enquiry has been received successfully!', variant: 'success' });
        }
    };

    // Submit Customer Support
    const handleSubmitSupport = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitSupportRequest({
            name: userInfo.name,
            email: userInfo.email,
            message: supportForm.message
        });
        if (success) {
            toast({ title: '✓ Support Request Submitted', description: 'Thank you! Our team will respond shortly.', variant: 'success' });
            setSupportForm({ message: '' });
        }
    };

    // Submit Feedback
    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitSupportRequest({
            name: userInfo.name,
            email: userInfo.email,
            message: feedbackForm.message
        });
        if (success) {
            toast({ title: '✓ Feedback Submitted', description: 'Thank you for your feedback!', variant: 'success' });
            setFeedbackForm({ message: '' });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden relative">
            <PageHeader title="CONTACT US" />

            {/* Tab Navigation */}
            <div className="px-6 py-6 pt-[20vh] flex gap-4 border-b border-[#0C898B]/30">
                <button
                    onClick={() => setActiveTab('support')}
                    className={`px-4 py-2 font-semibold transition-all ${activeTab === 'support' ? 'text-[#14FFEC] border-b-2 border-[#14FFEC]' : 'text-[#9D9C9C] hover:text-white'}`}
                >
                    Ticket
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-4 py-2 font-semibold transition-all ${activeTab === 'feedback' ? 'text-[#14FFEC] border-b-2 border-[#14FFEC]' : 'text-[#9D9C9C] hover:text-white'}`}
                >
                    Support
                </button>
            </div>

            {/* TAB 1: Support */}
            {activeTab === 'support' && (
                <div className="px-6 py-6 pb-20">
                    <div className="max-w-2xl mx-auto">
                        {/* Raised Tickets */}
                        <div>
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <h3 className="text-[#FFFEFF] text-lg font-semibold whitespace-nowrap">Your Support Tickets</h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                                </div>

                                {ticketsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-[#14FFEC] animate-spin" />
                                    </div>
                                ) : userTickets.length === 0 ? (
                                    <div className="bg-[#0D1F1F] border border-[#0C898B]/40 rounded-2xl p-8 text-center">
                                        <p className="text-[#9D9C9C] text-sm mb-4">No support tickets yet.</p>
                                        <button onClick={() => setSupportSubTab('new')} className="text-[#14FFEC] hover:underline font-semibold">
                                            Create a new ticket →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {userTickets.map((ticket: any) => (
                                            <button
                                                key={ticket.id}
                                                onClick={() => handleViewTicketDetail(ticket.id)}
                                                className="w-full bg-[#0D1F1F] border border-[#0C898B]/40 rounded-2xl p-4 hover:border-[#14FFEC]/60 transition-colors text-left"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-[#14FFEC] bg-[#14FFEC]/10 px-2 py-0.5 rounded-full">
                                                        {ticket.type || 'SUPPORT'}
                                                    </span>
                                                    <span className="text-xs text-[#9D9C9C] shrink-0">
                                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="text-white text-sm font-semibold mb-1">{ticket.name || ticket.username}</p>
                                                <p className="text-[#9D9C9C] text-xs leading-relaxed line-clamp-3">{ticket.message || ticket.feedback}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* New Ticket Form - Divider */}
                        <div className="my-8 border-t border-[#0C898B]/30"></div>

                        {/* New Ticket Form */}
                        <div>
                            <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6">
                                <h3 className="text-white text-2xl font-bold mb-2">Send us a Message</h3>
                                <p className="text-[#9D9C9C] text-sm mb-6">Our support team will respond to your inquiry as soon as possible.</p>

                                <form onSubmit={handleSubmitSupport} className="space-y-4">
                                    <div>
                                        <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Name *</label>
                                        <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">
                                            {userInfo.name || 'Not provided'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Email *</label>
                                        <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">
                                            {userInfo.email || 'Not provided'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Message *</label>
                                        <textarea
                                            required
                                            placeholder="Please describe your issue or inquiry..."
                                            className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-32 resize-none"
                                            value={supportForm.message}
                                            onChange={e => setSupportForm({ message: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-black font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            
            {/* TAB 2: Support (Feedback Form) */}
            {activeTab === 'feedback' && (
                <div className="px-6 py-6 pb-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Share Your Feedback</h3>
                            <p className="text-[#9D9C9C] text-sm mb-6">Help us improve by sharing your feedback.</p>

                            <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Name *</label>
                                    <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">
                                        {userInfo.name || 'Not provided'}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Email *</label>
                                    <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">
                                        {userInfo.email || 'Not provided'}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Feedback *</label>
                                    <textarea
                                        required
                                        placeholder="Tell us what you think..."
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-32 resize-none"
                                        value={feedbackForm.message}
                                        onChange={e => setFeedbackForm({ message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-black font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</> : 'Submit Feedback'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Business Inquiry Section */}
            <div className="px-6 py-8 border-t border-[#0C898B]/30">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-[#FFFEFF] text-lg font-semibold whitespace-nowrap">Partner with Us</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0D1F1F] to-[#031414] rounded-2xl border border-[#0C898B]/50 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#14FFEC]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <h4 className="text-white font-bold text-lg mb-2">Are you a Club Owner?</h4>
                        <p className="text-[#9D9C9C] text-sm mb-6">Join ClubViz network and manage your events, bookings and more.</p>
                        <button
                            onClick={() => setShowBusinessForm(!showBusinessForm)}
                            className="bg-[#14FFEC] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#14FFEC]/90 transition"
                        >
                            Submit Business Inquiry
                        </button>
                    </div>
                </div>
            </div>

            {/* Business Inquiry Modal */}
            {showBusinessForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowBusinessForm(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                        <h3 className="text-white text-xl font-bold mb-6">Business Enquiry</h3>
                        <form onSubmit={handleSubmitBusiness} className="space-y-4">
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Name</label>
                                <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">{userInfo.name || 'Not provided'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Contact Number</label>
                                <div className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white">{userInfo.phone || 'Not provided'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Instagram Link (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                    value={businessForm.instagramLink}
                                    onChange={e => setBusinessForm({ ...businessForm, instagramLink: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Message</label>
                                <textarea
                                    required
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-24 resize-none"
                                    value={businessForm.message}
                                    onChange={e => setBusinessForm({ ...businessForm, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-[#0C898B] hover:bg-[#0e9ea0] text-white font-bold py-3 rounded-xl mt-4 flex justify-center items-center">
                                {loading ? <Loader2 className="animate-spin" /> : 'Submit Enquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Detail Modal */}

        </div>
    );
}
