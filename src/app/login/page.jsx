"use client"
import React, { useState, useEffect } from 'react';
import { Github, Mail, CheckCircle, AlertCircle, Users, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Redirect to dashboard if already logged in
        window.location.href = 'https://uptime-frontend-ivory.vercel.app/';
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to dashboard on successful login
        window.location.href = 'https://uptime-frontend-ivory.vercel.app/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://uptime-frontend-ivory.vercel.app/'
        }
      });

      if (error) {
        throw error;
      }

      // Note: The redirect will happen automatically after successful OAuth
      
    } catch (error) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in with your GitHub account to get started
              </p>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting to GitHub...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </div>
                )}
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : message.text.includes('100 people') ? (
                    <Users className="w-5 h-5 text-red-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Secure authentication through GitHub. No passwords required.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="text-orange-600 mb-2">
                <Github className="w-6 h-6 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-700">GitHub OAuth</p>
              <p className="text-xs text-gray-500">Secure & trusted</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="text-orange-600 mb-2">
                <Zap className="w-6 h-6 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-700">Fast & Secure</p>
              <p className="text-xs text-gray-500">Login in seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}