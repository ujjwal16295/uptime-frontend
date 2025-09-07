"use client"
import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, Activity, Clock, Globe, AlertCircle, RefreshCw, Badge, X, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import { useSelector } from 'react-redux';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [reactivatingSubscription, setReactivatingSubscription] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const plan = useSelector(state => state.plan.value);

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
      
      // Automatically fetch user links if user is logged in
      if (user?.email) {
        fetchUserLinks(user.email);
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
      
      // Fetch user data when user logs in
      if (session?.user?.email) {
        fetchUserLinks(session.user.email);
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleHome = () => {
    window.location.href = '/';
  };

  const fetchUserLinks = async (email) => {
    if (!email) {
      setError('User email not found');
      return;
    }

    setLoadingData(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(email)}/links`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      setUserData(data.data);
    } catch (err) {
      console.error('Error fetching user links:', err);
      setError(err.message || 'Failed to load your dashboard');
      setUserData(null);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!user?.email) {
      setError('User email not found');
      return;
    }

    setDeletingId(linkId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete link');
      }

      // Refresh the user data after successful deletion
      await fetchUserLinks(user.email);
      
    } catch (err) {
      console.error('Error deleting link:', err);
      setError(err.message || 'Failed to delete link');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.email) {
      setError('User email not found');
      return;
    }

    setCancellingSubscription(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }

      setSuccessMessage(data.details || 'Your subscription has been scheduled for cancellation. You will continue to have access until the end of your current billing period.');
      setShowCancelModal(false);
      
      // Refresh user data to reflect the change
      await fetchUserLinks(user.email);
      
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!user?.email) {
      setError('User email not found');
      return;
    }

    setReactivatingSubscription(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscription/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reactivate subscription');
      }

      setSuccessMessage(data.details || 'Your subscription has been reactivated and will continue to renew as normal.');
      setShowReactivateModal(false);
      
      // Refresh user data to reflect the change
      await fetchUserLinks(user.email);
      
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError(err.message || 'Failed to reactivate subscription');
    } finally {
      setReactivatingSubscription(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const getSubscriptionStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          color: 'green',
          text: 'Active',
          description: 'Your subscription is active and will renew automatically.'
        };
      case 'scheduled_cancel':
        return {
          color: 'yellow',
          text: 'Scheduled for Cancellation',
          description: 'Your subscription will cancel at the end of the current billing period. You can reactivate it anytime before then.'
        };
      case 'cancelled':
        return {
          color: 'red',
          text: 'Cancelled',
          description: 'Your subscription has been cancelled and you no longer have access to paid features.'
        };
      case 'paused':
        return {
          color: 'blue',
          text: 'Paused',
          description: 'Your subscription is paused. Billing is stopped until you resume.'
        };
      default:
        return {
          color: 'gray',
          text: status || 'Unknown',
          description: 'Subscription status unknown.'
        };
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

  const subscriptionStatus = userData?.user?.subscription_status;
  const statusInfo = getSubscriptionStatusInfo(subscriptionStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Cancel Subscription</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={cancellingSubscription}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel your subscription? Your subscription will be scheduled for cancellation and will:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li>• Continue until the end of your current billing period</li>
                <li>• Stop automatic renewal</li>
                <li>• Downgrade you to the free plan when it expires</li>
                <li>• Allow you to reactivate anytime before it expires</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={cancellingSubscription}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancellingSubscription}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancellingSubscription ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivation Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reactivate Subscription</h3>
              <button
                onClick={() => setShowReactivateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={reactivatingSubscription}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Welcome back! Reactivating your subscription will:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li>• Cancel the scheduled cancellation</li>
                <li>• Resume automatic renewal</li>
                <li>• Continue your paid plan benefits</li>
                <li>• Keep your current billing cycle</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowReactivateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={reactivatingSubscription}
              >
                Cancel
              </button>
              <button
                onClick={handleReactivateSubscription}
                disabled={reactivatingSubscription}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reactivatingSubscription ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Reactivating...
                  </>
                ) : (
                  'Reactivate Subscription'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Your <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitor and manage all your active links in one place.
          </p>

          {/* Loading indicator for initial data fetch */}
          {loadingData && !userData && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />
              <span className="text-gray-600">Loading your dashboard...</span>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* User Stats */}
        {userData && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userData.total_links}</p>
                    <p className="text-gray-600 text-sm">Active Links</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userData.total_pings.toLocaleString()}</p>
                    <p className="text-gray-600 text-sm">Total Pings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{userData.user.credit.toLocaleString()}</p>
                    <p className="text-gray-600 text-sm">Credits Left</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`bg-${statusInfo.color}-100 w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <Badge className={`w-5 h-5 text-${statusInfo.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 capitalize">
                      {plan}
                    </p>
                    <p className="text-gray-600 text-sm">Current Plan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            {plan === 'paid' && subscriptionStatus && (
              <div className={`bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-3xl p-8 shadow-xl mb-8`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-${statusInfo.color}-100 rounded-lg flex items-center justify-center`}>
                        {subscriptionStatus === 'scheduled_cancel' ? (
                          <Calendar className={`w-4 h-4 text-${statusInfo.color}-600`} />
                        ) : subscriptionStatus === 'active' ? (
                          <CheckCircle className={`w-4 h-4 text-${statusInfo.color}-600`} />
                        ) : (
                          <AlertCircle className={`w-4 h-4 text-${statusInfo.color}-600`} />
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Subscription Status: {statusInfo.text}
                      </h2>
                    </div>
                    <p className={`text-${statusInfo.color}-700 mb-4`}>
                      {statusInfo.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    {subscriptionStatus === 'active' && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-6 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                      >
                        Cancel Subscription
                      </button>
                    )}
                    
                    {subscriptionStatus === 'scheduled_cancel' && (
                      <button
                        onClick={() => setShowReactivateModal(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Reactivate Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Links List */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Active Links</h2>
                <button
                  onClick={() => fetchUserLinks(user.email)}
                  disabled={loadingData}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                  {loadingData ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {userData.links.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Links Added Yet</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first URL to keep it alive!</p>
                  <button
                    onClick={handleHome}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add Your First Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.links.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {formatUrl(link.url)}
                            </h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              <span>{link.ping_count.toLocaleString()} pings</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Last: {formatDate(link.last_ping)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Visit Link
                            </a>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500 truncate max-w-xs">
                              {link.url}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          disabled={deletingId === link.id}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          {deletingId === link.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          {deletingId === link.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back to Home Button */}
            <div className="text-center mt-12">
              <button
                onClick={handleHome}
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}