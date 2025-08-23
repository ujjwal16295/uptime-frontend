"use client"
import React, { useState, useEffect } from 'react';
import { Clock, Globe, CheckCircle, Copy, Gift, AlertCircle, Server } from 'lucide-react';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

export default function KeepAlivePingService() {
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');
  const [backendUrl, setBackendUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redux state - only get credit from store
  const { creditDetails } = useSelector((state) => state.credit);

  // Backend API base URL - adjust this to your backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Auth handling useEffect - updated to use backend API
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 Checking for auth session on uptime home page...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          return;
        }

        if (session && session.user) {
          console.log('✅ Found session on uptime home page:', session.user.email);
          setUser(session.user);
          
          // Check if this is a new login that hasn't been processed
          const hasProcessedAuth = localStorage.getItem(`uptime_auth_processed_${session.user.id}`);
          
          if (!hasProcessedAuth) {
            console.log('🔄 Processing new auth session for uptime...');
            await handleUserSession(session);
            localStorage.setItem(`uptime_auth_processed_${session.user.id}`, 'true');
          } else {
            console.log('✅ Auth already processed for this uptime user');
          }
        } else {
          console.log('❌ No session found on uptime homepage');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        setLoading(false);
      }
    };

    // Run immediately
    handleAuthCallback();

    // Also listen for auth state changes (for real-time updates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed on uptime homepage:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in on uptime page:', session.user.email);
        setUser(session.user);
        await handleUserSession(session);
        localStorage.setItem(`uptime_auth_processed_${session.user.id}`, 'true');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out from uptime page');
        setUser(null);
        // Clean up localStorage on signout
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('uptime_auth_processed_')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleUserSession = async (session) => {
    try {
      const user = session.user;
      const email = user.email;
      
      console.log('🔄 Processing uptime user session for:', email);
      
      // Call backend API to handle user authentication/creation
      const response = await fetch(`${API_BASE_URL}/api/users/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Backend user auth error:', data);
        
        if (response.status === 403 && data.error === 'Registration closed') {
          console.log('🚫 User limit reached, signing out...');
          alert(data.message || 'Registration is currently closed. Only 100 people are allowed to join at this time.');
          await supabase.auth.signOut();
          window.location.href = '/login';
          return;
        }
        
        throw new Error(data.message || 'Failed to authenticate user');
      }

      console.log('✅ User successfully processed via backend:', data);
      
      if (data.data.is_new_user) {
        console.log('🎉 New user created with backend API');
      } else {
        console.log('👋 Existing user authenticated via backend API');
      }

    } catch (error) {
      console.error('❌ Error in handleUserSession:', error);
      // You might want to show a user-friendly error message here
    }
  };

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
          text: data.message || 'Your application has been added successfully! We\'ll start pinging it every 10 minutes.'
        });
        setBackendUrl(''); // Clear the input
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

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has zero credits - use value from store
  const hasZeroCredits = creditDetails === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
                Login to get <strong>21,600 minutes</strong> of free credits - that's <strong>15 days</strong> of continuous pinging!
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
              <span>Up to 3 URLs per account</span>
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
              Works with Render, Railway, Heroku, and any other platform that puts apps to sleep. Up to 3 URLs per account.
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
                Enter your backend URL below and we'll start pinging it every 10 minutes:
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
                            You need credits to add applications. Click "Get Credits" to purchase more.
                          </span>
                        ) : (
                          "Make sure to include the full URL to your health endpoint (Maximum 3 URLs per account)"
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
    </div>
  );
}