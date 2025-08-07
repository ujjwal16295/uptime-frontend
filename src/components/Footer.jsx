import Image from 'next/image'
import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
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
      </footer>  )
}
