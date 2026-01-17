'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, Instagram, MessageCircle, X, Loader2, Star } from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import { useContact } from '@/hooks/use-contact';
import { useToast } from '@/hooks/use-toast';

export default function ContactUsPage() {
    const { submitBusinessEnquiry, submitReview, submitSupportRequest, loading } = useContact();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'support' | 'feedback' | 'contact'>('contact');
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    // Customer Support Form State
    const [supportForm, setSupportForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Rating Feedback Form State
    const [feedbackForm, setFeedbackForm] = useState({
        rateName: '',
        rating: 5,
        feedback: '',
        feedbackVideoUrl: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        instagramLink: '',
        message: ''
    });

    // Get user email on mount
    useEffect(() => {
        // Get user email from localStorage
        try {
            const userStr = localStorage.getItem('clubviz-user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.email) {
                    setSupportForm(prev => ({ ...prev, email: user.email }));
                }
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }, []);

    const handleContactClick = (type: string, value: string) => {
        switch (type) {
            case 'phone':
                window.open(`tel:${value}`);
                break;
            case 'email':
                window.open(`mailto:${value}`);
                break;
            case 'instagram':
                window.open('https://instagram.com/Clubwiz_ngp', '_blank');
                break;
            case 'whatsapp':
                window.open('https://wa.me/message/XXXXXXXXXXXXX', '_blank');
                break;
            case 'twitter':
                window.open('https://twitter.com/Clubwiz_ngp', '_blank');
                break;
        }
    };

    const handleSubmitEnquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitBusinessEnquiry({
            name: formData.name,
            contactNumber: formData.contactNumber,
            instagramLink: formData.instagramLink,
            message: formData.message
        });

        if (success) {
            setShowEnquiryForm(false);
            setFormData({ name: '', contactNumber: '', instagramLink: '', message: '' });
            toast({
                title: '✓ Business Enquiry Submitted',
                description: 'Your enquiry has been received successfully!',
                variant: 'success',
            });
        }
    };

    // Submit Customer Support
    const handleSubmitSupport = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await submitSupportRequest(supportForm);
        console.log('Support request submission success:', success);
        if (success) {
            toast({
                title: '✓ Support Request Submitted',
                description: 'Thank you! Our team will respond shortly.',
                variant: 'success',
            });
            setSupportForm({ name: '', email: '', message: '' });
            // Re-populate email
            const userStr = localStorage.getItem('clubviz-user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.email) {
                    setSupportForm(prev => ({ ...prev, email: user.email }));
                }
            }
        }
        else {
            toast({
                title: 'Error',
                description: 'Failed to submit support request. Please try again.',
                variant: 'destructive',
            });
        }
    };

    // Submit Rating Feedback
    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const success = await submitReview({
                username: JSON.parse(localStorage.getItem('clubviz-user') || '{}').username || 'Anonymous',
                rating: feedbackForm.rating,
                review: feedbackForm.feedback,
                feedback: feedbackForm.rateName,
                photoOrVideo: feedbackForm.feedbackVideoUrl
            });

            if (success) {
                toast({
                    title: '✓ Feedback Submitted',
                    description: 'Thank you for your valuable feedback!',
                    variant: 'success',
                });
                setFeedbackForm({ rateName: '', rating: 5, feedback: '', feedbackVideoUrl: '' });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit feedback. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#031414] overflow-hidden relative">
            <PageHeader title="CONTACT US" />

            <div className="px-6 py-6 pt-[20vh] flex gap-4 border-b border-[#0C898B]/30">
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-4 py-2 font-semibold transition-all ${activeTab === 'contact'
                        ? 'text-[#14FFEC] border-b-2 border-[#14FFEC]'
                        : 'text-[#9D9C9C] hover:text-white'
                        }`}
                >
                    Support Channels
                </button>
                <button
                    onClick={() => setActiveTab('support')}
                    className={`px-4 py-2 font-semibold transition-all ${activeTab === 'support'
                        ? 'text-[#14FFEC] border-b-2 border-[#14FFEC]'
                        : 'text-[#9D9C9C] hover:text-white'
                        }`}
                >
                    Customer Support
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-4 py-2 font-semibold transition-all ${activeTab === 'feedback'
                        ? 'text-[#14FFEC] border-b-2 border-[#14FFEC]'
                        : 'text-[#9D9C9C] hover:text-white'
                        }`}
                >
                    Rate & Feedback
                </button>
            </div>

            {/* Customer Support Form Modal */}
            {showEnquiryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowEnquiryForm(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-white text-xl font-bold mb-6">Business Enquiry</h3>

                        <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Contact Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                    value={formData.contactNumber}
                                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Instagram Link (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                    value={formData.instagramLink}
                                    onChange={e => setFormData({ ...formData, instagramLink: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#9D9C9C] mb-1 block">Message</label>
                                <textarea
                                    required
                                    className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-24 resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0C898B] hover:bg-[#0e9ea0] text-white font-bold py-3 rounded-xl mt-4 flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Submit Enquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 1: Support Channels */}
            {activeTab === 'contact' && (
                <>
                    {/* Description Text */}
                    <div className="px-6 py-6">
                        <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">
                            You can get in touch with us through below platform. Our team will reach out to you as soon as it would be possible.
                        </div>
                    </div>

                    {/* Customer Support Section */}
                    <div className="px-6 py-4">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px] whitespace-nowrap">Customer Support</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        {/* Contact Items */}
                        <div className="space-y-4">
                            {/* Phone */}
                            <button
                                onClick={() => handleContactClick('phone', '+919XXXXXXXXX')}
                                className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                            >
                                <div className="w-[30px] h-[30px] relative overflow-hidden">
                                    <Phone size={24} className="absolute left-[3.75px] top-[2.81px] text-[#14FFEC]" />
                                </div>
                                <div className="flex-col justify-center items-start gap-1 inline-flex">
                                    <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Contact Number</div>
                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">+919XXXXXXXXX</div>
                                </div>
                            </button>

                            {/* Email */}
                            <button
                                onClick={() => handleContactClick('email', 'help@Clubwiz.com')}
                                className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                            >
                                <div className="w-[30px] h-[30px] relative overflow-hidden">
                                    <Mail size={24} className="absolute left-[2.81px] top-[5.62px] text-[#14FFEC]" />
                                </div>
                                <div className="flex-col justify-center items-start gap-1 inline-flex">
                                    <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Email Address</div>
                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">help@Clubwiz.com</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* My Preferences Section */}
                    <div className="px-6 py-4">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px] whitespace-nowrap">My Preferences</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        {/* Social Media Items */}
                        <div className="space-y-4">

                            {/* Instagram */}
                            <button
                                onClick={() => handleContactClick('instagram', '@Clubwiz_ngp')}
                                className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                            >
                                <div className="w-[30px] h-[30px] relative overflow-hidden">
                                    <Instagram size={24} className="absolute left-[2.81px] top-[2.81px] text-[#14FFEC]" />
                                </div>
                                <div className="flex-col justify-center items-start gap-1 inline-flex">
                                    <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Instagram</div>
                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                                </div>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={() => handleContactClick('whatsapp', '@Clubwiz_ngp')}
                                className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                            >
                                <div className="w-[30px] h-[30px] relative overflow-hidden">
                                    <MessageCircle size={24} className="absolute left-[2.81px] top-[2.82px] text-[#14FFEC]" />
                                </div>
                                <div className="flex-col justify-center items-start gap-1 inline-flex">
                                    <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">Whatsapp</div>
                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                                </div>
                            </button>

                            {/* X.com */}
                            <button
                                onClick={() => handleContactClick('twitter', '@Clubwiz_ngp')}
                                className="w-full h-[67px] px-5 py-[10px] bg-[#0D1F1F] rounded-[30px] border border-[#0C898B] justify-start items-center gap-5 flex hover:bg-[#1a3030] transition-colors"
                            >
                                <div className="w-[30px] h-[30px] relative overflow-hidden flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#14FFEC]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </div>
                                <div className="flex-col justify-center items-start gap-1 inline-flex">
                                    <div className="text-[#9D9C9C] text-[13px] font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">X.com</div>
                                    <div className="text-white text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px]">@Clubwiz_ngp</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    {/* Business Enquiry Section */}
                    <div className="px-6 py-4 pb-20">
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-[#FFFEFF] text-base font-['Manrope'] font-semibold leading-4 tracking-[0.50px] whitespace-nowrap">Partner with Us</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#14FFEC] to-transparent"></div>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-[#0D1F1F] to-[#031414] rounded-[20px] border border-[#0C898B]/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#14FFEC]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

                            <h4 className="text-white font-bold text-lg mb-2">Are you a Club Owner?</h4>
                            <p className="text-[#9D9C9C] text-sm mb-4">Join ClubViz network and manage your events, bookings and more.</p>

                            <button
                                onClick={() => setShowEnquiryForm(true)}
                                className="w-full py-3 bg-[#14FFEC]/10 border border-[#14FFEC] text-[#14FFEC] rounded-xl font-bold hover:bg-[#14FFEC] hover:text-black transition-all"
                            >
                                Register Your Business
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* TAB 2: Customer Support Form */}
            {activeTab === 'support' && (
                <div className="px-6 py-6 pb-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Send us a Message</h3>
                            <p className="text-[#9D9C9C] text-sm mb-6">Our support team will respond to your inquiry as soon as possible.</p>

                            <form onSubmit={handleSubmitSupport} className="space-y-4">
                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your name"
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                        value={supportForm.name}
                                        onChange={e => setSupportForm({ ...supportForm, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                        value={supportForm.email}
                                        onChange={e => setSupportForm({ ...supportForm, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Message *</label>
                                    <textarea
                                        required
                                        placeholder="Please describe your issue or inquiry..."
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-32 resize-none"
                                        value={supportForm.message}
                                        onChange={e => setSupportForm({ ...supportForm, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-black font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Rating & Feedback Form */}
            {activeTab === 'feedback' && (
                <div className="px-6 py-6 pb-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#0D1F1F] border border-[#0C898B] rounded-2xl p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Share Your Feedback</h3>
                            <p className="text-[#9D9C9C] text-sm mb-6">Help us improve by sharing your experience and rating.</p>

                            <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">What are you rating? *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Club experience, Event quality, App features"
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                        value={feedbackForm.rateName}
                                        onChange={e => setFeedbackForm({ ...feedbackForm, rateName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Rating *</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                className={`p-2 rounded transition ${feedbackForm.rating >= star
                                                    ? 'bg-[#14FFEC]/20 text-[#14FFEC]'
                                                    : 'bg-[#0D1F1F] text-[#9D9C9C] border border-[#0C898B]'
                                                    }`}
                                            >
                                                <Star className="w-6 h-6" fill={feedbackForm.rating >= star ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-[#9D9C9C] mt-1">{feedbackForm.rating} out of 5 stars</p>
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Feedback *</label>
                                    <textarea
                                        required
                                        placeholder="Tell us what you think... What did you like? What could be improved?"
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC] h-32 resize-none"
                                        value={feedbackForm.feedback}
                                        onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#9D9C9C] mb-2 block font-semibold">Video Link (Optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/video"
                                        className="w-full bg-[#031414] border border-[#0C898B] rounded-lg p-3 text-white placeholder-[#9D9C9C]/50 focus:outline-none focus:ring-1 focus:ring-[#14FFEC]"
                                        value={feedbackForm.feedbackVideoUrl}
                                        onChange={e => setFeedbackForm({ ...feedbackForm, feedbackVideoUrl: e.target.value })}
                                    />
                                    <p className="text-xs text-[#9D9C9C] mt-1">Share a video link if you want to show us more</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#005D5C] to-[#14FFEC] text-black font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}