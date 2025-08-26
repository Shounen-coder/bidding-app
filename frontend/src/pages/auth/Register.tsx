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


  // And update the success message link:
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='7' cy='7' r='3'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-400 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
            <span className="text-white font-bold text-3xl">B</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white tracking-tight">
            Join BIDDEX Today
          </h2>
          <p className="mt-3 text-lg text-gray-300">
            Create your account and start bidding on unique items
          </p>
        </div>


        {/* Registration Form */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
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
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-teal-600 hover:text-teal-700 transition-colors duration-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-700 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </label>
            </div>


            {/* Backend Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}


            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={isLoading}
              disabled={!isValid}
              variant="primary"
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-teal-400/30 focus:outline-none"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </LoadingButton>
          </form>


          {/* Additional Options */}
          <div className="mt-8 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-white mb-1">Secure & Private</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Your personal information is encrypted and secure. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Join Thousands of Happy Bidders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">50K+ Users</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">$2M+ Traded</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">100% Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Register;
