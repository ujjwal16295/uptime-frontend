"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Clock, Code, Globe, CheckCircle, Copy, Server, User, LogOut, Gift, AlertCircle, Heart, Zap, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export default function AboutUsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userCredit, setUserCredit] = useState(null);
  const [loadingCredit, setLoadingCredit] = useState(false);

  // Backend API base URL
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
        setUserCredit(21600);
      } else {
        console.error('Failed to fetch user credit');
        setUserCredit(21600);
      }
    } catch (error) {
      console.error('Error fetching user credit:', error);
      setUserCredit(21600);
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
      
      if (user?.email) {
        fetchUserCredit(user.email);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
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

  // Format credit display
  const formatCredit = (credit) => {
    if (credit === null || credit === undefined) return 'Loading...';
    return credit.toLocaleString();
  };

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

      {/* About Us Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">NapStopper</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about helping developers keep their applications running smoothly on free-tier hosting platforms.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 rounded-2xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h3>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              NapStopper was born out of frustration with free-tier hosting platforms that put applications to sleep 
              after periods of inactivity. As developers, we know how annoying it can be when your demo app takes 
              30+ seconds to wake up, potentially losing visitors and opportunities.
            </p>
            <p className="mb-4">
              We created NapStopper to solve this problem once and for all. Our service automatically pings your 
              applications every 10 minutes, ensuring they stay awake and respond instantly to your users.
            </p>
            <p>
              Whether you're running a portfolio site, API backend, or demo application, NapStopper keeps it 
              running smoothly so you can focus on what matters most - building great software.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To empower developers by eliminating the friction of free-tier limitations, making it easier 
              to showcase and deploy applications without worrying about cold starts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Choose Us</h3>
            <p className="text-gray-600">
              Simple, reliable, and developer-friendly. We offer generous free credits, transparent pricing, 
              and a service that just works - no complex setup or configuration required.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Keep Your Apps Awake?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who trust NapStopper to keep their applications running smoothly.
          </p>
          {!user ? (
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          ) : (
            <button
              onClick={handleHome}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Your App
            </button>
          )}
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