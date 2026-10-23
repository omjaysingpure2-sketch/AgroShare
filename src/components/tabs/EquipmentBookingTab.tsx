import React, { useState } from 'react';
import {
  Tractor,
  Calendar,
  Clock,
  Search,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  PlusCircle,
  ChevronRight,
  AlertCircle,
  Edit2,
  Trash2,
  Power,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EquipmentItem, BookingRecord } from '../../types';

interface EquipmentBookingTabProps {
  initialSubTab?: string;
  equipmentList: EquipmentItem[];
  bookings: BookingRecord[];
  onCreateBooking: (bookingData: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateBookingStatus: (bookingId: string, status: 'approved' | 'rejected' | 'completed' | 'cancelled') => void;
  onOpenAddEquipmentModal: () => void;
  onEditEquipment?: (equipment: EquipmentItem) => void;
  onDeleteEquipment?: (equipmentId: string) => Promise<{ success: boolean; error?: string }>;
  onToggleEquipmentAvailability?: (eqId: string, current: boolean) => void;
}

export const EquipmentBookingTab: React.FC<EquipmentBookingTabProps> = ({
  initialSubTab = 'find',
  equipmentList,
  bookings,
  onCreateBooking,
  onUpdateBookingStatus,
  onOpenAddEquipmentModal,
  onEditEquipment,
  onDeleteEquipment,
  onToggleEquipmentAvailability,
}) => {
  const { user } = useAuth();

  const [subTab, setSubTab] = useState<'find' | 'bookings' | 'owner_fleet'>(
    initialSubTab === 'bookings' ? 'bookings' : initialSubTab === 'owner_fleet' ? 'owner_fleet' : 'find'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Booking Modal State
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  );
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Deletion feedback
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const categories = ['All', 'Tractor', 'Rotavator', 'Harvester', 'Seed Drill', 'Sprayer', 'Cultivator'];

  // Filter equipment for browsing
  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesCat = selectedCategory === 'All' || eq.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || eq.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesPrice = eq.pricePerDay <= maxPrice;
    const matchesSearch =
      !searchQuery ||
      eq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesDistrict && matchesPrice && matchesSearch;
  });

  // Calculate rental days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const estimatedCost = selectedEquipment ? rentalDays * selectedEquipment.pricePerDay : 0;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    setBookingError(null);
    setIsSubmitting(true);

    const res = await onCreateBooking({
      equipmentId: selectedEquipment.id,
      renterId: user?.id || 'guest_farmer',
      renterName: user?.fullName || 'Farmer',
      renterPhone: user?.phoneNumber || '+919876543210',
      renterDistrict: user?.district || 'Pune',
      startDate,
      endDate,
      durationDays: rentalDays,
      notes: bookingNotes,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setBookingError(res.error || 'Failed to submit booking request.');
    } else {
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedEquipment(null);
        setBookingSuccess(false);
        setSubTab('bookings');
      }, 1500);
    }
  };

  const handleDeleteEquipment = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from your listed fleet?`)) {
      return;
    }
    setActionError(null);
    setDeletingId(id);
    if (onDeleteEquipment) {
      const res = await onDeleteEquipment(id);
      if (!res.success) {
        setActionError(res.error || 'Failed to delete equipment.');
      }
    }
    setDeletingId(null);
  };

  // User's own reservations
  const myBookings = bookings.filter((b) => b.renterId === user?.id || b.renterName === user?.fullName);

  // Owner's machinery fleet
  const myOwnedEquipment = equipmentList.filter((e) => e.ownerId === user?.id || user?.role === 'owner');

  // Incoming booking requests for owner's machines
  const incomingOwnerRequests = bookings.filter((b) => b.ownerId === user?.id || user?.role === 'owner');
  const pendingIncoming = incomingOwnerRequests.filter((b) => b.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Subtabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Farm Equipment Sharing & Booking</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Rent high-efficiency tractors, harvesters, and rotavators or list your own machinery fleet.
          </p>
        </div>

        {/* Subtab switcher */}
        <div className="flex items-center space-x-1.5 p-1 bg-gray-100 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setSubTab('find')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'find' ? 'bg-[#0B462C] text-white shadow-xs' : 'text-gray-700 hover:text-black'
            }`}
          >
            Find Equipment
          </button>
          <button
            onClick={() => setSubTab('bookings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'bookings' ? 'bg-[#0B462C] text-white shadow-xs' : 'text-gray-700 hover:text-black'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
          {user?.role === 'owner' && (
            <button
              onClick={() => setSubTab('owner_fleet')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                subTab === 'owner_fleet' ? 'bg-[#0B462C] text-white shadow-xs' : 'text-gray-700 hover:text-black'
              }`}
            >
              <span>My Fleet ({myOwnedEquipment.length})</span>
              {pendingIncoming.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block animate-pulse" />
              )}
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-500 hover:text-red-800 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Find Equipment */}
      {subTab === 'find' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by implement name, tractor model, district..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Districts</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Satara">Satara</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Aurangabad">Aurangabad</option>
                </select>

                {user?.role === 'owner' && (
                  <button
                    onClick={onOpenAddEquipmentModal}
                    className="px-4 py-2 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1 flex-shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Listing</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#0B462C] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-200">
                <Tractor className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-gray-800">No machinery matched your filters</h3>
                <p className="text-xs text-gray-500 mt-1">Try searching for other implements or reset filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedDistrict('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="relative">
                    <img
                      src={eq.imageUrl}
                      alt={eq.title}
                      className="w-full h-40 object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        eq.isAvailable ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white'
                      }`}
                    >
                      {eq.isAvailable ? 'Available' : 'Reserved'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{eq.title}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {eq.category}
                        </span>
                      </div>

                      <p className="text-base font-black text-[#0D442D] mt-1">
                        ₹{eq.pricePerDay.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-gray-500">/ day</span>
                      </p>

                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {eq.district}, {eq.state} • {eq.distanceKm || 4.2} km
                        </span>
                      </p>

                      <div className="flex items-center text-xs text-gray-600 mt-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 mr-1" />
                        <span className="font-bold text-gray-900">{eq.rating || 4.9}</span>
                        <span className="text-gray-400 ml-1">({eq.reviewsCount || 12} reviews)</span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {eq.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEquipment(eq);
                        setBookingError(null);
                        setBookingSuccess(false);
                      }}
                      className="mt-4 w-full py-2 bg-[#0D5C3A] hover:bg-[#124E35] text-white text-xs font-bold rounded-xl transition-colors text-center shadow-xs"
                    >
                      View Details & Book
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Bookings */}
      {subTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">Your Equipment Reservations</h2>
              <p className="text-xs text-gray-500">Track pending confirmations and completed rentals.</p>
            </div>
            <button
              onClick={() => setSubTab('find')}
              className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200"
            >
              Browse More Equipment
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800">You have no booking requests yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">Explore available machinery near your village and submit a rental request.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {myBookings.map((b) => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <img src={b.equipmentImage} alt={b.equipmentTitle} className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-gray-900">{b.equipmentTitle}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Dates: <strong className="text-gray-800">{b.startDate}</strong> to <strong className="text-gray-800">{b.endDate}</strong> ({b.durationDays} day(s))
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Rate: ₹{b.dailyRate} / day • Total Cost: <strong className="text-emerald-800 font-bold">₹{b.totalCost}</strong>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Owner: {b.ownerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {b.status === 'approved' && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirmed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Owner Fleet Control */}
      {subTab === 'owner_fleet' && (
        <div className="space-y-6">
          {/* Incoming Requests Panel for Owner */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Incoming Farmer Rental Requests</h2>
                <p className="text-xs text-gray-500">Review, approve, or reject booking applications for your machines.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {pendingIncoming.length} Pending
              </span>
            </div>

            {pendingIncoming.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl text-xs text-gray-500">
                No pending rental requests right now.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingIncoming.map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={req.equipmentImage}
                        alt={req.equipmentTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{req.equipmentTitle}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Farmer: <strong className="text-gray-900">{req.renterName}</strong> ({req.renterDistrict}) • Tel: {req.renterPhone}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Requested Duration: <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong> ({req.durationDays} days) • Total: <strong className="text-emerald-800 font-bold">₹{req.totalCost}</strong>
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

          {/* Machinery Fleet List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Your Listed Implements & Fleet</h2>
                <p className="text-xs text-gray-500">Edit listing details, update hire rates, and manage equipment availability.</p>
              </div>
              <button
                onClick={onOpenAddEquipmentModal}
                className="px-4 py-2 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List New Implement</span>
              </button>
            </div>

            {myOwnedEquipment.length === 0 ? (
              <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl">
                <Tractor className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">You haven&apos;t listed any equipment yet.</p>
                <p className="text-xs text-gray-400 mt-1">Start earning by listing your tractors, rotavators, or harvesters.</p>
                <button
                  onClick={onOpenAddEquipmentModal}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg"
                >
                  List Machinery Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myOwnedEquipment.map((eq) => (
                  <div key={eq.id} className="p-4 rounded-xl border border-gray-200 space-y-3 bg-white hover:border-emerald-300 transition-colors">
                    <div className="relative">
                      <img src={eq.imageUrl} alt={eq.title} className="w-full h-36 object-cover rounded-lg" />
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                          eq.isAvailable ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white'
                        }`}
                      >
                        {eq.isAvailable ? 'Available' : 'Reserved'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{eq.title}</h4>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {eq.category}
                        </span>
                      </div>
                      <p className="text-sm font-black text-emerald-800 mt-0.5">₹{eq.pricePerDay} / day</p>
                      <p className="text-xs text-gray-500">{eq.district}, {eq.state}</p>
                    </div>

                    {/* Action bar for Owner */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                      {onToggleEquipmentAvailability && (
                        <button
                          onClick={() => onToggleEquipmentAvailability(eq.id, eq.isAvailable)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-colors flex items-center space-x-1 ${
                            eq.isAvailable
                              ? 'text-gray-700 hover:bg-gray-100 border-gray-200'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{eq.isAvailable ? 'Set Busy' : 'Set Available'}</span>
                        </button>
                      )}

                      <div className="flex items-center space-x-1.5 ml-auto">
                        {onEditEquipment && (
                          <button
                            onClick={() => onEditEquipment(eq)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 border border-gray-200"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteEquipment && (
                          <button
                            disabled={deletingId === eq.id}
                            onClick={() => handleDeleteEquipment(eq.id, eq.title)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 disabled:opacity-50"
                            title="Remove Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Details & Reservation Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {selectedEquipment.category}
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">{selectedEquipment.title}</h3>
                <p className="text-xs text-gray-500">
                  Owner: {selectedEquipment.ownerName} • {selectedEquipment.district}, {selectedEquipment.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedEquipment(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <img
                src={selectedEquipment.imageUrl}
                alt={selectedEquipment.title}
                className="w-full h-48 object-cover rounded-2xl shadow-sm mb-4"
              />

              <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-gray-50 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400 block">Daily Rental Rate:</span>
                  <span className="font-extrabold text-emerald-900 text-sm">
                    ₹{selectedEquipment.pricePerDay.toLocaleString()} / day
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Rating:</span>
                  <span className="font-bold text-gray-800">
                    {selectedEquipment.rating || 4.9} ★ ({selectedEquipment.reviewsCount || 14} reviews)
                  </span>
                </div>
              </div>

              {/* Technical Specifications */}
              {selectedEquipment.specs && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase mb-1.5">Machine Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedEquipment.specs).map(([key, val]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-400 block text-[10px]">{key}</span>
                        <span className="font-semibold text-gray-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Dates Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase">Select Rental Duration</h4>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {bookingSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Booking requested successfully! Owner will confirm shortly.</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Special notes / work required (Optional)
                  </label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. 5 acres sugarcane deep plowing"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Price summary */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-900 font-bold block">
                      Estimated Cost ({rentalDays} day{rentalDays > 1 ? 's' : ''})
                    </span>
                    <span className="text-[11px] text-emerald-700">₹{selectedEquipment.pricePerDay} × {rentalDays} days</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#0B462C]">₹{estimatedCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEquipment(null)}
                    className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || bookingSuccess}
                    className="w-2/3 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Reserving...' : 'Submit Booking Request'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
