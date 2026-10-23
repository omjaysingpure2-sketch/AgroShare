export interface UserProfile {
  id: string;
  fullName: string;
  age: number;
  address: string;
  state: string;
  district: string;
  villageCity: string;
  phoneNumber: string;
  farmAreaAcres: number;
  role: 'farmer' | 'owner' | 'admin';
  email: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  category: 'Tractor' | 'Harvester' | 'Rotavator' | 'Seed Drill' | 'Sprayer' | 'Plow' | 'Cultivator' | 'Other';
  powerHp?: number;
  pricePerDay: number;
  state: string;
  district: string;
  village: string;
  distanceKm: number;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  specs: Record<string, string>;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentCategory: string;
  equipmentImage: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  renterDistrict: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  dailyRate: number;
  totalCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlantScanResult {
  id?: string;
  userId?: string;
  userName?: string;
  cropName: string;
  healthStatus: 'Healthy' | 'Moderate' | 'Critical' | 'Warning';
  diseaseDetected?: string;
  confidenceScore: number;
  severity?: 'None' | 'Mild' | 'Moderate' | 'Severe';
  positiveFindings?: string[];
  symptoms: string[];
  possibleCauses?: string[];
  treatment?: string[];
  prevention?: string[];
  recommendations: string[];
  fertilizerAdvice: string[];
  wateringAdvice: string[];
  uncertaintyNotes?: string;
  userObservations?: { id: string; date: string; note: string }[];
  imageUrl?: string;
  scannedAt: string;
}

export type ScanReport = PlantScanResult;

export interface SoilReportRecord {
  id: string;
  userId: string;
  cropName: string;
  soilType: string;
  ph: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
  summary: string;
  recommendations: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'scan' | 'soil' | 'system' | 'reminder';
  read: boolean;
  timestamp: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'scan' | 'booking' | 'fertilizer' | 'ai';
  timestamp: string;
}
