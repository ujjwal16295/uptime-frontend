"use client"
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginHeader() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className='bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'>
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <button
              onClick={handleBack}
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

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>
    </header>
    </div>
  );
}