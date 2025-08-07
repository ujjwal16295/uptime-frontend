"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Gift, CheckCircle, Clock, Globe, Server } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import { ChangeCredit } from '../../store/CreditSlice'; // Adjust path as needed
import { clearCreditSession } from '../../utils/sessionStorage'; // Adjust path as needed

// Constants
const CREDIT_TO_ADD = 43200;
const MAX_CREDIT_LIMIT = 70000;

export default function CreditPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [isAddingCredit, setIsAddingCredit] = useState(false);
  const [addCreditMessage, setAddCreditMessage] = useState(null);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { creditDetails, success } = useSelector((state) => state.credit);

  // Backend API base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Helper functions for credit limit checking
  const canAddCredits = () => {
    if (!creditDetails || loadingCredit) return false;
    return (creditDetails + CREDIT_TO_ADD) <= MAX_CREDIT_LIMIT;
  };

  const getRemainingCapacity = () => {
    if (!creditDetails) return MAX_CREDIT_LIMIT;
    return Math.max(0, MAX_CREDIT_LIMIT - creditDetails);
  };

  // Function to fetch user credit from backend
  const fetchUserCredit = useCallback(async (email) => {
    // Don't fetch if already successful
    if (success) {
      return;
    }

    setLoadingCredit(true);
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
          creditDetails: 0, 
          success: true 
        }));
      } else {
        console.error('Failed to fetch user credit');
        // Keep success as false and set default credit
        dispatch(ChangeCredit({ 
          creditDetails: 21600, 
          success: false 
        }));
      }
    } catch (error) {
      console.error('Error fetching user credit:', error);
      // Keep success as false and set default credit
      dispatch(ChangeCredit({ 
        creditDetails: 21600, 
        success: false 
      }));
    } finally {
      setLoadingCredit(false);
    }
  }, [API_BASE_URL, dispatch, success]);

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      // If no user, redirect to login
      if (!user) {
        window.location.href = '/login';
        return;
      }
      
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
      
      // Redirect to login if no user
      if (!session?.user) {
        window.location.href = '/login';
        return;
      }
      
      // Fetch credit when user logs in
      if (session?.user?.email) {
        fetchUserCredit(session.user.email);
      } else {
        // Clear session storage and reset credit state
        clearCreditSession();
        dispatch(ChangeCredit({ 
          creditDetails: 21600, 
          success: false 
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserCredit, dispatch]);

  // Enhanced function to add credits with 70k limit handling
  const handleAddCredit = async () => {
    if (!user?.email) {
      setAddCreditMessage({
        type: 'error',
        text: 'Please login to add credits'
      });
      return;
    }

    // Check if adding credits would exceed limit (client-side prevention)
    if (!canAddCredits()) {
      const remainingCapacity = getRemainingCapacity();
      let errorMessage;
      
      if (remainingCapacity > 0) {
        errorMessage = `Cannot add 43,200 minutes. You can only add ${remainingCapacity.toLocaleString()} more minutes to stay within the ${MAX_CREDIT_LIMIT.toLocaleString()} minute limit.`;
      } else {
        errorMessage = `You've reached the maximum credit limit of ${MAX_CREDIT_LIMIT.toLocaleString()} minutes. No additional credits can be added.`;
      }
      
      setAddCreditMessage({
        type: 'error',
        text: errorMessage
      });
      return;
    }

    setIsAddingCredit(true);
    setAddCreditMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/credit/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAddCreditMessage({
          type: 'success',
          text: `Successfully added 43,200 minutes! Your new balance is ${data.data.new_credit.toLocaleString()} minutes.`
        });
        
        // Update Redux store with new credit value and mark as successful
        dispatch(ChangeCredit({ 
          creditDetails: data.data.new_credit, 
          success: true 
        }));
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        // Handle different types of errors
        let errorMessage = 'Failed to add credits. Please try again.';
        
        // Check for specific error types
        if (response.status === 400 && data.error === 'Credit limit exceeded') {
          // Handle 70k limit exceeded error
          const remainingCapacity = data.data?.remaining_capacity || 0;
          
          if (remainingCapacity > 0) {
            errorMessage = `Credit limit reached! You can only add ${remainingCapacity.toLocaleString()} more minutes. Your current balance is ${data.data.current_credit.toLocaleString()} minutes (max: ${data.data.maximum_allowed.toLocaleString()}).`;
          } else {
            errorMessage = `You've reached the maximum credit limit of ${data.data?.maximum_allowed?.toLocaleString() || '70,000'} minutes. No additional credits can be added.`;
          }
        } else if (response.status === 404) {
          errorMessage = 'User not found. Please add a URL first to create an account.';
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        setAddCreditMessage({
          type: 'error',
          text: errorMessage
        });
      }
    } catch (error) {
      console.error('Error adding credits:', error);
      setAddCreditMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsAddingCredit(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  // Format credit display
  const formatCredit = (credit) => {
    if (credit === null || credit === undefined) return 'Loading...';
    return credit.toLocaleString();
  };

  // Convert minutes to days for display
  const convertMinutesToDays = (minutes) => {
    if (minutes === null || minutes === undefined) return 'Loading...';
    const days = Math.floor(minutes / 1440); // 1440 minutes in a day
    const remainingHours = Math.floor((minutes % 1440) / 60);
    
    if (days > 0) {
      return remainingHours > 0 ? `${days} days, ${remainingHours} hours` : `${days} days`;
    } else if (remainingHours > 0) {
      return `${remainingHours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Credits</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Add more credits to keep your applications running continuously without interruption.
          </p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Current Balance</h3>
            
            {loadingCredit ? (
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-6 h-6 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600">Loading your balance...</span>
              </div>
            ) : (
              <div className="mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                  {formatCredit(creditDetails)}
                </div>
                <div className="text-lg text-gray-600">
                  minutes remaining
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  That&apos;s approximately <strong>{convertMinutesToDays(creditDetails)}</strong> of continuous monitoring
                </div>
              </div>
            )}

            {/* Usage Info */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-orange-50 rounded-lg p-4">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-orange-800">Ping Frequency</div>
                <div className="text-sm text-orange-600">Every 10 minutes</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <Server className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-blue-800">Platform Support</div>
                <div className="text-sm text-blue-600">All hosting platforms</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <Globe className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-800">Reliability</div>
                <div className="text-sm text-green-600">99.9% uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Credits Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add More Credits</h3>
            
            {/* Credit Package */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8 max-w-lg mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-green-800">Free Credit Package</h4>
              </div>
              
              <div className="text-4xl font-bold text-green-700 mb-2">43,200 Minutes</div>
              <div className="text-lg text-green-600 mb-4">30 Days of Continuous Monitoring</div>
              
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>✓ Unlimited applications</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✓ 10-minute ping intervals</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✓ All platform support</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✓ Email notifications</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Button with Credit Limit Awareness */}
              <button
                onClick={handleAddCredit}
                disabled={isAddingCredit || loadingCredit || !canAddCredits()}
                className={`w-full px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg transform ${
                  canAddCredits() && !isAddingCredit && !loadingCredit
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAddingCredit ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Credits...</span>
                  </div>
                ) : loadingCredit ? (
                  'Loading...'
                ) : (
                  'Add 43,200 Minutes Free'
                )}
              </button>

              {/* Credit Information Section */}
              {!loadingCredit && creditDetails !== null && (
                <div className="mt-6 text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Current balance:</span>
                      <span className="font-medium">{formatCredit(creditDetails)} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Maximum allowed:</span>
                      <span className="font-medium">{MAX_CREDIT_LIMIT.toLocaleString()} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Remaining capacity:</span>
                      <span className={`font-medium ${getRemainingCapacity() === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getRemainingCapacity().toLocaleString()} minutes
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar showing credit usage */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Credit Usage</span>
                      <span>{((creditDetails / MAX_CREDIT_LIMIT) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          creditDetails / MAX_CREDIT_LIMIT < 0.8 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : creditDetails / MAX_CREDIT_LIMIT < 0.95 
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${Math.min((creditDetails / MAX_CREDIT_LIMIT) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    {/* Credit Status Message */}
                    {creditDetails / MAX_CREDIT_LIMIT >= 0.95 && (
                      <div className="mt-2 text-xs text-red-600 font-medium">
                        ⚠️ You're approaching the credit limit
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Success/Error Message */}
            {addCreditMessage && (
              <div className={`mb-6 p-4 rounded-lg max-w-lg mx-auto ${
                addCreditMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  {addCreditMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                  )}
                  <p className="font-medium">{addCreditMessage.text}</p>
                </div>
                {addCreditMessage.type === 'success' && (
                  <p className="text-sm text-green-600 mt-2">
                    Redirecting you to the home page...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}