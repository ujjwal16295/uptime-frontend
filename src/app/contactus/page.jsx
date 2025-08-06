"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Clock, Code, Globe, CheckCircle, Copy, Server, User, LogOut, Gift, AlertCircle, Mail, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import Image from 'next/image';

export default function ContactUsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userCredit, setUserCredit] = useState(null);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [copied, setCopied] = useState(false);

  // Backend API base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Function to fetch user credit from backend
  const fetchUserCredit = useCallback(async (email) => {
    setLoadingCredit(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit/${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserCredit(data.data.credit);
      } else if (response.status === 404) {
        // User not found, set default credit
        setUserCredit(21600);
      } else {
        console.error('Failed to fetch user credit');
        setUserCredit(21600); // Fallback to default
      }
    } catch (error) {
      console.error('Error fetching user credit:', error);
      setUserCredit(21600); // Fallback to default
    } finally {
      setLoadingCredit(false);
    }
  }, [API_BASE_URL]);

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      // Fetch user credit if user is logged in
      if (user?.email) {
        fetchUserCredit(user.email);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Fetch credit when user logs in
      if (session?.user?.email) {
        fetchUserCredit(session.user.email);
      } else {
        setUserCredit(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserCredit]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleCredits = () => {
    window.location.href = '/credit';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setUserCredit(null);
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('napstopper@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format credit display
  const formatCredit = (credit) => {
    if (credit === null || credit === undefined) return 'Loading...';
    return credit.toLocaleString();
  };

  // Check if user has zero credits
  const hasZeroCredits = userCredit === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left spacer for centering */}
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={handleCredits}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    hasZeroCredits 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {loadingCredit ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : hasZeroCredits ? (
                    `Get Credits: ${formatCredit(userCredit)}`
                  ) : (
                    `Credits: ${formatCredit(userCredit)}`
                  )}
                </button>
              )}
            </div>
            
            {/* Centered Title */}
            <button onClick={handleHome} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-lg">
                <Image 
                  src="/logo.png" 
                  alt="NapStopper Logo" 
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                NapStopper
              </h1>
            </button>
            
            {/* Right side - Login button or User menu */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-1.5 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium truncate max-w-32">
                      {user.email}
                    </span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Gift className="w-4 h-4" />
                    <span>Get 21,600 min free!</span>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      {/* Zero Credits Alert */}
      {user && hasZeroCredits && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-red-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-2 rounded-full">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">No Credits Remaining</h3>
                  <p className="text-red-700 text-sm">You have 0 credits left. Purchase more credits to continue using the ping service.</p>
                </div>
              </div>
              <button
                onClick={handleCredits}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Get in <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have questions about NapStopper? Need help with your application? We're here to help!
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto">
          <div className="text-center">
            {/* Mail Icon */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Mail className="w-10 h-10 text-orange-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Contact Us
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              If you have any queries, questions, or need support with NapStopper, feel free to reach out to us via email.
            </p>
            
            {/* Email Section */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-orange-500 p-2 rounded-full">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-orange-800">Email Us</h4>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <a 
                  href="mailto:napstopper@gmail.com"
                  className="text-xl font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  napstopper@gmail.com
                </a>
                <button
                  onClick={copyEmailToClipboard}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-lg transition-colors"
                  title="Copy email address"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              
              {copied && (
                <p className="text-orange-700 text-sm mt-2 font-medium">
                  Email address copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">What can we help you with?</h4>
            </div>
            <div className="text-gray-600 text-sm space-y-2">
              <p>• Technical support and troubleshooting</p>
              <p>• Questions about pricing and credits</p>
              <p>• Integration help with your applications</p>
              <p>• Feature requests and feedback</p>
              <p>• General inquiries about NapStopper</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center">
          <button
            onClick={handleHome}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-lg">
                <Image 
                  src="/logo.png" 
                  alt="NapStopper Logo" 
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">NapStopper</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Keep your free-tier applications running 24/7. Login to get 21,600 minutes of free credits!
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 NapStopper. Made with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}