'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Send,
  Clock,
  Bug,
  CreditCard,
  Settings,
  HelpCircle
} from 'lucide-react';

// Mock components for demonstration
const MobileLayout = ({ children, showNavigation }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    {children}
  </div>
);

const PageHeader = ({ title, showBack, onBack }) => (
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-6">
    <div className="flex items-center">
      {showBack && (
        <button onClick={onBack} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </div>
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = ""
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90",
    outline: "border border-purple-500 text-purple-400 hover:bg-purple-500/10"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 rounded-lg border bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 rounded-lg border bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${className}`}
    {...props}
  />
);

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    issueType: 'general',
    priority: 'medium',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Support',
      value: '+91 9XXXXXXXXX',
      subtitle: 'Available 24/7',
      action: () => window.open('tel:+919999999999')
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'help@clubwiz.com',
      subtitle: 'Response within 24 hours',
      action: () => window.open('mailto:help@clubwiz.com')
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Chat with us',
      subtitle: 'Average wait time: 2 mins',
      action: () => window.open('https://wa.me/919999999999')
    }
  ];

  const issueTypes = [
    { id: 'booking', label: 'Booking Issue', icon: Settings, color: 'text-blue-400' },
    { id: 'payment', label: 'Payment Issue', icon: CreditCard, color: 'text-green-400' },
    { id: 'technical', label: 'Technical Issue', icon: Bug, color: 'text-red-400' },
    { id: 'general', label: 'General Query', icon: HelpCircle, color: 'text-yellow-400' }
  ];

  const socialMedia = [
    {
      platform: 'Instagram',
      handle: '@Clubwiz_ngp',
      color: 'text-pink-400',
      action: () => window.open('https://instagram.com/clubwiz_ngp')
    },
    {
      platform: 'WhatsApp',
      handle: '@Clubwiz_ngp',
      color: 'text-green-400',
      action: () => window.open('https://wa.me/919999999999')
    },
    {
      platform: 'X.com',
      handle: '@Clubwiz_ngp',
      color: 'text-blue-400',
      action: () => window.open('https://x.com/clubwiz_ngp')
    }
  ];

  const handleSubmit = (e) => {
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
            <p className="text-gray-400 mb-6">We've received your message and will get back to you soon.</p>

            <GlassCard className="mb-6 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket ID</span>
                  <span className="text-white font-mono">#SUP2024040123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Issue Type</span>
                  <span className="text-white capitalize">{formData.issueType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
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
                  <span className="text-gray-400">Expected Response</span>
                  <span className="text-white">Within 24 hours</span>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-3 w-full">
              <Button
                onClick={() => setIsSubmitted(false)}
                className="w-full h-12 text-lg font-semibold"
              >
                Send Another Message
              </Button>
              <Button
                onClick={() => window.location.href = '/home'}
                variant="outline"
                className="w-full h-12"
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
                  <p className="text-gray-500 text-xs">{method.subtitle}</p>
                </div>
              </button>
            </GlassCard>
          ))}
        </div>

        {/* Contact Form */}
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Send us a Message</h3>

          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name *</label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone</label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-gray-400 text-sm mb-3">Issue Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {issueTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, issueType: type.id })}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-colors",
                      formData.issueType === type.id
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
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
              <label className="block text-gray-400 text-sm mb-3">Priority</label>
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
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Subject *</label>
              <Input
                type="text"
                placeholder="Brief description of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Message *</label>
              <Textarea
                placeholder="Please describe your issue in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-lg font-semibold"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </div>
        </GlassCard>

        {/* FAQ Quick Links */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <p className="text-white font-medium">How do I cancel my booking?</p>
              <p className="text-gray-400 text-sm">Learn about our cancellation policy</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <p className="text-white font-medium">Payment was deducted but booking failed</p>
              <p className="text-gray-400 text-sm">Steps to resolve payment issues</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <p className="text-white font-medium">How to download my tickets?</p>
              <p className="text-gray-400 text-sm">Guide to accessing your tickets</p>
            </button>
          </div>
        </GlassCard>

        {/* Operating Hours */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-blue-400 font-medium text-sm">Support Hours</p>
              <p className="text-gray-400 text-xs">Monday - Sunday: 9:00 AM - 11:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <GlassCard className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Connect with Us</h3>
          <div className="space-y-3">
            {socialMedia.map((social, index) => (
              <button
                key={index}
                onClick={social.action}
                className="w-full flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className={`text-lg ${social.color}`}>
                    {social.platform === 'Instagram' ? '📷' :
                      social.platform === 'WhatsApp' ? '💬' : 'X'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-400 text-sm">{social.platform}</p>
                  <p className="text-white font-medium">{social.handle}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </MobileLayout>
  );
}