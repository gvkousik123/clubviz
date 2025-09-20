'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Headphones, Bug, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MobileLayout, PageHeader, GlassCard } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

type IssueType = 'booking' | 'payment' | 'technical' | 'feedback' | 'other';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issueType: 'booking' as IssueType,
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = [
    { id: 'booking', label: 'Booking Issue', icon: MessageCircle, color: 'text-blue-400' },
    { id: 'payment', label: 'Payment Problem', icon: Phone, color: 'text-red-400' },
    { id: 'technical', label: 'Technical Support', icon: Bug, color: 'text-yellow-400' },
    { id: 'feedback', label: 'Feedback', icon: Star, color: 'text-green-400' },
    { id: 'other', label: 'Other', icon: Headphones, color: 'text-purple-400' }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 98765 43210',
      subtitle: 'Mon-Sun, 9 AM - 11 PM',
      action: () => window.open('tel:+919876543210')
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@clubviz.com',
      subtitle: 'Response within 24 hours',
      action: () => window.open('mailto:support@clubviz.com')
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Available Now',
      subtitle: 'Instant support',
      action: () => alert('Live chat feature coming soon!')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isSubmitted) {
    return (
      <MobileLayout showNavigation={false}>
        <PageHeader title="Contact Support" showBack onBack={handleBack} />

        <div className="px-6 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-text-secondary mb-6">We've received your message and will get back to you soon.</p>

            <GlassCard className="mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Ticket ID</span>
                  <span className="text-white font-mono">#SUP2024040123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Issue Type</span>
                  <span className="text-white capitalize">{formData.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Priority</span>
                  <span className={cn(
                    "capitalize",
                    formData.priority === 'high' && "text-red-400",
                    formData.priority === 'medium' && "text-yellow-400",
                    formData.priority === 'low' && "text-green-400"
                  )}>
                    {formData.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Expected Response</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3 w-full">
              <Button
                onClick={() => setIsSubmitted(false)}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
              >
                Send Another Message
              </Button>
              <Button
                onClick={() => window.location.href = '/home'}
                variant="outline"
                className="w-full h-12 border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNavigation={false}>
      <PageHeader title="Contact Support" showBack onBack={handleBack} />

      <div className="px-6 pb-6">
        {/* Quick Contact Methods */}
        <div className="mb-6 space-y-3">
          {contactMethods.map((method, index) => (
            <GlassCard key={index}>
              <button
                onClick={method.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors rounded-lg"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <method.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">{method.title}</h3>
                  <p className="text-purple-400 text-sm">{method.value}</p>
                  <p className="text-text-tertiary text-xs">{method.subtitle}</p>
                </div>
              </button>
            </GlassCard>
          ))}
        </div>

        {/* Contact Form */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Send us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-text-secondary text-sm mb-2">Name *</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Phone</label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-dark-600 border-dark-500 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">Email *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
                required
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-text-secondary text-sm mb-3">Issue Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {issueTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, issueType: type.id as IssueType })}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-colors",
                      formData.issueType === type.id
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-dark-500 text-text-secondary hover:border-dark-400"
                    )}
                  >
                    <type.icon className={cn("w-5 h-5 mx-auto mb-1", type.color)} />
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-text-secondary text-sm mb-3">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={cn(
                      "p-2 rounded-lg border text-center transition-colors capitalize text-sm",
                      formData.priority === priority
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-dark-500 text-text-secondary hover:border-dark-400"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">Subject *</label>
              <Input
                type="text"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-text-secondary text-sm mb-2">Message *</label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-dark-600 border-dark-500 text-white min-h-[100px]"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </GlassCard>

        {/* FAQ Quick Links */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors">
              <p className="text-white font-medium">How do I cancel my booking?</p>
              <p className="text-text-secondary text-sm">Learn about our cancellation policy</p>
            </button>
            <button className="w-full text-left p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors">
              <p className="text-white font-medium">Payment was deducted but booking failed</p>
              <p className="text-text-secondary text-sm">Steps to resolve payment issues</p>
            </button>
            <button className="w-full text-left p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600 transition-colors">
              <p className="text-white font-medium">How to download my tickets?</p>
              <p className="text-text-secondary text-sm">Guide to accessing your tickets</p>
            </button>
          </div>
        </GlassCard>

        {/* Operating Hours */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-blue-400 font-medium text-sm">Support Hours</p>
              <p className="text-text-secondary text-xs">Monday - Sunday: 9:00 AM - 11:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}