import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';

interface NotificationSettings {
  emailNotifications: boolean;
  bidNotifications: boolean;
  auctionUpdates: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'limited';
  showBiddingActivity: boolean;
  showWonAuctions: boolean;
  allowMessages: boolean;
  dataCollection: boolean;
  analyticsTracking: boolean;
}

interface AccountSettings {
  language: string;
  timezone: string;
  currency: string;
  autoLogout: number;
  theme: 'light' | 'dark' | 'system';
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceTracking: boolean;
}

const DashboardSettings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'account' | 'security' | 'billing'>('notifications');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    bidNotifications: true,
    auctionUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,
    securityAlerts: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showBiddingActivity: true,
    showWonAuctions: false,
    allowMessages: true,
    dataCollection: true,
    analyticsTracking: false
  });

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    autoLogout: 30,
    theme: 'system'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 60,
    loginAlerts: true,
    deviceTracking: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle settings changes
  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAccountChange = (key: keyof AccountSettings, value: any) => {
    setAccountSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Save functions
  const saveNotificationSettings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Notification settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update notification settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: API call to save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Privacy settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update privacy settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccountSettings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: API call to save account settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Account settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update account settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSecuritySettings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: API call to save security settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Security settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update security settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: API call to update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and you will lose all your data, including bid history, orders, and watchlist items.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This is your final warning. Deleting your account is permanent and irreversible. Type "DELETE" to confirm.'
    );

    if (!doubleConfirm) return;

    // TODO: Implement account deletion
    alert('Account deletion would be processed here. This is just a demo.');
  };

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'account', name: 'Account', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ];

  const ToggleSwitch: React.FC<{ 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    disabled?: boolean 
  }> = ({ checked, onChange, disabled = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#294c5b]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#294c5b] peer-disabled:opacity-50"></div>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your preferences, privacy, and security settings</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
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
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
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
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <button
                  onClick={saveNotificationSettings}
                  disabled={isLoading}
                  className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
                  
                  {[
                    { key: 'emailNotifications', name: 'General email notifications', description: 'Receive important updates via email' },
                    { key: 'bidNotifications', name: 'Bid notifications', description: 'Get notified when outbid or when you win' },
                    { key: 'auctionUpdates', name: 'Auction updates', description: 'Updates about watchlist auctions' },
                    { key: 'weeklyDigest', name: 'Weekly digest', description: 'Summary of your weekly activity' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ToggleSwitch
                        checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                        onChange={(checked) => handleNotificationChange(item.key as keyof NotificationSettings, checked)}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Other Notifications</h4>
                  
                  {[
                    { key: 'smsNotifications', name: 'SMS notifications', description: 'Receive urgent updates via SMS' },
                    { key: 'pushNotifications', name: 'Push notifications', description: 'Browser and mobile notifications' },
                    { key: 'marketingEmails', name: 'Marketing emails', description: 'Promotional offers and news' },
                    { key: 'securityAlerts', name: 'Security alerts', description: 'Account security notifications' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ToggleSwitch
                        checked={notificationSettings[item.key as keyof NotificationSettings] as boolean}
                        onChange={(checked) => handleNotificationChange(item.key as keyof NotificationSettings, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                <button
                  onClick={savePrivacySettings}
                  disabled={isLoading}
                  className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Profile Visibility</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                      { value: 'limited', label: 'Limited', description: 'Only auction participants can see your profile' },
                      { value: 'private', label: 'Private', description: 'Only you can see your profile' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option.value}
                          checked={privacySettings.profileVisibility === option.value}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="mr-3 text-[#294c5b] focus:ring-[#294c5b]"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Activity Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Activity Privacy</h4>
                  
                  {[
                    { key: 'showBiddingActivity', name: 'Show bidding activity', description: 'Allow others to see your recent bids' },
                    { key: 'showWonAuctions', name: 'Show won auctions', description: 'Display auctions you have won' },
                    { key: 'allowMessages', name: 'Allow messages', description: 'Let other users send you messages' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ToggleSwitch
                        checked={privacySettings[item.key as keyof PrivacySettings] as boolean}
                        onChange={(checked) => handlePrivacyChange(item.key as keyof PrivacySettings, checked)}
                      />
                    </div>
                  ))}
                </div>

                {/* Data Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Data & Analytics</h4>
                  
                  {[
                    { key: 'dataCollection', name: 'Data collection', description: 'Allow us to collect usage data to improve our service' },
                    { key: 'analyticsTracking', name: 'Analytics tracking', description: 'Enable anonymous analytics tracking' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ToggleSwitch
                        checked={privacySettings[item.key as keyof PrivacySettings] as boolean}
                        onChange={(checked) => handlePrivacyChange(item.key as keyof PrivacySettings, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Account Preferences</h3>
                <button
                  onClick={saveAccountSettings}
                  disabled={isLoading}
                  className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={accountSettings.language}
                    onChange={(e) => handleAccountChange('language', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={accountSettings.timezone}
                    onChange={(e) => handleAccountChange('timezone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={accountSettings.currency}
                    onChange={(e) => handleAccountChange('currency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={accountSettings.theme}
                    onChange={(e) => handleAccountChange('theme', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto Logout (minutes)</label>
                  <select
                    value={accountSettings.autoLogout}
                    onChange={(e) => handleAccountChange('autoLogout', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-red-800">Delete Account</h5>
                      <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                    </div>
                    <button
                      onClick={deleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>

              {/* Password Change */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={updatePassword}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              {/* Security Options */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Security Options</h4>
                  <button
                    onClick={saveSecuritySettings}
                    disabled={isLoading}
                    className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                {[
                  { key: 'twoFactorEnabled', name: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
                  { key: 'loginAlerts', name: 'Login alerts', description: 'Get notified of new login attempts' },
                  { key: 'deviceTracking', name: 'Device tracking', description: 'Track devices that access your account' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ToggleSwitch
                      checked={securitySettings[item.key as keyof SecuritySettings] as boolean}
                      onChange={(checked) => handleSecurityChange(item.key as keyof SecuritySettings, checked)}
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">Session Timeout</h5>
                    <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                  </div>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Billing & Payment Methods</h3>
              
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Billing Management</h4>
                <p className="text-gray-500 mb-6">Payment methods and billing history will be available when integrated with payment processing.</p>
                <button className="bg-[#294c5b] text-white px-6 py-3 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
