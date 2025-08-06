"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Clock, Code, Globe, CheckCircle, Copy, Server, User, LogOut, Gift, AlertCircle, ChevronDown, Info, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust path as needed
import Image from 'next/image';

export default function KeepAlivePingService() {
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');
  const [backendUrl, setBackendUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false); // New state for more menu
  const [userCredit, setUserCredit] = useState(null);
  const [loadingCredit, setLoadingCredit] = useState(false);

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

  const codeExamples = {
    nodejs: `app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Your API is running',
    timestamp: new Date().toISOString()
  });
});`,
    python: `@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Your API is running',
        'timestamp': datetime.utcnow().isoformat()
    })`,
    java: `@GetMapping("/api/health")
public ResponseEntity<Map<String, Object>> healthCheck() {
    Map<String, Object> response = new HashMap<>();
    response.put("status", "OK");
    response.put("message", "Your API is running");
    response.put("timestamp", Instant.now().toString());
    return ResponseEntity.ok(response);
}`,
    php: `Route::get('/api/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'Your API is running',
        'timestamp' => now()->toISOString()
    ]);
});`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit function to add URL to backend
  const handleSubmit = async () => {
    if (!user?.email) {
      setSubmitMessage({
        type: 'error',
        text: 'Please login to add your application URL'
      });
      return;
    }

    if (!backendUrl.trim()) {
      setSubmitMessage({
        type: 'error',
        text: 'Please enter a valid URL'
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(backendUrl);
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Please enter a valid URL (e.g., https://your-app.com/api/health)'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          link: backendUrl.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: data.message || 'Your application has been added successfully! We&apos;ll start pinging it every 10 minutes.'
        });
        setBackendUrl(''); // Clear the input
        
        // Refresh user credit after successful submission
        await fetchUserCredit(user.email);
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.message || 'Failed to add your application. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleCredits = () => {
    window.location.href = '/credit';
  };

  const handleAboutUs = () => {
    window.location.href = '/aboutus';
    setShowMoreMenu(false);
  };

  const handleContactUs = () => {
    window.location.href = '/contactus';
    setShowMoreMenu(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setUserCredit(null);
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
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
      <div className="flex items-center space-x-3">
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
      </div>
      
      {/* Right side - Always show More dropdown + Login/User menu */}
      <div className="flex items-center space-x-4">
        {/* More Menu Dropdown - Always visible */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 font-medium">More</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* More Dropdown Menu */}
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
              {/* Add Dashboard option for logged-in users */}
              {user && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleDashboard}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Server className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

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

      {/* Click outside to close menus */}
      {(showUserMenu || showMoreMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowMoreMenu(false);
          }}
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
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Keep Your Apps <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Always Awake</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Prevent your free-tier deployments from going to sleep on Render, Railway, and other platforms. 
            We ping your app every 10 minutes to keep it running smoothly.
          </p>
          
          {/* Login CTA for non-authenticated users */}
          {!user && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Get Started Free!</h3>
              </div>
              <p className="text-green-700 mb-4">
                Login to get <strong>21,600 minutes</strong> of free credits - that&apos;s <strong>15 days</strong> of continuous pinging!
              </p>
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login & Get Free Credits
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Pings every 10 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>21,600 min free credits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Works with all platforms</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic Pinging</h3>
            <p className="text-gray-600">
              We automatically ping your application every 10 minutes to prevent it from going into sleep mode.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Credits</h3>
            <p className="text-gray-600">
              Get 21,600 minutes of free credits when you sign up - enough for 15 days of continuous monitoring.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Agnostic</h3>
            <p className="text-gray-600">
              Works with Render, Railway, Heroku, and any other platform that puts apps to sleep.
            </p>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Setup in <span className="text-orange-600">3 Easy Steps</span>
          </h3>
          
          {/* Step 1 */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Add Health Check Endpoint</h4>
            </div>
            
            <p className="text-gray-600 mb-6 ml-12">
              Add this health check endpoint to your backend application:
            </p>
            
            {/* Language Selector */}
            <div className="ml-12 mb-4">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg inline-flex">
                {Object.keys(codeExamples).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Code Block */}
            <div className="ml-12 relative">
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-green-400 text-sm">
                  <code>{codeExamples[selectedLanguage]}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Deploy Your Application</h4>
            </div>
            <p className="text-gray-600 ml-12">
              Deploy your application to your preferred platform (Render, Railway, Heroku, etc.) and make sure the health endpoint is accessible.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Register Your URL</h4>
            </div>
            
            <div className="ml-12">
              <p className="text-gray-600 mb-6">
                Enter your backend URL below and we&apos;ll start pinging it every 10 minutes:
              </p>
              
              <div className="max-w-2xl">
                <div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                        placeholder="https://your-app.onrender.com/api/health"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                          !user || hasZeroCredits ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                        }`}
                        disabled={isSubmitting || !user || hasZeroCredits}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {!user ? (
                          <span className="text-orange-600 font-medium">
                            Please login to register your application and start using the service
                          </span>
                        ) : hasZeroCredits ? (
                          <span className="text-red-600 font-medium">
                            You need credits to add applications. Click &ldquo;Get Credits&rdquo; to purchase more.
                          </span>
                        ) : (
                          "Make sure to include the full URL to your health endpoint"
                        )}
                      </p>
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !user || !backendUrl.trim() || hasZeroCredits}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        'Start Pinging'
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Success/Error Message */}
                {submitMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    submitMessage.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {submitMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                          <span className="text-red-600 text-xs font-bold">!</span>
                        </div>
                      )}
                      <p className="font-medium">{submitMessage.text}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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