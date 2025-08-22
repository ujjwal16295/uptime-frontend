"use client"
import React, { useState} from 'react';
import {  CheckCircle, Copy, Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactUsPage() {
  const [copied, setCopied] = useState(false);



  const handleHome = () => {
    window.location.href = '/';
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    // navigator.clipboard.writeText('napstopper@gmail.com');
    navigator.clipboard.writeText('newujjwalpatel@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Get in <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have questions about NapStopper? Need help with your application? We're here to help!
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto">
          <div className="text-center">
            {/* Mail Icon */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto">
              <Mail className="w-10 h-10 text-orange-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Contact Us
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              If you have any queries, questions, or need support with NapStopper, feel free to reach out to us via email.
            </p>
            
            {/* Email Section */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-orange-500 p-2 rounded-full">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-orange-800">Email Us</h4>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <a 
                  href="mailto:napstopper@gmail.com"
                  className="text-xl font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  newujjwalpatel@gmail.com
                </a>
                <button
                  onClick={copyEmailToClipboard}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-lg transition-colors"
                  title="Copy email address"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              
              {copied && (
                <p className="text-orange-700 text-sm mt-2 font-medium">
                  Email address copied to clipboard!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">What can we help you with?</h4>
            </div>
            <div className="text-gray-600 text-sm space-y-2">
              <p>• Technical support and troubleshooting</p>
              <p>• Questions about pricing and credits</p>
              <p>• Integration help with your applications</p>
              <p>• Feature requests and feedback</p>
              <p>• General inquiries about NapStopper</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center">
          <button
            onClick={handleHome}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}