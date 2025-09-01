import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Sparkles, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    userName: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!credentials.userName.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const result = await login(credentials);
    
    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white">
            <Lock className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-blue-900">
            Shalom Therapy
          </h2>
          <p className="mt-2 text-sm text-blue-700">
            Welcome back! Please sign in to your account
          </p>
          
          {/* Demo credentials badge */}
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 backdrop-blur-sm border border-blue-200">
            <Sparkles className="w-4 h-4 mr-1 text-blue-600" />
            Demo: admin / admin123
          </div>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-md border border-white shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Username"
              name="userName"
              type="text"
              value={credentials.userName}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
              autoComplete="username"
              leftIcon={<User className="h-5 w-5 text-blue-500" />}
              inputClassName="bg-white border-blue-200 text-gray-800 placeholder-blue-400 focus:bg-blue-50 focus:border-blue-400"
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
                leftIcon={<Lock className="h-5 w-5 text-blue-500" />}
                inputClassName="bg-white border-blue-200 text-gray-800 placeholder-blue-400 focus:bg-blue-50 focus:border-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-blue-500" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-500" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-blue-700">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-blue-800 hover:text-blue-600 transition-colors">
              Contact administrator
            </a>
          </p>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </div>
  );
};

export default Login;