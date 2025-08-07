"use client"
import { Heart, Target, Zap } from 'lucide-react';
import React from 'react';

export default function AboutUsPage() {
  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
       
            <button
              onClick={handleHome}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          
        </div>
      </section>
    </div>
  );
}