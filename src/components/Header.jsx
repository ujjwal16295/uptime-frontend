"use client"
import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Info, Mail, Activity, CreditCard, FileText, Shield, Code, BarChart3, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust path as needed
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  const handleAboutUs = () => {
    window.location.href = '/aboutus';
  };

  const handleContactUs = () => {
    window.location.href = '/contactus';
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handlePricing = () => {
    window.location.href = '/pricing';
  };

  const handleTerms = () => {
    window.location.href = '/terms';
  };

  const handlePrivacy = () => {
    window.location.href = '/privacy';
  };
  

  
  const handleTestEndPoint = () => {
    window.location.href = '/testendpoint';
  };

  // Navigate to home page
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left spacer for centering */}
            <div className="flex items-center space-x-4">
              {/* Left side content can be added here if needed */}
            </div>
            
            {/* Centered Title - Now Clickable */}
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
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
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Activity className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleAboutUs}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Info className="w-4 h-4" />
                        <span>About Us</span>
                      </button>
                      <button
                        onClick={handlePricing}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pricing</span>
                      </button>
                      <button
                        onClick={handleContactUs}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact Us</span>
                      </button>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleTestEndPoint}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Code className="w-4 h-4" />
                        <span>Test Endpoint</span>
                      </button>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleTerms}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Terms of Service</span>
                      </button>
                      <button
                        onClick={handlePrivacy}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Privacy Policy</span>
                      </button>
                      <hr className="my-2 border-gray-100" />
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

                  {/* Navigation dropdown for non-authenticated users */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNavMenu(!showNavMenu)}
                      className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 font-medium">Menu</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {/* Navigation Dropdown Menu */}
                    {showNavMenu && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <button
                          onClick={handleAboutUs}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <Info className="w-4 h-4" />
                          <span>About Us</span>
                        </button>
                        <button
                          onClick={handleContactUs}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Contact Us</span>
                        </button>
                        <button
                          onClick={handlePricing}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pricing</span>
                        </button>
                        <button
                          onClick={handleTerms}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Terms of Service</span>
                        </button>
                        <button
                          onClick={handlePrivacy}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Privacy Policy</span>
                        </button>
                      </div>
                    )}
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
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showNavMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNavMenu(false);
          }}
        ></div>
      )}
    </>
  );
}