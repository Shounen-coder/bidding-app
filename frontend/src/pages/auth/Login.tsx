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
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='7' cy='7' r='3'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-400 flex items-center justify-center shadow-2xl ring-4 ring-white/20">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white tracking-tight">Welcome back to BIDDEX</h2>
          <p className="mt-3 text-lg text-gray-300">Sign in to your account to continue bidding</p>
        </div>


        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
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
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:ring-teal-400/30 focus:outline-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </LoadingButton>


            {/* Additional Options */}
            <div className="flex items-center justify-between pt-2">
              <Link to="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>


            <div className="text-center pt-4">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200">
                  Sign up for free
                </Link>
              </span>
            </div>


            {/* Demo Credentials */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Create a new account or use any registered email to test login
              </p>
            </div> */}
          </form>
        </div>

        {/* Additional Features Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Why Choose BIDDEX?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">Secure Escrow</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">Real-time Bidding</p>
            </div>
            <div className="group">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">Trusted Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
