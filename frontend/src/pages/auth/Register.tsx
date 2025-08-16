import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { registerSchema } from '../../utils/validationSchemas';
import FormField from '../../components/ui/FormField';
import LoadingButton from '../../components/ui/LoadingButton';
import PasswordStrength from '../../components/ui/PasswordStrength';
import { registerUser, clearError, clearSuccessMessage } from '../../store/slices/authSlice';
import { type RootState, type AppDispatch } from '../../store';
import { type RegisterData } from '../../types';

// Extended interface for form with confirm password
interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, successMessage, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
    mode: 'onChange'
  });

  // Watch password for strength indicator
  const watchedPassword = watch('password', '');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Remove confirmPassword from data before sending to API
      const { confirmPassword, ...registrationData } = data;
      
      await dispatch(registerUser({
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password,
        confirmPassword: data.confirmPassword,
        firstName: registrationData.first_name,
        lastName: registrationData.last_name,
        phone: registrationData.phone
      })).unwrap();
      
      setRegistrationSuccess(true);
    } catch (error) {
      // Error is handled by Redux
      console.error('Registration failed:', error);
    }
  };

  // Success state
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to BIDDEX!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You can now start bidding on amazing items.
            </p>
            <LoadingButton variant="primary" className="w-full">
              <Link to="/login">Continue to Sign In</Link>
            </LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join BIDDEX Today
          </h2>
          <p className="mt-2 text-gray-600">
            Create your account and start bidding on unique items
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              label="Username"
              name="username"
              placeholder="Choose a unique username"
              register={register}
              error={errors.username}
              required
            />

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="first_name"
                placeholder="Your first name"
                register={register}
                error={errors.first_name}
                required
              />
              <FormField
                label="Last Name"
                name="last_name"
                placeholder="Your last name"
                register={register}
                error={errors.last_name}
                required
              />
            </div>

            {/* Email Field */}
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
              required
            />

            {/* Phone Field */}
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Your phone number (optional)"
              register={register}
              error={errors.phone}
            />

            {/* Password Field with Strength Indicator */}
            <div>
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                register={register}
                error={errors.password}
                required
              />
              <PasswordStrength password={watchedPassword} />
            </div>

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              register={register}
              error={errors.confirmPassword}
              required
            />

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Backend Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={!isValid}
              variant="primary"
              className="w-full"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </LoadingButton>
          </form>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              Your personal information is encrypted and secure. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
