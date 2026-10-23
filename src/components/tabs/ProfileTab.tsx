import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save, Loader2, Edit3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../../data/indianLocations';

export const ProfileTab: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: user?.age ? String(user.age) : '35',
    phoneNumber: user?.phoneNumber || '+919876543210',
    address: user?.address || '',
    state: user?.state || 'Maharashtra',
    district: user?.district || 'Pune',
    villageCity: user?.villageCity || '',
    farmAreaAcres: user?.farmAreaAcres ? String(user.farmAreaAcres) : '4.5',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableDistricts = getDistrictsForState(formData.state);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      setErrorMessage('Please enter a valid age between 18 and 120.');
      return;
    }

    const areaNum = Number(formData.farmAreaAcres);
    if (isNaN(areaNum) || areaNum < 0) {
      setErrorMessage('Farm area cannot be negative.');
      return;
    }

    setIsSaving(true);
    const res = await updateProfile({
      fullName: formData.fullName.trim(),
      age: ageNum,
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      state: formData.state,
      district: formData.district,
      villageCity: formData.villageCity.trim(),
      farmAreaAcres: areaNum,
    });
    setIsSaving(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update profile.');
    } else {
      setSuccessMessage('Profile details updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
        <p className="text-sm text-gray-500">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B462C] to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/80 shadow-lg"
          />

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{user.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white">
                {user.role === 'farmer' ? 'Farmer / Equipment Renter' : user.role === 'owner' ? 'Equipment Owner' : 'Administrator'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 flex items-center justify-center sm:justify-start">
              <MapPin className="w-4 h-4 mr-1 text-emerald-300" />
              {user.villageCity ? `${user.villageCity}, ` : ''}{user.district}, {user.state}
            </p>

            <p className="text-xs text-emerald-200 flex items-center justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 mr-1 text-emerald-300" />
              {user.email}
              {user.isEmailVerified && (
                <span className="ml-2 inline-flex items-center text-[10px] bg-emerald-500/40 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle className="w-3 h-3 mr-0.5" /> Email Verified
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white text-[#0B462C] hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Details or Edit Form */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs p-6 sm:p-8">
        {!isEditing ? (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Official Registered Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">1. Full Name</span>
                <span className="text-sm font-bold text-gray-900">{user.fullName}</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">2. Age</span>
                <span className="text-sm font-bold text-gray-900">{user.age} Years</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">3. Indian Mobile Number</span>
                <span className="text-sm font-bold text-gray-900">{user.phoneNumber}</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">4. Farm Area (Acres)</span>
                <span className="text-sm font-bold text-gray-900">{user.farmAreaAcres} Acres</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">5. State / Union Territory</span>
                <span className="text-sm font-bold text-gray-900">{user.state}</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block font-medium">6. District</span>
                <span className="text-sm font-bold text-gray-900">{user.district}</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl sm:col-span-2">
                <span className="text-gray-400 block font-medium">7. Village / City</span>
                <span className="text-sm font-bold text-gray-900">{user.villageCity}</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl sm:col-span-2">
                <span className="text-gray-400 block font-medium">8. Complete Address</span>
                <span className="text-sm font-bold text-gray-900">{user.address}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Edit Your Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age (Years)</label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (+91)</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Farm Area (in Acres)</label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.farmAreaAcres}
                  onChange={(e) => setFormData({ ...formData, farmAreaAcres: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State / UT</label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const st = e.target.value;
                    const d = getDistrictsForState(st);
                    setFormData({ ...formData, state: st, district: d[0] || '' });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                >
                  {INDIAN_STATES_AND_UTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Village / City</label>
                <input
                  type="text"
                  value={formData.villageCity}
                  onChange={(e) => setFormData({ ...formData, villageCity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Complete Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
