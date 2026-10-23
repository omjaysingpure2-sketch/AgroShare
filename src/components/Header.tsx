import React, { useState } from 'react';
import { MapPin, Bell, ChevronDown, User, LogOut, Settings as SettingsIcon, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, subSection?: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    user ? `${user.district}, ${user.state}` : 'Pune, Maharashtra'
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.read && onMarkNotificationRead) {
      onMarkNotificationRead(notif.id);
    }
    setShowNotifMenu(false);
    if (notif.type === 'booking') {
      onNavigate('Equipment Booking', 'bookings');
    } else if (notif.type === 'scan' || notif.type === 'soil') {
      onNavigate('MyReports');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tagline matching screenshot */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('Home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center shadow-sm text-white">
              <svg
                className="w-6 h-6"
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
              <div className="text-xl font-bold tracking-tight text-[#0F4E34] flex items-center">
                AgriShare
              </div>
              <p className="text-xs text-gray-500 -mt-0.5 font-medium">
                Share Equipment, Grow Together
              </p>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Location Pill matching screenshot */}
            <button
              onClick={() => setShowLocationModal(!showLocationModal)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span className="truncate max-w-[150px]">{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Notifications Bell matching screenshot */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm text-gray-800">Notifications</span>
                      <span className="text-xs text-emerald-700 font-medium ml-2">{unreadCount} unread</span>
                    </div>
                    {unreadCount > 0 && onMarkAllNotificationsRead && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-1.5">
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block flex-shrink-0" />
                              )}
                              <p className="text-xs font-bold text-gray-800">{notif.title}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 pl-3 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login/Register buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center space-x-2.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600"
                  />
                  <div className="hidden md:block text-left pr-1">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize flex items-center">
                      {user.role === 'farmer' ? 'Farmer' : user.role === 'owner' ? 'Equipment Owner' : 'Admin'}
                      <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 capitalize">
                          {user.role}
                        </span>
                        {user.isEmailVerified ? (
                          <span className="inline-flex items-center text-[10px] text-emerald-600">
                            <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] text-amber-600">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('Profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-gray-500" /> My Profile
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('Dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2 text-gray-500" /> Role Dashboard ({user.role})
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('Settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center"
                      >
                        <SettingsIcon className="w-4 h-4 mr-2 text-gray-500" /> Account Settings
                      </button>
                    </div>

                    {/* Quick Demo Role Switcher for verification */}
                    <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/70">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Quick Demo Switcher
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            switchDemoUser('farmer');
                            setShowProfileMenu(false);
                          }}
                          className={`px-2 py-1 text-[11px] font-medium rounded border ${
                            user.role === 'farmer'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          Farmer View
                        </button>
                        <button
                          onClick={() => {
                            switchDemoUser('owner');
                            setShowProfileMenu(false);
                          }}
                          className={`px-2 py-1 text-[11px] font-medium rounded border ${
                            user.role === 'owner'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          Owner View
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
              <MapPin className="w-5 h-5 text-emerald-600 mr-2" /> Select Location
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Equipments and weather updates will be customized for your farming district.
            </p>
            <div className="space-y-2">
              {['Pune, Maharashtra', 'Nashik, Maharashtra', 'Satara, Maharashtra', 'Ahmednagar, Maharashtra', 'Ludhiana, Punjab', 'Karnal, Haryana'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedLocation === loc
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
