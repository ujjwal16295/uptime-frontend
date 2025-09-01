"use client"
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Globe, Lock, AlertCircle, BarChart3, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

export default function ResponseTimeAnalytics() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [responseTimeData, setResponseTimeData] = useState({});
  const [error, setError] = useState(null);
  const plan = useSelector(state => state.plan.value);

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      
      // If no user, redirect to home
      if (!user) {
        window.location.href = '/';
        return;
      }

      // If user exists and has premium plan, fetch data
      if (user && plan !== 'free') {
        fetchResponseTimeData(user.email);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Redirect to home if no user
      if (!session?.user) {
        window.location.href = '/';
        return;
      }

      // Fetch data if premium user
      if (session?.user && plan !== 'free') {
        fetchResponseTimeData(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [plan]);

  const fetchResponseTimeData = async (email) => {
    setDataLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${email}/response-times?limit=5`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch response time data');
      }

      setResponseTimeData(result.data || {});
    } catch (err) {
      setError(err.message);
      console.error('Error fetching response time data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const formatResponseTime = (time) => {
    if (time < 1000) {
      return `${time}ms`;
    } else {
      return `${(time / 1000).toFixed(2)}s`;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const prepareChartData = (pings) => {
    return pings
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((ping, index) => ({
        index: index + 1,
        response_time: ping.response_time,
        timestamp: ping.timestamp,
        formatted_time: formatTimestamp(ping.timestamp)
      }));
  };

  const getAverageResponseTime = (pings) => {
    if (pings.length === 0) return 0;
    const sum = pings.reduce((acc, ping) => acc + ping.response_time, 0);
    return Math.round(sum / pings.length);
  };

  const getStatusColor = (avgTime) => {
    if (avgTime < 500) return 'text-green-600';
    if (avgTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
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

  const isFreePlan = plan === 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Free Plan Overlay */}
        {isFreePlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature</h2>
              <p className="text-gray-600 mb-6">
                Response Time Analytics is available for premium users only. 
                Upgrade your plan to access detailed performance insights.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`${isFreePlan ? 'blur-sm pointer-events-none' : ''}`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Response Time Analytics</h1>
                <p className="text-gray-600">Monitor and analyze your website performance over time</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {dataLoading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-8 h-8 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading response time data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Error Loading Data</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Analytics Content */}
          {!dataLoading && !error && (
            <div className="space-y-6">
              {Object.keys(responseTimeData).length === 0 ? (
                /* Empty State */
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Response Time Data</h3>
                  <p className="text-gray-600 mb-6">
                    Start monitoring your websites to see response time analytics here.
                  </p>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200"
                  >
                    Add Website to Monitor
                  </button>
                </div>
              ) : (
                /* Response Time Charts */
                <div className="grid gap-6">
                  {Object.entries(responseTimeData).map(([url, pings]) => {
                    const avgTime = getAverageResponseTime(pings);
                    const chartData = prepareChartData(pings);
                    const hasSingleDataPoint = pings.length === 1;

                    return (
                      <div key={url} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
                        {/* Chart Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate max-w-md">{url}</h3>
                              <p className="text-sm text-gray-600">{pings.length} data point{pings.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Avg Response Time</p>
                              <p className={`text-lg font-bold ${getStatusColor(avgTime)}`}>
                                {formatResponseTime(avgTime)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {hasSingleDataPoint ? (
                          /* Single Data Point View */
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <div className="mb-4">
                              <p className="text-2xl font-bold text-gray-900 mb-2">
                                {formatResponseTime(pings[0].response_time)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Recorded on {formatTimestamp(pings[0].timestamp)}
                              </p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                              <div className="flex items-center space-x-2 justify-center">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                  More data needed to plot trend graph
                                </span>
                              </div>
                              <p className="text-xs text-blue-600 mt-1">
                                Wait for more monitoring data to see performance trends
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Multi Data Point Chart */
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                  dataKey="index"
                                  tick={{ fontSize: 12 }}
                                  tickLine={{ stroke: '#e0e0e0' }}
                                />
                                <YAxis 
                                  tick={{ fontSize: 12 }}
                                  tickLine={{ stroke: '#e0e0e0' }}
                                  tickFormatter={(value) => `${value}ms`}
                                />
                                <Tooltip 
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      return (
                                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                          <p className="font-medium text-gray-900">
                                            Response Time: {formatResponseTime(data.response_time)}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            {data.formatted_time}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="response_time" 
                                  stroke="#ea580c"
                                  strokeWidth={2}
                                  dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                                  activeDot={{ r: 6, fill: '#dc2626' }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {/* Stats Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Latest</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatResponseTime(pings[0]?.response_time || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Best</p>
                              <p className="text-sm font-semibold text-green-600">
                                {formatResponseTime(Math.min(...pings.map(p => p.response_time)))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">Worst</p>
                              <p className="text-sm font-semibold text-red-600">
                                {formatResponseTime(Math.max(...pings.map(p => p.response_time)))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}