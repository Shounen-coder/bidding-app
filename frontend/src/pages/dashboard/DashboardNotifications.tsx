import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { 
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from '../../store/slices/profileSlice';

interface Notification {
  id: number;
  type: 'bid' | 'auction' | 'system' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const DashboardNotifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { notifications: reduxNotifications, isLoading, error } = useSelector((state: RootState) => state.profile);
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bid' | 'auction'>('all');

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Use Redux notifications when available, fallback to mock data
  const notifications = reduxNotifications && reduxNotifications.length > 0 ? 
    reduxNotifications.map((notif: any) => ({
      id: notif.id,
      type: notif.type || 'system',
      title: notif.title,
      message: notif.message,
      time: notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Recently',
      read: notif.is_read || false,
      priority: notif.priority || 'medium'
    })) : 
    [
      {
        id: 1,
        type: 'bid',
        title: 'You\'ve been outbid!',
        message: 'Someone placed a higher bid on "Vintage Camera". Current bid: $250',
        time: '2 minutes ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'auction',
        title: 'Auction ending soon',
        message: 'The auction for "Antique Watch" ends in 2 hours',
        time: '1 hour ago',
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'system',
        title: 'Profile verification complete',
        message: 'Your profile has been successfully verified. You can now participate in premium auctions.',
        time: '3 hours ago',
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'payment',
        title: 'Payment successful',
        message: 'Your payment of $180 for "Digital Camera" has been processed.',
        time: '1 day ago',
        read: true,
        priority: 'medium'
      }
    ];

  const tabs = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'bid', name: 'Bids', count: notifications.filter(n => n.type === 'bid').length },
    { id: 'auction', name: 'Auctions', count: notifications.filter(n => n.type === 'auction').length },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  // Mark notification as read (with API call)
//   const markAsRead = async (id: number) => {
//     // Update local state immediately for better UX
//     const updatedNotifications = notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     );
    
//     try {
//       // TODO: Implement markNotificationAsRead API call
//       // await dispatch(markNotificationAsRead(id)).unwrap();
//       console.log('Marked notification as read:', id);
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

// UPDATED: Mark notification as read (now with real API call)
  const markAsRead = async (id: number) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
      console.log('Marked notification as read:', id);
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       // TODO: Implement markAllNotificationsAsRead API call
//       // await dispatch(markAllNotificationsAsRead()).unwrap();
//       console.log('Marked all notifications as read');
      
//       // Refresh notifications
//       dispatch(fetchNotifications({ page: 1, limit: 50 }));
//     } catch (error) {
//       console.error('Failed to mark all notifications as read:', error);
//     }
//   };

// UPDATED: Mark all notifications as read (now with real API call)
  const markAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      console.log('Marked all notifications as read');
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center";
    const iconClasses = "w-5 h-5";

    switch (type) {
      case 'bid':
        return (
          <div className={`${baseClasses} ${priority === 'high' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <svg className={`${iconClasses} ${priority === 'high' ? 'text-red-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'auction':
        return (
          <div className={`${baseClasses} bg-yellow-100`}>
            <svg className={`${iconClasses} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className={`${baseClasses} bg-green-100`}>
            <svg className={`${iconClasses} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-100`}>
            <svg className={`${iconClasses} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your auction activities</p>
        </div>
        
        <button
          onClick={markAllAsRead}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-[#294c5b] border border-[#294c5b] rounded-lg hover:bg-[#294c5b] hover:text-white transition-colors disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      {/* Show error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading notifications</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-[#294c5b] text-[#294c5b]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-[#294c5b] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#294c5b] mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-4">
                  {getNotificationIcon(notification.type, notification.priority)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        {notification.priority === 'high' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${
                      !notification.read ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5m0-5v5M7 7h5m0 0V2m0 5l5-5M7 7l5 5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNotifications;
