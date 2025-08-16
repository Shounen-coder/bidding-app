import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type Resolver } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { loginSchema } from '../../utils/validationSchemas';
import FormField from '../../components/ui/FormField';
import LoadingButton from '../../components/ui/LoadingButton';
import { loginUser, clearError, clearSuccessMessage } from '../../store/slices/authSlice';
import { type RootState, type AppDispatch } from '../../store';
import { type LoginCredentials } from '../../types';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, successMessage, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema) as Resolver<LoginCredentials>,
    mode: 'onChange' // Validate as user types
  });

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
  const onSubmit = async (data: LoginCredentials) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by Redux
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back to BIDDEX
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue bidding
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Password Field */}
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              required
            />

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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </LoadingButton>
          </form>

          {/* Additional Options */}
          <div className="mt-6">
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up for free
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Demo Credentials - Updated for real backend */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Create a new account or use any registered email to test login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
