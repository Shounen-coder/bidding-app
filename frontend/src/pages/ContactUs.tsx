// ContactUs.tsx
import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  phoneNumber?: string;
  priority: 'low' | 'medium' | 'high';
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    phoneNumber: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to send contact form
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        phoneNumber: '',
        priority: 'medium'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      name: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: ChatBubbleLeftRightIcon,
      action: 'Start Chat',
      availability: '24/7',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      name: 'Email Support',
      description: 'Send us a detailed message',
      icon: EnvelopeIcon,
      action: 'Send Email',
      availability: 'Response within 24 hours',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      name: 'Phone Support',
      description: 'Speak directly with our team',
      icon: PhoneIcon,
      action: 'Call Now',
      availability: 'Mon-Fri, 9AM-6PM EST',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const categories = [
    'General Inquiry',
    'Account Issues',
    'Bidding Problems',
    'Payment Issues',
    'Technical Support',
    'Seller Support',
    'Dispute Resolution',
    'Partnership',
    'Media Inquiry',
    'Other'
  ];

  const offices = [
    {
      city: 'New York',
      address: '123 Auction Plaza, Floor 15',
      state: 'NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'ny@biddex.com'
    },
    {
      city: 'San Francisco',
      address: '456 Tech Street, Suite 200',
      state: 'CA 94105',
      phone: '+1 (555) 987-6543',
      email: 'sf@biddex.com'
    },
    {
      city: 'London',
      address: '789 Auction House, Canary Wharf',
      state: 'E14 5AB, UK',
      phone: '+44 20 1234 5678',
      email: 'london@biddex.com'
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first auction?',
      answer: 'Visit your seller dashboard and click "Create Auction". Fill in the required details, upload images, and set your starting price.'
    },
    {
      question: 'What fees does BIDDEX charge?',
      answer: 'We charge a 5% final value fee on successful auctions. Listing your auction is free, and you only pay when you sell.'
    },
    {
      question: 'How do I resolve a dispute?',
      answer: 'Contact our dispute resolution team through this form or call our support line. We typically resolve disputes within 3-5 business days.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption and are PCI DSS compliant to ensure your payment information is always secure.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#294c5b] to-[#1e3a48] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're here to help you succeed on BIDDEX. Whether you're buying, selling, or need support, 
              our dedicated team is ready to assist you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>24/7 Support Available</span>
              </div>
              <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                <span>Enterprise-Grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${method.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#294c5b] to-[#1e3a48] text-white mb-4">
                <method.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{method.availability}</span>
                <button className="px-4 py-2 bg-[#294c5b] text-white rounded-lg hover:bg-[#1e3a48] transition-colors font-medium">
                  {method.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours. For urgent matters, 
                please use our live chat or call us directly.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Message sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent transition-colors resize-none"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="h-4 w-4 text-[#294c5b] focus:ring-[#294c5b] border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                  I'd like to receive updates about new features and promotions
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#294c5b] to-[#1e3a48] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#1e3a48] hover:to-[#294c5b] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information & FAQs */}
          <div className="space-y-8">
            {/* Office Locations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPinIcon className="h-6 w-6 mr-3 text-[#294c5b]" />
                Our Offices
              </h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-l-4 border-[#294c5b] pl-6">
                    <h4 className="font-semibold text-gray-900 text-lg">{office.city}</h4>
                    <p className="text-gray-600 mt-1">{office.address}</p>
                    <p className="text-gray-600">{office.state}</p>
                    <div className="mt-3 flex flex-col sm:flex-row sm:gap-6 gap-2">
                      <a href={`tel:${office.phone}`} className="text-[#294c5b] hover:underline flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} className="text-[#294c5b] hover:underline flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {office.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ClockIcon className="h-6 w-6 mr-3 text-[#294c5b]" />
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Chat Support</span>
                    <span className="font-semibold text-green-600">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Support</span>
                    <span className="font-semibold text-green-600">24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-[#294c5b]" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="border-b border-gray-200 pb-4">
                    <summary className="cursor-pointer font-semibold text-gray-900 hover:text-[#294c5b] transition-colors">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-600 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <a 
                  href="/help" 
                  className="inline-flex items-center text-[#294c5b] hover:underline font-medium"
                >
                  View All FAQs
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Enterprise Support */}
            <div className="bg-gradient-to-br from-[#294c5b] to-[#1e3a48] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-3" />
                Enterprise Support
              </h3>
              <p className="text-blue-100 mb-6">
                Need dedicated support for your business? Our enterprise team provides 
                personalized assistance, priority support, and custom solutions.
              </p>
              <button className="bg-white text-[#294c5b] font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Enterprise Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Optional) */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Headquarters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Located in the heart of New York's financial district, our headquarters 
              welcomes visitors by appointment. Schedule a tour to see BIDDEX in action.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
            {/* Replace with actual map integration (Google Maps, Mapbox, etc.) */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will be integrated here</p>
                <p className="text-sm text-gray-500">123 Auction Plaza, Floor 15, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
