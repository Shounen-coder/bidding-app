import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface CountdownTimerProps {
  endTime: string;
  onTimeUp?: () => void;
  variant?: 'default' | 'compact' | 'large';
  showLabels?: boolean;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onTimeUp,
  variant = 'default',
  showLabels = true,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  // Calculate time remaining
  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: difference };
  };

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Call onTimeUp when auction ends
      if (remaining.total <= 0 && onTimeUp) {
        onTimeUp();
        clearInterval(timer);
      }
    }, 1000);

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  // Determine urgency level for styling
  const getUrgencyLevel = () => {
    if (timeRemaining.total <= 0) return 'ended';
    if (timeRemaining.days === 0 && timeRemaining.hours < 1) return 'critical'; // Less than 1 hour
    if (timeRemaining.days === 0 && timeRemaining.hours < 24) return 'urgent'; // Less than 24 hours
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  // Style variants
  const variants = {
    default: 'text-base',
    compact: 'text-sm',
    large: 'text-xl'
  };

  // Urgency colors
  const urgencyColors = {
    ended: 'text-gray-500',
    critical: 'text-red-600',
    urgent: 'text-orange-600',
    normal: 'text-gray-900'
  };

  // Background colors for time boxes
  const urgencyBackgrounds = {
    ended: 'bg-gray-100',
    critical: 'bg-red-50 border-red-200',
    urgent: 'bg-orange-50 border-orange-200',
    normal: 'bg-blue-50 border-blue-200'
  };

  // If auction has ended
  if (timeRemaining.total <= 0) {
    return (
      <div className={clsx('flex items-center space-x-2', variants[variant], className)}>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
          Auction Ended
        </span>
      </div>
    );
  }

  // Compact variant (for cards)
  if (variant === 'compact') {
    return (
      <div className={clsx('flex items-center space-x-1', urgencyColors[urgencyLevel], className)}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium text-sm">
          {timeRemaining.days > 0 && `${timeRemaining.days}d `}
          {String(timeRemaining.hours).padStart(2, '0')}:
          {String(timeRemaining.minutes).padStart(2, '0')}:
          {String(timeRemaining.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Default and large variants (for detail pages)
  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      {/* Time boxes */}
      <div className="flex space-x-1">
        {timeRemaining.days > 0 && (
          <div className={clsx('px-2 py-1 rounded border', urgencyBackgrounds[urgencyLevel])}>
            <div className={clsx('font-bold', variants[variant], urgencyColors[urgencyLevel])}>
              {timeRemaining.days}
            </div>
            {showLabels && (
              <div className="text-xs text-gray-500 text-center">
                {timeRemaining.days === 1 ? 'Day' : 'Days'}
              </div>
            )}
          </div>
        )}
        
        <div className={clsx('px-2 py-1 rounded border', urgencyBackgrounds[urgencyLevel])}>
          <div className={clsx('font-bold', variants[variant], urgencyColors[urgencyLevel])}>
            {String(timeRemaining.hours).padStart(2, '0')}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 text-center">Hours</div>
          )}
        </div>

        <div className={clsx('px-2 py-1 rounded border', urgencyBackgrounds[urgencyLevel])}>
          <div className={clsx('font-bold', variants[variant], urgencyColors[urgencyLevel])}>
            {String(timeRemaining.minutes).padStart(2, '0')}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 text-center">Mins</div>
          )}
        </div>

        <div className={clsx('px-2 py-1 rounded border', urgencyBackgrounds[urgencyLevel])}>
          <div className={clsx('font-bold', variants[variant], urgencyColors[urgencyLevel])}>
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
          {showLabels && (
            <div className="text-xs text-gray-500 text-center">Secs</div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {urgencyLevel === 'critical' && (
        <div className="flex items-center text-red-600">
          <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Ending Soon!</span>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
