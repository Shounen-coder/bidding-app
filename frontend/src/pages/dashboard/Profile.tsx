import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type Resolver } from "react-hook-form";
import { profileSchema } from '../../utils/validationSchemas';
import FormField from '../../components/ui/FormField';
import LoadingButton from '../../components/ui/LoadingButton';
import { type User } from '../../types';

// Profile form data interface
interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in real app, this would come from Redux store or API
  const [currentUser] = useState<User>({
    id: 1,
    username: 'john_doe',
    email: 'john@biddex.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    address: '123 Main St, Anytown, USA',
    profile_image: '',
    is_verified: true,
    is_admin: false,
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as Resolver<ProfileFormData>,
    mode: 'onChange',
    defaultValues: {
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    }
  });

  // Load user data on component mount
  useEffect(() => {
    reset({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    });
  }, [currentUser, reset]);

  // Form submission handler
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSuccessMessage(null);
      
      console.log('Profile update attempt with:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      // const response = await userAPI.updateProfile(data);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Profile update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    reset({
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
      phone: currentUser.phone || '',
      address: currentUser.address || ''
    });
    setIsEditing(false);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {currentUser.first_name[0]}{currentUser.last_name[0]}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <p className="text-blue-100">@{currentUser.username}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-blue-100">Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">Username</label>
                  <p className="text-gray-900 font-medium">@{currentUser.username}</p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Email Address</label>
                  <p className="text-gray-900 font-medium">{currentUser.email}</p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Member Since</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(currentUser.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Account Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Profile Form */}
            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {!isEditing && (
                  <LoadingButton
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                  >
                    Edit Profile
                  </LoadingButton>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="first_name"
                    register={register}
                    error={errors.first_name}
                    disabled={!isEditing}
                    required
                  />
                  <FormField
                    label="Last Name"
                    name="last_name"
                    register={register}
                    error={errors.last_name}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  register={register}
                  error={errors.phone}
                  disabled={!isEditing}
                />

                <FormField
                  label="Address"
                  name="address"
                  register={register}
                  error={errors.address}
                  disabled={!isEditing}
                />

                {isEditing && (
                  <div className="flex space-x-4">
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || !isDirty}
                      variant="primary"
                    >
                      {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                    </LoadingButton>
                    <LoadingButton
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </LoadingButton>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Last changed 30 days ago</p>
              </div>
              <LoadingButton variant="outline">
                Change Password
              </LoadingButton>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <LoadingButton variant="outline">
                Enable 2FA
              </LoadingButton>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-gray-900">Login Activity</p>
                <p className="text-sm text-gray-600">See recent account activity</p>
              </div>
              <LoadingButton variant="outline">
                View Activity
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
