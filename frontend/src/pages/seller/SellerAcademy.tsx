import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const SellerAcademy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const { profile } = useSelector((state: RootState) => state.seller);

  const currentTier = profile?.tier || 'basic';

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
    { id: 'tiers', label: 'Seller Tiers', icon: '🏆' },
    { id: 'best-practices', label: 'Best Practices', icon: '💡' },
    { id: 'faqs', label: 'FAQs', icon: '❓' },
  ];

  const tierInfo = {
    basic: {
      name: 'Basic Seller',
      color: 'gray',
      maxValue: 200,
      maxActive: 2,
      features: ['Basic listing', 'Up to 3 photos', 'Starting price only'],
      nextSteps: 'Complete 5 auctions with 100% completion rate to reach Verified tier'
    },
    verified: {
      name: 'Verified Seller',
      color: 'teal',
      maxValue: 1000,
      maxActive: 5,
      features: ['Buy Now option', 'Up to 6 photos', 'Enhanced descriptions', 'Priority support'],
      nextSteps: 'Complete 20+ auctions, maintain 4.8+ rating, and be active for 3+ months for Trusted tier'
    },
    trusted: {
      name: 'Trusted Seller',
      color: 'green',
      maxValue: 5000,
      maxActive: 10,
      features: ['Reserve prices', 'Auction scheduling', 'Full analytics', 'Priority listings', 'Market insights'],
      nextSteps: 'You have achieved the highest tier! Enjoy all premium features.'
    }
  };

  const bestPractices = [
    {
      title: 'Write Clear Descriptions',
      description: 'Be honest and detailed about your item condition, size, and features.',
      icon: '📝',
      tip: 'Include measurements, brand, model, and any flaws or wear.'
    },
    {
      title: 'Use Quality Photos',
      description: 'Take multiple clear, well-lit photos from different angles.',
      icon: '📸',
      tip: 'Natural lighting works best. Show any defects clearly.'
    },
    {
      title: 'Set Smart Starting Prices',
      description: 'Research similar items to price competitively and attract bidders.',
      icon: '💰',
      tip: 'Lower starting prices often generate more interest and bidding activity.'
    },
    {
      title: 'Respond Quickly',
      description: 'Answer questions promptly and professionally.',
      icon: '💬',
      tip: 'Quick responses build trust and encourage more bids.'
    },
    {
      title: 'Ship Fast & Safe',
      description: 'Pack items carefully and ship within 24-48 hours.',
      icon: '📦',
      tip: 'Good shipping practices lead to positive reviews and repeat buyers.'
    },
    {
      title: 'Build Your Reputation',
      description: 'Maintain high ratings to unlock better seller tiers.',
      icon: '⭐',
      tip: 'Every successful transaction builds your credibility on the platform.'
    }
  ];

  const faqs = [
    {
      question: 'How do I create my first auction?',
      answer: 'Go to "Create Auction" from your seller dashboard. Fill in item details, upload photos, set your starting price and auction duration. Review and publish!'
    },
    {
      question: 'When do I get paid?',
      answer: 'Payment is released after the buyer confirms receipt. Basic sellers wait 5 days, Verified wait 3 days, and Trusted sellers wait just 1 day.'
    },
    {
      question: 'What fees do you charge?',
      answer: 'We charge 10% of the final sale price. This covers payment processing, fraud protection, and platform maintenance.'
    },
    {
      question: 'How do I upgrade my seller tier?',
      answer: 'Complete auctions successfully, maintain high ratings, and meet the requirements shown in the Tiers section. Upgrades are automatic.'
    },
    {
      question: 'Can I cancel an auction?',
      answer: 'You can cancel auctions with no bids. Once bidding starts, cancellation requires contacting support with a valid reason.'
    },
    {
      question: 'What if a buyer doesn\'t pay?',
      answer: 'We have buyer protection policies. Unpaid auctions are automatically relisted, and problematic buyers are penalized.'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Selling! 🎉</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Ready to turn your items into cash? Follow these simple steps to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-teal-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">List Your Item</h3>
                <p className="text-gray-600 text-sm">
                  Take great photos, write a clear description, and set your starting price.
                </p>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-teal-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Bids</h3>
                <p className="text-gray-600 text-sm">
                  Monitor your auction, answer questions, and watch the bids roll in.
                </p>
              </div>

              <div className="text-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl text-teal-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ship & Get Paid</h3>
                <p className="text-gray-600 text-sm">
                  Ship your item safely and receive payment automatically.
                </p>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-900 mb-1">Pro Tip</h3>
                  <p className="text-teal-800">
                    Start with items you no longer need around the house. Electronics, clothing, books, and collectibles often do well!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/dashboard/sell/create"
                className="inline-block bg-[#1f3c4a] text-white px-8 py-3 rounded-lg font-medium hover:text-teal-400 transition-colors"
              >
                Create Your First Auction
              </Link>
            </div>
          </div>
        );

      case 'tiers':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Seller Tier System</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Progress through tiers to unlock more features and higher limits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(tierInfo).map(([tier, info]) => (
                <div
                  key={tier}
                  className={`p-6 rounded-lg border-2 ${
                    currentTier === tier
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-200 bg-white'
                  } transition-colors`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {info.name}
                    </h3>
                    {currentTier === tier && (
                      <span className="inline-block bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                        Current Tier
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#1f3c4a]">
                        ${info.maxValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Max auction value</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-700">
                        {info.maxActive}
                      </div>
                      <div className="text-sm text-gray-600">Active auctions</div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium text-gray-900">Features:</div>
                      <ul className="space-y-1">
                        {info.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="text-teal-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <strong>Next Step:</strong> {info.nextSteps}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'best-practices':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Practices</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Follow these proven strategies to maximize your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{practice.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {practice.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {practice.description}
                      </p>
                      <div className="bg-teal-50 border-l-4 border-teal-400 rounded p-3">
                        <div className="text-sm text-teal-800">
                          <strong>Tip:</strong> {practice.tip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faqs':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get answers to the most common seller questions.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you succeed.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#1f3c4a] text-white px-6 py-2 rounded-lg hover:text-teal-600 font-medium transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Seller Academy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to become a successful seller on our platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex justify-center space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-teal-600 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful sellers on our platform today.
          </p>
          <div className="space-x-4">
            <Link
              to="/dashboard/sell/create"
              className="inline-block bg-[#1f3c4a] text-white px-6 py-3 rounded-lg font-medium hover:text-teal-600 transition-colors"
            >
              Create First Auction
            </Link>
            <Link
              to="/dashboard"
              className="inline-block border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:text-teal-600 hover:border-teal-400 transition-colors"
            >
              View My Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAcademy;
