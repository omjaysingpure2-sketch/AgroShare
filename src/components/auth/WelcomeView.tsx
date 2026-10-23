import React from 'react';
import { Tractor, ShieldCheck, Calendar, Sparkles, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WelcomeViewProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onContinueAsGuest: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onGoToLogin,
  onGoToRegister,
  onContinueAsGuest,
}) => {
  const { switchDemoUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F8F4] via-white to-[#E8F3EC] flex flex-col justify-between">
      {/* Top Welcome Bar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0B462C] to-emerald-600 flex items-center justify-center text-white shadow-md">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0B462C] tracking-tight">AgriShare</h1>
            <p className="text-xs text-gray-500 font-medium">Share Equipment, Grow Together.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToLogin}
            className="px-4 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            Login
          </button>
          <button
            onClick={onGoToRegister}
            className="px-5 py-2 text-sm font-semibold bg-[#0B462C] hover:bg-[#125838] text-white rounded-xl shadow-md transition-all"
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Phase 1 • Verified Farm Equipment Sharing</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
            Better Equipment.{' '}
            <span className="text-[#0B462C] underline decoration-emerald-400 decoration-wavy decoration-2">
              Smarter Farming.
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Connect directly with verified equipment owners across Indian farming districts. Rent tractors, rotavators, seed drills, and harvesters at transparent daily rates.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onGoToRegister}
              className="px-7 py-3.5 bg-[#0B462C] hover:bg-[#125838] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 flex items-center space-x-2.5 transition-transform active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onGoToLogin}
              className="px-7 py-3.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold border border-emerald-300 rounded-xl shadow-xs transition-colors"
            >
              Login to Account
            </button>
          </div>

          {/* Quick Demo Shortcuts for instant evaluation */}
          <div className="pt-4 border-t border-emerald-100">
            <p className="text-xs text-gray-500 font-medium mb-2.5">
              Quick preview with ready-to-test accounts:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  switchDemoUser('farmer');
                  onContinueAsGuest();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1.5"
              >
                <span>🧑‍🌾 Enter as Rohit Patil (Farmer)</span>
              </button>
              <button
                onClick={() => {
                  switchDemoUser('owner');
                  onContinueAsGuest();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1.5"
              >
                <span>🚜 Enter as Rameshwar (Equipment Owner)</span>
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2.5 text-xs text-gray-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Affordable Equipment Access</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-gray-700 font-medium">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Easy Online Booking</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-gray-700 font-medium">
              <Users className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Connected Farming Community</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card matching tractor theme */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white p-6">
            <img
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80"
              alt="Farm tractor"
              className="w-full h-64 sm:h-72 object-cover rounded-2xl mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Platform
                </span>
                <span className="text-xs text-emerald-200 font-medium">Pan-India Support</span>
              </div>
              <h3 className="text-lg font-bold text-white">Smart Farm Equipment Sharing & Scheduling</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Save capital on expensive machinery. Rent high-performance tractors, cultivators, and harvesters on-demand.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-gray-500 border-t border-emerald-100">
        AgriShare • Share Equipment, Grow Together • Designed for Indian Agriculture
      </footer>
    </div>
  );
};
