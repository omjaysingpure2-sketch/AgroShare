import React, { useState, useEffect } from 'react';
import { X, Tractor, Plus, AlertCircle, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EquipmentItem } from '../../types';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../../data/indianLocations';

interface AddEquipmentModalProps {
  onClose: () => void;
  onEquipmentAdded: (newEquipment: any) => void;
  onEquipmentUpdated?: (updatedEquipment: any) => void;
  equipmentToEdit?: EquipmentItem | null;
}

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  onClose,
  onEquipmentAdded,
  onEquipmentUpdated,
  equipmentToEdit,
}) => {
  const { user } = useAuth();
  const isEditing = Boolean(equipmentToEdit);

  const [formData, setFormData] = useState({
    title: equipmentToEdit?.title || '',
    category: equipmentToEdit?.category || ('Tractor' as any),
    powerHp: equipmentToEdit?.powerHp ? String(equipmentToEdit.powerHp) : '45',
    pricePerDay: equipmentToEdit?.pricePerDay ? String(equipmentToEdit.pricePerDay) : '1200',
    state: equipmentToEdit?.state || user?.state || 'Maharashtra',
    district: equipmentToEdit?.district || user?.district || 'Pune',
    village: equipmentToEdit?.village || user?.villageCity || '',
    description: equipmentToEdit?.description || '',
    imageUrl:
      equipmentToEdit?.imageUrl ||
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
    fuelType: equipmentToEdit?.specs?.['Fuel Type'] || 'Diesel',
    transmission: equipmentToEdit?.specs?.['Transmission'] || 'Standard 8+2',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (equipmentToEdit) {
      setFormData({
        title: equipmentToEdit.title,
        category: equipmentToEdit.category,
        powerHp: equipmentToEdit.powerHp ? String(equipmentToEdit.powerHp) : '45',
        pricePerDay: String(equipmentToEdit.pricePerDay),
        state: equipmentToEdit.state,
        district: equipmentToEdit.district,
        village: equipmentToEdit.village || '',
        description: equipmentToEdit.description,
        imageUrl: equipmentToEdit.imageUrl,
        fuelType: equipmentToEdit.specs?.['Fuel Type'] || 'Diesel',
        transmission: equipmentToEdit.specs?.['Transmission'] || 'Standard 8+2',
      });
    }
  }, [equipmentToEdit]);

  const availableDistricts = getDistrictsForState(formData.state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Equipment title is required.');
      return;
    }

    const price = Number(formData.pricePerDay);
    if (!formData.pricePerDay || isNaN(price) || price <= 0) {
      setError('Please provide a valid positive daily rate in ₹.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && equipmentToEdit) {
        // Edit existing listing
        const res = await fetch(`/api/equipment/${equipmentToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            title: formData.title.trim(),
            category: formData.category,
            powerHp: formData.powerHp ? Number(formData.powerHp) : undefined,
            pricePerDay: price,
            state: formData.state,
            district: formData.district,
            village: formData.village,
            imageUrl: formData.imageUrl,
            description: formData.description,
            specs: {
              'Horsepower / Capacity': `${formData.powerHp || 45} HP`,
              'Fuel Type': formData.fuelType,
              'Transmission': formData.transmission,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to update equipment listing.');
        } else {
          if (onEquipmentUpdated) onEquipmentUpdated(data);
          onClose();
        }
      } else {
        // Create new listing
        const res = await fetch('/api/equipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerId: user?.id || 'owner_default',
            ownerName: user?.fullName || 'Equipment Owner',
            ownerPhone: user?.phoneNumber || '+919876543210',
            title: formData.title.trim(),
            category: formData.category,
            powerHp: formData.powerHp ? Number(formData.powerHp) : undefined,
            pricePerDay: price,
            state: formData.state,
            district: formData.district,
            village: formData.village,
            imageUrl: formData.imageUrl,
            description: formData.description || 'Quality well-maintained agricultural machine.',
            specs: {
              'Horsepower / Capacity': `${formData.powerHp || 45} HP`,
              'Fuel Type': formData.fuelType,
              'Transmission': formData.transmission,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to add equipment listing.');
        } else {
          onEquipmentAdded(data);
          onClose();
        }
      }
    } catch (err) {
      setError('Network error while saving equipment listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Tractor className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg font-black text-gray-900">
              {isEditing ? 'Edit Equipment Listing' : 'List Equipment for Rent'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Equipment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. John Deere 5050D Tractor (50 HP)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
              >
                <option value="Tractor">Tractor</option>
                <option value="Rotavator">Rotavator</option>
                <option value="Harvester">Harvester</option>
                <option value="Seed Drill">Seed Drill</option>
                <option value="Sprayer">Sprayer</option>
                <option value="Cultivator">Cultivator</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Rental Price (₹ / Day) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                placeholder="1200"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Engine / Capacity</label>
              <input
                type="text"
                value={formData.powerHp}
                onChange={(e) => setFormData({ ...formData, powerHp: e.target.value })}
                placeholder="e.g. 50 HP or 7.5 Foot"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fuel Type</label>
              <input
                type="text"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                placeholder="e.g. Diesel or Electric"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => {
                  const s = e.target.value;
                  const dists = getDistrictsForState(s);
                  setFormData({ ...formData, state: s, district: dists[0] || '' });
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
              >
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
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
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Village / Town</label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              placeholder="e.g. Baramati"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Photo Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description & Condition</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Recently serviced with dual clutch and rotavator linkage. Available with driver."
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 bg-[#0B462C] hover:bg-[#125838] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? 'Updating...' : 'Adding Machine...'}</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>List Implement for Rent</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
