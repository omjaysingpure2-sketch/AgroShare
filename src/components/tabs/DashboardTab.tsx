import React from 'react';
import {
  Tractor,
  CalendarCheck,
  Clock,
  CheckCircle,
  Scan,
  TrendingUp,
  PlusCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRecord, EquipmentItem, ScanReport, SoilReportRecord } from '../../types';

interface DashboardTabProps {
  bookings: BookingRecord[];
  equipmentList: EquipmentItem[];
  scans: ScanReport[];
  soilReports: SoilReportRecord[];
  onNavigate: (tab: string, subSection?: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'approved' | 'rejected' | 'completed' | 'cancelled') => void;
  onToggleEquipmentAvailability?: (eqId: string, current: boolean) => void;
  onOpenAddEquipmentModal: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  bookings,
  equipmentList,
  scans,
  soilReports,
  onNavigate,
  onUpdateBookingStatus,
  onToggleEquipmentAvailability,
  onOpenAddEquipmentModal,
}) => {
  const { user } = useAuth();
  const role = user?.role || 'farmer';

  // Filter user specific data
  const myBookings = bookings.filter((b) => b.renterId === user?.id || b.renterName === user?.fullName);
  const activeBookings = myBookings.filter((b) => b.status === 'approved');
  const pendingBookings = myBookings.filter((b) => b.status === 'pending');

  // Owner specific data
  const myOwnedEquipment = equipmentList.filter((e) => e.ownerId === user?.id || user?.role === 'owner');
  const incomingOwnerRequests = bookings.filter((b) => b.ownerId === user?.id || user?.role === 'owner');
  const pendingRequestsToApprove = incomingOwnerRequests.filter((b) => b.status === 'pending');
  const approvedRentals = incomingOwnerRequests.filter((b) => b.status === 'approved');

  const totalOwnerRevenue = approvedRentals.reduce((sum, b) => sum + (b.totalCost || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              {role === 'farmer' ? 'Farmer Hub' : role === 'owner' ? 'Equipment Fleet Hub' : 'Admin Control'}
            </span>
            <span className="text-xs text-gray-500">• {user?.district || 'Pune'}, {user?.state || 'Maharashtra'}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">
            {role === 'farmer' ? 'Farming & Equipment Overview' : 'Machinery Fleet & Rental Management'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time status of your agricultural activities, machinery rentals, and crop health scans.
          </p>
        </div>

        {role === 'owner' ? (
          <button
            onClick={onOpenAddEquipmentModal}
            className="px-4 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 self-start sm:self-auto transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Equipment</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('Equipment Booking', 'find')}
            className="px-4 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 self-start sm:self-auto transition-colors"
          >
            <Tractor className="w-4 h-4" />
            <span>Book Farm Equipment</span>
          </button>
        )}
      </div>

      {/* Stats Cards Row — All Clickable */}
      {role === 'farmer' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('Equipment Booking', 'find')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-700">Available Near You</span>
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Tractor className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{equipmentList.filter((e) => e.isAvailable).length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Ready for hire</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('Equipment Booking', 'bookings')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-blue-700">Active Bookings</span>
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <CalendarCheck className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{activeBookings.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>{pendingBookings.length} pending approval</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('MyReports')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-teal-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-teal-700">Plant Scans</span>
              <div className="p-2 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
                <Scan className="w-5 h-5 text-teal-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{scans.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Diagnosed with AI</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('SoilHealth')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-amber-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-amber-700">Soil & Crop Reports</span>
              <div className="p-2 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-amber-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{soilReports.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>NPK & pH summaries</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>
      ) : (
        /* Equipment Owner Stats Cards */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('Equipment Booking', 'owner_fleet')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-700">Listed Machinery</span>
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Tractor className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{myOwnedEquipment.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>{myOwnedEquipment.filter((e) => e.isAvailable).length} available right now</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('Equipment Booking', 'owner_fleet')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-orange-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-orange-700">Pending Requests</span>
              <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Clock className="w-5 h-5 text-orange-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{pendingRequestsToApprove.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Requires approval</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('Equipment Booking', 'bookings')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-blue-700">Confirmed Rentals</span>
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{approvedRentals.length}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Active contracts</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>

          <div
            onClick={() => onNavigate('Equipment Booking', 'owner_fleet')}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs cursor-pointer hover:border-emerald-600 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-800">Total Rental Value</span>
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">₹{totalOwnerRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Earnings across bookings</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>
      )}

      {/* Role-Specific Action Center */}
      {role === 'owner' ? (
        <div className="space-y-6">
          {/* Pending Approval Requests */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Incoming Farmer Rental Requests</h2>
                <p className="text-xs text-gray-500">Approve or decline equipment reservation requests.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {pendingRequestsToApprove.length} Action Needed
              </span>
            </div>

            {pendingRequestsToApprove.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-500">
                No pending requests waiting for approval.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingRequestsToApprove.map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={req.equipmentImage}
                        alt={req.equipmentTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{req.equipmentTitle}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Farmer: <span className="font-semibold">{req.renterName}</span> ({req.renterDistrict}) • {req.renterPhone}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Dates: {req.startDate} to {req.endDate} ({req.durationDays} days) • Total: <strong className="text-emerald-800">₹{req.totalCost}</strong>
                        </p>
                        {req.notes && <p className="text-[11px] text-gray-500 italic mt-0.5">&ldquo;{req.notes}&rdquo;</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => onUpdateBookingStatus(req.id, 'approved')}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => onUpdateBookingStatus(req.id, 'rejected')}
                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Owned Equipment Fleet */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Your Machinery Fleet</h2>
                <p className="text-xs text-gray-500">Toggle availability and view listed implements.</p>
              </div>
              <button
                onClick={() => onNavigate('Equipment Booking', 'owner_fleet')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center"
              >
                <span>Manage Fleet</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myOwnedEquipment.map((eq) => (
                <div key={eq.id} className="p-4 rounded-xl border border-gray-200 flex space-x-3.5 items-start">
                  <img src={eq.imageUrl} alt={eq.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{eq.title}</h4>
                    <p className="text-xs font-bold text-emerald-800">₹{eq.pricePerDay} / day</p>
                    <p className="text-[11px] text-gray-500">{eq.district}, {eq.state}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${eq.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {eq.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      {onToggleEquipmentAvailability && (
                        <button
                          onClick={() => onToggleEquipmentAvailability(eq.id, eq.isAvailable)}
                          className="text-[11px] font-semibold text-emerald-700 underline"
                        >
                          {eq.isAvailable ? 'Mark Busy' : 'Mark Available'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Farmer Dashboard Main Content */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active & Recent Bookings (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">My Equipment Bookings</h2>
                  <p className="text-xs text-gray-500">Active and past machinery reservations.</p>
                </div>
                <button
                  onClick={() => onNavigate('Equipment Booking', 'bookings')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center"
                >
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              {myBookings.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-500 mb-3">You don&apos;t have any active equipment bookings.</p>
                  <button
                    onClick={() => onNavigate('Equipment Booking', 'find')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
                  >
                    Browse Available Machinery
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => onNavigate('Equipment Booking', 'bookings')}
                      className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={b.equipmentImage} alt={b.equipmentTitle} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.equipmentTitle}</h4>
                          <p className="text-[11px] text-gray-500">
                            {b.startDate} to {b.endDate} ({b.durationDays} days) • ₹{b.totalCost}
                          </p>
                          <p className="text-[10px] text-gray-400">Owner: {b.ownerName}</p>
                        </div>
                      </div>

                      <div className="text-right" onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : b.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {b.status}
                        </span>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                            className="block text-[10px] text-red-600 hover:text-red-800 underline mt-1"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Plant Scans & Soil Health Summaries */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Crop Health & Diagnostic Records</h2>
                  <p className="text-xs text-gray-500">AI disease diagnoses and soil test recommendations.</p>
                </div>
                <button
                  onClick={() => onNavigate('Scanner')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center"
                >
                  New Scan <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              {scans.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-500">
                  No plant scans recorded yet. Use the Plant Scanner tab to photograph and analyze your crops.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {scans.slice(0, 2).map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onNavigate('MyReports')}
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-900">{s.cropName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.healthStatus === 'Healthy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.healthStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium">Condition: {s.diseaseDetected}</p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        Advice: {s.recommendations?.[0] || 'Maintain balanced irrigation.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Agronomic Advice & Quick Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-emerald-800 to-green-900 rounded-2xl p-6 text-white shadow-md">
              <h3 className="text-base font-bold mb-1">Seasonal Farming Advisory</h3>
              <p className="text-xs text-emerald-200 leading-relaxed mb-4">
                Current recommendation for {user?.district || 'Pune'} district: Pre-monsoon soil tilling using heavy rotavators helps retain organic moisture and prevent root rot.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate('FertilizerGuide')}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-colors"
                >
                  <span>Fertilizer Dosage Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('WaterManagement')}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl text-left flex items-center justify-between transition-colors"
                >
                  <span>Drip Irrigation Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('AI Chat')}
                  className="w-full py-2 px-3 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-xl text-center mt-3 block transition-colors shadow-sm"
                >
                  Ask AI Farming Assistant
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Registered Farm Profile</h3>
              <div className="text-xs space-y-1.5 text-gray-600">
                <p><strong>Name:</strong> {user?.fullName}</p>
                <p><strong>Location:</strong> {user?.villageCity || 'Baramati'}, {user?.district}</p>
                <p><strong>Total Land:</strong> {user?.farmAreaAcres} Acres</p>
                <p><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
                <p><strong>Contact:</strong> {user?.phoneNumber}</p>
              </div>
              <button
                onClick={() => onNavigate('Profile')}
                className="mt-4 w-full py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 rounded-xl transition-colors"
              >
                Edit Profile Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
