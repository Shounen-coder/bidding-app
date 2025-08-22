import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const dispatch = useDispatch<AppDispatch>(); // Fixed: Proper typing
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, successMessage, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema) as Resolver<LoginCredentials>,
    mode: 'onChange'
  });

  // Fixed: Redirect to dashboard after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  // Fixed: Form submission handler with proper async handling
  const onSubmit = async (data: LoginCredentials) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back to BIDDEX</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue bidding</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            {/* Password Field */}
            <FormField
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            {/* Backend Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </LoadingButton>

            {/* Additional Options */}
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up for free
                </Link>
              </span>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Create a new account or use any registered email to test login
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
