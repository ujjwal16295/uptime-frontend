"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { User, LogOut, Gift, ChevronDown, Info, Mail, RotateCcw, Activity } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase'; // Adjust path as needed
import { ChangeCredit } from '../store/CreditSlice'; // Adjust path as needed
import { clearCreditSession } from '../utils/sessionStorage'; // Adjust path as needed
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [creditFetchError, setCreditFetchError] = useState(false);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { creditDetails, success } = useSelector((state) => state.credit);

  // Backend API base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Function to fetch user credit from backend
  const fetchUserCredit = useCallback(async (email, forceRefetch = false) => {
    // Don't fetch if already successful and not forcing refetch
    if (success && !forceRefetch) {
      return;
    }

    setLoadingCredit(true);
    setCreditFetchError(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/credit/${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        // Update Redux store with fetched credit and mark as successful
        dispatch(ChangeCredit({ 
          creditDetails: data.data.credit, 
          success: true 
        }));
      } else if (response.status === 404) {
        // User not found, set default credit and mark as successful
        dispatch(ChangeCredit({ 
          creditDetails: 21600, 
          success: true 
        }));
      } else {
        console.error('Failed to fetch user credit');
        setCreditFetchError(true);
        // Keep success as false and set default credit
        dispatch(ChangeCredit({ 
          creditDetails: 21600, 
          success: false 
        }));
      }
    } catch (error) {
      console.error('Error fetching user credit:', error);
      setCreditFetchError(true);
      // Keep success as false and set default credit
      dispatch(ChangeCredit({ 
        creditDetails: 21600, 
        success: false 
      }));
    } finally {
      setLoadingCredit(false);
    }
  }, [API_BASE_URL, dispatch, success, creditDetails]);

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
        // Clear session storage and reset credit state when user logs out
        clearCreditSession();
        dispatch(ChangeCredit({ 
          creditDetails: 21600, 
          success: false 
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserCredit, dispatch]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleCredits = () => {
    window.location.href = '/credit';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    // Clear session storage and reset credit state
    clearCreditSession();
    dispatch(ChangeCredit({ 
      creditDetails: 21600, 
      success: false 
    }));
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

  // Navigate to home page
  const handleHomeClick = () => {
    window.location.href = '/';
  };

  // Handle credit reload
  const handleCreditReload = () => {
    if (user?.email) {
      fetchUserCredit(user.email, true); // Force refetch
    }
  };

  // Format credit display
  const formatCredit = (credit) => {
    if (credit === null || credit === undefined) return 'Loading...';
    return credit.toLocaleString();
  };

  // Check if user has zero credits
  const hasZeroCredits = creditDetails === 0;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left spacer for centering */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
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
                      `Get Credits: ${formatCredit(creditDetails)}`
                    ) : (
                      `Credits: ${formatCredit(creditDetails)}`
                    )}
                  </button>
                  
                  {/* Show reload button if credit fetch failed */}
                  {creditFetchError && !loadingCredit && (
                    <button
                      onClick={handleCreditReload}
                      className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      title="Reload credits"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
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
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Activity className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
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