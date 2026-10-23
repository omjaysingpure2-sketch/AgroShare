import React, { useState } from 'react';
import { Settings, Bell, MapPin, Lock, Shield, LogOut, CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsTab: React.FC = () => {
  const { user, logout, resetPassword } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ error: 'Passwords do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    // Simulating token update for current session
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'current_user_token', newPassword, email: user?.email }),
    });

    setIsUpdatingPassword(false);
    setPasswordStatus({ success: 'Password successfully updated!' });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordStatus(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
          <Settings className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Account & Application Settings</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure alerts, security parameters, location radius, and session controls.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center">
          <Bell className="w-4 h-4 text-emerald-700 mr-2" />
          Notification Alerts
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Equipment Booking Alerts</span>
              <span className="text-[11px] text-gray-500">
                Receive notifications when owners approve/decline requests or farmers book your machinery.
              </span>
            </div>
            <input
              type="checkbox"
              checked={bookingAlerts}
              onChange={(e) => setBookingAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Weather & Pest Warning Bulletins</span>
              <span className="text-[11px] text-gray-500">
                Receive district-level alerts for unexpected pre-monsoon showers or pest flare-ups.
              </span>
            </div>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* Security & Password Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center">
          <Lock className="w-4 h-4 text-emerald-700 mr-2" />
          Security & Password
        </h3>

        {passwordStatus?.success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{passwordStatus.success}</span>
          </div>
        )}

        {passwordStatus?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordStatus.error}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword || !newPassword}
            className="px-4 py-2 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40"
          >
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Session & Sign Out */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Session Management</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Signed in as <strong>{user?.fullName}</strong> ({user?.email}).
          </p>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of AgriShare</span>
        </button>
      </div>
    </div>
  );
};
