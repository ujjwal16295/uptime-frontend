"use client"
import React, { useState, useEffect } from 'react';
import { Zap, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Function to create user record if it doesn't exist
  const createUserIfNotExists = async (userEmail) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', userEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error checking user existence:', fetchError);
        return;
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              email: userEmail,
              links: [], // Empty array (will use default '{}' from schema)
              ping: 0,   // Will use default from schema
              credit: 21600 // Will use default from schema
            }
          ]);

        if (insertError) {
          console.error('Error creating user:', insertError);
        } else {
          console.log('User created successfully:', userEmail);
        }
      }
    } catch (error) {
      console.error('Error in createUserIfNotExists:', error);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Create user record if needed
        await createUserIfNotExists(user.email);
        // Redirect to dashboard if already logged in
        window.location.href = '/';
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Create user record if needed
        await createUserIfNotExists(session.user.email);
        // Redirect to dashboard on successful login
        window.location.href = '/';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBack = () => {
    window.location.href = '/';
  };

  const handleEmailLogin = async () => {    
    if (!email) {
      setMessage({
        type: 'error',
        text: 'Please enter your email address'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      setIsLoading(false);
      setEmailSent(true);
      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your email and click the link to sign in.'
      });

    } catch (error) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.'
      });
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setMessage(null);
    handleEmailLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-lg">
              <img 
          src="/logo.png" 
          alt="NapStopper Logo" 
          className="w-6 h-6 object-contain"
        />              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                NapStopper
              </h1>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          {!emailSent ? (
            /* Login Form */
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">
                  Enter your email and we'll send you a magic link to sign in
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Magic Link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Send Magic Link</span>
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
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p className="font-medium">{message.text}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  No password required. We'll send you a secure link to access your account.
                </p>
              </div>
            </div>
          ) : (
            /* Email Sent Confirmation */
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
              <div className="bg-green-100 p-3 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a magic link to <strong>{email}</strong>. 
                Click the link in your email to sign in to your account.
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <button
                  onClick={handleResendEmail}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline transition-colors"
                >
                  Resend Email
                </button>
              </div>

              {message && message.type === 'success' && (
                <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-medium">{message.text}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div className="text-orange-600 mb-2">
                <Mail className="w-6 h-6 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-700">Passwordless</p>
              <p className="text-xs text-gray-500">No passwords to remember</p>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-1.5 rounded-lg">
              <img 
          src="/logo.png" 
          alt="NapStopper Logo" 
          className="w-6 h-6 object-contain"
        />              </div>
              <h3 className="text-lg font-bold">NapStopper</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Keep your free-tier applications running 24/7 without any hassle.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
