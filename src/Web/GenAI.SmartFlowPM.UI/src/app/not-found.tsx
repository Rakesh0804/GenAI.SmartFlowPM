'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, RefreshCcw } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-[180px] md:text-[220px] font-black text-transparent bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text leading-none animate-bounce-slow">
            404
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Floating Circle 1 */}
            <div className="absolute top-4 left-8 w-4 h-4 bg-primary-300 rounded-full animate-float-1"></div>
            {/* Floating Circle 2 */}
            <div className="absolute top-12 right-12 w-3 h-3 bg-secondary-300 rounded-full animate-float-2"></div>
            {/* Floating Circle 3 */}
            <div className="absolute bottom-8 left-16 w-5 h-5 bg-yellow-300 rounded-full animate-float-3"></div>
            {/* Floating Circle 4 */}
            <div className="absolute bottom-16 right-8 w-3 h-3 bg-pink-300 rounded-full animate-float-1"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Animated Character/Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-xl animate-pulse-gentle">
                <Search className="w-16 h-16 text-primary-500 animate-wiggle" />
              </div>
              {/* Question marks floating around */}
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce-slow delay-100">❓</div>
              <div className="absolute -bottom-2 -left-2 text-xl animate-bounce-slow delay-300">❔</div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Oops! Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto animate-fade-in-up animation-delay-200">
            Looks like you've ventured into uncharted territory! The page you're looking for seems to have taken a coffee break.
          </p>

          {/* Fun Facts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8 animate-fade-in-up animation-delay-400">
            <div className="text-sm text-gray-500 mb-2">Fun Fact:</div>
            <div className="text-gray-700 italic">
              "404" comes from the room number where the original web server was located at CERN! 🚀
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button
              onClick={handleGoHome}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <Home className="w-5 h-5 group-hover:animate-bounce" />
              <span>Go Home</span>
            </button>
            
            <button
              onClick={handleGoBack}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-primary-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Alternative Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up animation-delay-800">
            <p className="text-sm text-gray-500 mb-4">Still lost? Try these:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Dashboard
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => router.push('/projects')}
                className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Projects
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => router.push('/teams')}
                className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Teams
              </button>
              <span className="text-gray-300">•</span>
              <button 
                onClick={() => router.push('/timetracker')}
                className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Time Tracker
              </button>
            </div>
          </div>
        </div>

        {/* Refresh Hint */}
        <div className="mt-12 animate-fade-in-up animation-delay-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <RefreshCcw className="w-4 h-4" />
            <span>Try refreshing if you think this is a mistake</span>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Large floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-200/30 rounded-full animate-float-slow animation-delay-2000"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-yellow-200/30 rounded-full animate-float-slow animation-delay-4000"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-pink-200/30 rounded-full animate-float-slow animation-delay-6000"></div>
      </div>
    </div>
  );
}
