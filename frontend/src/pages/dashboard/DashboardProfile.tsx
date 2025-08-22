import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../store';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  updateNotificationSettings,
  clearError 
} from '../../store/slices/profileSlice';

interface SecuritySettings {
  emailNotifications: boolean;
  bidNotifications: boolean;
  auctionUpdates: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;

  [key: string]: boolean;
}

const DashboardProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, statistics, isLoading: profileLoading, error } = useSelector((state: RootState) => state.profile);
  
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences' | 'verification'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Update error message from Redux state
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // Form data derived from Redux user state
  const formData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    address: user?.address || '',
    zipCode: user?.zipCode || '',
    city: user?.city || '',
    country: user?.country || 'United States'
  };

  const [localFormData, setLocalFormData] = useState(formData);

  // Update local form data when Redux user data changes
  useEffect(() => {
    if (user) {
      setLocalFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: user?.dateOfBirth || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        address: user?.address || '',
        zipCode: user?.zipCode || '',
        city: user?.city || '',
        country: user?.country || 'United States'
      });
    }
  }, [user]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    emailNotifications: user?.emailNotifications ?? true,
    bidNotifications: user?.bidNotifications ?? true,
    auctionUpdates: user?.auctionUpdates ?? true,
    marketingEmails: user?.marketingEmails ?? false,
    twoFactorEnabled: user?.twoFactorEnabled ?? false
  });

  // Update security settings when user data changes
  useEffect(() => {
    if (user) {
      setSecuritySettings({
        emailNotifications: user?.emailNotifications ?? true,
        bidNotifications: user?.bidNotifications ?? true,
        auctionUpdates: user?.auctionUpdates ?? true,
        marketingEmails: user?.marketingEmails ?? false,
        twoFactorEnabled: user?.twoFactorEnabled ?? false
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Calculate profile completion percentage using Redux user data
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.dateOfBirth,
      user.bio,
      user.location,
      user.address,
      user.city,
      user.country
    ];
    
    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Updated handleSaveProfile function with Redux integration
  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await dispatch(updateUserProfile(localFormData)).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: Integrate with your updatePassword API
      // await dispatch(updatePassword(passwordForm)).unwrap();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleSaveSettings function with Redux integration
  const handleSaveSettings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await dispatch(updateNotificationSettings(securitySettings)).unwrap();
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error || 'Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!localFormData.firstName.trim() || !localFormData.lastName.trim()) {
      setErrorMessage('First name and last name are required');
      return false;
    }

    if (localFormData.website && !isValidUrl(localFormData.website)) {
      setErrorMessage('Please enter a valid website URL');
      return false;
    }

    return true;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetFormData = () => {
    setLocalFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      address: user?.address || '',
      zipCode: user?.zipCode || '',
      city: user?.city || '',
      country: user?.country || 'United States'
    });
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'verification', name: 'Verification', icon: '✅' },
  ];

  // Show loading state while fetching profile
  if (profileLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#294c5b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Profile Completion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#294c5b] to-[#1e3a48] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">Profile completion:</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-[#294c5b] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#294c5b]">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-semibold text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
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
                  setIsEditing(false);
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
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        resetFormData();
                        setErrorMessage('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading || profileLoading}
                      className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || profileLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={localFormData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{localFormData.firstName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={localFormData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{localFormData.lastName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500 relative">
                    {localFormData.email}
                    <span className="absolute right-3 top-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={localFormData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{localFormData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={localFormData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {localFormData.dateOfBirth ? new Date(localFormData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={localFormData.location}
                      onChange={handleInputChange}
                      placeholder="City, State/Country"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{localFormData.location || 'Not provided'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={localFormData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {localFormData.website ? (
                        <a href={localFormData.website} target="_blank" rel="noopener noreferrer" className="text-[#294c5b] hover:underline">
                          {localFormData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={localFormData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg min-h-[100px]">{localFormData.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-medium">Email verified</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current Password"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New Password"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm Password"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSavePassword}
                    disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading || profileLoading}
                  className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading || profileLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', name: 'Email notifications', description: 'Receive email updates about your account activity' },
                  { key: 'bidNotifications', name: 'Bid notifications', description: 'Get notified when someone outbids you or when you win' },
                  { key: 'auctionUpdates', name: 'Auction updates', description: 'Updates about auctions in your watchlist' },
                  { key: 'marketingEmails', name: 'Marketing emails', description: 'Promotional emails and newsletters' },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{pref.name}</h4>
                      <p className="text-sm text-gray-500">{pref.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securitySettings[pref.key as keyof SecuritySettings] as boolean}
                        onChange={(e) => handleSecurityChange(pref.key as keyof SecuritySettings, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#294c5b]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#294c5b]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Account Verification</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email Address</h4>
                      <p className="text-sm text-gray-500">Your email address has been verified</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone Number</h4>
                      <p className="text-sm text-gray-500">Verify your phone number for account security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#294c5b] text-white rounded-lg hover:bg-[#1e3a48] transition-colors font-medium">
                    Verify Phone
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
