import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../../data/indianLocations';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';

interface RegisterViewProps {
  onGoToLogin: () => void;
  onRegisteredSuccess: (user: UserProfile, token?: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onGoToLogin,
  onRegisteredSuccess,
}) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    address: '',
    state: 'Maharashtra',
    district: 'Pune',
    customDistrict: '',
    villageCity: '',
    phoneNumber: '',
    farmAreaAcres: '4.5',
    role: 'farmer' as 'farmer' | 'owner',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const availableDistricts = getDistrictsForState(formData.state);

  const handleStateChange = (newState: string) => {
    const districts = getDistrictsForState(newState);
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: districts[0] || '',
      customDistrict: '',
    }));
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must have at least 2 characters.';
    }

    // 2. Age
    const ageNum = Number(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      newErrors.age = 'Age must be a valid number between 18 and 120.';
    }

    // 3. Complete Address
    if (!formData.address.trim()) {
      newErrors.address = 'Complete Address is required.';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Please provide a complete address with street/locality.';
    }

    // 4. State
    if (!formData.state) {
      newErrors.state = 'State selection is required.';
    }

    // 5. District
    const finalDistrict = formData.customDistrict.trim() || formData.district;
    if (!finalDistrict) {
      newErrors.district = 'District is required.';
    }

    // 6. Village / City
    if (!formData.villageCity.trim()) {
      newErrors.villageCity = 'Village or City is required.';
    }

    // 7. Phone Number (+91 and 10 digits starting with 6-9)
    const phoneClean = formData.phoneNumber.replace(/\s+/g, '');
    const phonePattern = /^(\+91)?[6-9]\d{9}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!phonePattern.test(phoneClean)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    // 8. Farm Area in acres
    const farmAreaNum = Number(formData.farmAreaAcres);
    if (formData.role === 'farmer') {
      if (formData.farmAreaAcres === '' || isNaN(farmAreaNum) || farmAreaNum <= 0) {
        newErrors.farmAreaAcres = 'Farm area in acres is mandatory for farmers (e.g. 1.5 or 2.75).';
      }
    } else {
      if (formData.farmAreaAcres !== '' && (isNaN(farmAreaNum) || farmAreaNum < 0)) {
        newErrors.farmAreaAcres = 'Farm area cannot be negative.';
      }
    }

    // 9. User Role
    if (!formData.role) {
      newErrors.role = 'Please select your role.';
    }

    // 10. Email Address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 11. Password
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // 12. Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // 13. Terms and Conditions
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const finalDistrict = formData.customDistrict.trim() || formData.district;

    const res = await register({
      fullName: formData.fullName,
      age: Number(formData.age),
      address: formData.address,
      state: formData.state,
      district: finalDistrict,
      villageCity: formData.villageCity,
      phoneNumber: formData.phoneNumber,
      farmAreaAcres: Number(formData.farmAreaAcres || 0),
      role: formData.role,
      email: formData.email,
      password: formData.password,
      termsAccepted: formData.termsAccepted,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setGeneralError(res.error || 'Registration failed. Please review your details.');
    } else if (res.user) {
      onRegisteredSuccess(res.user, res.token);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8F5] py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        {/* Back Link */}
        <button
          onClick={onGoToLogin}
          className="inline-flex items-center text-sm font-semibold text-emerald-800 hover:text-emerald-950 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Login
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0B462C] to-emerald-700 p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Phase 1 Registration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Create Your AgriShare Account
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  Connect to local farm machinery, crop advisory, and scheduling.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {generalError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                9. User Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, role: 'farmer' }));
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start space-x-3 ${
                    formData.role === 'farmer'
                      ? 'border-[#0B462C] bg-emerald-50/60 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      formData.role === 'farmer' ? 'border-[#0B462C] bg-[#0B462C]' : 'border-gray-300'
                    }`}
                  >
                    {formData.role === 'farmer' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900">
                      Farmer / Equipment Renter
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Rent machinery, scan plant health, and get crop guidance.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, role: 'owner' }));
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start space-x-3 ${
                    formData.role === 'owner'
                      ? 'border-[#0B462C] bg-emerald-50/60 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      formData.role === 'owner' ? 'border-[#0B462C] bg-[#0B462C]' : 'border-gray-300'
                    }`}
                  >
                    {formData.role === 'owner' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900">
                      Equipment Owner / Provider
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      List your tractors, rotavators, and earn from rentals.
                    </span>
                  </div>
                </button>
              </div>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. Rameshwar Patil"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* 2. Age */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  2. Age (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder="e.g. 35"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.age ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
              </div>
            </div>

            {/* 3. Complete Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                3. Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: '' });
                }}
                placeholder="House/Plot no., Street name, Landmark, Post Office..."
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.address ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* 4. State & 5. District & 6. Village/City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 4. State */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  4. State / UT <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.state ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                >
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>

              {/* 5. District */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  5. District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({ ...formData, district: e.target.value });
                    if (errors.district) setErrors({ ...errors, district: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.district ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                >
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
              </div>

              {/* 6. Village / City */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  6. Village / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.villageCity}
                  onChange={(e) => {
                    setFormData({ ...formData, villageCity: e.target.value });
                    if (errors.villageCity) setErrors({ ...errors, villageCity: '' });
                  }}
                  placeholder="e.g. Baramati"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.villageCity ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.villageCity && <p className="text-xs text-red-500 mt-1">{errors.villageCity}</p>}
              </div>
            </div>

            {/* 7. Phone Number & 8. Farm Area in Acres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 7. Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  7. Indian Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-gray-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phoneNumber.replace(/^\+91/, '')}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, phoneNumber: digits ? `+91${digits}` : '' });
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                    }}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* 8. Farm Area in Acres */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  8. Farm Area (Acres) {formData.role === 'farmer' ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Optional for Owner)</span>}
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={formData.farmAreaAcres}
                  onChange={(e) => {
                    setFormData({ ...formData, farmAreaAcres: e.target.value });
                    if (errors.farmAreaAcres) setErrors({ ...errors, farmAreaAcres: '' });
                  }}
                  placeholder={formData.role === 'farmer' ? 'e.g. 2.75' : '0 (optional)'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.farmAreaAcres ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.farmAreaAcres && <p className="text-xs text-red-500 mt-1">{errors.farmAreaAcres}</p>}
              </div>
            </div>

            {/* 10. Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                10. Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="name@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* 11. Password & 12. Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 11. Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  11. Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="At least 6 characters"
                    className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.password ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* 12. Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  12. Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Re-enter your password"
                    className={`w-full pr-10 pl-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* 13. Terms & Conditions */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    setFormData({ ...formData, termsAccepted: e.target.checked });
                    if (errors.termsAccepted) setErrors({ ...errors, termsAccepted: '' });
                  }}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className="text-xs text-gray-600">
                  13. I agree to the{' '}
                  <span className="font-semibold text-emerald-800 underline">
                    Terms & Conditions
                  </span>{' '}
                  and Privacy Policy of AgriShare. I certify that my farming and machinery details are accurate.
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#0B462C] hover:bg-[#125838] text-white font-bold rounded-xl shadow-lg shadow-emerald-950/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Validating & Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Link to Login */}
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-bold text-emerald-800 hover:text-emerald-950 underline"
              >
                Log In Here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
