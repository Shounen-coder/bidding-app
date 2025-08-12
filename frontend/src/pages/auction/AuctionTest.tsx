import React from 'react';
import CountdownTimer from '../../components/auction/CountdownTimer';

const AuctionTest: React.FC = () => {
  // Test times
  const testTimes = [
    {
      label: 'Ending in 3 days',
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      label: 'Ending in 2 hours',
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    },
    {
      label: 'Ending in 30 minutes (Critical)',
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    },
    {
      label: 'Ended',
      endTime: new Date(Date.now() - 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Countdown Timer Tests - BIDDEX
        </h1>

        <div className="space-y-8">
          {testTimes.map((test, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {test.label}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Default variant */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Default</h4>
                  <CountdownTimer endTime={test.endTime} />
                </div>

                {/* Compact variant */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Compact</h4>
                  <CountdownTimer endTime={test.endTime} variant="compact" />
                </div>

                {/* Large variant */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Large</h4>
                  <CountdownTimer 
                    endTime={test.endTime} 
                    variant="large"
                    onTimeUp={() => console.log('Auction ended!')}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionTest;
