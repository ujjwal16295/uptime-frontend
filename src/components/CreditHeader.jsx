"use client"
import React, { useState, useEffect } from 'react';
import { Gift, User, LogOut, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust path as needed

export default function CreditHeader() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.href = '/login';
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button */}
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            {/* Centered Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Credits
              </h1>
            </div>
            
            {/* Right side - Loading */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button */}
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            {/* Centered Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Credits
              </h1>
            </div>
            
            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
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
                <div className="text-gray-500">Not signed in</div>
              )}
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </>
  );
}