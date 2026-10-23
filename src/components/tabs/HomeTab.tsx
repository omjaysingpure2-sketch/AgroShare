import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  BarChart3,
  ScanLine,
  Sprout,
  Mountain,
  ShoppingBag,
  Droplets,
  Tractor,
  CalendarDays,
  Bot,
  FileText,
  Star,
  CheckCircle,
  Wrench,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EquipmentItem, ActivityItem, NotificationItem } from '../../types';

interface HomeTabProps {
  onNavigate: (tab: string, subSection?: string) => void;
  equipmentList: EquipmentItem[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  onSelectEquipment: (eq: EquipmentItem) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigate,
  equipmentList,
  activities,
  notifications,
  onSelectEquipment,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(
    user ? `${user.district}, ${user.state}` : 'Pune, Maharashtra'
  );

  const displayName = user?.fullName || 'Farmer';

  const quickAccessCards = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'View your farming overview',
      icon: BarChart3,
      bgColor: 'bg-[#D6F5E3] text-[#0F6848]',
      action: () => onNavigate('Dashboard'),
    },
    {
      id: 'scanner',
      title: 'Plant Scanner',
      subtitle: 'Scan and analyze plants',
      icon: ScanLine,
      bgColor: 'bg-[#CEF1EC] text-[#0B7277]',
      action: () => onNavigate('Scanner'),
    },
    {
      id: 'plant_health',
      title: 'Plant Health',
      subtitle: 'Check plant health reports',
      icon: Sprout,
      bgColor: 'bg-[#E3F6D3] text-[#4F8025]',
      action: () => onNavigate('PlantHealth'),
    },
    {
      id: 'soil_health',
      title: 'Soil Health',
      subtitle: 'Analyze soil condition',
      icon: Mountain,
      bgColor: 'bg-[#FBE8D8] text-[#9A5023]',
      action: () => onNavigate('SoilHealth'),
    },
    {
      id: 'fertilizer',
      title: 'Fertilizer Guide',
      subtitle: 'Get fertilizer suggestions',
      icon: ShoppingBag,
      bgColor: 'bg-[#FEEACF] text-[#B8620F]',
      action: () => onNavigate('FertilizerGuide'),
    },
    {
      id: 'water',
      title: 'Water Management',
      subtitle: 'Smart irrigation advice',
      icon: Droplets,
      bgColor: 'bg-[#D7EEFF] text-[#1D6FA5]',
      action: () => onNavigate('WaterManagement'),
    },
    {
      id: 'find_equipment',
      title: 'Find Equipment',
      subtitle: 'Discover & rent equipment',
      icon: Tractor,
      bgColor: 'bg-[#EFE4FD] text-[#6E3BB5]',
      action: () => onNavigate('Equipment Booking', 'find'),
    },
    {
      id: 'my_bookings',
      title: 'My Bookings',
      subtitle: 'Track your bookings',
      icon: CalendarDays,
      bgColor: 'bg-[#FEE2E2] text-[#B91C1C]',
      action: () => onNavigate('Equipment Booking', 'bookings'),
    },
    {
      id: 'ai_chat',
      title: 'AI Farming Chat',
      subtitle: 'Ask farming questions',
      icon: Bot,
      bgColor: 'bg-[#D2F4F2] text-[#0E7A7A]',
      action: () => onNavigate('AI Chat'),
    },
    {
      id: 'my_reports',
      title: 'My Reports',
      subtitle: 'View past scans & reports',
      icon: FileText,
      bgColor: 'bg-[#E0E7FF] text-[#4338CA]',
      action: () => onNavigate('MyReports'),
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('tractor') || q.includes('rotavator') || q.includes('harvester') || q.includes('drill')) {
      onNavigate('Equipment Booking', 'find');
    } else if (q.includes('plant') || q.includes('disease') || q.includes('scan') || q.includes('leaf')) {
      onNavigate('Scanner');
    } else if (q.includes('soil') || q.includes('ph') || q.includes('npk')) {
      onNavigate('SoilHealth');
    } else if (q.includes('fertilizer') || q.includes('urea') || q.includes('spray')) {
      onNavigate('FertilizerGuide');
    } else if (q.includes('water') || q.includes('irrigation') || q.includes('drip')) {
      onNavigate('WaterManagement');
    } else {
      onNavigate('AI Chat');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Hero Banner Matching Reference Screenshot */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-emerald-100 bg-gradient-to-r from-[#F0F7F2] via-[#E4F2E9] to-[#CFE8D7] min-h-[220px]">
        {/* Background Tractor Photo on the Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-3/5 lg:w-1/2 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1000&auto=format&fit=crop&q=80"
            alt="Farm tractor in field"
            className="w-full h-full object-cover object-center mix-blend-multiply opacity-90 filter contrast-105"
          />
          {/* Subtle gradient overlay to merge photo smoothly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0F7F2] via-transparent to-transparent sm:w-1/3" />
          {/* Script slogan overlay matching screenshot */}
          <div className="hidden md:block absolute right-6 top-8 text-white drop-shadow-md select-none text-right font-serif italic text-xl sm:text-2xl font-bold tracking-wide text-emerald-950/90">
            Better Equipment.<br />
            <span className="text-emerald-900 font-extrabold not-italic text-lg">Smarter Farming.</span>
          </div>
        </div>

        {/* Left Content Banner */}
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <p className="text-sm font-semibold text-gray-700 flex items-center">
            Hello, {displayName} <span className="ml-1 text-base">👋</span>
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D442D] tracking-tight mt-1">
            Welcome to AgriShare
          </h1>
          <p className="text-sm sm:text-base text-gray-700 font-medium mt-0.5">
            Your Smart Farming Assistant.
          </p>

          {/* Search Box inside Hero matching screenshot */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-xl"
          >
            <div className="flex items-center flex-1 px-3.5 py-2.5">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for equipment, crops, or farming advice..."
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-gray-200 px-3 py-2 flex items-center justify-between sm:justify-start bg-gray-50/70">
              <div className="flex items-center text-xs font-medium text-gray-700 space-x-1 cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </form>

          {/* 3 Badges below search matching screenshot */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs font-semibold text-gray-700">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-emerald-200/80 shadow-2xs">
              <span className="text-emerald-700 font-bold">🌿</span>
              <span>Affordable Equipment Access</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-emerald-200/80 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Easy Online Booking</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-emerald-200/80 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Connected Farming Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Quick Access + Featured) & Right (Activity + Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8/12 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Access Section Matching Screenshot */}
          <div className="bg-transparent">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Quick Access
              </h2>
              <button
                onClick={() => onNavigate('Dashboard')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center"
              >
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* 10 Cards in 5x2 grid matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickAccessCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={card.action}
                    className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-left flex flex-col justify-between group h-32"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${card.bgColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-emerald-800 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {card.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Equipment Section Matching Screenshot */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-2">
                <Tractor className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Featured Equipment
                </h2>
              </div>
              <button
                onClick={() => onNavigate('Equipment Booking', 'find')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center"
              >
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* Equipment 4 Cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {equipmentList.slice(0, 4).map((eq) => (
                <div
                  key={eq.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="relative">
                    <img
                      src={eq.imageUrl}
                      alt={eq.title}
                      className="w-full h-32 object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Available
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                        {eq.title}
                      </h3>
                      <p className="text-sm font-extrabold text-[#0D442D] mt-0.5">
                        ₹{eq.pricePerDay.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ day</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                        <span className="truncate">{eq.district}, {eq.state} • {eq.distanceKm} km</span>
                      </p>
                      <div className="flex items-center text-[11px] text-gray-600 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400 mr-1" />
                        <span className="font-semibold text-gray-800">{eq.rating}</span>
                        <span className="text-gray-400 ml-1">({eq.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEquipment(eq)}
                      className="mt-3 w-full py-1.5 px-3 bg-[#0D5C3A] hover:bg-[#124E35] text-white text-xs font-bold rounded-lg transition-colors text-center shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Banner Matching Screenshot */}
          <div className="bg-gradient-to-r from-[#0F5338] to-[#166534] rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between shadow-md">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-10 h-10 rounded-full bg-emerald-700/80 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Need Help with Your Crops?</h4>
                <p className="text-xs text-emerald-100">
                  Ask our AI assistant for expert advice.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('AI Chat')}
              className="px-5 py-2 bg-white hover:bg-gray-100 text-[#0F5338] text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Chat Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 4/12 Column Matching Screenshot */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
              <button
                onClick={() => onNavigate('MyReports')}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-gray-50 pt-1">
              {activities.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No recent activities recorded.
                </div>
              ) : (
                activities.slice(0, 4).map((act) => {
                  return (
                    <div key={act.id} className="py-2.5 flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          act.type === 'scan'
                            ? 'bg-emerald-100 text-emerald-700'
                            : act.type === 'booking'
                            ? 'bg-blue-100 text-blue-700'
                            : act.type === 'fertilizer'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {act.type === 'scan' && <Sprout className="w-4 h-4" />}
                        {act.type === 'booking' && <Tractor className="w-4 h-4" />}
                        {act.type === 'fertilizer' && <ShoppingBag className="w-4 h-4" />}
                        {act.type === 'ai' && <MessageSquare className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-900 truncate">{act.title}</p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{act.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{act.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <button
                onClick={() => onNavigate('Equipment Booking', 'bookings')}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-gray-50 pt-1">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No notifications.
                </div>
              ) : (
                notifications.slice(0, 3).map((notif) => {
                  return (
                    <div key={notif.id} className="py-2.5 flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notif.type === 'booking'
                            ? 'bg-emerald-100 text-emerald-700'
                            : notif.type === 'soil'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {notif.type === 'booking' && <CheckCircle className="w-4 h-4" />}
                        {notif.type === 'soil' && <Mountain className="w-4 h-4" />}
                        {notif.type === 'reminder' && <Wrench className="w-4 h-4" />}
                        {notif.type === 'system' && <Sparkles className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-900 truncate">{notif.title}</p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
