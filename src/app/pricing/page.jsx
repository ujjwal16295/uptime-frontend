"use client"
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Globe, 
  Gift, 
  Zap, 
  BarChart3, 
  Timer, 
  Shield,
  Star,
  ArrowRight,
  RefreshCw,
  Wrench,
  LogIn
} from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Control variable for development status
  const isProPlanUnderDevelopment = false; // Set to true to show "Under Development"

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  const features = {
    free: [
      { icon: Globe, text: "Up to 3 URLs", included: true },
      { icon: Clock, text: "Ping every 10 minutes", included: true },
      { icon: RefreshCw, text: "Manual credit requests", included: true, note: "Add free credits through site" },
      { icon: X, text: "Unlimited monitoring", included: false },
      { icon: X, text: "Response time charts", included: false },
      { icon: X, text: "6-minute pings", included: false }
    ],
    paid: [
      { icon: Globe, text: "Unlimited URLs", included: true },
      { icon: Zap, text: "Ping every 6 minutes", included: true },
      { icon: Check, text: "Unlimited credits", included: true },
      { icon: BarChart3, text: "Response time charts", included: true },
      { icon: Shield, text: "Priority support", included: true },
    ]
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleUpgrade = async () => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to upgrade to Pro plan.');
      return;
    }

    try {
      // Use the actual user email from authentication
      const userEmail = user.email;
      
      // Create order on backend
      const response = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail,
          plan: 'monthly' 
        }),
      });
      
      const { order, subscription } = await response.json();
      
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add this to your .env
        subscription_id: subscription.id,
        name: 'NapStopper',
        description: 'Pro Plan Monthly Subscription',
        handler: async function (response) {
          // Send payment details to backend for verification
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              email: userEmail
            }),
          });
          
          if (verifyResponse.ok) {
            alert('Payment successful! Your account has been upgraded.');
            // Refresh page or update UI state
            window.location.reload();
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#ea580c'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Determine button state and handler
  const getProPlanButtonConfig = () => {
    if (loading) {
      return {
        disabled: true,
        text: 'Loading...',
        icon: null,
        handler: null,
        className: 'bg-gray-400 cursor-not-allowed'
      };
    }

    if (isProPlanUnderDevelopment) {
      return {
        disabled: true,
        text: 'Coming Soon',
        icon: <Wrench className="w-4 h-4 mr-2 inline" />,
        handler: null,
        className: 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
      };
    }

    if (!user) {
      return {
        disabled: false,
        text: 'Login to Upgrade',
        icon: <LogIn className="w-4 h-4 mr-2 inline" />,
        handler: handleLogin,
        className: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 shadow-lg'
      };
    }

    return {
      disabled: false,
      text: 'Upgrade to Pro',
      icon: <ArrowRight className="w-4 h-4 ml-2 inline" />,
      handler: handleUpgrade,
      className: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 shadow-lg'
    };
  };

  const buttonConfig = getProPlanButtonConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Simple <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your monitoring needs. Start free and upgrade when you're ready for more power.
          </p>
          
          {/* Authentication Status Indicator */}
          {!loading && (
            <div className="flex justify-center mb-8">
              {user ? (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Logged in as {user.email}</span>
                </div>
              ) : (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login required to upgrade to Pro</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden relative h-fit">
            <div className="p-8">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 text-lg">/forever</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900 text-lg mb-4">What's included:</h4>
                {features.free.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${
                        feature.included 
                          ? 'bg-green-100' 
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          feature.included 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <span className={`${
                          feature.included 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                        }`}>
                          {feature.text}
                        </span>
                        {feature.note && (
                          <p className="text-xs text-gray-500 mt-1">{feature.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free Credit Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">21,600 Free Minutes</span>
                </div>
                <p className="text-green-700 text-sm">
                  Get started with 15 days of monitoring. Need more? Just visit our site and click "Add Credit" for more free minutes!
                </p>
              </div>
            </div>
          </div>

          {/* Paid Plan */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden relative h-fit">
            {/* Under Development Badge */}
            {isProPlanUnderDevelopment && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Wrench className="w-3 h-3" />
                  <span>Under Development</span>
                </div>
              </div>
            )}
            
            {/* Authentication Required Badge */}
            {!user && !loading && !isProPlanUnderDevelopment && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <LogIn className="w-3 h-3" />
                  <span>Login Required</span>
                </div>
              </div>
            )}
            
            <div className="p-8 pt-12">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
                <p className="text-gray-600 mb-6">
                  {isProPlanUnderDevelopment 
                    ? "Coming soon with powerful features" 
                    : !user 
                    ? "Login required to access Pro features"
                    : "For serious monitoring needs"
                  }
                </p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$1</span>
                  <span className="text-gray-500 text-lg">/monthly</span>
                </div>
                
                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${buttonConfig.className}`}
                  onClick={buttonConfig.handler}
                  disabled={buttonConfig.disabled}
                >
                  {buttonConfig.icon}
                  {buttonConfig.text}
                </button>
                
                {(isProPlanUnderDevelopment || (!user && !loading)) && (
                  <p className="text-xs text-gray-500 mt-2">
                    {isProPlanUnderDevelopment 
                      ? "We're working hard to bring you these amazing features!"
                      : "Please log in to access Pro plan features"
                    }
                  </p>
                )}
              </div>

              {/* Features */}
              <div className={`space-y-4 mb-6 ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'opacity-75' : ''}`}>
                <h4 className="font-semibold text-gray-900 text-lg mb-4">Everything in Pro:</h4>
                {features.paid.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-orange-100 p-1 rounded-full">
                        <IconComponent className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-900">{feature.text}</span>
                        {feature.note && (
                          <p className="text-xs text-gray-500 mt-1">{feature.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pro Features Highlight */}
              <div className={`space-y-4 ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'opacity-75' : ''}`}>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Response Time Charts</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Beautiful charts showing your app's performance over time. Track trends and spot issues before they become problems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Pro {(isProPlanUnderDevelopment || (!user && !loading)) && (
                        <span className="text-xs text-amber-600">
                          {isProPlanUnderDevelopment ? "(Coming Soon)" : "(Login Required)"}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Number of URLs</td>
                    <td className="py-4 px-6 text-center text-gray-600">Up to 3</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'text-gray-500' : 'text-orange-600'}`}>
                        Unlimited
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">Ping Frequency</td>
                    <td className="py-4 px-6 text-center text-gray-600">Every 10 min</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'text-gray-500' : 'text-orange-600'}`}>
                        Every 6 min
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Monitoring Credits</td>
                    <td className="py-4 px-6 text-center text-gray-600">Manual requests</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'text-gray-500' : 'text-orange-600'}`}>
                        Unlimited
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">Response Time Charts</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className={`w-5 h-5 mx-auto ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'text-gray-500' : 'text-orange-600'}`} />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-gray-900">Priority Support</td>
                    <td className="py-4 px-6 text-center">
                      <X className="w-5 h-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className={`w-5 h-5 mx-auto ${(isProPlanUnderDevelopment || (!user && !loading)) ? 'text-gray-500' : 'text-orange-600'}`} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}