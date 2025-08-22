import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  tags: string[];
}

interface SupportTicket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
  category: string;
}

const DashboardHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets' | 'guides'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Support ticket form
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  // Mock data
  const [faqs] = useState<FAQItem[]>([
    {
      id: 1,
      category: 'Bidding',
      question: 'How does bidding work on your platform?',
      answer: 'Our bidding system allows you to place bids on auctions in real-time. You can set a maximum bid amount, and our system will automatically bid incrementally up to your maximum when others place bids. You\'ll be notified if you\'re outbid.',
      helpful: 45,
      tags: ['bidding', 'auctions', 'automatic']
    },
    {
      id: 2,
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.',
      helpful: 32,
      tags: ['payment', 'credit-card', 'paypal']
    },
    {
      id: 3,
      category: 'Shipping',
      question: 'How long does shipping take?',
      answer: 'Shipping times vary depending on the seller\'s location and the shipping method chosen. Typically, items are shipped within 2-3 business days after payment, and delivery takes 3-7 business days for domestic shipments.',
      helpful: 28,
      tags: ['shipping', 'delivery', 'timeline']
    },
    {
      id: 4,
      category: 'Account',
      question: 'How do I verify my account?',
      answer: 'To verify your account, go to your profile settings and click on "Verification". You\'ll need to provide a government-issued ID and proof of address. The verification process typically takes 1-2 business days.',
      helpful: 19,
      tags: ['verification', 'identity', 'account']
    },
    {
      id: 5,
      category: 'Bidding',
      question: 'Can I cancel a bid after placing it?',
      answer: 'Bids are generally binding commitments. However, you can cancel a bid within the first hour if there are no other bids placed after yours. Contact support if you need assistance with bid cancellation.',
      helpful: 15,
      tags: ['bidding', 'cancel', 'binding']
    },
    {
      id: 6,
      category: 'Security',
      question: 'How do you protect my personal information?',
      answer: 'We use industry-standard encryption and security measures to protect your personal information. Your data is stored securely and we never share your information with third parties without your consent.',
      helpful: 22,
      tags: ['security', 'privacy', 'data']
    }
  ]);

  const [tickets] = useState<SupportTicket[]>([
    {
      id: 1001,
      subject: 'Payment issue with Order #ORD-2024-001',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-08-20T10:30:00Z',
      lastUpdate: '2024-08-21T09:15:00Z',
      category: 'Payments'
    },
    {
      id: 1002,
      subject: 'Question about auction item authenticity',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-08-18T14:20:00Z',
      lastUpdate: '2024-08-19T11:30:00Z',
      category: 'Auctions'
    }
  ]);

  const categories = ['all', 'Bidding', 'Payments', 'Shipping', 'Account', 'Security'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit support ticket
    console.log('Support ticket submitted:', ticketForm);
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
    setTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      open: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Open' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' }
    };
    const config = configs[status as keyof typeof configs];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Medium' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' }
    };
    const config = configs[priority as keyof typeof configs];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'contact', name: 'Contact Support', icon: '📞' },
    { id: 'tickets', name: 'My Tickets', icon: '🎫' },
    { id: 'guides', name: 'User Guides', icon: '📖' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Get help with your account, bidding, and platform features</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/dashboard/help"
          onClick={() => setActiveTab('faq')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="text-3xl mb-2">❓</div>
          <h3 className="font-semibold text-lg mb-1">Browse FAQ</h3>
          <p className="text-blue-100 text-sm">Find answers to common questions</p>
        </Link>

        <Link
          to="/dashboard/help"
          onClick={() => setActiveTab('contact')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-semibold text-lg mb-1">Contact Support</h3>
          <p className="text-green-100 text-sm">Get personalized help from our team</p>
        </Link>

        <Link
          to="/dashboard/help"
          onClick={() => setActiveTab('guides')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="text-3xl mb-2">📖</div>
          <h3 className="font-semibold text-lg mb-1">User Guides</h3>
          <p className="text-purple-100 text-sm">Step-by-step tutorials and guides</p>
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                  activeTab === tab.id
                    ? 'border-[#294c5b] text-[#294c5b]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full mr-3">
                              {faq.category}
                            </span>
                            <span className="text-xs text-gray-500">{faq.helpful} people found this helpful</span>
                          </div>
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedFAQ === faq.id ? 'transform rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 border-t border-gray-200">
                          <p className="text-gray-700 mt-4 leading-relaxed">{faq.answer}</p>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {faq.tags.map((tag) => (
                                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">Was this helpful?</span>
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                                Yes
                              </button>
                              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                No
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.291.94-5.709 2.291M15 17h.01M9 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or category filter</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Our Support Team</h3>
              
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="bidding">Bidding & Auctions</option>
                      <option value="payments">Payments & Billing</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="account">Account Issues</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value="low">Low - General question</option>
                    <option value="medium">Medium - Issue affecting usage</option>
                    <option value="high">High - Urgent issue</option>
                    <option value="urgent">Urgent - Critical issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    placeholder="Please provide as much detail as possible about your issue..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#294c5b] text-white px-6 py-3 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
                >
                  Submit Support Ticket
                </button>
              </form>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-800 mb-2">Response Times</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Urgent issues: Within 2 hours</li>
                  <li>• High priority: Within 6 hours</li>
                  <li>• Medium priority: Within 24 hours</li>
                  <li>• Low priority: Within 48 hours</li>
                </ul>
              </div>
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">My Support Tickets</h3>
              
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">#{ticket.id} - {ticket.subject}</h4>
                          <p className="text-sm text-gray-500">Category: {ticket.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>Last update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                  <p className="text-gray-500">You haven't submitted any support tickets yet</p>
                </div>
              )}
            </div>
          )}

          {/* User Guides Tab */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">User Guides & Tutorials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Getting Started Guide', description: 'Learn the basics of using our auction platform', icon: '🚀', time: '5 min read' },
                  { title: 'How to Place Bids', description: 'Step-by-step guide to bidding on auctions', icon: '💰', time: '3 min read' },
                  { title: 'Payment & Checkout', description: 'Understanding our payment process', icon: '💳', time: '4 min read' },
                  { title: 'Seller Guidelines', description: 'Everything you need to know about selling', icon: '📝', time: '8 min read' },
                  { title: 'Account Security', description: 'Keeping your account safe and secure', icon: '🔒', time: '6 min read' },
                  { title: 'Troubleshooting', description: 'Solutions to common issues and problems', icon: '🔧', time: '7 min read' },
                ].map((guide, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-3xl mb-3">{guide.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{guide.title}</h4>
                    <p className="text-gray-600 mb-3">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{guide.time}</span>
                      <svg className="w-4 h-4 text-[#294c5b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHelp;
